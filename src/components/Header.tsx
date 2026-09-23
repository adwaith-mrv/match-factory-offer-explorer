import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  /** Distinct level count from the loaded play log. Shown in scope line. */
  levelCount?: number;
}

// Replace with the actual portfolio Match Factory page URL before deploy.
const PORTFOLIO_URL = "/";

export function Header({ levelCount }: HeaderProps) {
  const levelLabel =
    levelCount !== undefined && levelCount > 0
      ? `first ${levelCount} level${levelCount === 1 ? "" : "s"}`
      : "first N levels";

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4">
        <a
          href={PORTFOLIO_URL}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mb-3 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to portfolio
        </a>

        <h1 className="text-xl font-bold text-slate-900 leading-tight">
          Match Factory! Offer Explorer
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          One account, one player, Indian pricing, {levelLabel}.
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Independent analysis by Adwaith V. Not affiliated with or endorsed by
          any game developer or publisher.
        </p>
      </div>
    </header>
  );
}
