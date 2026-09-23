import type { PlayLogEntry } from "../types";

// PRD §4 fixture — used ONLY when play_log_schema.csv has 0 data rows.
// Every field is a placeholder. Remove the moment real log rows exist.
export const MOCK_PLAY_LOG: Array<PlayLogEntry & { ASSUMED: true }> = [
  {
    level: 12,
    result: "fail",
    timeLeftSeconds: 0,
    coinsEarned: 40,
    coinsSpent: 0,
    spentOn: "none",
    livesLeft: 0,
    offerShown: true,
    offerType: "continue",
    offerPriceInr: 10,
    eventOrPassUnlocked: null,
    ASSUMED: true,
  },
  {
    level: 12,
    result: "win",
    timeLeftSeconds: 8,
    coinsEarned: 120,
    coinsSpent: 50,
    spentOn: "booster",
    livesLeft: 3,
    offerShown: false,
    offerType: null,
    offerPriceInr: null,
    eventOrPassUnlocked: null,
    ASSUMED: true,
  },
  {
    level: 18,
    result: "fail",
    timeLeftSeconds: 0,
    coinsEarned: 0,
    coinsSpent: 200,
    spentOn: "lives",
    livesLeft: 0,
    offerShown: true,
    offerType: "coin_bundle",
    offerPriceInr: 99,
    eventOrPassUnlocked: null,
    ASSUMED: true,
  },
];
