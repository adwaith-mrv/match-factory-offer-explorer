export type OfferType =
  | "continue"
  | "booster_pre_level_tutorial_use"
  | "booster_in_level_locked"
  | "booster_in_level_unlocked_tutorial_use"
  | "booster_in_level_unlocked_unused"
  | "booster_in_level_unlocked_infinite_use"
  | "booster_chiefs_tool_unlocked_tutorial_use"
  | "coin_bundle"
  | "piggy_bank"
  | "pass"
  | "event";

export interface PlayLogEntry {
  level: number;
  result: "win" | "fail";
  timeLeftSeconds: number;
  coinsEarned: number;
  coinsSpent: number;
  spentOn: "continue" | "booster" | "lives" | "none";
  livesLeft: number | "infinite";
  offerShown: boolean;
  offerType: OfferType | null;
  offerPriceInr: number | null;
  eventOrPassUnlocked: string | null;
}

export interface DerivedBalancePoint {
  level: number;
  coinBalance: number;
  isSqueezePoint: boolean;
}

export interface OfferValueRow {
  offerType: OfferType;
  priceInr: number;
  coinsOrValueGranted: number;
  valuePerRupee: number;
  cheaperThanContinue: boolean;
}

export interface AppState {
  playLog: PlayLogEntry[];
  selectedLevel: number | null;
  isLoading: boolean;
  parseError: string | null;
}
