import React from 'react';
import { 
  Bot, 
  Calendar, 
  Workflow, 
  FileCode, 
  PlaySquare, 
  Settings, 
  Sparkles,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'telegram' | 'calendar' | 'n8n' | 'prompts' | 'demo';
  setActiveTab: (tab: 'telegram' | 'calendar' | 'n8n' | 'prompts' | 'demo') => void;
  onOpenSettings: () => void;
  eventCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  eventCount
}) => {
  return (
    <header id="main-header" className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Status */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-semibold text-lg tracking-tight text-white">
                  Telegram Booking AI
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                  Live Agent Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gemini 3.6 Flash • Google Calendar & Calendly Automated Engine
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              id="tab-telegram"
              onClick={() => setActiveTab('telegram')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'telegram'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Telegram Bot</span>
            </button>

            <button
              id="tab-calendar"
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'calendar'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar Agenda</span>
              {eventCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold bg-slate-800 text-sky-400">
                  {eventCount}
                </span>
              )}
            </button>

            <button
              id="tab-n8n"
              onClick={() => setActiveTab('n8n')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'n8n'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>n8n Workflow</span>
            </button>

            <button
              id="tab-prompts"
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'prompts'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Prompt.md</span>
            </button>

            <button
              id="tab-demo"
              onClick={() => setActiveTab('demo')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'demo'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <PlaySquare className="w-4 h-4 text-amber-400" />
              <span>Interactive Demo</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700/60"
              title="Configure Bot Credentials & Webhook"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Bot & Calendar API</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Row */}
        <div className="flex lg:hidden overflow-x-auto space-x-1 py-2 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'telegram' ? 'bg-sky-500 text-white' : 'text-slate-400 bg-slate-950'
            }`}
          >
            Telegram Bot
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'calendar' ? 'bg-sky-500 text-white' : 'text-slate-400 bg-slate-950'
            }`}
          >
            Calendar ({eventCount})
          </button>
          <button
            onClick={() => setActiveTab('n8n')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'n8n' ? 'bg-sky-500 text-white' : 'text-slate-400 bg-slate-950'
            }`}
          >
            n8n Export
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'prompts' ? 'bg-sky-500 text-white' : 'text-slate-400 bg-slate-950'
            }`}
          >
            Prompt.md
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'demo' ? 'bg-sky-500 text-white' : 'text-slate-400 bg-slate-950'
            }`}
          >
            Demo Simulator
          </button>
        </div>

      </div>
    </header>
  );
};
