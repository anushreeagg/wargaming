'use client';
import { useState, useEffect, useRef } from 'react';
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

const FREE_FORM_NODES = new Set([
  'scene2_choice',
  'scene3_choice',
  'scene4_synthesis_choice',
  'scene5_cortelyou_demand',
  'scene6_thesis_choice',
  'scene6_common_follow_up',
]);

const TELEGRAM_NODES = new Set(['scene4_packet_open', 'scene4_packet_read', 'scene0_telegram']);

const STAT_LABELS: Record<string, string> = {
  presidentialConfidence: 'Presidential Conf.',
  filipinoEliteSupport: 'Filipino Support',
  publicJustification: 'Public Justif.',
  orderWarRisk: 'War Risk',
};

// Per-character accent colors
const CHAR_ACCENT: Record<string, { border: string; bg: string; name: string }> = {
  narration: { border: 'rgba(184,134,11,0.2)',  bg: 'rgba(0,0,0,0.35)',       name: 'rgba(184,134,11,0.45)' },
  aide:      { border: 'rgba(184,134,11,0.5)',  bg: 'rgba(184,134,11,0.08)',  name: '#c9a84c' },
  greene:    { border: 'rgba(155,26,26,0.5)',   bg: 'rgba(155,26,26,0.08)',   name: '#e05555' },
  hay:       { border: 'rgba(59,90,220,0.5)',   bg: 'rgba(59,90,220,0.08)',   name: '#7090f0' },
  agoncillo: { border: 'rgba(16,140,100,0.5)',  bg: 'rgba(16,140,100,0.08)', name: '#40c090' },
  cortelyou: { border: 'rgba(100,116,139,0.5)', bg: 'rgba(100,116,139,0.08)',name: '#94a3b8' },
  mckinley:  { border: 'rgba(161,161,170,0.5)', bg: 'rgba(30,25,20,0.6)',    name: '#d4cfc8' },
};

function getAccent(speaker: string) {
  return CHAR_ACCENT[speaker.toLowerCase()] ?? CHAR_ACCENT.aide;
}

// ── Single message bubble ─────────────────────────────────────────────────────

interface BubbleProps {
  node: GameNode;
  isLatest: boolean;
  activeParagraph: number;
  onParagraphDone: (isLast: boolean) => void;
  playerLabel: string;
  selectedRole: string | null;
}

function MessageBubble({ node, isLatest, activeParagraph, onParagraphDone, playerLabel, selectedRole }: BubbleProps) {
  const isNarration = node.speaker === 'Narration';
  const isPlayer = node.speaker === 'Aide';
  const speakerKey = node.speaker.toLowerCase();
  const accent = getAccent(speakerKey);

  const character = getCharacter(speakerKey) ?? (isPlayer ? getCharacter('aide') : null);
  const playerCharacter = selectedRole ? getCharacter(selectedRole) : getCharacter('aide');

  const paragraphs = node.text.split('\n\n');

  const displayName = isPlayer
    ? playerLabel
    : node.speaker;

  // Narration: full-width centered italic strip
  if (isNarration) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full px-2 py-1"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(184,134,11,0.12)' }} />
          <p className="text-[9px] tracking-[0.3em] uppercase font-sans text-amber-600/40 flex-shrink-0">narration</p>
          <div className="flex-1 h-px" style={{ background: 'rgba(184,134,11,0.12)' }} />
        </div>
        <div className="mt-2 text-amber-100/55 text-sm leading-relaxed italic text-center font-serif">
          {paragraphs.map((para, i) => {
            if (isLatest && i > activeParagraph) return null;
            const isLastPara = i === paragraphs.length - 1;
            if (isLatest) {
              return (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  <TypewriterText
                    text={para}
                    speed={43}
                    onComplete={() => onParagraphDone(isLastPara && i === paragraphs.length - 1)}
                  />
                </p>
              );
            }
            return <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>;
          })}
        </div>
      </motion.div>
    );
  }

  // Player: right-aligned
  if (isPlayer) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex justify-end gap-3 px-1"
      >
        <div className="max-w-[82%]">
          <div className="flex items-center justify-end gap-2 mb-1">
            <p className="text-[10px] font-sans font-semibold tracking-wide" style={{ color: accent.name }}>
              {displayName}
            </p>
          </div>
          <div
            className="rounded-lg rounded-tr-sm p-3.5"
            style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
          >
            <div className="text-sm leading-relaxed text-amber-200">
              {paragraphs.map((para, i) => {
                if (isLatest && i > activeParagraph) return null;
                const isLastPara = i === paragraphs.length - 1;
                if (isLatest) {
                  return (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      <TypewriterText text={para} speed={43} onComplete={() => onParagraphDone(isLastPara)} />
                    </p>
                  );
                }
                return <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>;
              })}
            </div>
          </div>
        </div>
        {(playerCharacter) && (
          <div className="flex-shrink-0 mt-1">
            <CharacterPortrait character={playerCharacter} isSpeaking={isLatest} size="sm" />
          </div>
        )}
      </motion.div>
    );
  }

  // NPC: left-aligned with portrait and colored border
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex gap-3 px-1"
    >
      <div className="flex-shrink-0 mt-1">
        {character
          ? <CharacterPortrait character={character} isSpeaking={isLatest} size="sm" />
          : <div className="w-10 h-10 rounded-full bg-amber-900/20 border border-amber-700/30" />
        }
      </div>
      <div className="max-w-[82%]">
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-[11px] font-sans font-semibold" style={{ color: accent.name }}>
            {displayName}
          </p>
          {node.speakerRole && (
            <p className="text-[9px] font-sans text-amber-700/40 tracking-wider uppercase">
              {node.speakerRole}
            </p>
          )}
        </div>
        <div
          className="rounded-lg rounded-tl-sm p-3.5"
          style={{
            background: accent.bg,
            border: `1px solid ${accent.border}`,
            borderLeft: `3px solid ${accent.border}`,
          }}
        >
          <div className="text-sm leading-relaxed text-amber-50/90">
            {paragraphs.map((para, i) => {
              if (isLatest && i > activeParagraph) return null;
              const isLastPara = i === paragraphs.length - 1;
              if (isLatest) {
                return (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    <TypewriterText text={para} speed={43} onComplete={() => onParagraphDone(isLastPara)} />
                  </p>
                );
              }
              return <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>;
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function ConversationPanel({ node }: ConversationPanelProps) {
  const { makeChoice, goToNode, applyEffects, chosenThesis, selectedRole } = useGameStore();
  const { playHover, playDecision, playTelegram, playPaper } = useSound();

  const [messageHistory, setMessageHistory] = useState<GameNode[]>([node]);
  const [currentScene, setCurrentScene] = useState(node.scene);
  const [textDone, setTextDone] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);
  const [activeParagraph, setActiveParagraph] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const playerCharacter = selectedRole ? getCharacter(selectedRole) : getCharacter('aide');
  const playerLabel = playerCharacter ? `You (${playerCharacter.name})` : 'You (The Aide)';
  const showFreeForm = FREE_FORM_NODES.has(node.id);

  // When node changes: accumulate or reset on new scene
  useEffect(() => {
    setTextDone(false);
    setShowChoices(false);
    setActiveParagraph(0);

    if (node.scene !== currentScene) {
      // New scene — fresh log
      setCurrentScene(node.scene);
      setMessageHistory([node]);
    } else {
      setMessageHistory(prev => {
        if (prev[prev.length - 1]?.id === node.id) return prev;
        return [...prev, node];
      });
    }

    if (TELEGRAM_NODES.has(node.id)) {
      setTimeout(() => playTelegram(), 300);
    }
  }, [node.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom on new message
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 80);
  }, [messageHistory.length, activeParagraph]);

  const handleParagraphDone = (isLastParagraph: boolean) => {
    if (!isLastParagraph) {
      setActiveParagraph(p => p + 1);
    } else {
      setTextDone(true);
      if (node.options && node.options.length > 0) {
        setTimeout(() => setShowChoices(true), 300);
      }
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
    if (node.options && node.options.length > 0) {
      goToNode(node.options[0].next);
    } else if (node.next) {
      goToNode(node.next);
    }
  };

  const hoveredOption = node.options?.find(o => o.id === hoveredChoice);
  const hasEffects = hoveredOption && Object.values(hoveredOption.effects).some(v => v !== 0 && v !== undefined);

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Scrollable message log ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {messageHistory.map((msg, idx) => {
          const isLatest = idx === messageHistory.length - 1;
          return (
            <MessageBubble
              key={`${msg.id}-${idx}`}
              node={msg}
              isLatest={isLatest}
              activeParagraph={isLatest ? activeParagraph : 999}
              onParagraphDone={handleParagraphDone}
              playerLabel={playerLabel}
              selectedRole={selectedRole}
            />
          );
        })}
      </div>

      {/* ── Consequence preview ── */}
      <AnimatePresence>
        {hoveredOption && hasEffects && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 flex gap-2 flex-wrap px-1"
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

      {/* ── Actions ── */}
      <AnimatePresence>
        {textDone && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 space-y-2 flex-shrink-0"
          >
            {node.options && showChoices ? (
              <>
                {/* Divider */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-px bg-amber-900/20" />
                  <p className="text-[9px] tracking-[0.25em] uppercase font-sans text-amber-700/40">Your Response</p>
                  <div className="flex-1 h-px bg-amber-900/20" />
                </div>

                {node.options.map((option, i) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onHoverStart={() => { setHoveredChoice(option.id); playHover(); }}
                    onHoverEnd={() => setHoveredChoice(null)}
                    onClick={() => { playDecision(); makeChoice(option.id); }}
                    className={`w-full text-left p-3 rounded border transition-all duration-200 ${
                      hoveredChoice === option.id
                        ? 'bg-amber-900/35 border-amber-600/50'
                        : 'bg-black/25 border-amber-900/20 hover:border-amber-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600/70 mt-0.5 font-sans text-xs flex-shrink-0">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <div>
                        <p className="text-amber-100 text-sm leading-snug">{option.label}</p>
                        {option.subtext && (
                          <p className="text-amber-500/50 text-xs mt-0.5 font-sans italic">{option.subtext}</p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}

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
                className="w-full text-center py-2 text-amber-600/60 text-xs tracking-widest uppercase font-sans hover:text-amber-400 transition-colors"
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
