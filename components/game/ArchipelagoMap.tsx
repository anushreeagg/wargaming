'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game/store';

const MAP_REGIONS = [
  {
    id: 'luzon',
    label: 'Luzon',
    position: { top: '15%', left: '45%' },
    size: 'w-8 h-10',
    color: '#b8860b',
    note: 'Largest island. Manila harbor. Aguinaldo\'s stronghold. Greene argues keeping only Luzon invites future intervention.',
  },
  {
    id: 'manila',
    label: 'Manila',
    position: { top: '28%', left: '43%' },
    size: 'w-3 h-3',
    color: '#ef4444',
    note: 'Key harbor. US naval position since May 1898. Dewey\'s fleet is here. Strategic anchor of any American foothold.',
  },
  {
    id: 'visayas',
    label: 'Visayas',
    position: { top: '45%', left: '50%' },
    size: 'w-10 h-6',
    color: '#6366f1',
    note: 'Central islands. Divided leadership. Foreman warns these would declare separately from any unified Filipino government.',
  },
  {
    id: 'mindanao',
    label: 'Mindanao',
    position: { top: '62%', left: '48%' },
    size: 'w-12 h-8',
    color: '#10b981',
    note: 'Southern island. Muslim populations with distinct political traditions. Would not automatically follow Aguinaldo.',
  },
  {
    id: 'germany',
    label: 'German Fleet',
    position: { top: '20%', left: '20%' },
    size: 'w-4 h-4',
    color: '#6b7280',
    note: 'German ships observed Manila harbor during the battle. Hay warns: it is a poor moment to create a vacuum and call it principle.',
  },
  {
    id: 'paris',
    label: 'Paris (Treaty)',
    position: { top: '5%', left: '5%' },
    size: 'w-4 h-4',
    color: '#d4a843',
    note: 'Where the commissioners negotiate. Any recommendation must survive contact with European great powers.',
  },
];

export function ArchipelagoMap() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { stats } = useGameStore();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-900/20 border border-blue-800/30 rounded text-xs text-blue-400 hover:bg-blue-900/40 transition-all font-sans tracking-wide"
      >
        <span>🗺</span>
        <span>Archipelago</span>
      </button>

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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-stone-900 border border-amber-800/40 rounded-lg w-full max-w-2xl mx-4 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-amber-900/30 flex justify-between items-center">
                <div>
                  <h3 className="text-amber-300 font-semibold">The Philippine Archipelago</h3>
                  <p className="text-amber-600/50 text-xs font-sans mt-0.5">October 1898 — Stakes at a glance</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-amber-600 hover:text-amber-400 text-lg">×</button>
              </div>

              <div className="flex gap-4 p-5">
                {/* Map */}
                <div className="relative bg-blue-950/50 rounded border border-blue-900/30 flex-1" style={{ height: 300 }}>
                  {/* Ocean texture */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #1e3a5f 0, #1e3a5f 1px, transparent 0, transparent 50%)',
                      backgroundSize: '8px 8px',
                    }}
                  />

                  {/* Pacific label */}
                  <p className="absolute top-1/2 left-4 -translate-y-1/2 text-blue-400/20 text-xs tracking-widest uppercase font-sans rotate-90">
                    Pacific
                  </p>

                  {MAP_REGIONS.map(region => (
                    <motion.button
                      key={region.id}
                      className={`absolute ${region.size} rounded-sm flex items-center justify-center cursor-pointer`}
                      style={{
                        top: region.position.top,
                        left: region.position.left,
                        backgroundColor: region.color + '60',
                        border: `1px solid ${region.color}80`,
                      }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      onHoverStart={() => setHovered(region.id)}
                      onHoverEnd={() => setHovered(null)}
                    >
                      <span className="text-[8px] text-white/80 font-sans font-bold leading-none text-center px-0.5">
                        {region.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Info panel */}
                <div className="w-48 flex flex-col">
                  <AnimatePresence mode="wait">
                    {hovered ? (
                      <motion.div
                        key={hovered}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-amber-950/30 border border-amber-800/20 rounded p-3 flex-1"
                      >
                        <p className="text-amber-300 font-semibold text-sm mb-2">
                          {MAP_REGIONS.find(r => r.id === hovered)?.label}
                        </p>
                        <p className="text-amber-100/70 text-xs leading-relaxed">
                          {MAP_REGIONS.find(r => r.id === hovered)?.note}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex items-center justify-center"
                      >
                        <p className="text-amber-600/30 text-xs italic text-center">
                          Hover a region to read its strategic significance
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Current stats mini */}
                  <div className="mt-3 space-y-1">
                    <p className="text-amber-600/50 text-[10px] tracking-widest uppercase font-sans">Current Stakes</p>
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-amber-400/60">Confidence</span>
                      <span className="text-amber-300">{stats.presidentialConfidence > 0 ? '+' : ''}{stats.presidentialConfidence}</span>
                    </div>
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-emerald-400/60">Filipino Support</span>
                      <span className="text-emerald-300">{stats.filipinoEliteSupport > 0 ? '+' : ''}{stats.filipinoEliteSupport}</span>
                    </div>
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-red-400/60">War Risk</span>
                      <span className="text-red-300">{stats.orderWarRisk > 0 ? '+' : ''}{stats.orderWarRisk}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
