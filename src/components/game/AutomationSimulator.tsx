'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Settings,
  ShieldAlert,
  ArrowRight,
  HandMetal
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
  { id: 'waste', name: 'Ad Waste Monitor', description: 'Sistema nebeatpažįsta neefektyvių raktažodžių.', correctSkill: 'Vartotojų elgsenos analizė' },
  { id: 'competitor', name: 'Competitor Scraper', description: 'Konkurentų kainų stebėjimas užstrigo ties saugumo patikra.', correctSkill: 'Naršyklės valdymas' },
  { id: 'leads', name: 'Lead Scrubber', description: 'Nauji kontaktai nefiltruojami pagal kokybės kriterijus.', correctSkill: 'Semantinė analizė' },
];

const SKILLS = ['Vartotojų elgsenos analizė', 'Naršyklės valdymas', 'Semantinė analizė', 'Vaizdų atpažinimas', 'Vektorinė paieška'];

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
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative background pulse */}
      {!allFixed && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
      )}

      <div className="text-center space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">AVARINĖ BŪSENA: AGENTAI NEVEIKIA</span>
        </div>
        <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">SUSTABDYKITE ŽLUGIMĄ</h2>
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <HandMetal className="w-4 h-4 text-cyan-400" />
          <p className="text-sm">Spustelėkite ant sugedusios sistemos ir parinkite jai įrankį.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={false}
            animate={{ scale: selectedTask === task.id ? 1.05 : 1 }}
            className={cn(
              "p-6 rounded-2xl border text-left transition-all relative overflow-hidden",
              task.status === 'fixed' 
                ? "bg-green-500/5 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]" 
                : "bg-slate-900/80 border-slate-800",
              selectedTask === task.id && "border-cyan-500 ring-2 ring-cyan-500/20"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 border",
              task.status === 'fixed' ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-red-500/20 border-red-500/30 text-red-400 animate-pulse"
            )}>
              {task.status === 'fixed' ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>
            
            <h3 className="font-bold text-xl text-white mb-2">{task.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {task.status === 'fixed' ? 'Sistema sėkmingai stabilizuota ir veikia optimaliu režimu.' : task.description}
            </p>

            {task.status === 'broken' && (
              <button
                onClick={() => setSelectedTask(task.id)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-700 flex items-center justify-center gap-2"
              >
                <Settings className="w-3 h-3" /> taisyti dabar
              </button>
            )}
            
            {task.status === 'fixed' && (
              <div className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> veikia
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div 
              onClick={e => e.stopPropagation()}
              className="bg-slate-950 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl"
            >
              <h4 className="text-sm font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">SISTEMOS REMONTAS</h4>
              <h3 className="text-2xl font-bold text-white mb-1">{tasks.find(t => t.id === selectedTask)?.name}</h3>
              <p className="text-sm text-slate-400 mb-8">Parinkite tinkamą „Skill“ algoritmą klaidos eliminavimui:</p>
              
              <div className="grid gap-3">
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => fixTask(selectedTask, skill)}
                    className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all flex items-center justify-between group"
                  >
                    {skill}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setSelectedTask(null)}
                className="w-full mt-6 py-2 text-xs text-slate-600 hover:text-slate-400 font-bold uppercase"
              >
                atšaukti
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allFixed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <button
              className="w-full py-5 bg-cyan-500 text-black font-black uppercase tracking-tighter rounded-2xl hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3 text-lg"
              onClick={onComplete}
            >
              <Zap className="w-6 h-6 fill-current" /> STABILIZUOTI SISTEMĄ IR TĘSTI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
