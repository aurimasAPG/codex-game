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
  },
  {
    id: 'threads_m1',
    moduleId: 'threads',
    title: "The Multitasking Maze",
    scenario: "You're juggling a Nordic skincare brand, a B2B SaaS launch, and a fintech promo. How do you prevent Client A's data from bleeding into Client B's ads?",
    options: [
      { id: 'a', text: "Use one thread and be very careful", correct: false, feedback: "Human error is inevitable. Context bleed will happen.", score: 0 },
      { id: 'b', text: "Isolated Worktrees per client", correct: true, feedback: "Correct. Worktrees provide structural isolation, making cross-contamination impossible.", score: 100 },
      { id: 'c', text: "Clear the chat history every 10 minutes", correct: false, feedback: "Inefficient and you lose all project persistence.", score: 20 }
    ]
  },
  {
    id: 'computer_use_m1',
    moduleId: 'computer-use',
    title: "Legacy Dashboard Extraction",
    scenario: "You need data from a legacy portal with no API or export button. What's the agentic solution?",
    options: [
      { id: 'a', text: "Manually re-type the data into a Sheet", correct: false, feedback: "This is the 'operator-as-glue' trap we're trying to avoid.", score: 0 },
      { id: 'b', text: "Use Computer Use to screenshot and OCR the GUI", correct: true, feedback: "Exactly. Agents can perceive and drive the GUI just like an intern.", score: 100 },
      { id: 'c', text: "Ask the client to build an API", correct: false, feedback: "Unrealistic for legacy systems. Use the tools you have.", score: 10 }
    ]
  },
  {
    id: 'intel_m1',
    moduleId: 'intelligence',
    title: "Competitive Intelligence",
    scenario: "A competitor just dropped 5 new ad variants on the Meta Ad Library. How do you handle the scan?",
    options: [
      { id: 'a', text: "Manual daily check of Ad Library", correct: false, feedback: "You will eventually forget or miss a day. Not scalable.", score: 10 },
      { id: 'b', text: "In-app browser automation with delta summary", correct: true, feedback: "Correct. Use the browser plugin to find changes and summarize the strategy shift.", score: 100 },
      { id: 'c', text: "Wait for the client to notice", correct: false, feedback: "The 'reactive' model is the opposite of agentic leverage.", score: 0 }
    ]
  },
  {
    id: 'memory_m1',
    moduleId: 'memory',
    title: "The Forgetful Agent",
    scenario: "Every Monday, you have to remind the AI that 'Revenue' is more important than 'Clicks' for your fintech client. How do you fix this?",
    options: [
      { id: 'a', text: "Put it in every prompt", correct: false, feedback: "Prompt debt. It clutters your threads and wastes tokens.", score: 20 },
      { id: 'b', text: "Add it to the Client Memory layer", correct: true, feedback: "Yes. Memory is the cross-session truth that stays persistent.", score: 100 },
      { id: 'c', text: "Hope the model learns eventually", correct: false, feedback: "Models don't 'learn' purely from conversation history without persistent memory.", score: 0 }
    ]
  },
  {
    id: 'gov_m1',
    moduleId: 'governance',
    title: "The $50k Mistake",
    scenario: "You want an agent to optimize ad spend. What approval gate is safest?",
    options: [
      { id: 'a', text: "Full Autopilot (spend at will)", correct: false, feedback: "Dangerous. Never give an agent the 'bank password' without a gate.", score: 0 },
      { id: 'b', text: "Inform & Prepare only", correct: true, feedback: "Correct. Agents suggest; humans publish, spend, and send.", score: 100 },
      { id: 'c', text: "Approved ranges (up to $500)", correct: false, feedback: "Better, but still risky for core brand actions without review.", score: 50 }
    ]
  },
  {
    id: 'plan_m1',
    moduleId: 'plan',
    title: "The 30-Day Transition",
    scenario: "What's the first thing you should do when transitioning your agency to an agentic model?",
    options: [
      { id: 'a', text: "Replace all staff with agents", correct: false, feedback: "Disastrous. You need human taste more than ever.", score: 0 },
      { id: 'b', text: "Identify one repetitive 'Work in front of Work' task", correct: true, feedback: "Correct. Start small, build trust with one reliable automation.", score: 100 },
      { id: 'c', text: "Spend $10k on training courses", correct: false, feedback: "Action beats theory. Build a skill instead.", score: 20 }
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
