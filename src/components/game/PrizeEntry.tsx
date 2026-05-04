'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Send, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/context/GameContext';

const WEBHOOK_URL = 'https://hook.eu2.make.com/l9hbtpka5youaw87a8vp49dafxb2ufwd';

export function PrizeEntry() {
  const { state } = useGame();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          xp: state.xp,
          level: state.level,
          badges: state.badges.join(', '),
          source: 'Agentic Marketing Academy'
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Entry Received!</h3>
            <p className="text-slate-400 text-sm">
              Your agentic profile and prize entry have been synchronized. Good luck, Operator.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Trophy className="w-24 h-24 text-cyan-400" />
            </div>

            <div className="flex items-center gap-2 mb-6 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Grand Prize Entry</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">YOU MADE IT.</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Submit your operator details for a chance to win the Agentic Marketing prize pack.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Work Email</label>
                <input
                  required
                  type="email"
                  placeholder="name@agency.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <button
                disabled={status === 'loading'}
                className={cn(
                  "w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all",
                  "bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(6,182,212,0.3)]",
                  status === 'loading' && "opacity-50 cursor-not-allowed"
                )}
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    SUBMIT ENTRY <Send className="w-4 h-4" />
                  </>
                )}
              </button>
              
              {status === 'error' && (
                <p className="text-red-400 text-[10px] text-center font-bold uppercase tracking-widest animate-pulse">
                  System error. Please try again.
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
