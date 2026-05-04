'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type GameState = {
  xp: number;
  level: number;
  badges: string[];
  completedModules: string[];
  currentModule: string | null;
  agencyStatus: 'chat_based' | 'agentic';
  scores: Record<string, number>;
};

type GameContextType = {
  state: GameState;
  addXp: (amount: number) => void;
  addBadge: (badge: string) => void;
  completeModule: (moduleId: string, score: number) => void;
  setAgencyStatus: (status: 'chat_based' | 'agentic') => void;
  setCurrentModule: (moduleId: string | null) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    xp: 0,
    level: 1,
    badges: [],
    completedModules: [],
    currentModule: null,
    agencyStatus: 'chat_based',
    scores: {},
  });

  const addXp = (amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const addBadge = (badge: string) => {
    setState(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge]
    }));
  };

  const completeModule = (moduleId: string, score: number) => {
    setState(prev => ({
      ...prev,
      completedModules: [...new Set([...prev.completedModules, moduleId])],
      scores: { ...prev.scores, [moduleId]: Math.max(prev.scores[moduleId] || 0, score) }
    }));
    addXp(500);
  };

  const setAgencyStatus = (status: 'chat_based' | 'agentic') => {
    setState(prev => ({ ...prev, agencyStatus: status }));
  };

  const setCurrentModule = (moduleId: string | null) => {
    setState(prev => ({ ...prev, currentModule: moduleId }));
  };

  return (
    <GameContext.Provider value={{ state, addXp, addBadge, completeModule, setAgencyStatus, setCurrentModule }}>
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
