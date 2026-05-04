'use client';

import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Terminal, Layers, BookOpen, Zap, MousePointer2, Globe, Brain, Users, ShieldCheck, Calendar, ArrowRight, Play, CheckCircle2, X } from 'lucide-react';
import { InteractiveMission } from './InteractiveMission';
import { AgencyControlRoom } from './AgencyControlRoom';
import { AutomationSimulator } from './AutomationSimulator';

const iconMap: Record<string, any> = {
  Terminal, Layers, BookOpen, Zap, MousePointer2, Globe, Brain, Users, ShieldCheck, Calendar
};

const modules = [
  { id: 'intro', icon: 'Terminal', title: 'Why Chat Isn’t Enough', description: 'Learn why the single-thread model of ChatGPT hits a ceiling.' },
  { id: 'threads', icon: 'Layers', title: 'Parallel Threads', description: 'Master running multiple campaign operations simultaneously.' },
  { id: 'skills', icon: 'BookOpen', title: 'Skills & Playbooks', description: 'Turn prompts into scalable, executable agency skills.' },
  { id: 'automations', icon: 'Zap', title: 'Automations', description: 'Set up the 5 core always-on marketing automations.' },
  { id: 'computer-use', icon: 'MousePointer2', title: 'Computer Use', description: 'When the agent takes the wheel of your browser.' },
  { id: 'intelligence', icon: 'Globe', title: 'Intelligence & Research', description: 'Connecting agents to the live web and stack.' },
  { id: 'memory', icon: 'Brain', title: 'Memory Layer', description: 'Ensure agents never forget a client choice.' },
  { id: 'orchestration', icon: 'Users', title: 'Orchestration', description: 'Coordinating specialists for complex projects.' },
  { id: 'governance', icon: 'ShieldCheck', title: 'Governance', description: 'Scaling with safety: knowing when to approve.' },
  { id: 'plan', icon: 'Calendar', title: '30-Day Plan', description: 'Your final roadmap to an agentic marketing model.' }
];

export default function GameContainer() {
  const { state, setAgencyStatus, setCurrentModule, completeModule } = useGame();

  if (state.agencyStatus === 'chat_based' && !state.currentModule) {
    return <OpeningScenario />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-mono">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-cyan-400">AGENTIC MARKETING ACADEMY</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Status: {state.agencyStatus.replace('_', ' ')} Operation</p>
        </div>
        <div className="flex gap-8 items-center">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase">Level {state.level}</p>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-cyan-500 transition-all duration-500" 
                style={{ width: `${(state.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">XP</p>
            <p className="text-sm font-bold text-cyan-400">{state.xp.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {!state.currentModule ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, i) => {
              const Icon = iconMap[module.icon];
              const isCompleted = state.completedModules.includes(module.id);
              const isUnlocked = i === 0 || state.completedModules.includes(modules[i-1].id);
              
              return (
                <motion.div
                  key={module.id}
                  whileHover={isUnlocked ? { scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 1)' } : {}}
                  className={cn(
                    "p-6 rounded-xl border transition-all cursor-pointer relative overflow-hidden group",
                    isUnlocked ? "border-slate-800 bg-slate-900/50" : "border-slate-900 bg-slate-950 opacity-50 grayscale cursor-not-allowed",
                    isCompleted && "border-cyan-500/50 bg-cyan-950/10"
                  )}
                  onClick={() => isUnlocked && setCurrentModule(module.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-2 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 transition-colors", isCompleted && "bg-cyan-500/20")}>
                      <Icon className={cn("w-6 h-6", isCompleted ? "text-cyan-400" : "text-slate-400")} />
                    </div>
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{module.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{module.description}</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    START MISSION <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <ModuleLoader moduleId={state.currentModule} />
        )}
      </main>
    </div>
  );
}

function ModuleLoader({ moduleId }: { moduleId: string }) {
  const { setCurrentModule, completeModule } = useGame();
  
  const handleComplete = (score: number = 100) => {
    completeModule(moduleId, score);
    setCurrentModule(null);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
      <div className="w-full flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">MISSION: {moduleId.replace('-', ' ')}</h2>
        <button onClick={() => setCurrentModule(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {moduleId === 'orchestration' ? (
        <div className="w-full space-y-8">
          <AgencyControlRoom />
          <button onClick={() => handleComplete()} className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400">
            END SIMULATION
          </button>
        </div>
      ) : moduleId === 'automations' ? (
        <div className="w-full">
          <AutomationSimulator onComplete={() => handleComplete()} />
        </div>
      ) : (
        <InteractiveMission 
          moduleId={moduleId} 
          onComplete={(score) => handleComplete(score)} 
        />
      )}
    </div>
  );
}

function OpeningScenario() {
  const { setAgencyStatus } = useGame();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full border border-slate-800 bg-slate-900/50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold text-white mb-4">Monday Morning: 47 Tabs Open</h2>
        <p className="text-slate-400 mb-8">Your coffee is cooling. You have GA4, Meta, and Search Console open. Reports are due by noon. Do you keep grinding or shift to orchestration?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setAgencyStatus('agentic')} className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-left">
            <span className="text-xs font-bold text-cyan-400 block mb-1 uppercase">The Agentic Shift</span>
            <p className="font-bold text-slate-200">Start Orchestrating Agents</p>
          </button>
          <button className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 opacity-50 text-left cursor-not-allowed">
            <span className="text-xs font-bold text-slate-500 block mb-1 uppercase">Status Quo</span>
            <p className="font-bold text-slate-400">Manual Copy-Paste</p>
          </button>
        </div>
      </div>
    </div>
  );
}
