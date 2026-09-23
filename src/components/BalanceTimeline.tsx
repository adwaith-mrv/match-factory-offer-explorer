import { AlertTriangle } from "lucide-react";
import type { DerivedBalancePoint } from "../types";

interface BalanceTimelineProps {
  points: DerivedBalancePoint[];
  selectedLevel?: number | null;
  onRowSelect?: (level: number) => void;
}

function BalanceBar({
  balance,
  max,
  isSqueezePoint,
}: {
  balance: number;
  max: number;
  isSqueezePoint: boolean;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (balance / max) * 100)) : 0;

  return (
    <div className="h-3 w-full rounded bg-slate-100 overflow-hidden">
      {pct > 0 && (
        <div
          className={`h-full rounded ${isSqueezePoint ? "bg-red-400" : "bg-emerald-400"}`}
          style={{ width: `${pct}%` }}
        />
      )}
    </div>
  );
}

function SqueezeLabel() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1.5 rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-red-100 text-red-700 border border-red-300 leading-none">
      <AlertTriangle className="h-2.5 w-2.5" />
      squeeze
    </span>
  );
}

function TimelineRow({
  point,
  max,
  isSelected,
  onRowSelect,
}: {
  point: DerivedBalancePoint;
  max: number;
  isSelected: boolean;
  onRowSelect?: (level: number) => void;
}) {
  const { level, coinBalance, isSqueezePoint } = point;

  const rowClass = [
    "group cursor-pointer select-none transition-colors",
    isSqueezePoint
      ? "bg-red-50 border-l-4 border-red-400"
      : "border-l-4 border-transparent",
    isSelected && !isSqueezePoint ? "bg-blue-50 border-l-4 border-blue-400" : "",
    isSelected && isSqueezePoint ? "bg-red-100" : "",
    !isSqueezePoint && !isSelected ? "hover:bg-slate-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr
      className={rowClass}
      onClick={() => onRowSelect?.(level)}
      role="row"
      aria-selected={isSelected}
    >
      {/* Level */}
      <td className="py-2 pl-3 pr-2 text-sm font-mono text-slate-700 whitespace-nowrap w-12">
        {level}
      </td>

      {/* Balance */}
      <td className="py-2 px-2 whitespace-nowrap w-24">
        <span
          className={`text-sm font-mono tabular-nums ${
            coinBalance <= 0 ? "text-red-600 font-semibold" : "text-slate-800"
          }`}
        >
          {coinBalance.toLocaleString()}
        </span>
        {isSqueezePoint && <SqueezeLabel />}
      </td>

      {/* Bar */}
      <td className="py-2 pl-2 pr-4 w-full">
        <BalanceBar
          balance={coinBalance}
          max={max}
          isSqueezePoint={isSqueezePoint}
        />
      </td>
    </tr>
  );
}

export function BalanceTimeline({
  points,
  selectedLevel,
  onRowSelect,
}: BalanceTimelineProps) {
  if (points.length === 0) return null;

  const max = Math.max(...points.map((p) => p.coinBalance), 1);

  return (
    <section className="w-full">
      <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Coin Balance by Level
      </h2>

      {/* overflow-x-auto scoped to table wrapper only — page body never scrolls horizontally */}
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[280px] border-collapse text-left"
          role="grid"
          aria-label="Coin balance per level"
        >
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-1.5 pl-3 pr-2 text-xs font-medium text-slate-500 w-12">
                Lvl
              </th>
              <th className="py-1.5 px-2 text-xs font-medium text-slate-500 w-24">
                Balance
              </th>
              <th className="py-1.5 pl-2 pr-4 text-xs font-medium text-slate-500">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {points.map((point) => (
              <TimelineRow
                key={point.level}
                point={point}
                max={max}
                isSelected={selectedLevel === point.level}
                onRowSelect={onRowSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
