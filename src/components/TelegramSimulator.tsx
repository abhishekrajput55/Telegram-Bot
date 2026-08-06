import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Tag, 
  HelpCircle,
  Zap,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { TelegramMessage, ExtractionResult, BotSettings } from '../types';

interface TelegramSimulatorProps {
  messages: TelegramMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onResetChat: () => void;
  isLoading: boolean;
  botSettings: BotSettings;
  latestExtraction: ExtractionResult | null;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({
  messages,
  onSendMessage,
  onResetChat,
  isLoading,
  botSettings,
  latestExtraction
}) => {
  const [inputText, setInputText] = useState('');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    { label: '📅 Full Request', prompt: 'Hi! Can you schedule a Team Sync meeting for tomorrow at 3 PM?' },
    { label: '❓ Missing Time', prompt: 'I need to book a Dentist checkup appointment please.' },
    { label: '⚠️ Conflict Test', prompt: 'Book a Product Strategy review on Friday at 11:30 AM' },
    { label: '🔄 Reschedule', prompt: 'Can we move my Dental Cleaning from tomorrow to Friday at 4 PM?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div id="telegram-simulator-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Controls & View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Telegram Agent Live Chat Simulator
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Test natural language scheduling requests. The agent uses Gemini 3.6 Flash to extract date, time, and purpose.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex items-center space-x-1">
            <button
              id="btn-frame-mobile"
              onClick={() => setIsMobileFrame(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isMobileFrame ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Frame</span>
            </button>
            <button
              id="btn-frame-expanded"
              onClick={() => setIsMobileFrame(false)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                !isMobileFrame ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>

          <button
            id="btn-reset-chat"
            onClick={onResetChat}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Chat Interface */}
        <div className={`lg:col-span-7 flex justify-center ${!isMobileFrame ? 'lg:col-span-8' : ''}`}>
          
          <div className={`w-full ${isMobileFrame ? 'max-w-md bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-3 shadow-2xl relative shadow-sky-950/40' : 'bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl'}`}>
            
            {/* Phone Notch/Header for Mobile Frame */}
            {isMobileFrame && (
              <div className="flex flex-col items-center mb-2">
                <div className="w-24 h-4 bg-slate-900 rounded-b-xl flex items-center justify-center mb-2">
                  <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Telegram Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between mb-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                    🤖
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white flex items-center space-x-1">
                    <span>Calendar Booking Agent</span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded font-mono">BOT</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">@AppointmentBookingAI_bot</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                  Webhook Connected
                </span>
              </div>
            </div>

            {/* Quick Sample Prompts Chips */}
            <div className="mb-3 px-1">
              <p className="text-[11px] text-slate-400 mb-1.5 flex items-center space-x-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Quick Test Prompts:</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(sp.prompt)}
                    disabled={isLoading}
                    className="text-[11px] bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-sky-500/40 px-2.5 py-1 rounded-lg transition-all text-left flex items-center space-x-1"
                  >
                    <span>{sp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Timeline Box */}
            <div className={`overflow-y-auto space-y-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 ${isMobileFrame ? 'h-[440px]' : 'h-[500px]'}`}>
              
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md transition-all ${
                        isUser
                          ? 'bg-sky-600 text-white rounded-tr-xs'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      {/* Telegram Markdown Formatting rendering */}
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text.split('\n').map((line, i) => {
                          return (
                            <p key={i} className={i > 0 ? 'mt-1' : ''}>
                              {line}
                            </p>
                          );
                        })}
                      </div>

                      {/* Action Buttons if present */}
                      {msg.actionButtons && msg.actionButtons.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                          {msg.actionButtons.map((btn, bIdx) => (
                            <button
                              key={bIdx}
                              onClick={() => {
                                if (btn.payload?.slot) {
                                  onSendMessage(`Let's do ${btn.payload.slot} instead`);
                                }
                              }}
                              className="text-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-lg font-medium transition-colors"
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 opacity-80">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.text)}
                            className="ml-2 hover:text-slate-200 transition-colors"
                            title="Copy message"
                          >
                            {copiedText === msg.text ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center space-x-2 p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl text-xs text-sky-400 w-fit">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  <span className="animate-pulse font-medium">Gemini AI parsing request & verifying calendar...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-3 flex items-center space-x-2">
              <input
                id="input-telegram-chat"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type appointment request... (e.g. Book sync tomorrow 2pm)"
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all"
              />
              <button
                id="btn-send-message"
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>

        {/* Right Column: AI Extraction Inspector */}
        <div className={`lg:col-span-5 ${!isMobileFrame ? 'lg:col-span-4' : ''}`}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl sticky top-24">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">
                  AI NLP State Inspector
                </h3>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Gemini JSON output
              </span>
            </div>

            {latestExtraction ? (
              <div className="space-y-4">
                
                {/* Status Badge */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400">Request Completeness:</span>
                  {latestExtraction.isComplete ? (
                    <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to Book</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Awaiting Details</span>
                    </span>
                  )}
                </div>

                {/* Conflict Alert if present */}
                {latestExtraction.hasConflict && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-rose-200">Calendar Conflict Detected</p>
                      <p className="text-[11px] text-rose-300/80 mt-0.5">
                        Overlaps with: "{latestExtraction.conflictingEventTitle}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Extracted Parameters Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-sky-400" />
                      <span>Purpose / Title:</span>
                    </span>
                    <span className="font-semibold text-slate-200">
                      {latestExtraction.purpose || <em className="text-slate-500 font-normal">Missing</em>}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Extracted Date:</span>
                    </span>
                    <span className="font-semibold text-slate-200">
                      {latestExtraction.date || <em className="text-slate-500 font-normal">Missing</em>}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Extracted Time:</span>
                    </span>
                    <span className="font-semibold text-slate-200">
                      {latestExtraction.time || <em className="text-slate-500 font-normal">Missing</em>}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg text-xs">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Intent Type:</span>
                    </span>
                    <span className="font-mono text-sky-400 font-medium">
                      {latestExtraction.intent}
                    </span>
                  </div>
                </div>

                {/* Missing Fields list */}
                {latestExtraction.missingFields.length > 0 && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-xs font-semibold text-amber-300 mb-1">
                      Fields AI will ask user for:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {latestExtraction.missingFields.map((field, idx) => (
                        <span key={idx} className="text-[11px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded font-mono">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw JSON Debug Viewer */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                    <span>Parsed Agent Payload</span>
                    <span>JSON Schema v1</span>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-48 scrollbar-thin">
                    {JSON.stringify(latestExtraction, null, 2)}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Info className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>Send a message in the Telegram simulator to see real-time Gemini AI field extraction and state analysis.</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
