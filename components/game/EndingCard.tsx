'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game/store';
import { ENDINGS } from '@/data/endings';
import { CHARACTERS } from '@/data/characters';

const ARCHETYPE_MAP: Record<string, { label: string; description: string; character: string }> = {
  whole_annex_high: {
    label: 'The Responsible Imperialist',
    description: 'You reasoned like Greene at his most honest — you named the burden before you accepted it, and you tried to carry it with some dignity.',
    character: 'Greene',
  },
  whole_annex_low: {
    label: 'The Strategic Realist',
    description: 'You reasoned like a soldier. Order first, legitimacy later. History will ask whether later ever came.',
    character: 'Greene',
  },
  protectorate_high: {
    label: 'The Legal Architect',
    description: 'You reasoned like Hay — you found the arrangement that was elegant on paper and hoped the paper would hold.',
    character: 'Hay',
  },
  protectorate_low: {
    label: 'The Reluctant Governor',
    description: 'You chose the protectorate because annexation felt wrong, not because you had a plan for what protection meant in practice.',
    character: 'Hay',
  },
  luzon_high: {
    label: 'The Cautious Strategist',
    description: 'You reasoned like McKinley in his first instinct — bounded, defensible, aware of costs. Whether it would have held is the open question.',
    character: 'cortelyou',
  },
  luzon_low: {
    label: 'The Hopeful Compromiser',
    description: 'You chose moderation. The question Greene would ask: moderate toward what end?',
    character: 'cortelyou',
  },
  conditional_independence_high: {
    label: 'The Principled Advocate',
    description: 'You reasoned like Agoncillo — you honored Filipino political claims as claims, not sentiment. Whether the machinery could deliver is another matter.',
    character: 'agoncillo',
  },
  conditional_independence_low: {
    label: 'The Idealist Under Pressure',
    description: 'You chose principle. The world did not cooperate with your timeline.',
    character: 'agoncillo',
  },
  delay_high: {
    label: 'The Patient Observer',
    description: 'You waited for the nation to speak more plainly before committing. McKinley would understand. Hay would be impatient.',
    character: 'mckinley',
  },
  delay_low: {
    label: 'The Reluctant Decider',
    description: 'You delayed because every option seemed worse than the next one. That instinct is not wrong. It is, however, not a policy.',
    character: 'mckinley',
  },
};

export function EndingCard() {
  const { ending, memo, stats, sessionLog, reset } = useGameStore();
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [showArchetype, setShowArchetype] = useState(false);

  if (!ending || !memo.thesis) return null;

  const endingData = ENDINGS.find(e => e.id === ending);
  if (!endingData) return null;

  const tiebreakerValue = stats[endingData.tiebreakerStat];
  const variant = tiebreakerValue >= 2 ? endingData.tiebreakerHigh : endingData.tiebreakerLow;

  const archetypeKey = `${memo.thesis}_${tiebreakerValue >= 2 ? 'high' : 'low'}`;
  const archetype = ARCHETYPE_MAP[archetypeKey];
  const archetypeChar = archetype ? CHARACTERS.find(c => c.id === archetype.character.toLowerCase()) : null;

  const totalChoices = sessionLog.filter(l => l.choiceId).length;

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="min-h-full flex flex-col items-center justify-start px-4 py-8"
      >
        {/* Ending title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mb-8 max-w-lg"
        >
          <p className="text-amber-600/50 text-[10px] tracking-[0.5em] uppercase font-sans mb-3">
            Ending {ending}
          </p>
          <h1 className="text-3xl text-amber-300 font-serif mb-2">{endingData.title}</h1>
          <p className="text-amber-200/50 italic text-lg">{endingData.subtitle}</p>
        </motion.div>

        {/* White House reaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full max-w-lg bg-black/40 border border-amber-900/30 rounded-lg p-5 mb-4"
        >
          <p className="text-amber-600/50 text-[10px] tracking-widest uppercase font-sans mb-3">
            White House Reaction
          </p>
          <p className="text-amber-100/80 text-sm leading-relaxed italic">{variant.reaction}</p>
        </motion.div>

        {/* Dialogue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="w-full max-w-lg space-y-3 mb-4"
        >
          <div className="bg-zinc-900/50 border border-zinc-700/30 rounded p-4">
            <p className="text-zinc-400/60 text-xs font-sans mb-1">McKinley</p>
            <p className="text-zinc-100 italic">"{variant.mckinleyLine}"</p>
          </div>
          <div className="bg-blue-950/30 border border-blue-900/20 rounded p-4">
            <p className="text-blue-400/60 text-xs font-sans mb-1">Hay</p>
            <p className="text-blue-100 italic">"{variant.hayLine}"</p>
          </div>
          <div className="bg-black/30 border border-amber-900/20 rounded p-4">
            <p className="text-amber-600/40 text-xs font-sans mb-1">Narration</p>
            <p className="text-amber-100/70 text-sm leading-relaxed">{variant.narration}</p>
          </div>
        </motion.div>

        {/* Historical epilogue toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="w-full max-w-lg"
        >
          <button
            onClick={() => setShowEpilogue(!showEpilogue)}
            className="w-full py-2 border border-amber-800/30 rounded text-amber-500/70 text-xs tracking-widest uppercase font-sans hover:border-amber-700/50 hover:text-amber-400 transition-all mb-3"
          >
            {showEpilogue ? 'Hide' : 'Read'} Historical Epilogue
          </button>

          <AnimatePresence>
            {showEpilogue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-stone-900/60 border border-stone-700/30 rounded p-5 mb-4"
              >
                <p className="text-stone-400/60 text-[10px] tracking-widest uppercase font-sans mb-3">
                  What Actually Happened
                </p>
                <p className="text-stone-200/80 text-sm leading-relaxed">{variant.epilogue}</p>
                <p className="text-stone-500/40 text-xs font-sans mt-3 italic">{endingData.historicalGrounding}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Archetype reveal */}
          <button
            onClick={() => setShowArchetype(!showArchetype)}
            className="w-full py-2 border border-amber-700/40 rounded text-amber-400 text-xs tracking-widest uppercase font-sans hover:border-amber-600/60 transition-all mb-3"
          >
            {showArchetype ? 'Hide' : 'Reveal'} Your Reasoning Pattern
          </button>

          <AnimatePresence>
            {showArchetype && archetype && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-amber-950/40 border-2 border-amber-700/40 rounded-lg p-5 mb-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  {archetypeChar && (
                    <span className="text-3xl">{archetypeChar.portrait}</span>
                  )}
                  <div>
                    <p className="text-amber-300 font-semibold">{archetype.label}</p>
                    {archetypeChar && (
                      <p className="text-amber-600/60 text-xs font-sans">
                        Reasoned most like: {archetypeChar.name}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-amber-100/70 text-sm leading-relaxed italic">{archetype.description}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Session stats */}
          <div className="bg-black/30 border border-amber-900/20 rounded p-4 mb-6">
            <p className="text-amber-600/50 text-[10px] tracking-widest uppercase font-sans mb-3">Session Summary</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-amber-400/50">Choices made</span>
                <span className="text-amber-300">{totalChoices}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400/50">Presidential Conf.</span>
                <span className="text-amber-300">{stats.presidentialConfidence > 0 ? '+' : ''}{stats.presidentialConfidence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/50">Filipino Support</span>
                <span className="text-emerald-300">{stats.filipinoEliteSupport > 0 ? '+' : ''}{stats.filipinoEliteSupport}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400/50">War Risk</span>
                <span className="text-red-300">{stats.orderWarRisk > 0 ? '+' : ''}{stats.orderWarRisk}</span>
              </div>
            </div>
          </div>

          {/* Play again */}
          <button
            onClick={reset}
            className="w-full py-3 bg-amber-900/30 border border-amber-700/40 rounded text-amber-300 font-semibold tracking-widest uppercase text-sm hover:bg-amber-900/50 transition-all"
          >
            Play Again — Different Route
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
