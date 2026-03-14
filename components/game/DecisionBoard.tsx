'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game/store';
import { MemoThesis } from '@/lib/game/types';
import { MEMO_THESIS_LABELS } from '@/data/endings';
import { getPhraseCard } from '@/data/phrase-cards';

interface Option {
  value: MemoThesis;
  label: string;
  description: string;
  forCards: string[];   // phrase card IDs that support this
  againstCards: string[]; // phrase card IDs that challenge this
  greeneVerdict: string;
  hayVerdict: string;
  agoncilloVerdict: string;
  riskLevel: 'low' | 'medium' | 'high';
  statPreview: { label: string; delta: number; color: string }[];
}

const OPTIONS: Option[] = [
  {
    value: 'whole_archipelago',
    label: 'Full Annexation',
    description: 'Assume the whole burden. Direct the commissioners to take the entire archipelago.',
    forCards: ['support_no_spain', 'support_republic_fragments', 'support_foreign_vacuum'],
    againstCards: ['support_respect_not_recognition', 'support_tact_averts_war'],
    greeneVerdict: '"The only honest course. Every other answer returns disguised as a crisis."',
    hayVerdict: '"It can be defended in Paris — but it must not sound like triumph."',
    agoncilloVerdict: '"This is Spain replaced by another name. We did not fight for this."',
    riskLevel: 'high',
    statPreview: [
      { label: 'Presidential Conf.', delta: 2, color: 'amber' },
      { label: 'Filipino Support', delta: -1, color: 'red' },
      { label: 'Public Justif.', delta: 1, color: 'indigo' },
      { label: 'War Risk', delta: 2, color: 'red' },
    ],
  },
  {
    value: 'protectorate',
    label: 'Protectorate',
    description: 'Filipino government under American protection. Responsibility without annexation.',
    forCards: ['support_respect_not_recognition', 'support_tact_averts_war', 'support_elite_opinion'],
    againstCards: ['support_protectorate_is_rule', 'support_foreign_vacuum'],
    greeneVerdict: '"A protectorate is annexation in slow dress. I do not object to the substance — only the dishonesty."',
    hayVerdict: '"Elegant on paper. Paris will accept it if we define the terms precisely."',
    agoncilloVerdict: '"Protection we could accept, if it is genuine. History suggests it rarely is."',
    riskLevel: 'medium',
    statPreview: [
      { label: 'Presidential Conf.', delta: 1, color: 'amber' },
      { label: 'Filipino Support', delta: 2, color: 'emerald' },
      { label: 'Public Justif.', delta: 1, color: 'indigo' },
      { label: 'War Risk', delta: 1, color: 'amber' },
    ],
  },
  {
    value: 'luzon_guarantees',
    label: 'Luzon + Guarantees',
    description: 'Retain Manila and Luzon. Bar alienation. Require guarantees from Spain elsewhere.',
    forCards: ['support_guarantees_nonalienation', 'support_no_spain', 'support_china_trade'],
    againstCards: ['support_luzon_invites_intervention', 'support_republic_fragments'],
    greeneVerdict: '"A fragment. You inherit all the risk with none of the authority."',
    hayVerdict: '"McKinley\'s earlier inclination. Defensible — but you must prove it is not merely convenient."',
    agoncilloVerdict: '"What happens south of Luzon? Spain remains our jailer elsewhere."',
    riskLevel: 'medium',
    statPreview: [
      { label: 'Presidential Conf.', delta: 1, color: 'amber' },
      { label: 'Filipino Support', delta: 0, color: 'slate' },
      { label: 'Public Justif.', delta: 1, color: 'indigo' },
      { label: 'War Risk', delta: 0, color: 'slate' },
    ],
  },
  {
    value: 'conditional_independence',
    label: 'Filipino Independence',
    description: 'Recognize independence under conditions and temporary American support.',
    forCards: ['support_respect_not_recognition', 'support_moral_obligation', 'support_elite_opinion'],
    againstCards: ['support_republic_fragments', 'support_foreign_vacuum', 'support_no_spain'],
    greeneVerdict: '"Who enforces the conditions? And who keeps order when the first province refuses?"',
    hayVerdict: '"The principle is sound. The machinery is not. I admire it as an idea."',
    agoncilloVerdict: '"This is what we came to Paris to argue for. This is our right."',
    riskLevel: 'low',
    statPreview: [
      { label: 'Presidential Conf.', delta: 0, color: 'slate' },
      { label: 'Filipino Support', delta: 3, color: 'emerald' },
      { label: 'Public Justif.', delta: 1, color: 'indigo' },
      { label: 'War Risk', delta: -1, color: 'emerald' },
    ],
  },
  {
    value: 'delay_guarantees',
    label: 'Delay + Guarantees',
    description: 'Preserve American freedom of action. Secure guarantees. Defer final settlement.',
    forCards: ['support_guarantees_nonalienation'],
    againstCards: ['support_foreign_vacuum', 'support_luzon_invites_intervention'],
    greeneVerdict: '"The safest sentence in this house — which is often another way of saying the least useful."',
    hayVerdict: '"Paris may accept temporary ambiguity. History seldom does."',
    agoncilloVerdict: '"Delay means Spain remains. We cannot accept further delay."',
    riskLevel: 'low',
    statPreview: [
      { label: 'Presidential Conf.', delta: -1, color: 'red' },
      { label: 'Filipino Support', delta: 0, color: 'slate' },
      { label: 'Public Justif.', delta: 0, color: 'slate' },
      { label: 'War Risk', delta: -1, color: 'emerald' },
    ],
  },
];

const RISK_COLOR = { low: 'emerald', medium: 'amber', high: 'red' };
const DELTA_COLOR = (d: number) => d > 0 ? 'text-emerald-400' : d < 0 ? 'text-red-400' : 'text-amber-600/40';

interface DecisionBoardProps {
  onCommit: (thesis: MemoThesis) => void;
}

export function DecisionBoard({ onCommit }: DecisionBoardProps) {
  const { unlockedCards, stats } = useGameStore();
  const [selected, setSelected] = useState<MemoThesis | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState<'evidence' | 'voices' | 'stakes'>('evidence');

  const selectedOption = OPTIONS.find(o => o.value === selected);

  const handleCommit = () => {
    if (!selected) return;
    setConfirmed(true);
    setTimeout(() => onCommit(selected), 1000);
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-amber-600/50 text-[10px] tracking-[0.4em] uppercase font-sans mb-2">
            Strategic Decision Point
          </p>
          <h2 className="text-2xl text-amber-300 font-serif mb-2">
            What do you recommend?
          </h2>
          <p className="text-amber-100/40 text-sm italic max-w-lg mx-auto">
            You have read the evidence, heard the voices, and walked the corridors.
            McKinley is waiting. What does the United States do with the Philippines?
          </p>
        </div>

        <div className="flex gap-4">
          {/* Options column */}
          <div className="w-56 flex-shrink-0 space-y-2">
            <p className="text-amber-600/40 text-[10px] tracking-widest uppercase font-sans mb-3">
              Five Courses Open
            </p>
            {OPTIONS.map(opt => {
              const rc = RISK_COLOR[opt.riskLevel];
              const isSelected = selected === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02, x: 2 }}
                  onClick={() => setSelected(opt.value)}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    isSelected
                      ? 'bg-amber-900/40 border-amber-500/60 shadow-lg shadow-amber-900/20'
                      : 'bg-black/20 border-amber-900/20 hover:border-amber-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className={`text-sm font-semibold leading-tight ${isSelected ? 'text-amber-200' : 'text-amber-300/70'}`}>
                      {opt.label}
                    </p>
                    <span className={`text-[9px] font-sans mt-0.5 px-1 py-0.5 rounded bg-${rc}-900/30 text-${rc}-400/70 flex-shrink-0`}>
                      {opt.riskLevel}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-snug ${isSelected ? 'text-amber-400/70' : 'text-amber-600/40'}`}>
                    {opt.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {!selectedOption ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <p className="text-amber-700/30 text-sm italic text-center">
                    Select a course to examine the evidence and voices
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedOption.value}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {/* Tab nav */}
                  <div className="flex gap-1 border-b border-amber-900/20 pb-2">
                    {(['evidence', 'voices', 'stakes'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-[10px] tracking-widest uppercase font-sans rounded transition-all ${
                          activeTab === tab
                            ? 'bg-amber-900/40 text-amber-300'
                            : 'text-amber-700/40 hover:text-amber-600/60'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* EVIDENCE tab */}
                  {activeTab === 'evidence' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-emerald-500/60 text-[10px] font-sans tracking-wide mb-2 uppercase">
                          Arguments supporting this course
                        </p>
                        {selectedOption.forCards.map(id => {
                          const card = getPhraseCard(id);
                          const unlocked = unlockedCards.includes(id);
                          if (!card) return null;
                          return (
                            <div
                              key={id}
                              className={`p-3 rounded border mb-2 transition-all ${
                                unlocked
                                  ? 'bg-emerald-950/20 border-emerald-900/30'
                                  : 'bg-black/20 border-amber-900/10 opacity-40'
                              }`}
                            >
                              <p className={`text-sm italic leading-relaxed ${unlocked ? 'text-emerald-100/80' : 'text-amber-600/40'}`}>
                                "{card.text}"
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-emerald-600/50 text-[10px] font-sans">— {card.source}</p>
                                {!unlocked && (
                                  <p className="text-amber-700/40 text-[9px] font-sans italic">
                                    (not yet encountered)
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        <p className="text-red-500/60 text-[10px] font-sans tracking-wide mb-2 uppercase">
                          Arguments against this course
                        </p>
                        {selectedOption.againstCards.map(id => {
                          const card = getPhraseCard(id);
                          const unlocked = unlockedCards.includes(id);
                          if (!card) return null;
                          return (
                            <div
                              key={id}
                              className={`p-3 rounded border mb-2 ${
                                unlocked
                                  ? 'bg-red-950/20 border-red-900/30'
                                  : 'bg-black/20 border-amber-900/10 opacity-40'
                              }`}
                            >
                              <p className={`text-sm italic leading-relaxed ${unlocked ? 'text-red-100/80' : 'text-amber-600/40'}`}>
                                "{card.text}"
                              </p>
                              <p className="text-red-600/50 text-[10px] font-sans mt-1">— {card.source}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* VOICES tab */}
                  {activeTab === 'voices' && (
                    <div className="space-y-3">
                      {[
                        { name: 'Greene', icon: '⚔', verdict: selectedOption.greeneVerdict, color: 'red' },
                        { name: 'Hay', icon: '🎩', verdict: selectedOption.hayVerdict, color: 'blue' },
                        { name: 'Agoncillo', icon: '🌺', verdict: selectedOption.agoncilloVerdict, color: 'emerald' },
                      ].map(v => (
                        <div key={v.name} className={`bg-${v.color}-950/20 border border-${v.color}-900/25 rounded p-4`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span>{v.icon}</span>
                            <p className={`text-${v.color}-400/80 text-xs font-sans font-semibold tracking-wide`}>
                              {v.name}
                            </p>
                          </div>
                          <p className={`text-${v.color}-100/70 text-sm italic leading-relaxed`}>
                            {v.verdict}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* STAKES tab */}
                  {activeTab === 'stakes' && (
                    <div className="space-y-3">
                      <p className="text-amber-600/40 text-xs italic">
                        Projected effect on your standing if you commit to this course.
                      </p>
                      {selectedOption.statPreview.map(s => (
                        <div key={s.label} className="flex items-center justify-between bg-black/20 rounded p-3">
                          <p className="text-amber-300/60 text-sm">{s.label}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-amber-500/40 text-sm font-sans">
                              {s.delta === 0 ? 'current' : 'current'} {stats[
                                s.label === 'Presidential Conf.' ? 'presidentialConfidence' :
                                s.label === 'Filipino Support' ? 'filipinoEliteSupport' :
                                s.label === 'Public Justif.' ? 'publicJustification' : 'orderWarRisk'
                              ]}
                            </p>
                            <span className="text-amber-700/30">→</span>
                            <p className={`text-sm font-bold font-sans ${DELTA_COLOR(s.delta)}`}>
                              {s.delta > 0 ? '+' : ''}{s.delta !== 0 ? s.delta : '—'}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="bg-amber-950/20 border border-amber-900/20 rounded p-3 mt-2">
                        <p className="text-amber-600/50 text-[10px] font-sans mb-1">Risk Level</p>
                        <p className={`text-${RISK_COLOR[selectedOption.riskLevel]}-400 font-semibold capitalize`}>
                          {selectedOption.riskLevel} — {
                            selectedOption.riskLevel === 'high'
                              ? 'High probability of conflict. Hard to walk back.'
                              : selectedOption.riskLevel === 'medium'
                              ? 'Manageable, but depends on execution.'
                              : 'Lowest immediate risk. Defers the hard question.'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Commit button */}
                  <AnimatePresence>
                    {!confirmed ? (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCommit}
                        className="w-full mt-4 py-3 bg-amber-900/50 border-2 border-amber-600/50 rounded text-amber-200 font-semibold tracking-wide hover:bg-amber-900/70 transition-all"
                      >
                        Commit to This Course — Enter McKinley's Study
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-4"
                      >
                        <p className="text-amber-400/70 text-sm italic">
                          The decision is made. McKinley is waiting.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
