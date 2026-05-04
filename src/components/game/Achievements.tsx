'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Medal, Flame, Trophy, Star, Rocket, Crown, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/context/GameContext';
import { ACHIEVEMENTS, type Achievement } from '@/data/achievements';

const iconMap = {
  medal: Medal,
  flame: Flame,
  trophy: Trophy,
  star: Star,
  rocket: Rocket,
  crown: Crown,
  sparkles: Sparkles,
  target: Target,
} as const;

const tierColors: Record<Achievement['tier'], { ring: string; text: string; glow: string }> = {
  bronze: { ring: 'border-amber-700/40', text: 'text-amber-500', glow: 'shadow-[0_0_20px_rgba(180,83,9,0.15)]' },
  silver: { ring: 'border-slate-400/40', text: 'text-slate-300', glow: 'shadow-[0_0_20px_rgba(148,163,184,0.15)]' },
  gold: { ring: 'border-yellow-400/50', text: 'text-yellow-300', glow: 'shadow-[0_0_25px_rgba(250,204,21,0.2)]' },
  legendary: { ring: 'border-fuchsia-400/60', text: 'text-fuchsia-300', glow: 'shadow-[0_0_30px_rgba(232,121,249,0.25)]' },
};

export function Achievements({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useGame();

  const unlockedCount = ACHIEVEMENTS.filter((a) => state.badges.includes(a.id)).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" /> Achievements
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {unlockedCount} of {ACHIEVEMENTS.length} unlocked · best streak {state.bestStreak}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = state.badges.includes(a.id);
                const Icon = iconMap[a.icon];
                const colors = tierColors[a.tier];
                return (
                  <div
                    key={a.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all flex gap-3 items-start',
                      unlocked
                        ? `bg-slate-900/80 ${colors.ring} ${colors.glow}`
                        : 'bg-slate-900/30 border-slate-800 opacity-70'
                    )}
                  >
                    <div
                      className={cn(
                        'p-2.5 rounded-lg shrink-0 border',
                        unlocked ? `${colors.ring} bg-slate-950` : 'border-slate-800 bg-slate-950/50'
                      )}
                    >
                      {unlocked ? (
                        <Icon className={cn('w-5 h-5', colors.text)} />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={cn('font-bold text-sm', unlocked ? 'text-white' : 'text-slate-400')}>
                          {a.title}
                        </h3>
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded',
                            unlocked ? `${colors.text} bg-slate-800` : 'text-slate-600 bg-slate-900'
                          )}
                        >
                          {a.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {unlocked ? a.description : a.hint}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
