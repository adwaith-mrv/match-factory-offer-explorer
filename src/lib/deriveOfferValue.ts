import type { PlayLogEntry, OfferValueRow, OfferType } from "../types";

// Returns the value that appears most often in the array. Falls back to 0.
function mostFrequent(values: number[]): number {
  if (values.length === 0) return 0;
  const freq = new Map<number, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

// Coin cost of a continue = coinsSpent on rows where spentOn="continue".
// This is the "value" that paying INR for a continue substitutes for.
function measureContinueCoinCost(log: PlayLogEntry[]): number {
  const costs = log
    .filter((e) => e.spentOn === "continue" && e.coinsSpent > 0)
    .map((e) => e.coinsSpent);
  return mostFrequent(costs);
}

type OfferEntry = PlayLogEntry & { offerType: OfferType; offerPriceInr: number };

export function deriveOfferValue(log: PlayLogEntry[]): OfferValueRow[] {
  const offerEntries = log.filter(
    (e): e is OfferEntry =>
      e.offerShown && e.offerType !== null && e.offerPriceInr !== null
  );

  if (offerEntries.length === 0) return [];

  const continueCoinCost = measureContinueCoinCost(log);

  // Group by offerType — one output row per distinct type, not per occurrence
  const byType = new Map<OfferType, OfferEntry[]>();
  for (const entry of offerEntries) {
    const group = byType.get(entry.offerType) ?? [];
    group.push(entry);
    byType.set(entry.offerType, group);
  }

  // Baseline rate for cheaperThanContinue comparison.
  // Derived from the continue offer group if it exists in the log.
  let continueValuePerRupee = 0;
  const continueGroup = byType.get("continue");
  if (continueGroup && continueGroup.length > 0) {
    const continuePrice = mostFrequent(continueGroup.map((e) => e.offerPriceInr));
    if (continuePrice > 0 && continueCoinCost > 0) {
      continueValuePerRupee = continueCoinCost / continuePrice;
    }
  }

  const rows: OfferValueRow[] = [];

  for (const [offerType, group] of byType.entries()) {
    // When an offerType appears at multiple prices across the log,
    // modal (most frequent) price is used — the schema has no "purchased" flag
    // so we cannot isolate which price matched an actual purchase.
    const priceInr = mostFrequent(group.map((e) => e.offerPriceInr));

    let coinsOrValueGranted: number;

    if (offerType === "continue") {
      // Paying INR for a continue saves the player continueCoinCost coins.
      coinsOrValueGranted = continueCoinCost;
    } else {
      // For non-continue types, coinsEarned in the offer-shown level is the
      // closest proxy the schema provides for "coins granted". Will be 0 when
      // no purchase is recorded (offer shown but not taken).
      const earned = group.map((e) => e.coinsEarned).filter((v) => v > 0);
      coinsOrValueGranted = earned.length > 0 ? mostFrequent(earned) : 0;
    }

    const valuePerRupee =
      priceInr > 0 && coinsOrValueGranted > 0
        ? coinsOrValueGranted / priceInr
        : 0;

    const cheaperThanContinue =
      continueValuePerRupee > 0 && valuePerRupee > continueValuePerRupee;

    rows.push({ offerType, priceInr, coinsOrValueGranted, valuePerRupee, cheaperThanContinue });
  }

  // PRD §7 AC: sorted by valuePerRupee descending
  return rows.sort((a, b) => b.valuePerRupee - a.valuePerRupee);
}
