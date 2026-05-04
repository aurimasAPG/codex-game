'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Terminal,
  Layers,
  BookOpen,
  Zap,
  MousePointer2,
  Globe,
  Brain,
  Users,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  X,
  Flame,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { InteractiveMission } from './InteractiveMission';
import { AgencyControlRoom } from './AgencyControlRoom';
import { AutomationSimulator } from './AutomationSimulator';
import { Achievements } from './Achievements';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
  const { state, hydrated, setCurrentModule, resetProgress } = useGame();
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-600 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Booting agentic fleet…
      </div>
    );
  }

  if (state.agencyStatus === 'chat_based' && !state.currentModule) {
    return <OpeningScenario />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-mono">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tighter text-cyan-400">AGENTIC MARKETING ACADEMY</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Status: {state.agencyStatus.replace('_', ' ')} Operation</p>
        </div>
        <div className="flex gap-6 items-center">
          <StreakIndicator streak={state.streak} />
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase">Level {state.level}</p>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-500"
                style={{ width: `${(state.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase">XP</p>
            <p className="text-sm font-bold text-cyan-400">{state.xp.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAchievementsOpen(true)}
              title="Achievements"
              className="p-2 rounded-lg border border-slate-800 hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-colors"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
            </button>
            <button
              onClick={() => setResetOpen(true)}
              title="Reset progress"
              className="p-2 rounded-lg border border-slate-800 hover:border-red-500/40 hover:bg-red-500/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>
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
                    {isCompleted ? 'REPLAY MISSION' : 'START MISSION'} <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <ModuleLoader moduleId={state.currentModule} />
        )}
      </main>

      <Achievements open={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
      <ResetConfirm open={resetOpen} onCancel={() => setResetOpen(false)} onConfirm={() => { resetProgress(); setResetOpen(false); }} />
    </div>
  );
}

function StreakIndicator({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  const intensity = streak >= 10 ? 'text-fuchsia-400' : streak >= 5 ? 'text-orange-400' : streak >= 3 ? 'text-amber-400' : 'text-slate-400';
  return (
    <motion.div
      key={streak}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/60', intensity)}
      title={`${streak}-answer streak`}
    >
      <Flame className="w-4 h-4" />
      <span className="text-xs font-bold font-mono">{streak}×</span>
    </motion.div>
  );
}

function ModuleLoader({ moduleId }: { moduleId: string }) {
  const { setCurrentModule, completeModule } = useGame();
  const close = () => setCurrentModule(null);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
      <div className="w-full flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">MISSION: {moduleId.replace('-', ' ')}</h2>
        <button onClick={close} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {moduleId === 'orchestration' ? (
        <div className="w-full space-y-8">
          <AgencyControlRoom />
          <button
            onClick={() => { completeModule(moduleId, 100); close(); }}
            className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400"
          >
            END SIMULATION
          </button>
        </div>
      ) : moduleId === 'automations' ? (
        <div className="w-full">
          <AutomationSimulator onComplete={() => { completeModule(moduleId, 100); close(); }} />
        </div>
      ) : (
        <InteractiveMission
          moduleId={moduleId}
          onComplete={close}
        />
      )}
    </div>
  );
}

function ResetConfirm({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950 border border-red-500/30 rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-bold text-white mb-2">Wipe agentic fleet?</h2>
            <p className="text-sm text-slate-400 mb-6">
              This clears your XP, streaks, badges, and module progress. The action can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-black text-xs font-bold rounded-lg hover:bg-red-400 transition-colors"
              >
                RESET PROGRESS
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
