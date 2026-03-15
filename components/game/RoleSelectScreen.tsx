'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useGameStore } from '@/lib/game/store';
import { CHARACTERS } from '@/data/characters';
import { Character } from '@/lib/game/types';

const PLAYABLE = CHARACTERS.filter(c => c.isPlayable);

const ROLE_BONUS_LABELS: Record<string, string[]> = {
  greene:    ['+1 Presidential Confidence', '−1 War Risk'],
  hay:       ['+1 Public Justification', '+1 Presidential Confidence'],
  agoncillo: ['+2 Filipino Support', '+1 Public Justification'],
  aide:      ['Balanced starting position'],
};

const BORDER_COLOR: Record<string, string> = {
  amber:   '#b8860b',
  red:     '#9b1a1a',
  blue:    '#1e40af',
  emerald: '#065f46',
};

const ACCENT_COLOR: Record<string, string> = {
  amber:   'rgba(184,134,11,',
  red:     'rgba(155,26,26,',
  blue:    'rgba(30,64,175,',
  emerald: 'rgba(6,95,70,',
};

interface RoleSelectScreenProps {
  onSelect: () => void;
}

export function RoleSelectScreen({ onSelect }: RoleSelectScreenProps) {
  const { selectRole } = useGameStore();
  const [hovered, setHovered] = useState<string | null>(null);
  const [brief, setBrief] = useState<Character | null>(null);

  const handleConfirm = (char: Character) => {
    selectRole(char.id);
    onSelect();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background — Executive Mansion at dawn */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 85%, #3a1a08 0%, #1a0c05 40%, #050303 100%)' }} />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, #6b3010 0%, transparent 55%)' }} />

      {/* Architectural silhouette */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" style={{ opacity: 0.25 }}>
        <rect x="300" y="60" width="600" height="240" fill="#0a0806" />
        {[350,400,450,500,550,600,650,700,750,800].map((x,i) => (
          <rect key={i} x={x} y="80" width="16" height="200" fill="#080604" />
        ))}
        <rect x="280" y="50" width="640" height="16" fill="#0d0a07" />
        <ellipse cx="600" cy="240" rx="500" ry="80" fill="#060404" />
      </svg>

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
        {[[80,40],[220,70],[400,30],[580,55],[760,25],[940,60],[1100,40],[160,100],[500,80],[850,90],[1050,110]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={[0.8,1.1,0.7,1.3,0.9,1.0,0.8,1.2,0.7,1.1,0.9][i]} fill="white" />
        ))}
      </svg>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="text-amber-600/60 text-[10px] tracking-[0.4em] uppercase font-sans mb-3">
            15 October 1898 · Washington
          </p>
          <h1 className="text-3xl font-serif text-amber-100/90 tracking-wide mb-2">
            Choose Your Role
          </h1>
          <p className="text-amber-500/50 text-sm font-sans max-w-lg text-center leading-relaxed">
            Each figure brings different knowledge, different interests, and a different claim on the President's attention.
          </p>
        </motion.div>

        {/* Character Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-5xl">
          {PLAYABLE.map((char, i) => {
            const border = BORDER_COLOR[char.color] ?? '#b8860b';
            const accent = ACCENT_COLOR[char.color] ?? 'rgba(184,134,11,';
            const isHovered = hovered === char.id;

            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                onHoverStart={() => setHovered(char.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => setBrief(char)}
                className="relative cursor-pointer rounded-lg overflow-hidden"
                style={{
                  border: `1px solid ${isHovered ? border : border + '40'}`,
                  boxShadow: isHovered ? `0 0 24px ${accent}0.2)` : 'none',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                {/* Card background */}
                <div className="absolute inset-0"
                  style={{ background: isHovered ? `${accent}0.12)` : 'rgba(10,8,6,0.8)' }} />

                <div className="relative p-5 flex flex-col items-center gap-3">
                  {/* Portrait */}
                  <div className="relative" style={{ width: 80, height: 80 }}>
                    <div className="absolute inset-0 rounded-full overflow-hidden"
                      style={{ border: `2px solid ${border}`, boxShadow: `0 0 12px ${accent}0.3)` }}>
                      {char.photoUrl ? (
                        <Image
                          src={char.photoUrl}
                          alt={char.name}
                          fill
                          sizes="80px"
                          className="object-cover object-top"
                          style={{ filter: 'sepia(50%) contrast(1.1) brightness(0.9)' }}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl"
                          style={{ background: `${accent}0.15)` }}>
                          {char.portrait}
                        </div>
                      )}
                      {/* Portrait vignette */}
                      <div className="absolute inset-0 rounded-full"
                        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />
                    </div>
                  </div>

                  {/* Name + Role */}
                  <div className="text-center">
                    <p className="font-serif text-sm leading-tight" style={{ color: border }}>
                      {char.name}
                    </p>
                    <p className="text-[10px] font-sans mt-1 leading-tight" style={{ color: `${accent}0.6)` }}>
                      {char.role}
                    </p>
                  </div>

                  {/* Starting bonuses */}
                  <div className="w-full space-y-1 mt-1">
                    {(ROLE_BONUS_LABELS[char.id] ?? []).map((label, j) => (
                      <p key={j} className="text-[9px] font-sans text-center" style={{ color: `${accent}0.5)` }}>
                        {label}
                      </p>
                    ))}
                  </div>

                  {/* View Brief button */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="text-[10px] tracking-[0.2em] uppercase font-sans mt-1"
                    style={{ color: border }}
                  >
                    View Brief →
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="mt-8 text-amber-600 text-xs font-sans tracking-widest"
        >
          Click a role to read your mission brief
        </motion.p>
      </div>

      {/* ── MISSION BRIEF OVERLAY ──────────────────────────────────────────── */}
      <AnimatePresence>
        {brief && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            onClick={() => setBrief(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-2xl mx-4 rounded-lg overflow-hidden"
              style={{
                border: `1px solid ${BORDER_COLOR[brief.color] ?? '#b8860b'}60`,
                background: 'linear-gradient(135deg, #1a1008 0%, #0d0806 100%)',
                boxShadow: `0 0 60px ${ACCENT_COLOR[brief.color] ?? 'rgba(184,134,11,'}0.15)`,
              }}
            >
              {/* Brief header */}
              <div className="px-8 pt-8 pb-6 border-b"
                style={{ borderColor: `${BORDER_COLOR[brief.color] ?? '#b8860b'}30` }}>
                <div className="flex items-center gap-5">
                  {/* Large portrait */}
                  <div className="relative flex-shrink-0" style={{ width: 72, height: 72 }}>
                    <div className="absolute inset-0 rounded-full overflow-hidden"
                      style={{ border: `2px solid ${BORDER_COLOR[brief.color] ?? '#b8860b'}` }}>
                      {brief.photoUrl ? (
                        <Image
                          src={brief.photoUrl}
                          alt={brief.name}
                          fill
                          sizes="72px"
                          className="object-cover object-top"
                          style={{ filter: 'sepia(50%) contrast(1.1) brightness(0.85)' }}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {brief.portrait}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-amber-600/50 mb-1">
                      Mission Brief
                    </p>
                    <h2 className="font-serif text-xl text-amber-200">{brief.name}</h2>
                    <p className="text-amber-600/70 text-xs font-sans mt-0.5">{brief.role}</p>
                  </div>
                </div>

                <p className="mt-4 text-amber-100/60 text-sm font-serif italic leading-relaxed">
                  "{brief.voice}"
                </p>
              </div>

              {/* Brief body */}
              <div className="px-8 py-6 grid grid-cols-2 gap-6">
                {/* Objectives */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-3"
                    style={{ color: BORDER_COLOR[brief.color] ?? '#b8860b' }}>
                    Your Objectives
                  </p>
                  <ul className="space-y-2">
                    {brief.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: BORDER_COLOR[brief.color] ?? '#b8860b' }} />
                        <p className="text-amber-100/75 text-xs leading-relaxed">{obj}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Private Knowledge */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-3 text-amber-600/60">
                    What Only You Know
                  </p>
                  <ul className="space-y-2">
                    {brief.privateKnowledge.map((pk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex-shrink-0 text-amber-700/50 text-xs">✦</span>
                        <p className="text-amber-500/60 text-xs leading-relaxed italic">{pk}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Starting advantages */}
              <div className="px-8 pb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-2 text-amber-600/40">
                  Starting Advantages
                </p>
                <div className="flex gap-3 flex-wrap">
                  {(ROLE_BONUS_LABELS[brief.id] ?? []).map((label, i) => (
                    <span key={i} className="text-[10px] font-sans px-2 py-1 rounded border"
                      style={{
                        color: BORDER_COLOR[brief.color] ?? '#b8860b',
                        borderColor: `${BORDER_COLOR[brief.color] ?? '#b8860b'}30`,
                        background: `${ACCENT_COLOR[brief.color] ?? 'rgba(184,134,11,'}0.08)`,
                      }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 pb-8 flex items-center justify-between">
                <button
                  onClick={() => setBrief(null)}
                  className="text-xs text-amber-700/50 hover:text-amber-600/70 font-sans tracking-wide transition-colors"
                >
                  ← Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleConfirm(brief)}
                  className="px-6 py-2.5 rounded text-sm font-sans tracking-[0.15em] uppercase transition-all"
                  style={{
                    background: `${ACCENT_COLOR[brief.color] ?? 'rgba(184,134,11,'}0.2)`,
                    border: `1px solid ${BORDER_COLOR[brief.color] ?? '#b8860b'}80`,
                    color: BORDER_COLOR[brief.color] ?? '#b8860b',
                    boxShadow: `0 0 20px ${ACCENT_COLOR[brief.color] ?? 'rgba(184,134,11,'}0.15)`,
                  }}
                >
                  Take This Role →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
