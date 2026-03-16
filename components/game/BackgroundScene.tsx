'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundKey, AmbienceKey } from '@/lib/game/types';
import { soundEngine } from '@/lib/audio/soundEngine';

interface BackgroundSceneProps {
  background: BackgroundKey;
  ambience?: AmbienceKey;
  children: React.ReactNode;
}

const BG_LABELS: Record<BackgroundKey, string> = {
  mansion_dawn:     'Executive Mansion — Before Breakfast',
  desk_morning:     'Your Desk — Morning',
  war_room:         'War Room — Midmorning',
  state_dept:       'State Department Anteroom — Early Afternoon',
  desk_afternoon:   'Your Desk — Late Afternoon',
  corridor_evening: 'Executive Mansion Corridor — Evening',
  library_night:    'Executive Mansion Library — Night',
  memo_desk:        'Your Desk — Near Midnight',
};

// ── Image paths ────────────────────────────────────────────────────────────
// Drop your Midjourney images into /public/images/ with these exact filenames.
const BG_IMAGES: Record<BackgroundKey, string> = {
  mansion_dawn:     '/images/bg_mansion_dawn.png',
  desk_morning:     '/images/bg_desk_morning.png',
  desk_afternoon:   '/images/bg_desk_morning.png',   // reuse desk image
  memo_desk:        '/images/bg_memo_desk.png',
  war_room:         '/images/bg_war_room.png',
  state_dept:       '/images/bg_state_dept.png',
  corridor_evening: '/images/bg_corridor_evening.png',
  library_night:    '/images/bg_library_night.png',
};

// ── Fallback gradient colors per scene (if image missing) ─────────────────
const BG_FALLBACK: Record<BackgroundKey, string> = {
  mansion_dawn:     'radial-gradient(ellipse at 50% 80%, #3a1a08 0%, #1a0c05 50%, #050303 100%)',
  desk_morning:     'radial-gradient(ellipse at 40% 60%, #2a1a08 0%, #1a1005 60%, #080503 100%)',
  desk_afternoon:   'radial-gradient(ellipse at 40% 60%, #3a2008 0%, #1a1005 60%, #080503 100%)',
  memo_desk:        'radial-gradient(ellipse at 50% 60%, #0a0810 0%, #080508 60%, #030204 100%)',
  war_room:         'radial-gradient(ellipse at 50% 40%, #0d0808 0%, #080505 60%, #030202 100%)',
  state_dept:       'radial-gradient(ellipse at 50% 20%, #1a1f2e 0%, #12161f 60%, #080a0f 100%)',
  corridor_evening: 'radial-gradient(ellipse at 50% 50%, #100c08 0%, #060404 70%, #020201 100%)',
  library_night:    'radial-gradient(ellipse at 50% 75%, #1a0a06 0%, #0a0604 60%, #030202 100%)',
};

// ── Per-scene overlay tint (Bhansali color grading) ───────────────────────
// Each scene gets a subtle tinted overlay to unify the Padmaavat palette.
const BG_TINT: Record<BackgroundKey, string> = {
  mansion_dawn:     'rgba(60, 25, 5, 0.35)',
  desk_morning:     'rgba(40, 20, 5, 0.32)',
  desk_afternoon:   'rgba(50, 28, 5, 0.30)',
  memo_desk:        'rgba(5, 3, 15, 0.50)',
  war_room:         'rgba(15, 5, 5, 0.42)',
  state_dept:       'rgba(8, 10, 22, 0.40)',
  corridor_evening: 'rgba(10, 5, 3, 0.55)',
  library_night:    'rgba(25, 8, 3, 0.38)',
};

// ── Main component ─────────────────────────────────────────────────────────

export function BackgroundScene({ background, ambience, children }: BackgroundSceneProps) {
  const prevAmbienceRef = useRef<AmbienceKey | undefined>(undefined);

  useEffect(() => {
    if (!soundEngine) return;
    if (ambience !== prevAmbienceRef.current) {
      prevAmbienceRef.current = ambience;
      soundEngine.setAmbience(ambience ?? 'silence');
    }
  }, [ambience]);

  const label = BG_LABELS[background] ?? '';
  const isRain = ambience === 'rain_light' || ambience === 'rain_heavy';
  const imgSrc = BG_IMAGES[background];
  const fallback = BG_FALLBACK[background];
  const tint = BG_TINT[background];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={background}
        className="relative w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.6 }}
      >
        {/* ── Base image layer ── */}
        <div
          className="absolute inset-0 bhansali-grade"
          style={{
            backgroundImage: `url('${imgSrc}'), ${fallback}`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* ── Bhansali amber tint — warm/cool grade per scene ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: tint, mixBlendMode: 'multiply' }}
        />

        {/* ── Film grain texture ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.045,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '180px 180px',
          }}
        />

        {/* ── Rain overlay ── */}
        {isRain && (
          <div
            className="absolute inset-0 rain-overlay pointer-events-none"
            style={{ opacity: ambience === 'rain_heavy' ? 0.5 : 0.28 }}
          />
        )}

        {/* ── Fireplace pulse for library scenes ── */}
        {background === 'library_night' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0, 0.06, 0, 0.09, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(ellipse at 50% 80%, #ff7300 0%, transparent 55%)' }}
          />
        )}

        {/* ── Candle flicker for memo desk ── */}
        {background === 'memo_desk' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.07, 0.03, 0.10, 0.02, 0.08] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'radial-gradient(ellipse at 52% 65%, #ffbb22 0%, transparent 42%)' }}
          />
        )}

        {/* ── Cinematic vignette — heavy, Bhansali-style ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, transparent 22%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* ── Letterbox bars ── */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '9vh',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '12vh',
            background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          }}
        />

        {/* ── Location label ── */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <motion.p
            key={label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-[9px] tracking-[0.45em] uppercase text-amber-200 font-sans text-center whitespace-nowrap"
          >
            {label}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-1 mx-auto h-px w-full"
            style={{ background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.5), transparent)' }}
          />
        </div>

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
