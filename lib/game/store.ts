'use client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  Stats,
  StatEffect,
  MemoState,
  MemoThesis,
  MemoTone,
  EndingId,
  SessionState,
  LogEntry,
  GamePhase,
} from './types';
import { getNode } from '@/data/nodes';
import { getEnding } from '@/data/endings';

const INITIAL_STATS: Stats = {
  presidentialConfidence: 0,
  filipinoEliteSupport: 0,
  publicJustification: 0,
  orderWarRisk: 0,
};

const INITIAL_MEMO: MemoState = {
  thesis: null,
  support: [],
  tone: null,
  locked: false,
};

interface GameStore extends SessionState {
  // Navigation
  goToNode: (nodeId: string) => void;
  makeChoice: (optionId: string) => void;

  // Stats
  applyEffects: (effects: StatEffect) => void;

  // Cards
  unlockCard: (cardId: string) => void;
  unlockCards: (cardIds: string[]) => void;
  hasCard: (cardId: string) => boolean;

  // Hub tracking
  visitedScenes: number[];
  markSceneVisited: (scene: number) => void;
  allHubScenesVisited: () => boolean;

  // Memo
  setMemoThesis: (thesis: MemoThesis) => void;
  toggleMemoSupport: (cardId: string) => void;
  setMemoTone: (tone: MemoTone) => void;
  lockMemo: () => void;

  // Endings
  resolveEnding: () => void;

  // Reset
  reset: () => void;

  // Phase
  setPhase: (phase: GamePhase) => void;

  // Free-form argument (for AI evaluation)
  lastFreeFormArgument: string;
  setFreeFormArgument: (text: string) => void;

  // Role selection
  selectedRole: string | null;
  selectRole: (characterId: string) => void;
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    currentNodeId: 'scene0_open',
    stats: { ...INITIAL_STATS },
    unlockedCards: [],
    visitedNodes: [],
    memo: { ...INITIAL_MEMO },
    ending: null,
    sessionLog: [],
    phase: 'opening',
    chosenThesis: null,
    visitedScenes: [],
    lastFreeFormArgument: '',
    selectedRole: null,

    goToNode: (nodeId: string) => {
      set(state => {
        state.currentNodeId = nodeId;
        if (!state.visitedNodes.includes(nodeId)) {
          state.visitedNodes.push(nodeId);
        }
        const node = getNode(nodeId);
        if (node) {
          if (!state.visitedScenes.includes(node.scene)) {
            state.visitedScenes.push(node.scene);
          }
          // Auto-unlock cards on this node
          if (node.unlocksCards) {
            node.unlocksCards.forEach(cardId => {
              if (!state.unlockedCards.includes(cardId)) {
                state.unlockedCards.push(cardId);
              }
            });
          }
        }
      });
    },

    makeChoice: (optionId: string) => {
      const { currentNodeId, applyEffects, unlockCards, goToNode } = get();
      const node = getNode(currentNodeId);
      if (!node?.options) return;

      const option = node.options.find(o => o.id === optionId);
      if (!option) return;

      // Store thesis choice if it's a thesis selection
      const thesisMap: Record<string, MemoThesis> = {
        thesis_a: 'whole_archipelago',
        final_whole: 'whole_archipelago',
        thesis_b: 'protectorate',
        final_protectorate: 'protectorate',
        thesis_c: 'luzon_guarantees',
        final_luzon: 'luzon_guarantees',
        thesis_d: 'conditional_independence',
        final_independence: 'conditional_independence',
        thesis_e: 'delay_guarantees',
        final_delay: 'delay_guarantees',
      };

      if (thesisMap[optionId]) {
        set(state => {
          state.chosenThesis = thesisMap[optionId];
        });
      }

      const entry: LogEntry = {
        nodeId: currentNodeId,
        choiceId: optionId,
        choiceLabel: option.label,
        effects: option.effects,
        timestamp: Date.now(),
      };

      set(state => {
        state.sessionLog.push(entry);
      });

      applyEffects(option.effects);
      if (option.unlocksCards) {
        unlockCards(option.unlocksCards);
      }
      goToNode(option.next);
    },

    applyEffects: (effects: StatEffect) => {
      set(state => {
        const clamp = (v: number) => Math.max(-2, Math.min(5, v));
        if (effects.presidentialConfidence !== undefined)
          state.stats.presidentialConfidence = clamp(
            state.stats.presidentialConfidence + effects.presidentialConfidence
          );
        if (effects.filipinoEliteSupport !== undefined)
          state.stats.filipinoEliteSupport = clamp(
            state.stats.filipinoEliteSupport + effects.filipinoEliteSupport
          );
        if (effects.publicJustification !== undefined)
          state.stats.publicJustification = clamp(
            state.stats.publicJustification + effects.publicJustification
          );
        if (effects.orderWarRisk !== undefined)
          state.stats.orderWarRisk = clamp(
            state.stats.orderWarRisk + effects.orderWarRisk
          );
      });
    },

    unlockCard: (cardId: string) => {
      set(state => {
        if (!state.unlockedCards.includes(cardId)) {
          state.unlockedCards.push(cardId);
        }
      });
    },

    unlockCards: (cardIds: string[]) => {
      set(state => {
        cardIds.forEach(id => {
          if (!state.unlockedCards.includes(id)) {
            state.unlockedCards.push(id);
          }
        });
      });
    },

    hasCard: (cardId: string) => {
      return get().unlockedCards.includes(cardId);
    },

    markSceneVisited: (scene: number) => {
      set(state => {
        if (!state.visitedScenes.includes(scene)) {
          state.visitedScenes.push(scene);
        }
      });
    },

    allHubScenesVisited: () => {
      const { visitedScenes } = get();
      return visitedScenes.includes(2) && visitedScenes.includes(3) && visitedScenes.includes(4);
    },

    setMemoThesis: (thesis: MemoThesis) => {
      set(state => {
        state.memo.thesis = thesis;
        state.chosenThesis = thesis;
      });
    },

    toggleMemoSupport: (cardId: string) => {
      set(state => {
        const idx = state.memo.support.indexOf(cardId);
        if (idx >= 0) {
          state.memo.support.splice(idx, 1);
        } else if (state.memo.support.length < 2) {
          state.memo.support.push(cardId);
        }
      });
    },

    setMemoTone: (tone: MemoTone) => {
      set(state => {
        state.memo.tone = tone;
      });
    },

    lockMemo: () => {
      set(state => {
        state.memo.locked = true;
        state.phase = 'ending';
      });
      get().resolveEnding();
    },

    resolveEnding: () => {
      const { memo, stats } = get();
      if (!memo.thesis) return;
      const ending = getEnding(memo.thesis);
      if (!ending) return;
      set(state => {
        state.ending = ending.id;
      });
    },

    setPhase: (phase: GamePhase) => {
      set(state => {
        state.phase = phase;
      });
    },

    setFreeFormArgument: (text: string) => {
      set(state => {
        state.lastFreeFormArgument = text;
      });
    },

    selectRole: (characterId: string) => {
      // Role-specific starting stat bonuses
      const ROLE_BONUSES: Record<string, StatEffect> = {
        greene:    { presidentialConfidence: 1, orderWarRisk: -1 },
        hay:       { publicJustification: 1, presidentialConfidence: 1 },
        agoncillo: { filipinoEliteSupport: 2, publicJustification: 1 },
        aide:      {},
      };
      const bonus = ROLE_BONUSES[characterId] ?? {};
      set(state => {
        state.selectedRole = characterId;
        const clamp = (v: number) => Math.max(-2, Math.min(5, v));
        if (bonus.presidentialConfidence)
          state.stats.presidentialConfidence = clamp(state.stats.presidentialConfidence + bonus.presidentialConfidence);
        if (bonus.filipinoEliteSupport)
          state.stats.filipinoEliteSupport = clamp(state.stats.filipinoEliteSupport + bonus.filipinoEliteSupport);
        if (bonus.publicJustification)
          state.stats.publicJustification = clamp(state.stats.publicJustification + bonus.publicJustification);
        if (bonus.orderWarRisk)
          state.stats.orderWarRisk = clamp(state.stats.orderWarRisk + (bonus.orderWarRisk ?? 0));
      });
    },

    reset: () => {
      set(state => {
        state.currentNodeId = 'scene0_open';
        state.stats = { ...INITIAL_STATS };
        state.unlockedCards = [];
        state.visitedNodes = [];
        state.memo = { ...INITIAL_MEMO };
        state.ending = null;
        state.sessionLog = [];
        state.phase = 'opening';
        state.chosenThesis = null;
        state.visitedScenes = [];
        state.lastFreeFormArgument = '';
        state.selectedRole = null;
      });
    },
  }))
);
