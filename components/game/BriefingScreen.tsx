'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useGameStore } from '@/lib/game/store';
import { getCharacter } from '@/data/characters';

interface BriefingScreenProps {
  onContinue: () => void;
}

const STEPS = ['The Setting', 'The Map', 'The Players', 'Your Mission'];

const NPC_CHARACTERS = ['greene', 'hay', 'agoncillo', 'cortelyou', 'mckinley'];

const CHARACTER_SUMMARIES: Record<string, { title: string; summary: string }> = {
  greene: {
    title: 'The General',
    summary: 'Commanded US forces in the Philippines. Believes full annexation is the only honest policy — partial measures will fail and cost more blood later.',
  },
  hay: {
    title: 'The Diplomat',
    summary: 'Secretary of State, architect of US foreign policy. Wants a recommendation that can survive European scrutiny in Paris without sounding like conquest.',
  },
  agoncillo: {
    title: 'The Filipino Voice',
    summary: 'Representative of Aguinaldo\'s government. Was received but not recognized. Insists Filipino political capacity is real — and is watching every word.',
  },
  cortelyou: {
    title: 'The Gatekeeper',
    summary: 'Secretary to the President. Controls access to McKinley. Calm, procedural, loyal — and notices whether conviction is real or performed.',
  },
  mckinley: {
    title: 'The Decider',
    summary: 'President of the United States. Has not yet decided. Is waiting for someone to give him a burden he can defend to the nation, to history, and to God.',
  },
};

export function BriefingScreen({ onContinue }: BriefingScreenProps) {
  const [step, setStep] = useState(0);
  const { selectedRole } = useGameStore();
  const roleCharacter = selectedRole ? getCharacter(selectedRole) : getCharacter('aide');

  const isLast = step === STEPS.length - 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bhansali-grade"
        style={{
          backgroundImage: "url('/images/bg_war_room.png'), radial-gradient(ellipse at 50% 40%, #1a0e06 0%, #080503 100%)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(5,3,1,0.72)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 20%, rgba(0,0,0,0.75) 100%)' }} />
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">

        {/* Header — step label */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-[11px] tracking-[0.45em] uppercase font-sans text-amber-500/60 mb-2">
            Situation Briefing · {step + 1} of {STEPS.length}
          </p>
          <h2
            className="text-3xl tracking-wide"
            style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif', fontWeight: 400, color: '#e8d5a8' }}
          >
            {STEPS[step]}
          </h2>
          <div className="mt-3 w-48 h-px mx-auto"
            style={{ background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.6), transparent)' }} />
        </motion.div>

        {/* Step progress dots */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}>
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === step ? '#c9a84c' : i < step ? 'rgba(184,134,11,0.5)' : 'rgba(184,134,11,0.2)',
                  transform: i === step ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            </button>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl"
          >

            {/* ── STEP 0: THE SETTING ── */}
            {step === 0 && (
              <div
                className="rounded-xl p-8 space-y-6"
                style={{ background: 'rgba(8,5,2,0.82)', border: '1px solid rgba(184,134,11,0.22)' }}
              >
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">The Date</p>
                      <p className="text-amber-200 text-base font-serif">15 October 1898 — Washington, D.C.</p>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">What Just Happened</p>
                      <p className="text-amber-100/80 text-sm leading-relaxed">
                        The Spanish-American War ended in August. Admiral Dewey destroyed the Spanish fleet in Manila Bay in May. US forces occupy Manila. Spain is finished in the Pacific.
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">The Problem</p>
                      <p className="text-amber-100/80 text-sm leading-relaxed">
                        The Paris Peace Commission is negotiating right now. Spain will cede territory — but which? The Philippines is 7,000 islands, 8 million people, no formal US policy. McKinley has not decided.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">The Stakes</p>
                      <p className="text-amber-100/80 text-sm leading-relaxed">
                        Germany, Britain, and Japan are all watching. If the US hesitates, a vacuum forms. If it overreaches, it inherits a war with Filipino independence forces. There is no clean option.
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">Your Role Today</p>
                      <p className="text-amber-100/80 text-sm leading-relaxed">
                        You are a White House aide. You will hear from the generals, diplomats, and Filipino representatives. At the end of the day, you must write a memorandum for the President that helps him be less wrong.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['No formal US colonial policy', 'Filipino forces already armed', 'Treaty deadline: December 10', 'Senate vote will be close'].map(f => (
                        <span key={f} className="text-[11px] font-sans px-3 py-1 rounded-full"
                          style={{ background: 'rgba(184,134,11,0.1)', border: '1px solid rgba(184,134,11,0.25)', color: 'rgba(212,168,67,0.8)' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 1: THE MAP ── */}
            {step === 1 && (
              <div
                className="rounded-xl p-6"
                style={{ background: 'rgba(8,5,2,0.82)', border: '1px solid rgba(184,134,11,0.22)' }}
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Philippines map */}
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-3">The Archipelago</p>
                    <div className="rounded-lg overflow-hidden relative" style={{ height: 260 }}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "url('/images/map_philippines.png')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'sepia(25%) contrast(1.05)',
                        }}
                      />
                      <div className="absolute inset-0" style={{ background: 'rgba(8,5,2,0.3)' }} />
                      {/* Labels */}
                      <div className="absolute top-3 left-3 bg-black/60 rounded px-2 py-1">
                        <p className="text-[10px] font-sans text-amber-300/90 tracking-wider">PHILIPPINE ARCHIPELAGO</p>
                        <p className="text-[9px] font-sans text-amber-500/60">~7,000 islands · 8 million people</p>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 rounded px-2 py-1">
                        <p className="text-[9px] font-sans text-amber-400/80">★ Manila — US Naval Base since May 1898</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {[
                        { name: 'Luzon', note: 'Largest island. Manila. Aguinaldo\'s stronghold.' },
                        { name: 'Visayas', note: 'Central islands. Divided leadership.' },
                        { name: 'Mindanao', note: 'South. Muslim populations. Distinct politics.' },
                      ].map(r => (
                        <div key={r.name} className="flex gap-2 text-xs">
                          <span className="text-amber-500/80 font-sans font-semibold w-20 flex-shrink-0">{r.name}</span>
                          <span className="text-amber-200/55 font-sans">{r.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pacific map */}
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-3">The Pacific Theater</p>
                    <div className="rounded-lg overflow-hidden relative" style={{ height: 260 }}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "url('/images/map_pacific.png')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'sepia(25%) contrast(1.05)',
                        }}
                      />
                      <div className="absolute inset-0" style={{ background: 'rgba(8,5,2,0.3)' }} />
                      <div className="absolute top-3 left-3 bg-black/60 rounded px-2 py-1">
                        <p className="text-[10px] font-sans text-amber-300/90 tracking-wider">PACIFIC THEATER</p>
                        <p className="text-[9px] font-sans text-amber-500/60">Great powers watching from all sides</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {[
                        { power: 'Germany', note: 'German fleet observed Manila Bay. Wants presence.' },
                        { power: 'Britain', note: 'Favors US presence over Germany or Spain.' },
                        { power: 'Japan', note: 'Watching. Will fill any vacuum within a decade.' },
                      ].map(r => (
                        <div key={r.power} className="flex gap-2 text-xs">
                          <span className="text-amber-500/80 font-sans font-semibold w-20 flex-shrink-0">{r.power}</span>
                          <span className="text-amber-200/55 font-sans">{r.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: THE PLAYERS ── */}
            {step === 2 && (
              <div
                className="rounded-xl p-6"
                style={{ background: 'rgba(8,5,2,0.82)', border: '1px solid rgba(184,134,11,0.22)' }}
              >
                <div className="grid grid-cols-5 gap-4">
                  {NPC_CHARACTERS.map(id => {
                    const char = getCharacter(id);
                    if (!char) return null;
                    const summary = CHARACTER_SUMMARIES[id];
                    return (
                      <div key={id} className="flex flex-col items-center text-center gap-3">
                        {/* Portrait */}
                        <div
                          className="relative rounded-full overflow-hidden flex-shrink-0"
                          style={{ width: 80, height: 80, border: '2px solid rgba(184,134,11,0.5)' }}
                        >
                          {char.photoUrl ? (
                            <Image
                              src={char.photoUrl}
                              alt={char.name}
                              fill
                              sizes="80px"
                              className="object-cover object-top"
                              style={{ filter: 'sepia(40%) contrast(1.1) brightness(0.88)' }}
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl"
                              style={{ background: 'rgba(184,134,11,0.1)' }}>
                              {char.portrait}
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-full"
                            style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)' }} />
                        </div>
                        {/* Name + title */}
                        <div>
                          <p className="text-amber-200 text-sm font-serif font-semibold leading-tight">{char.name}</p>
                          <p className="text-amber-500/70 text-[11px] font-sans mt-0.5">{summary.title}</p>
                        </div>
                        {/* Summary */}
                        <p className="text-amber-100/60 text-xs leading-relaxed font-sans">{summary.summary}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 3: YOUR MISSION ── */}
            {step === 3 && roleCharacter && (
              <div
                className="rounded-xl p-8"
                style={{ background: 'rgba(8,5,2,0.82)', border: '1px solid rgba(184,134,11,0.22)' }}
              >
                <div className="flex gap-8">
                  {/* Portrait */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div
                      className="relative rounded-full overflow-hidden"
                      style={{ width: 100, height: 100, border: '2px solid rgba(184,134,11,0.6)' }}
                    >
                      {roleCharacter.photoUrl ? (
                        <Image
                          src={roleCharacter.photoUrl}
                          alt={roleCharacter.name}
                          fill
                          sizes="100px"
                          className="object-cover object-top"
                          style={{ filter: 'sepia(40%) contrast(1.1) brightness(0.88)' }}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl"
                          style={{ background: 'rgba(184,134,11,0.1)' }}>
                          {roleCharacter.portrait}
                        </div>
                      )}
                    </div>
                    <p className="text-amber-200 text-sm font-serif text-center">{roleCharacter.name}</p>
                    <p className="text-amber-500/65 text-xs font-sans text-center leading-snug max-w-[120px]">{roleCharacter.role}</p>
                  </div>

                  {/* Mission details */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">Your Perspective</p>
                      <p className="text-amber-100/80 text-sm leading-relaxed font-serif italic">
                        &ldquo;{roleCharacter.voice}&rdquo;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">Your Objectives</p>
                        <ul className="space-y-2">
                          {roleCharacter.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-600/70 mt-1 flex-shrink-0">▸</span>
                              <p className="text-amber-100/75 text-xs leading-relaxed">{obj}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">What Only You Know</p>
                        <ul className="space-y-2">
                          {roleCharacter.privateKnowledge.map((pk, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-700/50 mt-0.5 flex-shrink-0 text-xs">✦</span>
                              <p className="text-amber-500/65 text-xs leading-relaxed italic">{pk}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[11px] tracking-[0.3em] uppercase font-sans text-amber-500/60 mb-2">How The Game Works</p>
                      <div className="flex gap-3 flex-wrap">
                        {[
                          'Read the evidence, hear the voices',
                          'Make choices that affect 4 key stats',
                          'Draft a final memorandum for McKinley',
                          'Your ending depends on your reasoning',
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-sans"
                            style={{ color: 'rgba(212,168,67,0.7)' }}>
                            <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]"
                              style={{ background: 'rgba(184,134,11,0.15)', border: '1px solid rgba(184,134,11,0.3)' }}>
                              {i + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-2.5 text-xs tracking-[0.25em] uppercase font-sans transition-colors"
              style={{ color: 'rgba(184,134,11,0.55)', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 4 }}
            >
              ← Back
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={isLast ? onContinue : () => setStep(s => s + 1)}
            className="px-10 py-3 text-sm tracking-[0.3em] uppercase font-sans transition-all relative"
            style={{
              background: isLast ? 'rgba(184,134,11,0.2)' : 'rgba(0,0,0,0.3)',
              border: `1px solid rgba(184,134,11,${isLast ? '0.7' : '0.4'})`,
              color: isLast ? '#c9a84c' : 'rgba(212,168,67,0.75)',
              borderRadius: 4,
            }}
          >
            {isLast ? 'Enter the Room →' : 'Next →'}
          </motion.button>
        </div>

      </div>
    </div>
  );
}
