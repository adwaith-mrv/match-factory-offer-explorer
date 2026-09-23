import type { PlayLogEntry, DerivedBalancePoint } from "../types";

export function deriveBalance(log: PlayLogEntry[]): DerivedBalancePoint[] {
  if (log.length === 0) return [];

  // Sort ascending by level so cumulative sum is correct regardless of CSV row order
  const sorted = [...log].sort((a, b) => a.level - b.level);

  // Collapse multiple entries per level into one net delta before accumulating.
  // A level can have several rows (e.g. fail then win after continue spend).
  const deltaByLevel = new Map<number, number>();
  for (const entry of sorted) {
    const prev = deltaByLevel.get(entry.level) ?? 0;
    deltaByLevel.set(entry.level, prev + entry.coinsEarned - entry.coinsSpent);
  }

  const levels = [...deltaByLevel.keys()].sort((a, b) => a - b);

  const points: DerivedBalancePoint[] = [];
  let running = 0;
  let squeezeMarked = false;

  for (const level of levels) {
    running += deltaByLevel.get(level)!;

    const isSqueezePoint = !squeezeMarked && running <= 0;
    if (isSqueezePoint) squeezeMarked = true;

    points.push({ level, coinBalance: running, isSqueezePoint });
  }

  return points;
}
