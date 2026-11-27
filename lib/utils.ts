export type Path = (string | number)[];

/** Immutable deep set used for optimistic local updates. */
export function applyPath<T>(input: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;

  if (Array.isArray(input)) {
    const copy = input.slice();
    const index = Number(head);
    copy[index] = applyPath(copy[index], rest, value);
    return copy as unknown as T;
  }

  const source = (input ?? {}) as Record<string, unknown>;
  return {
    ...source,
    [head]: applyPath(source[head as string], rest, value),
  } as T;
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const ROMAN: Array<[number, string]> = [
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function romanize(value: number): string {
  let n = Math.max(1, Math.min(9, Math.floor(value)));
  let out = "";
  for (const [amount, glyph] of ROMAN) {
    while (n >= amount) {
      out += glyph;
      n -= amount;
    }
  }
  return out;
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatClock(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function codeKey(code: string): string {
  return `rc:${code}`;
}

export function roleKey(code: string): string {
  return `rc:role:${code}`;
}

export function langKey(): string {
  return "rc:lang";
}
