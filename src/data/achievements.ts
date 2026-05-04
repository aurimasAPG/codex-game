import type { GameState } from '@/context/GameContext';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  hint: string;
  icon: 'medal' | 'flame' | 'trophy' | 'star' | 'rocket' | 'crown' | 'sparkles' | 'target';
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
  isUnlocked: (state: GameState) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Completed your first mission.',
    hint: 'Finish any module to unlock.',
    icon: 'medal',
    tier: 'bronze',
    isUnlocked: (s) => s.completedModules.length >= 1,
  },
  {
    id: 'skill-architect',
    title: 'Skill Architect',
    description: 'Saved a reusable skill into your library.',
    hint: 'Save any skill in the Skill Builder.',
    icon: 'sparkles',
    tier: 'bronze',
    isUnlocked: (s) => s.badges.includes('Skill Architect'),
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Scored a perfect 100 on a mission.',
    hint: 'Pick the right answer on the first try.',
    icon: 'target',
    tier: 'silver',
    isUnlocked: (s) => Object.values(s.scores).some((v) => v >= 100),
  },
  {
    id: 'combo-3',
    title: 'On Fire',
    description: 'Reached a 3x answer streak.',
    hint: 'Get 3 missions correct in a row.',
    icon: 'flame',
    tier: 'silver',
    isUnlocked: (s) => s.bestStreak >= 3,
  },
  {
    id: 'combo-5',
    title: 'Heat Wave',
    description: 'Reached a 5x answer streak.',
    hint: 'Get 5 missions correct in a row.',
    icon: 'flame',
    tier: 'gold',
    isUnlocked: (s) => s.bestStreak >= 5,
  },
  {
    id: 'halfway',
    title: 'Halfway Hero',
    description: 'Completed 5 modules of the academy.',
    hint: 'Finish 5 modules.',
    icon: 'rocket',
    tier: 'silver',
    isUnlocked: (s) => s.completedModules.length >= 5,
  },
  {
    id: 'xp-1k',
    title: 'Four Figures',
    description: 'Earned 1,000 XP.',
    hint: 'Stack up XP across missions and skills.',
    icon: 'star',
    tier: 'silver',
    isUnlocked: (s) => s.xp >= 1000,
  },
  {
    id: 'xp-5k',
    title: 'High Roller',
    description: 'Earned 5,000 XP.',
    hint: 'Keep grinding XP.',
    icon: 'star',
    tier: 'gold',
    isUnlocked: (s) => s.xp >= 5000,
  },
  {
    id: 'combo-10',
    title: 'Legendary Streak',
    description: 'Reached a 10x answer streak.',
    hint: 'Get 10 missions correct in a row.',
    icon: 'crown',
    tier: 'legendary',
    isUnlocked: (s) => s.bestStreak >= 10,
  },
  {
    id: 'graduate',
    title: 'Academy Graduate',
    description: 'Completed every module of the academy.',
    hint: 'Complete all 10 modules.',
    icon: 'trophy',
    tier: 'legendary',
    isUnlocked: (s) => s.completedModules.length >= 10,
  },
];
