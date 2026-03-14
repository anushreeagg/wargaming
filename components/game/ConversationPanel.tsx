'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameNode, StatEffect } from '@/lib/game/types';
import { useGameStore } from '@/lib/game/store';
import { getCharacter } from '@/data/characters';
import { CharacterPortrait } from './CharacterPortrait';
import { TypewriterText } from './TypewriterText';
import { FreeFormArgument } from './FreeFormArgument';
import { useSound } from '@/lib/hooks/useSound';

interface ConversationPanelProps {
  node: GameNode;
}

// Nodes where free-form argument makes sense
const FREE_FORM_NODES = new Set([
  'scene2_choice',
  'scene3_choice',
  'scene4_synthesis_choice',
  'scene5_cortelyou_demand',
  'scene6_thesis_choice',
  'scene6_common_follow_up',
]);

const STAT_LABELS: Record<string, string> = {
  presidentialConfidence: 'Presidential Conf.',
  filipinoEliteSupport: 'Filipino Support',
  publicJustification: 'Public Justif.',
  orderWarRisk: 'War Risk',
};

// Nodes that trigger a telegram sound on arrival
const TELEGRAM_NODES = new Set(['scene4_packet_open', 'scene4_packet_read', 'scene0_telegram']);

export function ConversationPanel({ node }: ConversationPanelProps) {
  const { makeChoice, goToNode, applyEffects, chosenThesis } = useGameStore();
  const { playHover, playDecision, playTelegram, playPaper } = useSound();
  const [textDone, setTextDone] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  const character = getCharacter(node.speaker.toLowerCase()) ??
    (node.speaker === 'Aide' ? getCharacter('aide') : null);

  const isNarration = node.speaker === 'Narration';
  const isPlayer = node.speaker === 'Aide';
  const showFreeForm = FREE_FORM_NODES.has(node.id);

  useEffect(() => {
    setTextDone(false);
    setShowChoices(false);
    if (TELEGRAM_NODES.has(node.id)) {
      setTimeout(() => playTelegram(), 300);
    }
  }, [node.id, playTelegram]);

  const handleTextDone = () => {
    setTextDone(true);
    if (node.options && node.options.length > 0) {
      setTimeout(() => setShowChoices(true), 300);
    }
  };

  const handleContinue = () => {
    playPaper();
    if (node.next && node.next !== 'END' && node.next !== 'MEMO_DRAFT_SCREEN' && node.next !== 'ENDING_SCREEN') {
      goToNode(node.next);
    }
  };

  const handleFreeForm = (text: string, effects: StatEffect) => {
    applyEffects(effects);
    // Route to the most natural next node
    if (node.options && node.options.length > 0) {
      goToNode(node.options[0].next);
    } else if (node.next) {
      goToNode(node.next);
    }
  };

  // Consequence preview for a hovered option
  const hoveredOption = node.options?.find(o => o.id === hoveredChoice);
  const hasEffects = hoveredOption && Object.values(hoveredOption.effects).some(v => v !== 0 && v !== undefined);

  return (
    <div className="flex flex-col h-full">
      {/* Dialogue box */}
      <motion.div
        key={node.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col justify-end pb-2"
      >
        <div className={`relative rounded-lg p-5 ${
          isNarration
            ? 'bg-black/50 border border-amber-900/20 italic'
            : 'bg-black/60 border border-amber-800/30'
        }`}>
          {!isNarration && (
            <div className="flex items-center gap-3 mb-3">
              {character && <CharacterPortrait character={character} isSpeaking size="sm" />}
              <div>
                <p className="text-amber-300 font-semibold text-sm tracking-wide">
                  {isPlayer ? 'You (The Aide)' : node.speaker}
                </p>
                {node.speakerRole && (
                  <p className="text-amber-600/70 text-xs tracking-widest uppercase font-sans">
                    {node.speakerRole}
                  </p>
                )}
              </div>
            </div>
          )}

          {isNarration && (
            <p className="text-amber-500/60 text-[10px] tracking-[0.3em] uppercase font-sans mb-2">
              — narration —
            </p>
          )}

          <div className={`text-base leading-relaxed ${
            isNarration ? 'text-amber-100/70' : isPlayer ? 'text-amber-200' : 'text-amber-50'
          }`}>
            {node.text.split('\n\n').map((para, i, arr) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>
                <TypewriterText
                  text={para}
                  speed={45}
                  onComplete={i === arr.length - 1 ? handleTextDone : undefined}
                />
              </p>
            ))}
          </div>

          <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        </div>
      </motion.div>

      {/* Consequence preview tooltip */}
      <AnimatePresence>
        {hoveredOption && hasEffects && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 flex gap-3 flex-wrap px-1"
          >
            {Object.entries(hoveredOption.effects).map(([key, val]) => {
              if (!val) return null;
              const isPos = (val as number) > 0;
              return (
                <span
                  key={key}
                  className={`text-[10px] font-sans px-2 py-0.5 rounded-full border ${
                    isPos
                      ? 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30'
                      : 'text-red-400 border-red-800/40 bg-red-950/30'
                  }`}
                >
                  {isPos ? '▲' : '▼'} {STAT_LABELS[key] ?? key}
                </span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choices / Continue / Free-form */}
      <AnimatePresence>
        {textDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 space-y-2"
          >
            {node.options && showChoices ? (
              <>
                {node.options.map((option, i) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onHoverStart={() => { setHoveredChoice(option.id); playHover(); }}
                    onHoverEnd={() => setHoveredChoice(null)}
                    onClick={() => { playDecision(); makeChoice(option.id); }}
                    className={`w-full text-left p-3 rounded border transition-all duration-200 ${
                      hoveredChoice === option.id
                        ? 'bg-amber-900/40 border-amber-600/60'
                        : 'bg-black/30 border-amber-900/20 hover:border-amber-700/40'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5 font-sans text-xs flex-shrink-0">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <div>
                        <p className="text-amber-100 text-sm leading-snug">{option.label}</p>
                        {option.subtext && (
                          <p className="text-amber-500/60 text-xs mt-0.5 font-sans italic">
                            {option.subtext}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}

                {/* Free-form option */}
                {showFreeForm && (
                  <FreeFormArgument
                    thesis={chosenThesis}
                    onSubmit={handleFreeForm}
                    placeholder="State your position in your own words. What should the President direct in Paris, and why?"
                  />
                )}
              </>
            ) : !node.options ? (
              <button
                onClick={handleContinue}
                className="w-full text-center py-2 text-amber-600/70 text-xs tracking-widest uppercase font-sans hover:text-amber-400 transition-colors"
              >
                Continue ›
              </button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
