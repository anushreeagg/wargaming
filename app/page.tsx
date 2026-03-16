'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    setEntering(true);
    setTimeout(() => router.push('/game'), 1400);
  };

  return (
    <motion.div
      className="w-screen h-screen overflow-hidden relative"
      animate={entering ? { opacity: 0 } : {}}
      transition={{ duration: 1.4 }}
    >
      {/* ── Background image — Executive Mansion at dawn ── */}
      <div
        className="absolute inset-0 bhansali-grade"
        style={{
          backgroundImage: "url('/images/bg_mansion_dawn.jpg'), radial-gradient(ellipse at 50% 80%, #2a1205 0%, #0d0804 50%, #000000 100%)",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* ── Bhansali amber-shadow tint ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(18, 8, 2, 0.48)', mixBlendMode: 'multiply' }}
      />

      {/* ── Film grain ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />

      {/* ── Rain overlay ── */}
      <div className="absolute inset-0 rain-overlay opacity-15 pointer-events-none" />

      {/* ── Cinematic vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 15%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.92) 100%)' }}
      />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: '8vh', background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)' }} />
      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '12vh', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }} />

      {/* ── Ambient lamp glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none lamp-glow"
        style={{ background: 'radial-gradient(ellipse, rgba(184,100,8,0.06) 0%, transparent 70%)' }} />

      {/* ── Content ── */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">

        {/* Pre-title */}
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="text-amber-600/55 text-[10px] tracking-[0.55em] uppercase font-sans mb-10"
        >
          Hoover Institution · Wargame Series
        </motion.p>

        {/* Decorative rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="w-64 h-px mb-8"
          style={{ background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.6), transparent)' }}
        />

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.4 }}
          className="text-center mb-4"
        >
          <h1
            className="text-6xl md:text-8xl leading-tight tracking-wider"
            style={{
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif',
              fontWeight: 300,
              color: '#e8d5a8',
              textShadow: '0 2px 40px rgba(184,134,11,0.25), 0 0 80px rgba(0,0,0,0.8)',
              letterSpacing: '0.06em',
            }}
          >
            The White House
          </h1>
          <div className="w-32 h-px mx-auto my-3"
            style={{ background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.5), transparent)' }} />
          <h1
            className="text-5xl md:text-7xl leading-tight tracking-wider"
            style={{
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#c9a84c',
              textShadow: '0 2px 40px rgba(184,134,11,0.35)',
              letterSpacing: '0.04em',
            }}
          >
            and the Archipelago
          </h1>
        </motion.div>

        {/* Gold ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.4, duration: 0.9 }}
          className="flex items-center gap-3 my-7"
        >
          <div className="w-20 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.55))' }} />
          <span style={{ color: 'rgba(184,134,11,0.55)', fontSize: 10 }}>✦</span>
          <span style={{ color: 'rgba(184,134,11,0.35)', fontSize: 10 }}>✦</span>
          <span style={{ color: 'rgba(184,134,11,0.55)', fontSize: 10 }}>✦</span>
          <div className="w-20 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(184,134,11,0.55))' }} />
        </motion.div>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="text-amber-200/35 text-xs tracking-[0.4em] uppercase font-sans mb-3"
        >
          15 October 1898
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.2 }}
          className="text-amber-100/28 text-sm text-center max-w-md mb-12 leading-loose"
          style={{ fontFamily: 'var(--font-im-fell), IM Fell English, Georgia, serif' }}
        >
          You are a White House aide. The President has not decided. The commissioners wait in Paris.
          You have one day to read the evidence, hear the voices, and write the memorandum that will help him be less wrong.
        </motion.p>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          className="relative px-12 py-4 tracking-[0.4em] uppercase text-[11px] font-sans transition-all"
          style={{
            border: '1px solid rgba(184,134,11,0.5)',
            color: '#c9a84c',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <span className="relative z-10">Enter the Mansion</span>
          {/* Corner decorations */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l"
            style={{ borderColor: 'rgba(184,134,11,0.6)' }} />
          <span className="absolute top-0 right-0 w-2 h-2 border-t border-r"
            style={{ borderColor: 'rgba(184,134,11,0.6)' }} />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l"
            style={{ borderColor: 'rgba(184,134,11,0.6)' }} />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r"
            style={{ borderColor: 'rgba(184,134,11,0.6)' }} />
        </motion.button>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-6 text-amber-600/40 text-[9px] tracking-widest uppercase font-sans"
        >
          Based on historical documents · October 1898 · Paris Peace Commission
        </motion.p>
      </div>
    </motion.div>
  );
}
