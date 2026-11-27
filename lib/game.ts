import { buildStages } from "./story";
import type { RoomSeeds, RoomState, Role } from "./types";

export const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const MAX_CHAPTER = 7;
export const PUZZLE_CHAPTERS = [1, 2, 3, 4, 5];

const GEAR_SETS: Record<number, [number, number, number]> = {
  47: [10, 25, 12],
  53: [12, 29, 12],
  58: [12, 31, 15],
  59: [13, 30, 16],
};

export function randomRoomCode(length = 5): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ROOM_ALPHABET[Math.floor(Math.random() * ROOM_ALPHABET.length)];
  }
  return out;
}

export function partnerOf(role: Role): Role {
  return role === "A" ? "B" : "A";
}

export function bothPresent(state: RoomState): boolean {
  return Boolean(state.players.A && state.players.B);
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function makeSeeds(): RoomSeeds {
  const clockMinute = pick([47, 53, 58, 59]);
  return {
    clockMinute,
    gearFragments: GEAR_SETS[clockMinute],
    dialOrder: shuffled([1, 2, 3]) as [number, number, number],
    missingTeeth: pick([3, 4, 5]),
    fake: pick(["A", "B"] as Role[]),
  };
}

export function createRoomState(): RoomState {
  return {
    v: 2,
    createdAt: Date.now(),
    chapter: 0,
    players: {},
    ready: {},
    advance: {},
    puzzles: {},
    flags: {},
    found: { A: [], B: [] },
    secret: { recordings: [], optional: [] },
    seeds: makeSeeds(),
    finale: {},
    knock: 0,
  };
}

/** Old rooms and partial patches are normalised before they reach the UI. */
export function normalizeState(raw: unknown): RoomState | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Partial<RoomState>;
  const fresh = createRoomState();
  const seeds = source.seeds ?? fresh.seeds;
  const safeSeeds: RoomSeeds = {
    clockMinute: GEAR_SETS[seeds.clockMinute] ? seeds.clockMinute : 58,
    gearFragments:
      Array.isArray(seeds.gearFragments) && seeds.gearFragments.length === 3
        ? (seeds.gearFragments as [number, number, number])
        : GEAR_SETS[58],
    dialOrder:
      Array.isArray(seeds.dialOrder) && seeds.dialOrder.length === 3
        ? (seeds.dialOrder as [number, number, number])
        : [1, 2, 3],
    missingTeeth: [3, 4, 5].includes(seeds.missingTeeth)
      ? seeds.missingTeeth
      : 3,
    fake: seeds.fake === "B" ? "B" : "A",
  };

  return {
    v: 2,
    createdAt: typeof source.createdAt === "number" ? source.createdAt : Date.now(),
    chapter:
      typeof source.chapter === "number"
        ? Math.max(0, Math.min(MAX_CHAPTER, source.chapter))
        : 0,
    players: source.players ?? {},
    ready: source.ready ?? {},
    advance: source.advance ?? {},
    puzzles: source.puzzles ?? {},
    flags: source.flags ?? {},
    found: {
      A: Array.isArray(source.found?.A) ? source.found.A : [],
      B: Array.isArray(source.found?.B) ? source.found.B : [],
    },
    secret: {
      recordings: Array.isArray(source.secret?.recordings)
        ? source.secret.recordings
        : [],
      optional: Array.isArray(source.secret?.optional)
        ? source.secret.optional
        : [],
    },
    seeds: safeSeeds,
    finale: source.finale ?? {},
    knock: typeof source.knock === "number" ? source.knock : 0,
  };
}

export function chapterSolved(state: RoomState, chapter: number): boolean {
  const stages = buildStages(state).filter((stage) => stage.chapter === chapter);
  if (stages.length === 0) return false;
  return stages.every((stage) => state.puzzles[stage.id]?.solved === true);
}

export function accepted(answer: string | undefined, options: string[]): boolean {
  if (!answer) return false;
  return options.includes(answer);
}

/** Tolerant comparison: case, punctuation and extra whitespace do not matter. */
export function normaliseAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}
