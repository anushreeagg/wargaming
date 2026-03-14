'use client';
import { useCallback } from 'react';
import { soundEngine } from '@/lib/audio/soundEngine';

export function useSound() {
  const playHover = useCallback(() => {
    soundEngine?.playHover();
  }, []);

  const playDecision = useCallback(() => {
    soundEngine?.playDecision();
  }, []);

  const playTelegram = useCallback(() => {
    soundEngine?.playTelegram();
  }, []);

  const playPaper = useCallback(() => {
    soundEngine?.playPaper();
  }, []);

  const playDramaticSting = useCallback(() => {
    soundEngine?.playDramaticSting();
  }, []);

  const setEnabled = useCallback((val: boolean) => {
    soundEngine?.setEnabled(val);
  }, []);

  return { playHover, playDecision, playTelegram, playPaper, playDramaticSting, setEnabled };
}
