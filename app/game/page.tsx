'use client';
import { useState } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { RoleSelectScreen } from '@/components/game/RoleSelectScreen';

export default function GamePage() {
  const [roleSelected, setRoleSelected] = useState(false);

  if (!roleSelected) {
    return <RoleSelectScreen onSelect={() => setRoleSelected(true)} />;
  }

  return <GameShell />;
}
