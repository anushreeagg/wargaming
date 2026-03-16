'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Character } from '@/lib/game/types';

interface CharacterPortraitProps {
  character: Character;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const BORDER_COLOR: Record<string, string> = {
  amber: '#b8860b',
  red: '#9b1a1a',
  blue: '#1e40af',
  emerald: '#065f46',
  slate: '#475569',
  zinc: '#71717a',
};

const SIZE_PX = { sm: 44, md: 60, lg: 88 };

export function CharacterPortrait({ character, isSpeaking, size = 'md' }: CharacterPortraitProps) {
  const [imgError, setImgError] = useState(false);
  const px = SIZE_PX[size];
  const borderColor = BORDER_COLOR[character.color] ?? '#b8860b';

  const showPhoto = character.photoUrl && !imgError;

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ width: px, height: px }}
      animate={isSpeaking ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 2.5, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' }}
    >
      {/* Outer glow ring when speaking */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${borderColor}`, boxShadow: `0 0 12px ${borderColor}60` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* Portrait frame — oval shape */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '50%',
          border: `2px solid ${borderColor}`,
          boxShadow: `inset 0 0 8px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)`,
        }}
      >
        {showPhoto ? (
          <div className="relative w-full h-full">
            <Image
              src={character.photoUrl!}
              alt={character.name}
              fill
              sizes={`${px}px`}
              className="object-cover object-top"
              style={{
                // Bhansali portrait look: sepia warmth, slight desaturation, period feel
                filter: 'sepia(45%) contrast(1.12) brightness(0.88) saturate(0.85)',
              }}
              onError={() => setImgError(true)}
              unoptimized
            />
            {/* Chiaroscuro oval vignette */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)',
              }}
            />
          </div>
        ) : (
          /* Emoji fallback */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${borderColor}20` }}
          >
            <span style={{ fontSize: px * 0.45 }}>{character.portrait}</span>
          </div>
        )}
      </div>

      {/* Gold oval frame overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'transparent',
          boxShadow: `inset 0 1px 2px ${borderColor}80, inset 0 -1px 1px rgba(0,0,0,0.3)`,
          borderRadius: '50%',
        }}
      />

      {/* Speaking indicator */}
      {isSpeaking && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 rounded-full"
          style={{
            width: px * 0.22,
            height: px * 0.22,
            backgroundColor: borderColor,
            boxShadow: `0 0 6px ${borderColor}`,
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
