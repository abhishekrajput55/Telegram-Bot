import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  HelpCircle, 
  AlertTriangle,
  PlaySquare,
  Smartphone,
  Zap,
  Info
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/mockData';
import { DemoScenario, DemoStep } from '../types';

export const DemoVideoView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep: DemoStep | undefined = selectedScenario.steps[currentStepIndex];

  // Handle auto playback step progression
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex < selectedScenario.steps.length - 1) {
        const delay = (selectedScenario.steps[currentStepIndex]?.delayMs || 1500) / playbackSpeed;
        timerRef.current = setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
        }, delay);
      } else {
        setIsPlaying(false);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, selectedScenario, playbackSpeed]);

  const handleSelectScenario = (scen: DemoScenario) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedScenario(scen);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= selectedScenario.steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepNext = () => {
    if (currentStepIndex < selectedScenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  return (
    <div id="demo-video-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PlaySquare className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Interactive Prototype Walkthrough & Video Simulator
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulated end-to-end execution scenarios demonstrating AI extraction, multi-turn clarification, and conflict handling.
          </p>
        </div>

        {/* Speed & Player Controls */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Reset video"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="flex items-center space-x-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all text-xs"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            <span>{isPlaying ? 'Pause' : 'Play Walkthrough'}</span>
          </button>

          <button
            onClick={handleStepNext}
            disabled={currentStepIndex >= selectedScenario.steps.length - 1}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg transition-colors"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="border-l border-slate-800 pl-2 text-xs text-slate-400 font-mono">
            <span>{playbackSpeed}x</span>
          </div>
        </div>
      </div>

      {/* Scenario Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {DEMO_SCENARIOS.map((scen) => (
          <button
            key={scen.id}
            onClick={() => handleSelectScenario(scen)}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              selectedScenario.id === scen.id
                ? 'bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-950/20'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400 mb-2">
              {scen.badge}
            </span>
            <h3 className="text-sm font-bold text-white mb-1">{scen.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{scen.description}</p>
          </button>
        ))}
      </div>

      {/* Main Player Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Simulated Telegram Phone Frame */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-md bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-3 shadow-2xl relative shadow-amber-950/20">
            
            {/* Top Notch */}
            <div className="flex flex-col items-center mb-2">
              <div className="w-24 h-4 bg-slate-900 rounded-b-xl flex items-center justify-center mb-2">
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
              </div>
            </div>

            {/* Telegram Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                  🤖
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">AI Appointment Booking Bot</h4>
                  <p className="text-[10px] text-amber-400 font-mono">Demo Simulation Recording</p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                Step {currentStepIndex + 1} of {selectedScenario.steps.length}
              </span>
            </div>

            {/* Step Chat Container */}
            <div className="h-[400px] overflow-y-auto space-y-3 p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
              {selectedScenario.steps.slice(0, currentStepIndex + 1).map((st, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${st.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow ${
                      st.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-tr-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{st.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-3 px-1">
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / selectedScenario.steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Step Explanation & Logic Breakdown */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Step AI Explanation</h3>
          </div>

          {currentStep ? (
            <div className="space-y-4">
              
              {/* Annotation box */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                <p className="font-semibold text-amber-300 mb-1 flex items-center space-x-1.5">
                  <Info className="w-4 h-4" />
                  <span>Execution Insight</span>
                </p>
                <p className="leading-relaxed">{currentStep.annotation}</p>
              </div>

              {/* Extracted Data snapshot if present */}
              {currentStep.extractedData && (
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Gemini Extracted Payload
                  </span>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-sky-400 font-mono overflow-x-auto max-h-48">
                    {JSON.stringify(currentStep.extractedData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <span>Step {currentStepIndex + 1} of {selectedScenario.steps.length}</span>
                <button
                  onClick={handleStepNext}
                  disabled={currentStepIndex >= selectedScenario.steps.length - 1}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium rounded-lg transition-colors"
                >
                  Next Step →
                </button>
              </div>

            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
};
