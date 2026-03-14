export interface Stats {
  presidentialConfidence: number; // -2 to +4
  filipinoEliteSupport: number;
  publicJustification: number;
  orderWarRisk: number;
}

export type StatKey = keyof Stats;

export interface StatEffect {
  presidentialConfidence?: number;
  filipinoEliteSupport?: number;
  publicJustification?: number;
  orderWarRisk?: number;
}

export interface DialogueOption {
  id: string;
  label: string;
  subtext?: string;
  effects: StatEffect;
  next: string;
  unlocksCards?: string[];
}

export interface GameNode {
  id: string;
  scene: number;
  speaker: string;
  speakerRole?: string;
  text: string;
  narration?: string;
  options?: DialogueOption[];
  next?: string; // auto-advance if no options
  unlocksCards?: string[];
  background?: BackgroundKey;
  ambience?: AmbienceKey;
}

export type BackgroundKey =
  | 'mansion_dawn'
  | 'desk_morning'
  | 'war_room'
  | 'state_dept'
  | 'desk_afternoon'
  | 'corridor_evening'
  | 'library_night'
  | 'memo_desk';

export type AmbienceKey = 'rain_light' | 'rain_heavy' | 'clock_tick' | 'silence' | 'fire';

export interface PhraseCard {
  id: string;
  text: string;
  source: string; // which character/document it came from
  category: 'thesis' | 'support' | 'tone';
}

export type MemoThesis =
  | 'whole_archipelago'
  | 'protectorate'
  | 'luzon_guarantees'
  | 'conditional_independence'
  | 'delay_guarantees';

export type MemoTone =
  | 'duty_before_appetite'
  | 'prudence_before_sentiment'
  | 'partnership_without_illusion'
  | 'restraint_without_abdication';

export interface MemoState {
  thesis: MemoThesis | null;
  support: string[]; // phrase card IDs, max 2
  tone: MemoTone | null;
  locked: boolean;
}

export type EndingId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Ending {
  id: EndingId;
  title: string;
  subtitle: string;
  trigger: MemoThesis;
  tiebreakerStat: StatKey;
  tiebreakerHigh: EndingVariant;
  tiebreakerLow: EndingVariant;
  historicalGrounding: string;
}

export interface EndingVariant {
  reaction: string; // immediate White House reaction
  narration: string;
  mckinleyLine: string;
  hayLine: string;
  epilogue: string; // historical what-actually-happened
}

export interface Character {
  id: string;
  name: string;
  role: string;
  voice: string;
  portrait: string; // emoji fallback
  photoUrl?: string; // Wikimedia Commons historical photo
  color: string; // tailwind color class
  privateKnowledge: string[]; // what only this character knows
  objectives: string[];
  isPlayable: boolean;
  isAI: boolean;
}

export interface SessionState {
  currentNodeId: string;
  stats: Stats;
  unlockedCards: string[];
  visitedNodes: string[];
  memo: MemoState;
  ending: EndingId | null;
  sessionLog: LogEntry[];
  phase: GamePhase;
  chosenThesis: MemoThesis | null;
}

export type GamePhase =
  | 'opening'
  | 'desk_hub'
  | 'greene_interview'
  | 'state_dept'
  | 'paris_packet'
  | 'corridor'
  | 'mckinley_audience'
  | 'memo_lock'
  | 'ending';

export interface LogEntry {
  nodeId: string;
  choiceId?: string;
  choiceLabel?: string;
  effects?: StatEffect;
  timestamp: number;
}
