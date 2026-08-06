import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TelegramSimulator } from './components/TelegramSimulator';
import { CalendarView } from './components/CalendarView';
import { N8nWorkflowView } from './components/N8nWorkflowView';
import { PromptsView } from './components/PromptsView';
import { DemoVideoView } from './components/DemoVideoView';
import { SettingsModal } from './components/SettingsModal';
import { AppointmentEvent, BotSettings, ExtractionResult, TelegramMessage } from './types';
import { DEFAULT_BOT_SETTINGS, INITIAL_APPOINTMENTS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'telegram' | 'calendar' | 'n8n' | 'prompts' | 'demo'>('telegram');
  const [events, setEvents] = useState<AppointmentEvent[]>(INITIAL_APPOINTMENTS);
  const [botSettings, setBotSettings] = useState<BotSettings>(DEFAULT_BOT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [latestExtraction, setLatestExtraction] = useState<ExtractionResult | null>(null);

  // Default welcome conversation
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: '👋 *Hello! I am your AI Telegram Appointment Booking Agent.*\n\nTell me what you would like to schedule, and I will understand your natural language request, check availability, and create a Google Calendar or Calendly event for you!\n\n_Example: "Schedule a Team Sync for tomorrow at 3 PM"_',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Fetch live calendar events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar/events');
      if (res.ok) {
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
        }
      }
    } catch (err) {
      console.error('Failed to fetch events from server:', err);
    }
  };

  const handleSendMessage = async (userText: string) => {
    const userMsg: TelegramMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyContext = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyContext
        })
      });

      const data = await res.json();

      if (data.success && data.extracted) {
        setLatestExtraction(data.extracted);
        if (data.events) {
          setEvents(data.events);
        }

        const actionButtons = [];
        if (data.extracted.suggestedSlots && data.extracted.suggestedSlots.length > 0) {
          data.extracted.suggestedSlots.forEach((slot: string) => {
            actionButtons.push({
              label: `🕒 Select ${slot}`,
              action: 'select_slot' as const,
              payload: { slot }
            });
          });
        }

        const botReplyMsg: TelegramMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: data.extracted.botReply || 'I have processed your request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          extractedDetails: data.extracted,
          actionButtons
        };

        setMessages(prev => [...prev, botReplyMsg]);
      } else {
        throw new Error(data.error || 'Failed to parse AI response');
      }
    } catch (err: any) {
      console.error('Error in handleSendMessage:', err);
      const errorMsg: TelegramMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'bot',
        text: '⚠️ I encountered an issue processing your request with Gemini AI. Please try again or rephrase.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'bot',
        text: '👋 *Chat reset!*\n\nSend a new appointment request (e.g., "Book a Dentist appointment on Friday at 11 AM").',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLatestExtraction(null);
  };

  const handleAddEvent = async (eventData: Partial<AppointmentEvent>) => {
    try {
      const res = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (res.ok) {
        await fetchEvents();
      }
    } catch (err) {
      console.error('Failed to add event:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/calendar/events/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchEvents();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col">
      
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        eventCount={events.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'telegram' && (
          <TelegramSimulator
            messages={messages}
            onSendMessage={handleSendMessage}
            onResetChat={handleResetChat}
            isLoading={isLoading}
            botSettings={botSettings}
            latestExtraction={latestExtraction}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'n8n' && (
          <N8nWorkflowView />
        )}

        {activeTab === 'prompts' && (
          <PromptsView />
        )}

        {activeTab === 'demo' && (
          <DemoVideoView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Telegram Appointment Booking Agent • Powered by Gemini 3.6 Flash & Cloud Run</span>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-mono">n8n-workflow.json Export Ready</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">Prompt.md Included</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        botSettings={botSettings}
        onSaveSettings={(newSet) => setBotSettings(newSet)}
      />

    </div>
  );
}
