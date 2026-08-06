import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Bot, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

export const PromptsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownload = () => {
    fetch('/api/export/prompt')
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Prompt.md';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => {
        alert('Downloading Prompt.md');
      });
  };

  const promptSections = [
    {
      id: 'system-instruction',
      title: '1. Telegram Agent System Instruction',
      description: 'Defines the personality, objective, and multi-turn rules for the AI booking agent.',
      icon: Bot,
      code: `You are an intelligent, friendly, and efficient AI Telegram Appointment Booking Assistant.
Your primary goal is to help users schedule, reschedule, or cancel appointments through natural language conversation.

### Core Objectives:
1. **Understand Intent**: Determine if the user wants to book, reschedule, cancel, or query an appointment.
2. **Extract Essential Details**:
   - Purpose / Title of meeting (e.g., "Dentist Checkup", "Team Sync", "Strategy Session")
   - Preferred Date (e.g., "tomorrow", "next Tuesday", "August 12th")
   - Preferred Start Time (e.g., "3 PM", "10:30 AM")
   - Duration (Default to 30 minutes if unspecified)
3. **Handle Incomplete Information**:
   - If ANY essential detail (date, time, or purpose) is missing or ambiguous, politely ask the user specifically for the missing detail.
   - Do NOT book the appointment until all 3 essential fields are resolved.
4. **Calendar Validation & Confirmation**:
   - Confirm details clearly before finalizing: Date, Time, Duration, Purpose.`
    },
    {
      id: 'extraction-schema',
      title: '2. Gemini Structured JSON Output Schema',
      description: 'Used by Gemini 3.6 Flash to output strict typed JSON parameters for Google Calendar.',
      icon: Terminal,
      code: `{
  "systemInstruction": "Extract appointment parameters from user text relative to context time. Return JSON adhering strictly to schema.",
  "responseSchema": {
    "type": "OBJECT",
    "properties": {
      "intent": { "type": "STRING", "description": "book | reschedule | cancel | query | general" },
      "purpose": { "type": "STRING", "nullable": true },
      "date": { "type": "STRING", "description": "YYYY-MM-DD", "nullable": true },
      "time": { "type": "STRING", "description": "HH:mm 24-hour", "nullable": true },
      "durationMinutes": { "type": "INTEGER" },
      "isComplete": { "type": "BOOLEAN" },
      "missingFields": { "type": "ARRAY", "items": { "type": "STRING" } },
      "botReply": { "type": "STRING", "description": "Telegram markdown formatted reply" }
    },
    "required": ["intent", "isComplete", "missingFields", "botReply"]
  }
}`
    },
    {
      id: 'conflict-resolution',
      title: '3. Calendar Conflict Resolution Prompt',
      description: 'Triggered when the requested time slot overlaps with an existing appointment.',
      icon: AlertTriangle,
      code: `"The requested time slot ({REQUESTED_TIME} on {REQUESTED_DATE}) conflicts with an existing event: '{EXISTING_EVENT}'.
Politely inform the user that this slot is unavailable and offer two alternative available slots nearby (e.g., {ALT_SLOT_1} and {ALT_SLOT_2}). Ask them which one works best."`
    },
    {
      id: 'confirmation-format',
      title: '4. Telegram Confirmation Message Format',
      description: 'Final confirmation message sent to the user upon successful calendar event creation.',
      icon: CheckCircle2,
      code: `✅ *Appointment Successfully Booked!*

📅 *Date:* {DATE_FORMATTED}
⏰ *Time:* {TIME_FORMATTED} ({DURATION} mins)
📝 *Purpose:* {PURPOSE}
🔗 *Calendar Event:* {CALENDAR_LINK}

A Google Calendar invite and Telegram reminder have been set! Let me know if you need to make any changes.`
    }
  ];

  return (
    <div id="prompts-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FileCode className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Prompt.md & AI System Directives
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Complete prompts, extraction rules, and multi-turn conversational guidelines for the Telegram Agent.
          </p>
        </div>

        <button
          id="btn-download-prompt-md"
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-sky-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Download Prompt.md</span>
        </button>
      </div>

      {/* Prompts Cards Stack */}
      <div className="space-y-6">
        {promptSections.map((sec) => {
          const IconComp = sec.icon;
          const isCopied = copiedSection === sec.id;

          return (
            <div
              key={sec.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{sec.title}</h3>
                    <p className="text-xs text-slate-400">{sec.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(sec.code, sec.id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors shrink-0"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{isCopied ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-sky-300 font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
                {sec.code}
              </pre>
            </div>
          );
        })}
      </div>

    </div>
  );
};
