import Papa from "papaparse";
import type { PlayLogEntry, OfferType } from "../types";

const OFFER_TYPES = new Set<OfferType>([
  "continue",
  "booster_pre_level_tutorial_use",
  "booster_in_level_locked",
  "booster_in_level_unlocked_tutorial_use",
  "booster_in_level_unlocked_unused",
  "booster_in_level_unlocked_infinite_use",
  "booster_chiefs_tool_unlocked_tutorial_use",
  "coin_bundle",
  "piggy_bank",
  "pass",
  "event",
]);

const SPENT_ON_VALUES = new Set(["continue", "booster", "lives", "none"]);

function isOfferType(value: unknown): value is OfferType {
  return typeof value === "string" && OFFER_TYPES.has(value as OfferType);
}

function parseNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}

function parseResult(value: unknown): "win" | "fail" {
  return value === "win" ? "win" : "fail";
}

function parseSpentOn(
  value: unknown
): "continue" | "booster" | "lives" | "none" {
  return typeof value === "string" && SPENT_ON_VALUES.has(value)
    ? (value as "continue" | "booster" | "lives" | "none")
    : "none";
}

function parseNullableString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function parseNullableNum(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseNullableOfferType(value: unknown): OfferType | null {
  return isOfferType(value) ? value : null;
}

type RawRow = Record<string, unknown>;

function mapRow(raw: RawRow): PlayLogEntry | null {
  const level = parseNum(raw["level"]);
  if (level === 0 && raw["level"] !== 0 && raw["level"] !== "0") return null;

  return {
    level,
    result: parseResult(raw["result"]),
    timeLeftSeconds: parseNum(raw["timeLeftSeconds"]),
    coinsEarned: parseNum(raw["coinsEarned"]),
    coinsSpent: parseNum(raw["coinsSpent"]),
    spentOn: parseSpentOn(raw["spentOn"]),
    livesLeft: raw["livesLeft"] === "infinite" ? "infinite" : parseNum(raw["livesLeft"]),
    offerShown: parseBool(raw["offerShown"]),
    offerType: parseNullableOfferType(raw["offerType"]),
    offerPriceInr: parseNullableNum(raw["offerPriceInr"]),
    eventOrPassUnlocked: parseNullableString(raw["eventOrPassUnlocked"]),
  };
}

export async function loadPlayLog(csvPath = "/play_log_schema.csv"): Promise<PlayLogEntry[]> {
  let text: string;

  try {
    const res = await fetch(csvPath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
  } catch {
    return [];
  }

  return new Promise((resolve) => {
    Papa.parse<RawRow>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete(results) {
        if (!results.data || results.data.length === 0) {
          resolve([]);
          return;
        }

        const entries: PlayLogEntry[] = [];
        for (const raw of results.data) {
          // Skip ASSUMED fixture rows if they somehow land in the real CSV
          if (raw["ASSUMED"] === "true" || raw["ASSUMED"] === true) continue;
          const entry = mapRow(raw);
          if (entry !== null) entries.push(entry);
        }

        resolve(entries);
      },
      error() {
        resolve([]);
      },
    });
  });
}
