'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Plus, 
  Play, 
  Trash2, 
  Save, 
  Code2, 
  AlignLeft, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/context/GameContext';

type Skill = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  examples: string;
  isCustom?: boolean;
};

const TEMPLATE_SKILLS: Skill[] = [
  {
    id: 'brand-voice',
    name: 'Brand Voice Anchor',
    description: 'Ensures all output matches the specific tone and vocabulary of a client.',
    instructions: 'Analyze the provided text. Identify key descriptive adjectives, sentence structure patterns, and forbidden words. Apply these to all future generations.',
    examples: 'Input: "Our fintech is bold but not reckless." -> Output: High-energy verbs, short sentences, technical accuracy.'
  },
  {
    id: 'pmax-auditor',
    name: 'PMax Health Auditor',
    description: 'Specific logic for auditing Performance Max asset groups and search signals.',
    instructions: 'Check asset strength ratings. Flag any search terms with >$50 spend and 0 conversions. Compare current CPA vs 7-day average.',
    examples: 'Flag: "Sneaker brands" search term has $120 spend, 0 conversion. Action: Add to negatives.'
  },
  {
    id: 'competitor-monitor',
    name: 'Competitor Offer Scanner',
    description: 'Extracts hero offers and pricing tiers from competitor landing pages.',
    instructions: 'Visit URL. Identify the H1, the primary CTA, and the pricing table. Summarize the value proposition in 3 bullet points.',
    examples: 'Competitor A: $29/mo, "Scale faster", 14-day trial. Competitor B: $49/mo, "For enterprise", 30-day trial.'
  }
];

export function SkillBuilder() {
  const { addXp, addBadge } = useGame();
  const [skills, setSkills] = useState<Skill[]>(TEMPLATE_SKILLS);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!activeSkill) return;
    
    setSkills(prev => {
      const exists = prev.find(s => s.id === activeSkill.id);
      if (exists) return prev.map(s => s.id === activeSkill.id ? activeSkill : s);
      return [...prev, activeSkill];
    });
    
    setIsEditing(false);
    setShowSuccess(true);
    addXp(150);
    addBadge('Skill Architect');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const createNew = () => {
    const newSkill: Skill = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Custom Skill',
      description: 'Describe what this skill does...',
      instructions: 'Enter step-by-step instructions for the agent...',
      examples: 'Provide examples of good inputs and outputs...',
      isCustom: true
    };
    setActiveSkill(newSkill);
    setIsEditing(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
      {/* Sidebar: Skill List */}
      <div className="md:col-span-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            Skill Library
          </h2>
          <button 
            onClick={createNew}
            className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors border border-cyan-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              layoutId={skill.id}
              onClick={() => { setActiveSkill(skill); setIsEditing(false); }}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all group",
                activeSkill?.id === skill.id 
                  ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex justify-between items-start">
                <h3 className={cn("font-bold text-sm mb-1", activeSkill?.id === skill.id ? "text-cyan-400" : "text-slate-200")}>
                  {skill.name}
                </h3>
                {skill.isCustom && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded italic">Custom</span>
                )}
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Panel: Editor/Viewer */}
      <div className="md:col-span-8">
        <AnimatePresence mode="wait">
          {activeSkill ? (
            <motion.div
              key={activeSkill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Code2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none mb-1">{isEditing ? 'Editing Skill' : activeSkill.name}</h3>
                    <p className="text-xs text-slate-500 font-mono tracking-tighter uppercase">ID: {activeSkill.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        CANCEL
                      </button>
                      <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg hover:bg-cyan-400 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                      >
                        <Save className="w-3.5 h-3.5" /> SAVE SKILL
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      EDIT CONFIG
                    </button>
                  )}
                </div>
              </div>

              {/* Editor Content */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2 block">Skill Name</label>
                      <input 
                        value={activeSkill.name}
                        onChange={(e) => setActiveSkill({...activeSkill, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2 block">Description</label>
                      <input 
                        value={activeSkill.description}
                        onChange={(e) => setActiveSkill({...activeSkill, description: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2 block flex justify-between">
                        Instructions (Logic)
                        <span className="text-cyan-500 flex items-center gap-1 font-normal normal-case"><Info className="w-3 h-3" /> Step-by-step logic</span>
                      </label>
                      <textarea 
                        rows={4}
                        value={activeSkill.instructions}
                        onChange={(e) => setActiveSkill({...activeSkill, instructions: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2 block">Examples (Few-Shot)</label>
                      <textarea 
                        rows={3}
                        value={activeSkill.examples}
                        onChange={(e) => setActiveSkill({...activeSkill, examples: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="relative">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-cyan-500/20 rounded-full" />
                      <h4 className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-3">
                        <AlignLeft className="w-4 h-4" /> REUSABLE PLAYBOOK
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        {activeSkill.instructions}
                      </p>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-3">
                        <Sparkles className="w-4 h-4" /> FEW-SHOT EXAMPLES
                      </h4>
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 italic text-slate-400 text-sm">
                        {activeSkill.examples}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50">
                      <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-4 rounded-xl border border-cyan-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-bold text-sm">Ready to deploy</p>
                            <p className="text-xs text-slate-500">This skill is synced to your Agentic Fleet.</p>
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform active:scale-95">
                            <Play className="w-3 h-3 fill-current" /> RUN TEST
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl h-full flex flex-col items-center justify-center text-center p-12">
              <div className="p-4 bg-slate-800 rounded-full mb-4">
                <Wrench className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-slate-400 font-bold mb-2">No Skill Selected</h3>
              <p className="text-slate-600 text-sm max-w-xs">Select a skill from the library or create a new one to start building your marketing operation.</p>
              <button 
                onClick={createNew}
                className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-700"
              >
                CREATE YOUR FIRST SKILL
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500 text-black font-bold rounded-full shadow-2xl flex items-center gap-3 z-50 capitalize"
          >
            <Sparkles className="w-5 h-5" /> Skill Synced to Agentic Fleet
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
