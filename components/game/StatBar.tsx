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
    abbr: 'CONF',
    color: '#b8860b',
    icon: '🦅',
  },
  {
    key: 'filipinoEliteSupport' as keyof Stats,
    label: 'Filipino Elite Support',
    abbr: 'ELITE',
    color: '#10b981',
    icon: '🌺',
  },
  {
    key: 'publicJustification' as keyof Stats,
    label: 'Public Justification',
    abbr: 'PUB',
    color: '#6366f1',
    icon: '📰',
  },
  {
    key: 'orderWarRisk' as keyof Stats,
    label: 'Order / War Risk',
    abbr: 'RISK',
    color: '#ef4444',
    icon: '⚔',
  },
];

const MAX = 5;
const MIN = -2;
const RANGE = MAX - MIN;

export function StatBar({ stats }: StatBarProps) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3 bg-black/40 rounded border border-yellow-900/30">
      {STAT_CONFIG.map(cfg => {
        const value = stats[cfg.key];
        const pct = ((value - MIN) / RANGE) * 100;
        const isNegative = value < 0;
        const isHigh = value >= 3;

        return (
          <div key={cfg.key} className="flex items-center gap-2">
            <span className="text-sm w-4 text-center">{cfg.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] tracking-widest uppercase opacity-60 font-sans">
                  {cfg.abbr}
                </span>
                <span
                  className="text-xs font-bold font-sans"
                  style={{ color: isNegative ? '#ef4444' : isHigh ? cfg.color : '#d4a843' }}
                >
                  {value > 0 ? `+${value}` : value}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: isNegative ? '#ef4444' : cfg.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, pct)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
