'use client';
import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per char
  onComplete?: () => void;
  className?: string;
  skipable?: boolean;
}

export function TypewriterText({
  text,
  speed = 22,
  onComplete,
  className = '',
  skipable = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;

    intervalRef.current = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  const skip = () => {
    if (done) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(text);
    setDone(true);
    onComplete?.();
  };

  return (
    <span
      className={`${className} ${!done ? 'typewriter-cursor' : ''}`}
      onClick={skipable ? skip : undefined}
      style={{ cursor: skipable && !done ? 'pointer' : 'default', whiteSpace: 'pre-wrap' }}
    >
      {displayed}
    </span>
  );
}
