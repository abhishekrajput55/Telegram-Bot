import React, { useState } from 'react';
import { Settings, X, Shield, Key, Send, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { BotSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  botSettings: BotSettings;
  onSaveSettings: (newSettings: BotSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  botSettings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<BotSettings>(botSettings);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  const handleTestWebhook = () => {
    setTestResult('Testing Webhook Endpoint...');
    fetch('/api/telegram/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        update_id: 10001,
        message: {
          message_id: 1,
          text: 'Ping from Settings Tester',
          chat: { id: 123456, first_name: 'Admin' }
        }
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setTestResult('✅ Telegram Webhook Endpoint Connected & Responding (HTTP 200)');
        } else {
          setTestResult('⚠️ Webhook response received');
        }
      })
      .catch((err) => {
        setTestResult(`❌ Error testing webhook: ${err.message}`);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">Bot & Calendar API Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          
          {/* Telegram Bot Token */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram Bot API Token</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Get via @BotFather</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 7891234567:AAH_TgBotSampleToken..."
              value={formData.botToken}
              onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500 font-mono text-xs"
            />
          </div>

          {/* Calendar Provider selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Active Calendar Backend
            </label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
            >
              <option value="google_calendar">Google Calendar API (Primary)</option>
              <option value="calendly">Calendly API</option>
            </select>
          </div>

          {/* Calendly API Key */}
          {formData.provider === 'calendly' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Calendly Personal Access Token</span>
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOi..."
                value={formData.calendlyApiKey}
                onChange={(e) => setFormData({ ...formData, calendlyApiKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500 font-mono text-xs"
              />
            </div>
          )}

          {/* Webhook Endpoint */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Telegram Webhook URL
            </label>
            <input
              type="text"
              readOnly
              value={formData.webhookUrl}
              className="w-full bg-slate-950/80 border border-slate-800/80 text-slate-400 rounded-xl px-3 py-2 outline-none font-mono text-xs select-all"
            />
          </div>

          {/* Webhook Tester */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestWebhook}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
            >
              Test Webhook Connection
            </button>
            {testResult && (
              <p className="mt-2 text-xs font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
                {testResult}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold shadow-md shadow-sky-500/20"
            >
              Save Configuration
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
