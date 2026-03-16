'use client';
import { motion } from 'framer-motion';
import { Stats } from '@/lib/game/types';

interface StatBarProps {
  stats: Stats;
}

const STAT_CONFIG = [
  {
    key: 'presidentialConfidence' as keyof Stats,
    label: 'Presidential Confidence',
    color: '#b8860b',
  },
  {
    key: 'filipinoEliteSupport' as keyof Stats,
    label: 'Filipino Support',
    color: '#10b981',
  },
  {
    key: 'publicJustification' as keyof Stats,
    label: 'Public Justification',
    color: '#6366f1',
  },
  {
    key: 'orderWarRisk' as keyof Stats,
    label: 'War Risk',
    color: '#ef4444',
  },
];

const MAX = 5;
const MIN = -2;
const RANGE = MAX - MIN;

export function StatBar({ stats }: StatBarProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(184,134,11,0.2)' }}>
      <p className="text-[11px] tracking-[0.25em] uppercase font-sans text-amber-500/70 mb-1">Situation</p>
      {STAT_CONFIG.map(cfg => {
        const value = stats[cfg.key];
        const pct = ((value - MIN) / RANGE) * 100;
        const isNegative = value < 0;
        const isHigh = value >= 3;

        return (
          <div key={cfg.key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-sans text-amber-200/75">{cfg.label}</span>
              <span
                className="text-sm font-bold font-sans"
                style={{ color: isNegative ? '#ef4444' : isHigh ? cfg.color : '#d4a843' }}
              >
                {value > 0 ? `+${value}` : value}
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: isNegative ? '#ef4444' : cfg.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, pct)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
