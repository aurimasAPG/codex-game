'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Play, 
  Pause, 
  ChevronRight, 
  Plus, 
  Activity, 
  Settings, 
  History,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/context/GameContext';

type Automation = {
  id: string;
  name: string;
  trigger: string;
  lastRun: string;
  status: 'active' | 'idle' | 'running' | 'error';
  impact: string;
};

const DEFAULT_AUTOMATIONS: Automation[] = [
  { id: '1', name: 'Dawn Account-Health Digest', trigger: 'Daily, 07:00', lastRun: 'Today, 07:00', status: 'active', impact: 'Saves 45m/day' },
  { id: '2', name: 'Competitor Offer Scanner', trigger: 'Every 6 hrs', lastRun: '2 hrs ago', status: 'running', impact: 'Real-time Intel' },
  { id: '3', name: 'Search-Term Waste Mining', trigger: 'Weekly, Mon', lastRun: 'Mon, 09:00', status: 'idle', impact: 'ROAS Protection' },
  { id: '4', name: 'Anomaly Thread Trigger', trigger: 'Event: CPA > 25%', lastRun: 'Yesterday', status: 'error', impact: 'Risk Mitigation' },
];

export function AutomationSimulator({ onComplete }: { onComplete?: () => void }) {
  const { addXp } = useGame();
  const [automations, setAutomations] = useState<Automation[]>(DEFAULT_AUTOMATIONS);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Core orchestration engines online...', '[IDLE] Waiting for scheduled triggers...']);
  const [activeTab, setActiveTab] = useState<'monitor' | 'builder'>('monitor');

  useEffect(() => {
    const interval = setInterval(() => {
      const running = automations.find(a => a.status === 'running');
      if (running) {
        setLogs(prev => [`[RUNNING] ${running.name}: Checking data sources...`, ...prev.slice(0, 5)]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [automations]);

  const toggleStatus = (id: string) => {
    setAutomations(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'active' ? 'idle' : 'active';
        setLogs(l => [`[CONFIG] ${a.name} status changed to ${nextStatus.toUpperCase()}`, ...l]);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      {/* Header Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem label="Running Now" value={automations.filter(a => a.status === 'running').length.toString()} color="text-cyan-400" />
        <StatItem label="Weekly Runs" value="124" color="text-purple-400" />
        <StatItem label="Critical Alerts" value="1" color="text-red-400" />
        <StatItem label="Fleet Efficiency" value="94%" color="text-green-400" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
        {/* Left: Nav/Sidebar */}
        <div className="w-full md:w-64 border-r border-slate-800 bg-slate-950/20 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('monitor')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'monitor' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
            )}
          >
            <Activity className="w-4 h-4" /> MONITOR
          </button>
          <button 
            onClick={() => setActiveTab('builder')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'builder' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
            )}
          >
            <Zap className="w-4 h-4" /> BUILD AUTOMATION
          </button>
          <div className="pt-8 px-4">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Live Logs</h4>
            <div className="space-y-3">
              {logs.map((log, i) => (
                <p key={i} className="text-[10px] font-mono text-slate-500 leading-tight">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Main Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'monitor' ? (
              <motion.div 
                key="monitor"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Active Automations
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-[10px] rounded animate-pulse">LIVE</span>
                  </h3>
                  <button className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                    <History className="w-3 h-3" /> HISTORY
                  </button>
                </div>

                <div className="space-y-3">
                  {automations.map((auto) => (
                    <div key={auto.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2.5 rounded-lg border",
                          auto.status === 'running' ? "bg-cyan-500/10 border-cyan-500/20 animate-pulse" :
                          auto.status === 'error' ? "bg-red-500/10 border-red-500/20" :
                          "bg-slate-800 border-slate-700"
                        )}>
                          <Cpu className={cn(
                            "w-5 h-5",
                            auto.status === 'running' ? "text-cyan-400" :
                            auto.status === 'error' ? "text-red-400" : "text-slate-400"
                          )} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-200">{auto.name}</h4>
                            <span className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded font-black",
                              auto.status === 'active' ? "bg-green-500/10 text-green-500" :
                              auto.status === 'running' ? "bg-cyan-500/10 text-cyan-500" :
                              auto.status === 'idle' ? "bg-slate-800 text-slate-500" :
                              "bg-red-500/10 text-red-500"
                            )}>
                              {auto.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {auto.trigger}</span>
                            <span className="flex items-center gap-1 font-mono">{auto.impact}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 translate-x-2 group-hover:translate-x-0 transition-transform">
                        {auto.status === 'error' ? (
                          <button 
                            onClick={() => {
                              setAutomations(prev => prev.map(a => a.id === auto.id ? {...a, status: 'active'} : a));
                              addXp(50);
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleStatus(auto.id)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            {auto.status === 'active' || auto.status === 'running' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="builder"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto"
              >
                <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                  <Plus className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Build New Automation</h3>
                <p className="text-slate-400 text-sm mb-8">
                  Chain skills together to create always-on workflows that run while you sleep.
                </p>
                <button 
                  onClick={() => { setActiveTab('monitor'); addXp(100); }}
                  className="w-full py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95"
                >
                  START BUILDER (v1.4)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{label}</p>
      <p className={cn("text-2xl font-bold", color)}>{value}</p>
    </div>
  );
}
