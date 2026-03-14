'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game/store';
import { MemoThesis, MemoTone } from '@/lib/game/types';
import { getPhraseCard, getCardsByCategory } from '@/data/phrase-cards';
import { MEMO_THESIS_LABELS, MEMO_THESIS_OPENING } from '@/data/endings';

const THESIS_OPTIONS: { value: MemoThesis; label: string; description: string }[] = [
  {
    value: 'whole_archipelago',
    label: 'The Whole Archipelago',
    description: 'Assume the full burden. Every partial course recreates the same danger.',
  },
  {
    value: 'protectorate',
    label: 'Protectorate',
    description: 'Filipino government under American protection. Responsibility without annexation.',
  },
  {
    value: 'luzon_guarantees',
    label: 'Luzon and Guarantees',
    description: 'Retain Manila and Luzon only. Exact guarantees. Bar alienation elsewhere.',
  },
  {
    value: 'conditional_independence',
    label: 'Conditional Independence',
    description: 'Recognize Filipino independence under conditions and temporary support.',
  },
  {
    value: 'delay_guarantees',
    label: 'Delay and Guarantees',
    description: 'Preserve American freedom of action. Press Spain for guarantees. Defer final settlement.',
  },
];

const TONE_OPTIONS: { value: MemoTone; label: string; description: string }[] = [
  { value: 'duty_before_appetite', label: 'Duty Before Appetite', description: 'Frame as obligation, not opportunity.' },
  { value: 'prudence_before_sentiment', label: 'Prudence Before Sentiment', description: 'Paris realism. The memo must outlast the newspapers.' },
  { value: 'partnership_without_illusion', label: 'Partnership Without Illusion', description: 'Acknowledge Filipino agency. No false promises.' },
  { value: 'restraint_without_abdication', label: 'Restraint Without Abdication', description: 'Caution is not absence of decision.' },
];

export function MemoDraftScreen() {
  const { memo, setMemoThesis, toggleMemoSupport, setMemoTone, lockMemo, unlockedCards } = useGameStore();
  const [sealed, setSealed] = useState(false);
  const [step, setStep] = useState<'thesis' | 'support' | 'tone' | 'review'>('thesis');

  const supportCards = getCardsByCategory('support').filter(c => unlockedCards.includes(c.id));
  const isReady = memo.thesis && memo.support.length === 2 && memo.tone;

  const handleSeal = () => {
    setSealed(true);
    setTimeout(() => {
      lockMemo();
    }, 2000);
  };

  const memoText = memo.thesis ? MEMO_THESIS_OPENING[memo.thesis] : '';

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-amber-600/50 text-[10px] tracking-[0.4em] uppercase font-sans mb-1">
            15 October 1898 — Executive Mansion
          </p>
          <h2 className="text-2xl text-amber-300 font-serif">Draft Your Memorandum</h2>
          <p className="text-amber-100/40 text-sm mt-2 italic">
            To: Secretary Hay &nbsp;·&nbsp; Re: The Philippine Question
          </p>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 mb-6">
          {(['thesis', 'support', 'tone', 'review'] as const).map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              disabled={s === 'review' && !isReady}
              className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-sans rounded border transition-all ${
                step === s
                  ? 'bg-amber-900/50 border-amber-600/50 text-amber-300'
                  : 'bg-black/20 border-amber-900/20 text-amber-600/40 hover:border-amber-700/30'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {/* THESIS */}
        <AnimatePresence mode="wait">
          {step === 'thesis' && (
            <motion.div key="thesis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-amber-200/60 text-sm mb-4 italic">
                What should the President direct the Paris commissioners to do?
              </p>
              <div className="space-y-2">
                {THESIS_OPTIONS.map(opt => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => { setMemoThesis(opt.value); setStep('support'); }}
                    className={`w-full text-left p-4 rounded border transition-all ${
                      memo.thesis === opt.value
                        ? 'bg-amber-900/40 border-amber-500/60'
                        : 'bg-black/30 border-amber-900/20 hover:border-amber-700/40'
                    }`}
                  >
                    <p className="text-amber-200 font-semibold">{opt.label}</p>
                    <p className="text-amber-400/60 text-sm mt-1 italic">{opt.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUPPORT */}
          {step === 'support' && (
            <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-amber-200/60 text-sm mb-1 italic">
                Choose two supporting arguments from your unlocked phrase cards.
              </p>
              <p className="text-amber-600/40 text-xs font-sans mb-4">
                {memo.support.length}/2 selected
              </p>
              {supportCards.length === 0 ? (
                <p className="text-amber-600/30 text-sm italic text-center py-8">
                  No support cards unlocked yet. Return to the interviews.
                </p>
              ) : (
                <div className="space-y-2">
                  {supportCards.map(card => {
                    const selected = memo.support.includes(card.id);
                    const disabled = !selected && memo.support.length >= 2;
                    return (
                      <motion.button
                        key={card.id}
                        whileHover={!disabled ? { scale: 1.01 } : {}}
                        onClick={() => !disabled && toggleMemoSupport(card.id)}
                        className={`w-full text-left p-3 rounded border transition-all ${
                          selected
                            ? 'bg-amber-900/40 border-amber-500/60'
                            : disabled
                            ? 'bg-black/20 border-amber-900/10 opacity-40 cursor-not-allowed'
                            : 'bg-black/30 border-amber-900/20 hover:border-amber-700/40'
                        }`}
                      >
                        <p className="text-amber-100/90 text-sm italic leading-relaxed">"{card.text}"</p>
                        <p className="text-amber-600/50 text-[10px] font-sans mt-1">— {card.source}</p>
                      </motion.button>
                    );
                  })}
                </div>
              )}
              {memo.support.length === 2 && (
                <button
                  onClick={() => setStep('tone')}
                  className="mt-4 w-full py-2 bg-amber-800/30 border border-amber-700/40 rounded text-amber-300 text-sm hover:bg-amber-800/50 transition-all"
                >
                  Continue to Tone ›
                </button>
              )}
            </motion.div>
          )}

          {/* TONE */}
          {step === 'tone' && (
            <motion.div key="tone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-amber-200/60 text-sm mb-4 italic">
                What register will the memorandum use?
              </p>
              <div className="space-y-2">
                {TONE_OPTIONS.map(opt => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => { setMemoTone(opt.value); setStep('review'); }}
                    className={`w-full text-left p-4 rounded border transition-all ${
                      memo.tone === opt.value
                        ? 'bg-amber-900/40 border-amber-500/60'
                        : 'bg-black/30 border-amber-900/20 hover:border-amber-700/40'
                    }`}
                  >
                    <p className="text-amber-200 font-semibold">{opt.label}</p>
                    <p className="text-amber-400/60 text-sm mt-1 italic">{opt.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* REVIEW — the rendered memo */}
          {step === 'review' && memo.thesis && memo.tone && (
            <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Period memo document */}
              <div className="parchment rounded-lg shadow-2xl overflow-hidden border-2 border-amber-700/30">
                <div className="relative px-8 py-6">
                  {/* Letterhead */}
                  <div className="text-center border-b border-amber-700/30 pb-4 mb-5">
                    <p className="text-xs tracking-[0.3em] uppercase text-ink-faded font-sans" style={{ color: 'var(--ink-faded)' }}>
                      Executive Mansion
                    </p>
                    <p className="text-xs text-ink-faded font-sans" style={{ color: 'var(--ink-faded)' }}>Washington</p>
                    <p className="text-sm font-semibold mt-2" style={{ color: 'var(--ink)' }}>
                      15 October 1898
                    </p>
                  </div>

                  <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                    <p>
                      <span className="font-semibold">To:</span> The Honourable John Hay, Secretary of State
                    </p>
                    <p>
                      <span className="font-semibold">Re:</span> The Philippine Islands — Private Recommendation
                    </p>

                    <div className="border-t border-amber-700/20 pt-3 mt-3">
                      <p className="leading-loose">{memoText}</p>
                    </div>

                    {/* Support arguments */}
                    {memo.support.map(cardId => {
                      const card = getPhraseCard(cardId);
                      return card ? (
                        <p key={cardId} className="pl-4 border-l-2 border-amber-700/30 italic text-sm leading-loose" style={{ color: 'var(--ink-faded)' }}>
                          {card.text}
                        </p>
                      ) : null;
                    })}

                    {/* Tone closing */}
                    <p className="pt-2 text-xs" style={{ color: 'var(--ink-faded)' }}>
                      {memo.tone === 'duty_before_appetite' && 'This recommendation proceeds from obligation, not appetite.'}
                      {memo.tone === 'prudence_before_sentiment' && 'This recommendation is written to survive contact with Paris, not merely with American newspapers.'}
                      {memo.tone === 'partnership_without_illusion' && 'This recommendation acknowledges Filipino political agency without promising what cannot be honoured.'}
                      {memo.tone === 'restraint_without_abdication' && 'This recommendation counsels caution without treating caution as the same thing as decision.'}
                    </p>

                    <p className="pt-4 text-xs text-right" style={{ color: 'var(--ink-faded)' }}>
                      Submitted in confidence,<br />
                      <em>The Aide</em>
                    </p>
                  </div>
                </div>
              </div>

              {/* Seal and send */}
              <div className="mt-6 text-center">
                {!sealed ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSeal}
                    className="px-8 py-3 bg-red-900/60 border-2 border-red-700/60 rounded text-red-200 font-semibold tracking-widest uppercase text-sm hover:bg-red-900/80 transition-all"
                  >
                    Seal and Send to Hay
                  </motion.button>
                ) : (
                  <motion.div className="flex flex-col items-center gap-3">
                    <motion.div
                      className="text-6xl seal-stamp"
                      animate={{ rotate: [0, -5, 5, 0] }}
                    >
                      🔴
                    </motion.div>
                    <p className="text-amber-400/70 text-sm italic tracking-wide">
                      Sealed. Sent to Mr. Hay.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
