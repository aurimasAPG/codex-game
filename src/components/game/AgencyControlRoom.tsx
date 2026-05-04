'use client';

import { useGame } from '@/context/GameContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Activity, CheckCircle2, Clock, Pause, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const agents = [
  { id: 'media', name: 'Paid Media Agent', status: 'Running', task: 'Optimizing LinkedIn budget split', progress: 65 },
  { id: 'seo', name: 'SEO Agent', status: 'Waiting', task: 'GSC data pulled. Needs anomaly interpretation.', progress: 100 },
  { id: 'cro', name: 'CRO Agent', status: 'Running', task: 'Analyzing heatmaps for skincare landing page', progress: 22 },
  { id: 'intel', name: 'Intelligence Agent', status: 'Paused', task: 'Competitor pricing change detected. Authorize deeper scan?', progress: 45 },
];

export function AgencyControlRoom() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard label="Active Agents" value="3" icon={<Zap className="w-4 h-4 text-cyan-400" />} />
        <StatusCard label="Worktrees" value="12" icon={<Layers className="w-4 h-4 text-purple-400" />} />
        <StatusCard label="Approvals Waiting" value="2" icon={<Activity className="w-4 h-4 text-yellow-400" />} />
        <StatusCard label="Savings/Mo" value="$4.2k" icon={<Clock className="w-4 h-4 text-green-400" />} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">Agentic Fleet Status</h2>
          <div className="px-2 py-1 bg-cyan-500/10 rounded text-[10px] font-bold text-cyan-400">SYNCED</div>
        </div>
        <div className="divide-y divide-slate-800/50">
          {agents.map((agent) => (
            <div key={agent.id} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-slate-200">{agent.name}</h3>
                  <StatusBadge status={agent.status} />
                </div>
                <p className="text-xs text-slate-500 font-mono">{agent.task}</p>
                <div className="mt-3 w-full max-w-sm h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500/50 transition-all duration-1000" style={{ width: `${agent.progress}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                {agent.status === 'Waiting' || agent.status === 'Paused' ? (
                  <button className="px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded hover:bg-cyan-400">REVIEW</button>
                ) : (
                  <button className="p-2 border border-slate-700 rounded hover:bg-slate-700 text-slate-400"><Pause className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
