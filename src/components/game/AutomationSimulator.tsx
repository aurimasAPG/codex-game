'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/context/GameContext';

type AutomationTask = {
  id: string;
  name: string;
  status: 'broken' | 'fixed';
  description: string;
  correctSkill: string;
};

const INITIAL_TASKS: AutomationTask[] = [
  { id: 'waste', name: 'Ad Waste Monitor', description: 'Sistema nebeatpažįsta neefektyvių ratažodžių.', correctSkill: 'Pattern Matching' },
  { id: 'competitor', name: 'Competitor Scraper', description: 'Konkurentų kainų stebėjimas užstrigo ties saugumo patikra.', correctSkill: 'Computer Use' },
  { id: 'leads', name: 'Lead Scrubber', description: 'Nauji kontaktai nefiltruojami pagal kokybės kriterijus.', correctSkill: 'Semantic Analysis' },
];

const SKILLS = ['Pattern Matching', 'Computer Use', 'Semantic Analysis', 'Image Recognition', 'Vector Search'];

export function AutomationSimulator({ onComplete }: { onComplete?: () => void }) {
  const { addXp } = useGame();
  const [tasks, setTasks] = useState<AutomationTask[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const allFixed = tasks.every(t => t.status === 'fixed');

  const fixTask = (id: string, skill: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && task.correctSkill === skill) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'fixed' } : t));
      addXp(150);
      setSelectedTask(null);
    } else {
      // Netinkamas įrankis - vizualus feedback galėtų būti čia
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Kritinė būsena: Agentų laivynas atjungtas</span>
        </div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Atstatykite automatizacijas</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Jūsų verslo mastelis (Scale) krenta. Parinkite tinkamus įgūdžius sugedusiems agentams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <motion.button
            key={task.id}
            layout
            onClick={() => task.status === 'broken' && setSelectedTask(task.id)}
            className={cn(
              "p-5 rounded-2xl border text-left transition-all relative group",
              task.status === 'fixed' 
                ? "bg-green-500/5 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]" 
                : "bg-slate-900 border-slate-800 hover:border-red-500/50 hover:bg-red-500/5"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-4 border",
              task.status === 'fixed' ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-red-500/20 border-red-500/30 text-red-400 animate-pulse"
            )}>
              {task.status === 'fixed' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <h3 className="font-bold text-white mb-1">{task.name}</h3>
            <p className="text-[11px] text-slate-500 leading-snug">{task.status === 'fixed' ? 'Sistema veikia stabiliai.' : task.description}</p>
            
            {task.status === 'broken' && (
              <div className="absolute top-4 right-4 text-[10px] font-black text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                FIX NOW
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 bg-slate-950 border border-slate-800 rounded-2xl"
          >
            <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest">Parinkite įtaisą sistemai: <span className="text-white">{tasks.find(t => t.id === selectedTask)?.name}</span></h4>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => fixTask(selectedTask, skill)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all"
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allFixed && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-tighter rounded-2xl hover:bg-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-3"
            onClick={onComplete}
          >
            <Zap className="w-5 h-5 fill-current" /> STABILIZUOTI SISTEMĄ IR TĘSTI
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
