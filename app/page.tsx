'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    setEntering(true);
    setTimeout(() => router.push('/game'), 1200);
  };

  return (
    <motion.div
      className="w-screen h-screen overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1c1208 0%, #0a0804 60%, #000000 100%)' }}
      animate={entering ? { opacity: 0 } : {}}
      transition={{ duration: 1.2 }}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-700/6 rounded-full blur-3xl lamp-glow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-800/4 rounded-full blur-3xl" />
      </div>

      {/* Rain overlay */}
      <div className="absolute inset-0 rain-overlay opacity-20 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">

        {/* Pre-title */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-amber-600/50 text-[11px] tracking-[0.6em] uppercase font-sans mb-8"
        >
          Hoover Institution · Wargame Series
        </motion.p>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="text-center mb-4"
        >
          <h1 className="text-5xl md:text-7xl text-amber-200 font-serif leading-tight tracking-wide">
            The White House
          </h1>
          <h1 className="text-5xl md:text-7xl text-amber-400 font-serif leading-tight tracking-wide">
            and the Archipelago
          </h1>
        </motion.div>

        {/* Gold line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-48 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-6"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-amber-200/40 text-sm italic text-center max-w-md mb-2"
        >
          15 October 1898
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 1 }}
          className="text-amber-100/30 text-sm text-center max-w-lg mb-12 leading-relaxed"
        >
          You are a White House aide. The President has not decided. The commissioners wait in Paris.
          You have one day to read the evidence, hear the voices, and write the memorandum that will help him be less wrong.
        </motion.p>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          className="px-10 py-4 border border-amber-700/60 rounded text-amber-300 tracking-[0.3em] uppercase text-sm font-sans hover:bg-amber-900/20 transition-all relative group"
        >
          <span className="relative z-10">Enter the Mansion</span>
          <motion.div
            className="absolute inset-0 bg-amber-800/10 rounded"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </motion.button>

        {/* Character teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-16 flex gap-8 items-center"
        >
          {[
            { icon: '⚔', name: 'Greene', note: 'Annexation' },
            { icon: '🎩', name: 'Hay', note: 'Paris' },
            { icon: '🌺', name: 'Agoncillo', note: 'Manila' },
            { icon: '🦅', name: 'McKinley', note: 'The Decider' },
          ].map(c => (
            <div key={c.name} className="text-center">
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="text-amber-400/50 text-[10px] tracking-wide font-sans">{c.name}</p>
              <p className="text-amber-600/30 text-[9px] font-sans">{c.note}</p>
            </div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-6 text-amber-600/40 text-[10px] tracking-widest uppercase font-sans"
        >
          Based on historical documents · October 1898 · Paris Peace Commission
        </motion.p>
      </div>
    </motion.div>
  );
}
