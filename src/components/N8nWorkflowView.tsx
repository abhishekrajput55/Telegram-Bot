import React, { useState } from 'react';
import { 
  Workflow, 
  Download, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  GitBranch, 
  Calendar, 
  CheckCircle2, 
  HelpCircle,
  Code,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { N8N_WORKFLOW_NODES } from '../data/n8nWorkflowData';

export const N8nWorkflowView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-2');
  const [copied, setCopied] = useState(false);
  const [showJsonTab, setShowJsonTab] = useState(false);

  const selectedNode = N8N_WORKFLOW_NODES.find(n => n.id === selectedNodeId) || N8N_WORKFLOW_NODES[0];

  const handleDownloadJson = () => {
    fetch('/api/export/n8n')
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'n8n-workflow.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => {
        alert('Downloading n8n-workflow.json');
      });
  };

  const handleCopyJson = () => {
    fetch('/api/export/n8n')
      .then(res => res.text())
      .then(text => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div id="n8n-workflow-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Workflow className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              n8n Workflow Automation Blueprint
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visual pipeline representation of the Telegram AI Bot logic. Ready to export & import into n8n.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            id="btn-copy-n8n-json"
            onClick={handleCopyJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs sm:text-sm font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copied JSON!' : 'Copy n8n JSON'}</span>
          </button>

          <button
            id="btn-download-n8n-json"
            onClick={handleDownloadJson}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-sky-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export n8n-workflow.json</span>
          </button>
        </div>
      </div>

      {/* View Mode Toggle: Visual Diagram vs Raw JSON */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => setShowJsonTab(false)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            !showJsonTab ? 'bg-sky-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Interactive Diagram</span>
        </button>
        <button
          onClick={() => setShowJsonTab(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            showJsonTab ? 'bg-sky-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>n8n-workflow.json Code</span>
        </button>
      </div>

      {!showJsonTab ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Diagram Canvas */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/60">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>n8n Canvas Editor Mockup</span>
              </span>
              <span className="text-xs text-slate-500">
                Click any node to inspect configuration
              </span>
            </div>

            {/* Pipeline Flow Grid */}
            <div className="space-y-6">
              
              {/* Step 1: Trigger */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  onClick={() => setSelectedNodeId('node-1')}
                  className={`w-full sm:w-64 p-4 rounded-xl border-2 transition-all cursor-pointer shadow-lg ${
                    selectedNodeId === 'node-1'
                      ? 'bg-sky-950/60 border-sky-500 shadow-sky-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-lg bg-sky-500 text-white">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Telegram Trigger</h4>
                      <p className="text-[11px] text-sky-400 font-mono">Webhook Receiver</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Listens for new text messages from Telegram Bot.
                  </p>
                </div>

                <div className="hidden sm:flex items-center justify-center text-slate-600">
                  <ArrowRight className="w-6 h-6 animate-pulse text-sky-500" />
                </div>
                <div className="sm:hidden text-slate-600">
                  ↓
                </div>

                {/* Step 2: Gemini AI NLP */}
                <div
                  onClick={() => setSelectedNodeId('node-2')}
                  className={`w-full sm:w-64 p-4 rounded-xl border-2 transition-all cursor-pointer shadow-lg ${
                    selectedNodeId === 'node-2'
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-indigo-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-600 text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Gemini 3.6 Flash</h4>
                      <p className="text-[11px] text-indigo-400 font-mono">NLP Extractor</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Extracts structured JSON: date, time, and purpose.
                  </p>
                </div>
              </div>

              {/* Step 3: Branch Condition */}
              <div className="flex justify-center my-2">
                <div
                  onClick={() => setSelectedNodeId('node-3')}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer shadow-lg flex items-center space-x-3 ${
                    selectedNodeId === 'node-3'
                      ? 'bg-amber-950/60 border-amber-500 shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <GitBranch className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-white text-xs">Completeness Condition (IF)</h4>
                    <p className="text-[10px] text-amber-400">isComplete === true ?</p>
                  </div>
                </div>
              </div>

              {/* Step 4: Two Branches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                {/* Branch TRUE: Calendar API */}
                <div className="space-y-4 border-l-2 border-emerald-500/40 pl-4">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    IF TRUE (Complete Request)
                  </span>

                  <div
                    onClick={() => setSelectedNodeId('node-5')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-lg ${
                      selectedNodeId === 'node-5'
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-emerald-500/20'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 rounded-lg bg-emerald-600 text-white">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Google Calendar</h4>
                        <p className="text-[11px] text-emerald-400 font-mono">Create Event</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Check conflicts & book appointment.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedNodeId('node-6')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-lg ${
                      selectedNodeId === 'node-6'
                        ? 'bg-sky-950/60 border-sky-500 shadow-sky-500/20'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 rounded-lg bg-sky-600 text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Telegram Confirmation</h4>
                        <p className="text-[11px] text-sky-400 font-mono">Send Success Msg</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Sends confirmation markdown with appointment summary.
                    </p>
                  </div>
                </div>

                {/* Branch FALSE: Ask Missing Info */}
                <div className="space-y-4 border-l-2 border-rose-500/40 pl-4">
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    IF FALSE (Missing Info)
                  </span>

                  <div
                    onClick={() => setSelectedNodeId('node-4')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-lg ${
                      selectedNodeId === 'node-4'
                        ? 'bg-rose-950/60 border-rose-500 shadow-rose-500/20'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 rounded-lg bg-rose-600 text-white">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Ask Missing Details</h4>
                        <p className="text-[11px] text-rose-400 font-mono">Telegram Question</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Prompts user for missing date or time specifically.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Node Inspector Panel */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl sticky top-24">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-800">
              <Workflow className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-white text-base">Node Inspector</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Node Name</span>
                <h4 className="text-lg font-bold text-white mt-0.5">{selectedNode.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedNode.description}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Required Credentials
                </span>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{selectedNode.credentialsNeeded || 'None Required'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Node Parameters
                </span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-sky-300 font-mono overflow-x-auto max-h-48">
                  {JSON.stringify(selectedNode.parameters, null, 2)}
                </pre>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={handleDownloadJson}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                >
                  Download Complete Workflow File
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Raw JSON Viewer */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">n8n-workflow.json Export Output</h3>
            </div>
            <button
              onClick={handleCopyJson}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Code</span>
            </button>
          </div>

          <pre className="text-xs text-emerald-400 font-mono bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[600px] scrollbar-thin">
            {`{
  "name": "AI Telegram Appointment Booking Workflow",
  "nodes": [
    {
      "parameters": { "updates": ["message"] },
      "id": "1a2b3c4d-telegram-trigger",
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1.1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "modelName": "models/gemini-3.6-flash",
        "systemInstruction": "Extract date, time, purpose from text into structured JSON"
      },
      "id": "2b3c4d5e-gemini-nlp",
      "name": "Gemini AI NLP Extractor",
      "type": "n8n-nodes-base.googleGemini",
      "typeVersion": 1,
      "position": [480, 300]
    },
    {
      "parameters": {
        "conditions": { "boolean": [{ "value1": "={{ $json.isComplete }}", "value2": true }] }
      },
      "id": "3c4d5e6f-completeness-check",
      "name": "Check Request Complete?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [710, 300]
    },
    {
      "parameters": {
        "calendar": "primary",
        "summary": "={{ $json.purpose }}",
        "start": "={{ $json.startDateTime }}",
        "end": "={{ $json.endDateTime }}"
      },
      "id": "6f7g8h9i-create-calendar-event",
      "name": "Google Calendar / Calendly Create Event",
      "type": "n8n-nodes-base.googleCalendar",
      "typeVersion": 1,
      "position": [1170, 180]
    },
    {
      "parameters": {
        "chatId": "={{ $('Telegram Trigger').item.json.message.chat.id }}",
        "text": "=✅ *Appointment Scheduled!*\\n\\n📅 Date: {{ $json.date }}\\n⏰ Time: {{ $json.time }}"
      },
      "id": "7g8h9i0j-send-confirmation",
      "name": "Send Telegram Confirmation",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [1400, 180]
    }
  ]
}`}
          </pre>
        </div>
      )}

    </div>
  );
};
