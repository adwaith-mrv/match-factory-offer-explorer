# play_log_schema.csv - column reference

Single source of truth for 3 artifacts: this Offer Explorer, the portfolio-page coin-squeeze simulator, the Machinations model. One row per level attempt.

| Column | Type | Values | Notes |
|---|---|---|---|
| level | integer | 1, 2, 3... | level number attempted |
| result | string | `win` \| `fail` | outcome of that attempt |
| timeLeftSeconds | integer | >= 0 | timer seconds remaining at win; 0 on fail if timer ran out |
| coinsEarned | integer | >= 0 | coins gained this attempt (win reward, event, etc) |
| coinsSpent | integer | >= 0 | coins spent this attempt |
| spentOn | string | `continue` \| `booster` \| `lives` \| `none` | what coinsSpent went to |
| livesLeft | integer | >= 0 | lives remaining after this attempt |
| offerShown | boolean | `true` \| `false` | whether a paid offer appeared |
| offerType | string or empty | `continue` \| `booster_pre_level` \| `booster_in_level` \| `coin_bundle` \| `piggy_bank` \| `pass` \| `event` | empty if offerShown = false |
| offerPriceInr | number or empty | e.g. `99` | INR price shown, empty if no offer |
| eventOrPassUnlocked | string or empty | free text | name of any event/pass that unlocked this attempt |

**Departure logged:** header casing changed from snake_case (original doc) to camelCase - Builder (Chapter 3.3) wrote `loadPlayLog.ts` and `public/play_log_schema.csv` in camelCase to match `PlayLogEntry` field names directly, no mapping layer. This doc updated to match the shipped reality. If the portfolio-page simulator or Machinations model were already built against snake_case, they need this same rename before they can share the CSV.

Rules:
- One account, one player, Indian pricing only.
- No fabricated rows. Header-only file is valid and expected until the play log lands (Playbook Chapter 4 fallback path).
- All 3 consuming artifacts read this exact header order - do not reorder or rename columns without updating all 3.
