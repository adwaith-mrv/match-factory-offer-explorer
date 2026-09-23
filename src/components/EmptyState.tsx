import { AlertCircle } from "lucide-react";
import type { PlayLogEntry, OfferType } from "../types";
import { MOCK_PLAY_LOG } from "../fixtures/mockPlayLog";

function AssumedBadge() {
  return (
    <span className="inline-flex items-center rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 border border-amber-300 ml-1 leading-none">
      assumed
    </span>
  );
}

function Val({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-baseline flex-wrap gap-x-0.5">
      <span className="font-mono text-sm">{String(children)}</span>
      <AssumedBadge />
    </span>
  );
}

function ResultPill({ result }: { result: "win" | "fail" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        result === "win"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {result.toUpperCase()}
      <AssumedBadge />
    </span>
  );
}

function OfferLine({
  offerShown,
  offerType,
  offerPriceInr,
}: {
  offerShown: boolean;
  offerType: OfferType | null;
  offerPriceInr: number | null;
}) {
  if (!offerShown) {
    return (
      <Row label="Offer">
        <Val>none</Val>
      </Row>
    );
  }
  return (
    <Row label="Offer">
      <span className="inline-flex items-baseline flex-wrap gap-x-1">
        <span className="font-mono text-sm">{offerType ?? "—"}</span>
        {offerPriceInr !== null && (
          <span className="font-mono text-sm text-slate-500">
            @ ₹{offerPriceInr}
          </span>
        )}
        <AssumedBadge />
      </span>
    </Row>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500 shrink-0 w-28">{label}</span>
      <span className="text-right min-w-0">{children}</span>
    </div>
  );
}

function EntryCard({ entry }: { entry: PlayLogEntry }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-700">
          Level <Val>{entry.level}</Val>
        </span>
        <ResultPill result={entry.result} />
      </div>
      <div className="px-4 py-1">
        <Row label="Time left (s)">
          <Val>{entry.timeLeftSeconds}</Val>
        </Row>
        <Row label="Coins earned">
          <Val>{entry.coinsEarned}</Val>
        </Row>
        <Row label="Coins spent">
          <Val>{entry.coinsSpent}</Val>
        </Row>
        <Row label="Spent on">
          <Val>{entry.spentOn}</Val>
        </Row>
        <Row label="Lives left">
          <Val>{entry.livesLeft}</Val>
        </Row>
        <OfferLine
          offerShown={entry.offerShown}
          offerType={entry.offerType}
          offerPriceInr={entry.offerPriceInr}
        />
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800 leading-snug">
          No play-log data yet. Values below are placeholders.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_PLAY_LOG.map((entry, i) => (
          <EntryCard key={`${entry.level}-${i}`} entry={entry} />
        ))}
      </div>
    </div>
  );
}
