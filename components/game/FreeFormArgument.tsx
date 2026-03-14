'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatEffect } from '@/lib/game/types';

interface EvalResult {
  historicalCoherence: number;
  strategicClarity: number;
  diplomaticRegister: number;
  total: number;
  feedback: string;
  strengthPhrase: string;
  weakSeam: string;
}

interface FreeFormArgumentProps {
  thesis: string | null;
  onSubmit: (text: string, mappedEffects: StatEffect) => void;
  placeholder?: string;
}

export function FreeFormArgument({ thesis, onSubmit, placeholder }: FreeFormArgumentProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  const handleEvaluate = async () => {
    if (!text.trim() || text.length < 20) return;
    setLoading(true);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          argument: text,
          characterId: 'aide',
          thesis: thesis ?? 'undecided',
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        historicalCoherence: 2,
        strategicClarity: 2,
        diplomaticRegister: 2,
        total: 6,
        feedback: 'Your argument shows genuine engagement with the stakes. Cortelyou would call it a solid first draft.',
        strengthPhrase: text.slice(0, 60) + '...',
        weakSeam: 'The argument does not yet account for how this survives contact with Paris.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!result) return;
    // Map score to stat effects
    const effects: StatEffect = {
      presidentialConfidence: result.diplomaticRegister >= 2 ? 1 : 0,
      publicJustification: result.historicalCoherence >= 2 ? 1 : 0,
      filipinoEliteSupport: text.toLowerCase().includes('filipino') || text.toLowerCase().includes('agoncillo') ? 1 : 0,
      orderWarRisk: result.strategicClarity >= 2 ? 0 : 1,
    };
    onSubmit(text, effects);
    setOpen(false);
    setText('');
    setResult(null);
  };

  const scoreColor = (n: number) =>
    n >= 3 ? 'text-emerald-400' : n === 2 ? 'text-amber-400' : 'text-red-400';

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setOpen(true)}
        className="w-full text-left p-3 rounded border border-dashed border-amber-700/40 bg-black/20 hover:border-amber-600/60 hover:bg-amber-900/10 transition-all group"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-600/60 text-xs">✍</span>
          <span className="text-amber-500/60 text-sm italic group-hover:text-amber-400/80 transition-colors">
            Write your own argument…
          </span>
        </div>
        <p className="text-amber-700/40 text-[10px] font-sans mt-1">
          Claude will evaluate it for historical coherence and strategic clarity
        </p>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="bg-stone-900 border border-amber-800/40 rounded-lg w-full max-w-xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-amber-900/30">
                <h3 className="text-amber-300 font-semibold">Write Your Own Argument</h3>
                <p className="text-amber-600/50 text-xs font-sans mt-0.5">
                  State your position in your own words. Be precise — Cortelyou will evaluate it.
                </p>
              </div>

              <div className="p-5">
                {/* Text input */}
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setResult(null); }}
                  placeholder={placeholder ?? 'State your recommendation and your reasoning. What should the President direct in Paris, and why?'}
                  className="w-full h-32 bg-black/30 border border-amber-900/30 rounded p-3 text-amber-100 text-sm leading-relaxed resize-none placeholder:text-amber-700/30 focus:outline-none focus:border-amber-700/60 font-serif"
                  maxLength={600}
                />
                <p className="text-amber-700/30 text-[10px] font-sans text-right mt-1">
                  {text.length}/600
                </p>

                {/* Evaluate button */}
                {!result && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEvaluate}
                    disabled={loading || text.length < 20}
                    className="mt-2 w-full py-2.5 bg-amber-900/40 border border-amber-700/50 rounded text-amber-300 text-sm tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-900/60 transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block"
                        >⟳</motion.span>
                        Cortelyou is reading…
                      </span>
                    ) : 'Submit for Evaluation'}
                  </motion.button>
                )}

                {/* Evaluation result */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-4"
                    >
                      {/* Scores */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Historical', value: result.historicalCoherence },
                          { label: 'Strategic', value: result.strategicClarity },
                          { label: 'Register', value: result.diplomaticRegister },
                        ].map(s => (
                          <div key={s.label} className="bg-black/30 rounded p-2 text-center">
                            <p className={`text-2xl font-bold font-sans ${scoreColor(s.value)}`}>
                              {s.value}/3
                            </p>
                            <p className="text-amber-600/50 text-[10px] font-sans mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Feedback */}
                      <div className="bg-slate-900/50 border border-slate-700/30 rounded p-3">
                        <p className="text-slate-400/60 text-[10px] font-sans mb-1">Cortelyou</p>
                        <p className="text-slate-100 text-sm italic leading-relaxed">"{result.feedback}"</p>
                      </div>

                      {/* Strength */}
                      {result.strengthPhrase && (
                        <div className="bg-emerald-950/30 border border-emerald-900/30 rounded p-3">
                          <p className="text-emerald-500/60 text-[10px] font-sans mb-1">Strongest point</p>
                          <p className="text-emerald-200/80 text-sm italic">"{result.strengthPhrase}"</p>
                        </div>
                      )}

                      {/* Weak seam */}
                      {result.weakSeam && (
                        <div className="bg-red-950/30 border border-red-900/30 rounded p-3">
                          <p className="text-red-400/60 text-[10px] font-sans mb-1">Weak seam — McKinley will find this</p>
                          <p className="text-red-200/70 text-sm italic">"{result.weakSeam}"</p>
                        </div>
                      )}

                      {/* Confirm */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setResult(null); }}
                          className="flex-1 py-2 border border-amber-900/30 rounded text-amber-600/60 text-sm hover:border-amber-700/50 transition-all"
                        >
                          Revise
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          className="flex-1 py-2 bg-amber-800/40 border border-amber-600/50 rounded text-amber-300 text-sm font-semibold hover:bg-amber-800/60 transition-all"
                        >
                          Submit This Argument
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
