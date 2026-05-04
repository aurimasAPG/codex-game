'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, Clock, Pause, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

import { SkillBuilder } from './SkillBuilder';
import { AutomationSimulator } from './AutomationSimulator';

const agentsInitial = [
  { id: 'media', name: 'Paid Media Agent', status: 'Running', task: 'Optimizing LinkedIn budget split', progress: 65 },
  { id: 'seo', name: 'SEO Agent', status: 'Waiting', task: 'GSC data pulled. Needs anomaly interpretation.', progress: 100 },
  { id: 'cro', name: 'CRO Agent', status: 'Running', task: 'Analyzing heatmaps for skincare landing page', progress: 22 },
  { id: 'intel', name: 'Intelligence Agent', status: 'Paused', task: 'Competitor pricing change detected. Authorize deeper scan?', progress: 45 },
];

export function AgencyControlRoom() {
  const [agents, setAgents] = useState(agentsInitial);
  const [activeView, setActiveView] = useState<'dashboard' | 'skills' | 'automations'>('dashboard');

  const updateProgress = () => {
    setAgents(prev => prev.map(a => {
      if (a.status === 'Running') {
        const next = a.progress + (Math.random() * 5);
        return { ...a, progress: next > 100 ? 0 : next };
      }
      return a;
    }));
  };

  useEffect(() => {
    const interval = setInterval(updateProgress, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-2xl w-fit mx-auto shadow-2xl">
        <NavTab 
          active={activeView === 'dashboard'} 
          onClick={() => setActiveView('dashboard')} 
          label="Control Room" 
          icon={<Activity className="w-4 h-4" />} 
        />
        <NavTab 
          active={activeView === 'skills'} 
          onClick={() => setActiveView('skills')} 
          label="Skill Builder" 
          icon={<Layers className="w-4 h-4" />} 
        />
        <NavTab 
          active={activeView === 'automations'} 
          onClick={() => setActiveView('automations')} 
          label="Automation Sim" 
          icon={<Zap className="w-4 h-4" />} 
        />
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard label="Active Agents" value="3" icon={<Zap className="w-4 h-4 text-cyan-400" />} />
              <StatusCard label="Worktrees" value="12" icon={<Layers className="w-4 h-4 text-purple-400" />} />
              <StatusCard label="Approvals Waiting" value="2" icon={<Activity className="w-4 h-4 text-yellow-400" />} />
              <StatusCard label="Savings/Mo" value="$4.2k" icon={<Clock className="w-4 h-4 text-green-400" />} />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                  <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Agentic Fleet Status</h2>
                </div>
                <div className="px-2 py-1 bg-cyan-500/10 rounded text-[10px] font-bold text-cyan-400 border border-cyan-500/20">LIVE SYNC</div>
              </div>
              <div className="divide-y divide-slate-800/50">
                {agents.map((agent) => (
                  <div key={agent.id} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{agent.name}</h3>
                        <StatusBadge status={agent.status} />
                      </div>
                      <p className="text-xs text-slate-500 font-mono italic">{agent.task}</p>
                      <div className="mt-4 w-full max-w-md h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                          animate={{ width: `${agent.progress}%` }}
                          transition={{ type: 'spring', bounce: 0 }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {agent.status === 'Waiting' || agent.status === 'Paused' ? (
                        <button className="px-5 py-2 bg-cyan-500 text-black text-xs font-black rounded-lg hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                          REVIEW ESCALATION
                        </button>
                      ) : (
                        <button className="p-2.5 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors">
                          <Pause className="w-4 h-4 fill-current" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <SkillBuilder />
          </motion.div>
        )}

        {activeView === 'automations' && (
          <motion.div
            key="automations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AutomationSimulator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavTab({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
        active 
          ? "bg-slate-800 text-cyan-400 shadow-xl border border-slate-700" 
          : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Running': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Waiting': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Paused': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded border text-[10px] font-bold", styles[status])}>
      {status.toUpperCase()}
    </span>
  );
}
