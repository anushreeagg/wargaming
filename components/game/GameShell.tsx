'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/game/store';
import { getNode } from '@/data/nodes';
import { MemoThesis } from '@/lib/game/types';
import { BackgroundScene } from './BackgroundScene';
import { ConversationPanel } from './ConversationPanel';
import { StatBar } from './StatBar';
import { PhraseCardDeck } from './PhraseCardDeck';
import { ArchipelagoMap } from './ArchipelagoMap';
import { MemoDraftScreen } from './MemoDraftScreen';
import { EndingCard } from './EndingCard';
import { DecisionBoard } from './DecisionBoard';
import { soundEngine } from '@/lib/audio/soundEngine';

// Nodes that trigger the Decision Board before proceeding
const DECISION_BOARD_TRIGGER = 'scene5_tone_choice';

export function GameShell() {
  const { currentNodeId, stats, phase, ending, setPhase, setMemoThesis, goToNode } = useGameStore();
  const [showDecisionBoard, setShowDecisionBoard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const node = getNode(currentNodeId);

  // Trigger memo phase
  useEffect(() => {
    if (node?.text === 'MEMO_DRAFT_SCREEN' && phase !== 'memo_lock') {
      setPhase('memo_lock');
    }
  }, [node?.text, phase, setPhase]);

  // Trigger Decision Board just before McKinley
  useEffect(() => {
    if (currentNodeId === DECISION_BOARD_TRIGGER) {
      setShowDecisionBoard(true);
    }
  }, [currentNodeId]);

  // Dramatic sting on McKinley entrance
  useEffect(() => {
    if (currentNodeId === 'scene6_mckinley_open') {
      setTimeout(() => soundEngine?.playDramaticSting(), 600);
    }
  }, [currentNodeId]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine?.setEnabled(next);
  };

  const handleDecisionCommit = (thesis: MemoThesis) => {
    setMemoThesis(thesis);
    setShowDecisionBoard(false);
    goToNode('scene6_mckinley_open');
  };

  // ── ENDING ───────────────────────────────────────────────────────────────────
  if (phase === 'ending' && ending) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-zinc-950 via-stone-950 to-black overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-amber-900/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
          <EndingCard />
        </div>
      </div>
    );
  }

  // ── MEMO ─────────────────────────────────────────────────────────────────────
  if (node?.text === 'MEMO_DRAFT_SCREEN' || phase === 'memo_lock') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-amber-950 via-stone-950 to-black overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/8 rounded-full blur-3xl" />
          <div className="absolute top-4 right-4 w-48 z-10">
            <StatBar stats={stats} />
          </div>
          <MemoDraftScreen />
        </div>
      </div>
    );
  }

  // ── DECISION BOARD ───────────────────────────────────────────────────────────
  if (showDecisionBoard) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Lamp glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
          {/* Stat sidebar */}
          <div className="absolute top-4 right-4 w-48 z-10">
            <StatBar stats={stats} />
          </div>
          <DecisionBoard onCommit={handleDecisionCommit} />
        </div>
      </div>
    );
  }

  if (!node || node.text === 'MEMO_DRAFT_SCREEN' || node.text === 'ENDING_SCREEN') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-stone-950">
        <p className="text-amber-400/50 text-sm font-sans">Loading...</p>
      </div>
    );
  }

  const bg = node.background ?? 'desk_morning';
  const ambience = node.ambience;

  // ── MAIN GAME SHELL ──────────────────────────────────────────────────────────
  return (
    <div className="w-full h-screen overflow-hidden">
      <BackgroundScene background={bg} ambience={ambience}>
        <div className="relative w-full h-full flex">

          {/* Left sidebar — stats */}
          <div className="w-52 flex-shrink-0 p-4 flex flex-col gap-4 z-10">
            <div className="mt-12">
              <StatBar stats={stats} />
            </div>
            <div className="text-center">
              <p className="text-amber-500/40 text-[10px] tracking-[0.25em] uppercase font-sans">
                15 Oct 1898
              </p>
              <div className="mt-1 flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: i < Math.floor((node.scene / 7) * 5)
                        ? '#b8860b'
                        : 'rgba(184, 134, 11, 0.2)',
                    }}
                  />
                ))}
              </div>
              <p className="text-amber-600/30 text-[9px] font-sans mt-1">Scene {node.scene} / 7</p>
            </div>
          </div>

          {/* Center — dialogue */}
          <div className="flex-1 flex flex-col justify-end pb-6 px-4 z-10 min-w-0">
            <div className="max-w-xl mx-auto w-full" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <ConversationPanel node={node} />
            </div>
          </div>

          {/* Right sidebar — tools */}
          <div className="w-52 flex-shrink-0 p-4 flex flex-col gap-3 z-10 mt-12">
            <PhraseCardDeck />
            <ArchipelagoMap />
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 px-3 py-2 bg-stone-900/40 border border-stone-700/30 rounded text-xs font-sans tracking-wide transition-all hover:bg-stone-800/60"
              style={{ color: soundEnabled ? 'rgba(180,160,100,0.7)' : 'rgba(120,100,80,0.4)' }}
            >
              <span>{soundEnabled ? '♪' : '♪̸'}</span>
              <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>
            <div className="mt-auto">
              <SceneIndicator scene={node.scene} />
            </div>
          </div>
        </div>
      </BackgroundScene>
    </div>
  );
}

function SceneIndicator({ scene }: { scene: number }) {
  const SCENES = ['Dawn', 'The Desk', 'Greene', 'State Dept.', 'Paris Packet', 'Corridor', "McKinley's Study", 'Memo'];
  return (
    <div className="space-y-1">
      {SCENES.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: i < scene ? '#b8860b' : i === scene ? '#d4a843' : 'rgba(184, 134, 11, 0.15)',
            }}
          />
          <p
            className="text-[10px] font-sans truncate"
            style={{
              color: i < scene ? 'rgba(184,134,11,0.4)' : i === scene ? 'rgba(212,168,67,0.9)' : 'rgba(184,134,11,0.2)',
            }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
