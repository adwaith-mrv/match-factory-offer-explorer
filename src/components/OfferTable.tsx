import { CheckCircle2, TrendingUp } from "lucide-react";
import type { OfferValueRow, OfferType } from "../types";

// OfferValueRow carries no level field — there is no clean mapping from a
// selected level to a specific offer row (multiple levels can show the same
// offer type; an offer type may appear at levels that were never selected).
// Cross-highlight from BalanceTimeline is intentionally skipped here rather
// than force a wrong or misleading highlight. selectedLevel is accepted in
// props so App.tsx stays consistent but it is deliberately unused below.
interface OfferTableProps {
  rows: OfferValueRow[];
  selectedLevel?: number | null;
}

const OFFER_LABELS: Record<OfferType, string> = {
  continue: "Continue",
  booster_pre_level_tutorial_use: "Pre-level Booster (Tutorial)",
  booster_in_level_locked: "In-level Booster (Locked)",
  booster_in_level_unlocked_tutorial_use: "In-level Booster (Tutorial)",
  booster_in_level_unlocked_unused: "In-level Booster (Unused)",
  booster_in_level_unlocked_infinite_use: "In-level Booster (∞ Use)",
  booster_chiefs_tool_unlocked_tutorial_use: "Chief's Tool (Tutorial)",
  coin_bundle: "Coin Bundle",
  piggy_bank: "Piggy Bank",
  pass: "Pass",
  event: "Event",
};

function BeatsBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300 whitespace-nowrap">
      <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
      beats continue
    </span>
  );
}

function RankDot({ rank }: { rank: number }) {
  if (rank > 3) return null;
  const colors = ["bg-amber-400", "bg-slate-400", "bg-orange-300"];
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[rank - 1]} mr-1.5 shrink-0`}
      aria-label={`Rank ${rank}`}
    />
  );
}

function OfferRow({
  row,
  rank,
}: {
  row: OfferValueRow;
  rank: number;
}) {
  const { offerType, priceInr, valuePerRupee, cheaperThanContinue } = row;

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      {/* Offer type */}
      <td className="py-2.5 pl-3 pr-2">
        <span className="inline-flex items-center text-sm text-slate-800">
          <RankDot rank={rank} />
          {OFFER_LABELS[offerType] ?? offerType}
        </span>
      </td>

      {/* Price */}
      <td className="py-2.5 px-2 text-sm font-mono tabular-nums text-slate-700 whitespace-nowrap">
        {priceInr > 0 ? `₹${priceInr}` : "—"}
      </td>

      {/* Value per rupee */}
      <td className="py-2.5 px-2 text-sm font-mono tabular-nums text-slate-700 whitespace-nowrap">
        {valuePerRupee > 0 ? valuePerRupee.toFixed(1) : "—"}
      </td>

      {/* Beats continue badge */}
      <td className="py-2.5 pl-2 pr-3">
        {cheaperThanContinue && <BeatsBadge />}
      </td>
    </tr>
  );
}

function EmptyOffers() {
  return (
    <p className="px-4 py-6 text-sm text-slate-400 text-center">
      No offers recorded yet.
    </p>
  );
}

export function OfferTable({ rows }: OfferTableProps) {
  return (
    <section className="w-full">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-slate-400 shrink-0" />
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Offer Value Breakdown
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyOffers />
      ) : (
        /* overflow-x-auto scoped to table wrapper — page body never scrolls horizontally */
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[300px] border-collapse text-left"
            aria-label="Offer value breakdown"
          >
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-1.5 pl-3 pr-2 text-xs font-medium text-slate-500">
                  Offer
                </th>
                <th className="py-1.5 px-2 text-xs font-medium text-slate-500 whitespace-nowrap">
                  Price
                </th>
                <th className="py-1.5 px-2 text-xs font-medium text-slate-500 whitespace-nowrap">
                  Coins/₹
                </th>
                <th className="py-1.5 pl-2 pr-3 text-xs font-medium text-slate-500">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <OfferRow key={row.offerType} row={row} rank={i + 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
