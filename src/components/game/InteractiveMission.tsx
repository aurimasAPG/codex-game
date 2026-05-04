'use client';

import { useGame } from '@/context/GameContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const missions = [
  {
    id: 'intro_m1',
    moduleId: 'intro',
    title: "The Single Thread Trap",
    scenario: "You have 14 ad variants across 3 campaigns. Your client wants them by noon.",
    options: [
      { id: 'a', text: "One long chat thread", correct: false, feedback: "Incorrect. One thread leads to context bleed and manual orchestration debt.", score: 0 },
      { id: 'b', text: "Three parallel threads + brand skills", correct: true, feedback: "Correct! Parallel threads allow you to run plural operations without contamination.", score: 100 },
      { id: 'c', text: "Wait for client approval on each line", correct: false, feedback: "Too slow. Agentic workflows require batching review at the end.", score: 20 }
    ]
  },
  {
    id: 'skills_m1',
    moduleId: 'skills',
    title: "Brand Voice Drift",
    scenario: "An agent starts using professional corporate speak for a playful skincare brand. How do you fix this permanently?",
    options: [
      { id: 'a', text: "Tell the agent: 'Be more playful'", correct: false, feedback: "Ephemeral. Prompts are not persistent. Use a Skill.", score: 10 },
      { id: 'b', text: "Create a 'Brand Voice' Skill with explicit do-not-use list", correct: true, feedback: "Exactly. Skills are reusable, persistent playbooks.", score: 100 },
      { id: 'c', text: "Edit every output manually", correct: false, feedback: "You are the bottleneck. Shift to orchestration.", score: 0 }
    ]
  }
];

export function InteractiveMission({ moduleId, onComplete }: { moduleId: string, onComplete: (score: number) => void }) {
  const mission = missions.find(m => m.moduleId === moduleId);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!mission) return <div className="text-slate-500">Mission content coming soon...</div>;

  const currentOption = mission.options.find(o => o.id === selected);

  return (
    <div className="max-w-xl w-full mx-auto text-left">
      <h2 className="text-xl font-bold text-white mb-2">{mission.title}</h2>
      <p className="text-slate-400 mb-6">{mission.scenario}</p>

      <div className="space-y-3 mb-8">
        {mission.options.map((option) => (
          <button
            key={option.id}
            disabled={showFeedback}
            onClick={() => setSelected(option.id)}
            className={cn(
              "w-full p-4 rounded-xl border text-left transition-all",
              selected === option.id 
                ? (showFeedback ? (option.correct ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "border-cyan-500 bg-cyan-500/10")
                : "border-slate-800 bg-slate-900/50 hover:bg-slate-800"
            )}
          >
            {option.text}
          </button>
        ))}
      </div>

      {!showFeedback ? (
        <button
          disabled={!selected}
          onClick={() => setShowFeedback(true)}
          className="w-full py-3 bg-cyan-500 text-black font-bold rounded-xl disabled:opacity-50"
        >
          SUBMIT DECISION
        </button>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className={cn("p-4 rounded-xl border", currentOption?.correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5")}>
            <p className={cn("font-bold mb-1", currentOption?.correct ? "text-green-400" : "text-red-400")}>
              {currentOption?.correct ? "SUCCESS" : "FAIL"}
            </p>
            <p className="text-sm text-slate-300">{currentOption?.feedback}</p>
          </div>
          <button
            onClick={() => onComplete(currentOption?.score || 0)}
            className="w-full py-3 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-800"
          >
            CONTINUE
          </button>
        </motion.div>
      )}
    </div>
  );
}
