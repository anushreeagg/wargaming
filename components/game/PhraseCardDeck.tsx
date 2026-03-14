'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game/store';
import { getPhraseCard, PHRASE_CARDS } from '@/data/phrase-cards';

export function PhraseCardDeck() {
  const { unlockedCards } = useGameStore();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'thesis' | 'support' | 'tone'>('support');

  const cards = unlockedCards
    .map(id => getPhraseCard(id))
    .filter(Boolean)
    .filter(c => c!.category === activeCategory);

  const unlockedCount = unlockedCards.length;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-3 py-2 bg-amber-900/30 border border-amber-800/40 rounded text-xs text-amber-400 hover:bg-amber-900/50 transition-all font-sans tracking-wide"
      >
        <span>📜</span>
        <span>Phrase Cards</span>
        {unlockedCount > 0 && (
          <span className="bg-amber-600 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-sans">
            {unlockedCount}
          </span>
        )}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-stone-900 border border-amber-800/40 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="px-5 py-4 border-b border-amber-900/30 flex justify-between items-center">
                <h3 className="text-amber-300 font-semibold tracking-wide">Unlocked Arguments</h3>
                <button onClick={() => setOpen(false)} className="text-amber-600 hover:text-amber-400 text-lg">×</button>
              </div>

              {/* Category tabs */}
              <div className="flex border-b border-amber-900/20">
                {(['thesis', 'support', 'tone'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 py-2 text-xs tracking-widest uppercase font-sans transition-colors ${
                      activeCategory === cat
                        ? 'text-amber-300 border-b-2 border-amber-500'
                        : 'text-amber-600/50 hover:text-amber-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-3">
                {cards.length === 0 ? (
                  <p className="text-amber-600/40 text-sm italic text-center py-8">
                    No {activeCategory} cards unlocked yet. Continue reading and interviewing to build your argument.
                  </p>
                ) : (
                  cards.map(card => (
                    <motion.div
                      key={card!.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-amber-950/30 border border-amber-800/20 rounded p-3"
                    >
                      <p className="text-amber-100 text-sm leading-relaxed italic">
                        "{card!.text}"
                      </p>
                      <p className="text-amber-600/50 text-[10px] font-sans mt-2 tracking-wide">
                        — {card!.source}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
