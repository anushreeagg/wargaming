'use client';
import { useState } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { RoleSelectScreen } from '@/components/game/RoleSelectScreen';
import { BriefingScreen } from '@/components/game/BriefingScreen';

export default function GamePage() {
  const [roleSelected, setRoleSelected] = useState(false);
  const [briefingDone, setBriefingDone] = useState(false);

  if (!roleSelected) {
    return <RoleSelectScreen onSelect={() => setRoleSelected(true)} />;
  }

  if (!briefingDone) {
    return <BriefingScreen onContinue={() => setBriefingDone(true)} />;
  }

  return <GameShell />;
}
