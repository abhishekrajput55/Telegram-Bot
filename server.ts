import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_APPOINTMENTS } from './src/data/mockData';
import { AppointmentEvent, ExtractionResult, TelegramMessage } from './src/types';

// Initialize in-memory appointment store
let appointmentsStore: AppointmentEvent[] = [...INITIAL_APPOINTMENTS];

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET /api/calendar/events
  app.get('/api/calendar/events', (req, res) => {
    res.json({ success: true, events: appointmentsStore });
  });

  // POST /api/calendar/events
  app.post('/api/calendar/events', (req, res) => {
    const { title, date, time, durationMinutes, purpose, attendeeName, attendeeEmail, provider } = req.body;
    
    if (!title || !date || !time) {
      return res.status(400).json({ error: 'Missing title, date, or time' });
    }

    const duration = durationMinutes || 30;
    const startIso = `${date}T${time}:00.000Z`;
    const startDate = new Date(`${date}T${time}:00`);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endIso = endDate.toISOString();

    const newEvent: AppointmentEvent = {
      id: `evt-${Date.now()}`,
      title: title || purpose || 'Scheduled Meeting',
      date,
      time,
      durationMinutes: duration,
      startDateTime: startIso,
      endDateTime: endIso,
      purpose: purpose || title,
      attendeeName: attendeeName || 'User',
      attendeeEmail: attendeeEmail || '',
      status: 'confirmed',
      provider: provider || 'google_calendar',
      calendarLink: `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(title)}`,
      createdAt: new Date().toISOString()
    };

    appointmentsStore.push(newEvent);
    return res.json({ success: true, event: newEvent });
  });

  // DELETE /api/calendar/events/:id
  app.delete('/api/calendar/events/:id', (req, res) => {
    const { id } = req.params;
    const initialLen = appointmentsStore.length;
    appointmentsStore = appointmentsStore.filter(e => e.id !== id);
    return res.json({ success: appointmentsStore.length < initialLen });
  });

  // GET /api/export/n8n
  app.get('/api/export/n8n', (req, res) => {
    try {
      const n8nPath = path.join(process.cwd(), 'n8n-workflow.json');
      if (fs.existsSync(n8nPath)) {
        const content = fs.readFileSync(n8nPath, 'utf8');
        res.setHeader('Content-Type', 'application/json');
        return res.send(content);
      }
      return res.status(404).json({ error: 'n8n-workflow.json not found' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // GET /api/export/prompt
  app.get('/api/export/prompt', (req, res) => {
    try {
      const promptPath = path.join(process.cwd(), 'Prompt.md');
      if (fs.existsSync(promptPath)) {
        const content = fs.readFileSync(promptPath, 'utf8');
        res.setHeader('Content-Type', 'text/markdown');
        return res.send(content);
      }
      return res.status(404).json({ error: 'Prompt.md not found' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // POST /api/agent/chat - Natural Language Agent NLP Pipeline using Gemini
  app.post('/api/agent/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required' });
      }

      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const nowString = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

      // Build context of existing appointments
      const existingEventsSummary = appointmentsStore
        .filter(e => e.status === 'confirmed')
        .map(e => `- "${e.title}" on ${e.date} at ${e.time} (${e.durationMinutes}m)`)
        .join('\n');

      const systemPrompt = `You are an AI Telegram Appointment Booking Agent.
Current Date: ${currentDate} (${nowString} UTC)
Current Scheduled Calendar Appointments:\n${existingEventsSummary || 'None'}

Your goal is to parse user messages and schedule/manage appointments intelligently.
Analyze the user message and output JSON matching the specified schema:
1. "intent": "book" | "reschedule" | "cancel" | "query" | "general"
2. "purpose": meeting/appointment title (e.g. "Dentist", "Team Sync", "Haircut") or null if missing.
3. "date": date in YYYY-MM-DD format (convert relative terms like "tomorrow", "next Tuesday", "Friday" relative to ${currentDate}) or null if missing.
4. "time": 24-hour time "HH:mm" (e.g. "15:00" for 3 PM, "10:30" for 10:30 AM) or null if missing.
5. "durationMinutes": integer (default 30 if unspecified).
6. "attendeeName": name or null.
7. "attendeeEmail": email or null.
8. "isComplete": boolean (true ONLY if purpose, date, AND time are all known or clear).
9. "missingFields": array of missing essential fields from ["date", "time", "purpose"].
10. "botReply": A polite, friendly Telegram-formatted Markdown response. 
   - If missing fields: ask specifically for the missing details.
   - If complete: confirm the appointment clearly with emoji formatting (📅, ⏰, 📝, ✅).`;

      // Call Gemini 3.6 Flash model with Structured JSON Output
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Recent Chat Context:\n${JSON.stringify(history || [])}\n\nUser Message: "${message}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING, description: "book, reschedule, cancel, query, general" },
              purpose: { type: Type.STRING, nullable: true },
              date: { type: Type.STRING, nullable: true },
              time: { type: Type.STRING, nullable: true },
              durationMinutes: { type: Type.INTEGER },
              attendeeName: { type: Type.STRING, nullable: true },
              attendeeEmail: { type: Type.STRING, nullable: true },
              isComplete: { type: Type.BOOLEAN },
              missingFields: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              botReply: { type: Type.STRING }
            },
            required: ['intent', 'isComplete', 'missingFields', 'botReply']
          }
        }
      });

      let extracted: ExtractionResult = JSON.parse(response.text || '{}');

      // Check for calendar conflicts if intent is "book" and complete
      let hasConflict = false;
      let conflictingTitle = '';
      let suggestedSlots: string[] = [];

      if (extracted.intent === 'book' && extracted.isComplete && extracted.date && extracted.time) {
        const reqDate = extracted.date;
        const reqTime = extracted.time;

        const conflict = appointmentsStore.find(evt => 
          evt.status === 'confirmed' &&
          evt.date === reqDate &&
          evt.time === reqTime
        );

        if (conflict) {
          hasConflict = true;
          conflictingTitle = conflict.title;
          
          // Generate alternative times
          const [h, m] = reqTime.split(':').map(Number);
          const alt1 = `${String(Math.max(8, h - 2)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          const alt2 = `${String(Math.min(18, h + 2)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          suggestedSlots = [alt1, alt2];

          extracted.hasConflict = true;
          extracted.conflictingEventTitle = conflict.title;
          extracted.suggestedSlots = suggestedSlots;

          extracted.botReply = `⚠️ *Slot Conflict Detected*\n\nYou already have "*${conflict.title}*" scheduled on ${reqDate} at ${reqTime}.\n\nWould one of these alternative times work for you?\n• 🕒 *${alt1}*\n• 🕒 *${alt2}*`;
        } else {
          // Auto-create appointment event
          const newEvt: AppointmentEvent = {
            id: `evt-${Date.now()}`,
            title: extracted.purpose || 'Scheduled Appointment',
            date: extracted.date,
            time: extracted.time,
            durationMinutes: extracted.durationMinutes || 30,
            startDateTime: `${extracted.date}T${extracted.time}:00.000Z`,
            endDateTime: `${extracted.date}T${extracted.time}:00.000Z`,
            purpose: extracted.purpose || 'Appointment',
            attendeeName: extracted.attendeeName || 'Telegram User',
            attendeeEmail: extracted.attendeeEmail || '',
            status: 'confirmed',
            provider: 'google_calendar',
            calendarLink: `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(extracted.purpose || 'Appointment')}`,
            createdAt: new Date().toISOString()
          };
          appointmentsStore.push(newEvt);

          if (!extracted.botReply.includes('✅')) {
            extracted.botReply = `✅ *Appointment Scheduled!*\n\n📅 *Date:* ${extracted.date}\n⏰ *Time:* ${extracted.time} (${extracted.durationMinutes || 30} mins)\n📝 *Purpose:* ${extracted.purpose}\n\nEvent created on Google Calendar successfully!`;
          }
        }
      }

      return res.json({
        success: true,
        extracted,
        events: appointmentsStore
      });

    } catch (err: any) {
      console.error('Error processing agent chat:', err);
      return res.status(500).json({
        error: 'Failed to process AI appointment request',
        details: err.message
      });
    }
  });

  // Telegram Live Webhook endpoint
  app.post('/api/telegram/webhook', (req, res) => {
    console.log('Received Telegram Webhook Payload:', req.body);
    return res.json({ ok: true, description: 'Telegram Webhook processed successfully' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Appointment Booking Server running on http://localhost:${PORT}`);
  });
}

startServer();
