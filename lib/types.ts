export type Role = "A" | "B";
export type Lang = "id" | "en";
export type FinalChoice = "shutdown" | "preserve" | "split";
export type EndingId =
  | "goodbye"
  | "never-forgets"
  | "one-remains"
  | "first-memory";

export interface Player {
  role: Role;
  joinedAt: number;
  lastSeen: number;
}

export interface PuzzleEntry {
  /** Normalised answer submitted by each side. */
  A?: string;
  B?: string;
  solved?: boolean;
  attempts?: number;
}

export interface RoomSeeds {
  clockMinute: number;
  gearFragments: [number, number, number];
  dialOrder: [number, number, number];
  missingTeeth: number;
  fake: Role;
}

export interface RoomState {
  v: 2;
  createdAt: number;
  /** 0 prologue, 1..5 puzzles, 6 finale, 7 ending. */
  chapter: number;
  players: Partial<Record<Role, Player>>;
  ready: Partial<Record<Role, boolean>>;
  /** Chapter number acknowledged by each player. */
  advance: Partial<Record<Role, number>>;
  puzzles: Record<string, PuzzleEntry>;
  flags: Record<string, boolean>;
  found: Record<Role, string[]>;
  secret: { recordings: string[]; optional: string[] };
  seeds: RoomSeeds;
  finale: {
    choice?: Partial<Record<Role, FinalChoice>>;
    stay?: Role;
  };
  knock: number;
}
