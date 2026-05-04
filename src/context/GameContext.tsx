'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ACHIEVEMENTS } from '@/data/achievements';

export type GameState = {
  xp: number;
  level: number;
  badges: string[];
  completedModules: string[];
  currentModule: string | null;
  agencyStatus: 'chat_based' | 'agentic';
  scores: Record<string, number>;
  streak: number;
  bestStreak: number;
};

export type MissionResult = {
  baseXp: number;
  multiplier: number;
  totalXp: number;
  bonusXp: number;
  newStreak: number;
  isCombo: boolean;
};

type GameContextType = {
  state: GameState;
  hydrated: boolean;
  addXp: (amount: number) => void;
  addBadge: (badge: string) => void;
  completeModule: (moduleId: string, score: number) => void;
  submitMissionAnswer: (moduleId: string, score: number) => MissionResult;
  resetProgress: () => void;
  setAgencyStatus: (status: 'chat_based' | 'agentic') => void;
  setCurrentModule: (moduleId: string | null) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'codex-game-state-v2';

const initialState: GameState = {
  xp: 0,
  level: 1,
  badges: [],
  completedModules: [],
  currentModule: null,
  agencyStatus: 'chat_based',
  scores: {},
  streak: 0,
  bestStreak: 0,
};

export function streakMultiplier(streak: number): number {
  if (streak >= 10) return 3;
  if (streak >= 8) return 2.5;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

function levelFromXp(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

function mergeState(saved: unknown): GameState {
  if (!saved || typeof saved !== 'object') return initialState;
  const s = saved as Partial<GameState>;
  return {
    xp: typeof s.xp === 'number' ? s.xp : 0,
    level: typeof s.level === 'number' ? s.level : 1,
    badges: Array.isArray(s.badges) ? s.badges : [],
    completedModules: Array.isArray(s.completedModules) ? s.completedModules : [],
    currentModule: typeof s.currentModule === 'string' ? s.currentModule : null,
    agencyStatus: s.agencyStatus === 'agentic' ? 'agentic' : 'chat_based',
    scores: s.scores && typeof s.scores === 'object' ? (s.scores as Record<string, number>) : {},
    streak: typeof s.streak === 'number' ? s.streak : 0,
    bestStreak: typeof s.bestStreak === 'number' ? s.bestStreak : 0,
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(mergeState(JSON.parse(raw)));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or disabled — ignore
    }
  }, [state, hydrated]);

  // Auto-award achievements whenever state changes
  useEffect(() => {
    if (!hydrated) return;
    const earned = ACHIEVEMENTS.filter((a) => a.isUnlocked(state)).map((a) => a.id);
    const missing = earned.filter((id) => !state.badges.includes(id));
    if (missing.length > 0) {
      setState((prev) => ({
        ...prev,
        badges: [...prev.badges, ...missing.filter((id) => !prev.badges.includes(id))],
      }));
    }
  }, [state, hydrated]);

  const addXp = useCallback((amount: number) => {
    setState((prev) => {
      const newXp = prev.xp + amount;
      return { ...prev, xp: newXp, level: levelFromXp(newXp) };
    });
  }, []);

  const addBadge = useCallback((badge: string) => {
    setState((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge],
    }));
  }, []);

  const completeModule = useCallback((moduleId: string, score: number) => {
    setState((prev) => {
      const newXp = prev.xp + 500;
      return {
        ...prev,
        xp: newXp,
        level: levelFromXp(newXp),
        completedModules: [...new Set([...prev.completedModules, moduleId])],
        scores: { ...prev.scores, [moduleId]: Math.max(prev.scores[moduleId] || 0, score) },
      };
    });
  }, []);

  const submitMissionAnswer = useCallback(
    (moduleId: string, score: number): MissionResult => {
      const isCorrect = score >= 100;
      let result: MissionResult = {
        baseXp: score,
        multiplier: 1,
        totalXp: score,
        bonusXp: 0,
        newStreak: 0,
        isCombo: false,
      };
      setState((prev) => {
        const newStreak = isCorrect ? prev.streak + 1 : 0;
        const multiplier = isCorrect ? streakMultiplier(newStreak) : 1;
        const totalXp = Math.round(score * multiplier);
        const bonusXp = totalXp - score;
        result = {
          baseXp: score,
          multiplier,
          totalXp,
          bonusXp,
          newStreak,
          isCombo: multiplier > 1,
        };
        const newXp = prev.xp + totalXp + 500;
        return {
          ...prev,
          xp: newXp,
          level: levelFromXp(newXp),
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          completedModules: [...new Set([...prev.completedModules, moduleId])],
          scores: { ...prev.scores, [moduleId]: Math.max(prev.scores[moduleId] || 0, score) },
        };
      });
      return result;
    },
    []
  );

  const resetProgress = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setAgencyStatus = useCallback((status: 'chat_based' | 'agentic') => {
    setState((prev) => ({ ...prev, agencyStatus: status }));
  }, []);

  const setCurrentModule = useCallback((moduleId: string | null) => {
    setState((prev) => ({ ...prev, currentModule: moduleId }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        hydrated,
        addXp,
        addBadge,
        completeModule,
        submitMissionAnswer,
        resetProgress,
        setAgencyStatus,
        setCurrentModule,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
