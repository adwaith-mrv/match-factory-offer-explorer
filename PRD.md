# PRD: Match Factory! Offer Explorer

Built per The 48-Hour AI Prototype Playbook for PMs, Chapter 2 (Machine-Readable PRD Format). 5 non-negotiable sections from 2.2 expanded as explicit headers below (source template only showed 4 headers as a worked example - departure logged in build-log.md).

## 1. Objective & Scope Boundaries

- Goal: build a standalone web tool that shows, level by level, where a non-paying Match Factory! player's coin balance runs out, and what the game offers at that exact moment - price in INR, and value per coin against the cost of a continue.
- Reads one shared CSV (play_log_schema.csv) - the same file the portfolio-page simulator and the Machinations model read. No duplicated data entry.
- Explicit Non-Goals:
  - No OAuth, no accounts, no backend, no database. Static site, client-side only.
  - No real-money purchase flow of any kind.
  - No Zynga or Match Factory! logos, colors, or brand styling. Title reads as independent analysis by Adwaith V.
  - No dark mode toggle. ASSUMED - single light theme, kept out of scope to hold the 250-line component budget; can be added post-sprint if time allows.
  - No editing or deleting play-log rows from the UI. Read-only against the CSV.
  - No claim of affiliation with Zynga or Peak. No "shipped at Zynga" language anywhere in copy.

## 2. Core State & Data Schema

```typescript
// types.ts

export type OfferType =
  | "continue"
  | "booster_pre_level"
  | "booster_in_level"
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
  livesLeft: number;
  offerShown: boolean;
  offerType: OfferType | null;
  offerPriceInr: number | null;
  eventOrPassUnlocked: string | null;
}

export interface DerivedBalancePoint {
  level: number;
  coinBalance: number;
  isSqueezePoint: boolean; // true where balance first goes negative or hits 0 pre-continue
}

export interface OfferValueRow {
  offerType: OfferType;
  priceInr: number;
  coinsOrValueGranted: number;
  valuePerRupee: number; // coinsOrValueGranted / priceInr
  cheaperThanContinue: boolean; // compared against measured continue coin-cost, converted at the same rate
}
```

## 3. Deterministic Component Tree

- `App.tsx` - main container. Loads `play_log_schema.csv` (via `lib/loadPlayLog.ts`), holds `PlayLogEntry[]` in state, renders `Header`, `BalanceTimeline`, `OfferTable`, `EmptyState`.
- `components/Header.tsx` - title, one-line scope statement ("One account, one player, Indian pricing, first N levels."), link back to the portfolio page.
- `components/BalanceTimeline.tsx` - level-by-level coin balance list/table with the squeeze point highlighted. No chart library (mobile-first, avoids the overflow issue already hit on the portfolio page's simulator) - rendered as a plain scrollable table with a CSS bar per row.
- `components/OfferTable.tsx` - one row per distinct offer type seen in the log: type, price (INR), what it grants, value per rupee, and whether it beats the measured continue cost.
- `components/EmptyState.tsx` - shown when `play_log_schema.csv` has 0 data rows (headers only). Text: "No play-log data yet. Values below are placeholders." Renders scaffold data clearly labeled ASSUMED.
- `lib/loadPlayLog.ts` - fetches and parses the CSV, maps rows to `PlayLogEntry[]`. Returns `[]` on header-only file, never throws.
- `lib/deriveBalance.ts` - pure function: `PlayLogEntry[]` -> `DerivedBalancePoint[]`.
- `lib/deriveOfferValue.ts` - pure function: `PlayLogEntry[]` -> `OfferValueRow[]`.

## 4. Mock Data Fixture

Used only for scaffolding while `play_log_schema.csv` is header-only. Every field below is labeled ASSUMED and gets removed the moment real log rows exist - hard rule 3.

```json
[
  {
    "level": 12,
    "result": "fail",
    "timeLeftSeconds": 0,
    "coinsEarned": 40,
    "coinsSpent": 0,
    "spentOn": "none",
    "livesLeft": 0,
    "offerShown": true,
    "offerType": "continue",
    "offerPriceInr": 10,
    "eventOrPassUnlocked": null,
    "ASSUMED": true
  },
  {
    "level": 12,
    "result": "win",
    "timeLeftSeconds": 8,
    "coinsEarned": 120,
    "coinsSpent": 50,
    "spentOn": "booster",
    "livesLeft": 3,
    "offerShown": false,
    "offerType": null,
    "offerPriceInr": null,
    "eventOrPassUnlocked": null,
    "ASSUMED": true
  },
  {
    "level": 18,
    "result": "fail",
    "timeLeftSeconds": 0,
    "coinsEarned": 0,
    "coinsSpent": 200,
    "spentOn": "lives",
    "livesLeft": 0,
    "offerShown": true,
    "offerType": "coin_bundle",
    "offerPriceInr": 99,
    "eventOrPassUnlocked": null,
    "ASSUMED": true
  }
]
```

## 5. Action & Event Mapping

| User action | Handler | Effect |
|---|---|---|
| Page load | `loadPlayLog()` in `App.tsx` useEffect | Fetches CSV, parses, sets `playLog` state. Empty CSV -> `playLog = []`, `EmptyState` renders with mock fixture, `ASSUMED` badge shown on every row. |
| Row hover/tap on `BalanceTimeline` | `onRowSelect(level)` | Highlights matching row in `OfferTable` if an offer fired at that level. No modal, no navigation. |
| Tap "Back to portfolio" in `Header` | plain `<a>` link | Navigates to the portfolio Match Factory! page. No JS intercept. |

## 6. Strict Constraint Boundaries

- Do not build a login, account system, or any user identity. Single anonymous viewer.
- Do not call any external API. All data is the local CSV, fetched as a static asset.
- Do not hardcode Zynga/Match Factory! wordmarks, icons, or color palette pulled from the live game.
- Do not exceed 250 lines per component, 200 lines per file (Chapter 1.4 / Chapter 3.3 Builder rule).
- Do not invent prices, coin values, or rates outside the CSV or the labeled ASSUMED fixture.

## 7. Acceptance Criteria (deterministic)

- [ ] Loading the app with `play_log_schema.csv` containing 0 data rows renders `EmptyState` with all values visibly tagged `ASSUMED`, no console errors.
- [ ] Loading the app with `play_log_schema.csv` containing >=1 real row renders `BalanceTimeline` with no `ASSUMED` tags anywhere.
- [ ] `BalanceTimeline` marks exactly the first row where derived coin balance is <= 0 as the squeeze point.
- [ ] `OfferTable` lists one row per distinct `offerType` present in the log, sorted by `valuePerRupee` descending.
- [ ] Page renders with no horizontal scroll at 360px viewport width (mobile-first hard rule).
- [ ] No network requests fire except the same-origin fetch of `play_log_schema.csv`.
- [ ] No string in the built output matches `Zynga` or `Peak` (brand-safety check, run via grep before final deploy).
