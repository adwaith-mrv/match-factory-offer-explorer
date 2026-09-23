import { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import type { AppState } from "./types";
import { loadPlayLog } from "./lib/loadPlayLog";
import { deriveBalance } from "./lib/deriveBalance";
import { deriveOfferValue } from "./lib/deriveOfferValue";
import { Header } from "./components/Header";
import { BalanceTimeline } from "./components/BalanceTimeline";
import { OfferTable } from "./components/OfferTable";
import { EmptyState } from "./components/EmptyState";

const INITIAL_STATE: AppState = {
  playLog: [],
  selectedLevel: null,
  isLoading: true,
  parseError: null,
};

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Loading play log…</span>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mx-4 mt-4 flex gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    loadPlayLog().then((entries) => {
      if (cancelled) return;
      setState({
        playLog: entries,
        selectedLevel: null,
        isLoading: false,
        parseError: null,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const { playLog, selectedLevel, isLoading, parseError } = state;

  const balancePoints = useMemo(
    () => (playLog.length > 0 ? deriveBalance(playLog) : []),
    [playLog]
  );

  const offerRows = useMemo(
    () => (playLog.length > 0 ? deriveOfferValue(playLog) : []),
    [playLog]
  );

  const distinctLevelCount = useMemo(
    () => new Set(playLog.map((e) => e.level)).size,
    [playLog]
  );

  function handleRowSelect(level: number) {
    setState((prev) => ({
      ...prev,
      selectedLevel: prev.selectedLevel === level ? null : level,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl w-full">
        <Header levelCount={distinctLevelCount > 0 ? distinctLevelCount : undefined} />

        {isLoading && <LoadingScreen />}

        {!isLoading && parseError && <ErrorBanner message={parseError} />}

        {!isLoading && !parseError && playLog.length === 0 && <EmptyState />}

        {!isLoading && !parseError && playLog.length > 0 && (
          <main className="divide-y divide-slate-200">
            <BalanceTimeline
              points={balancePoints}
              selectedLevel={selectedLevel}
              onRowSelect={handleRowSelect}
            />
            <OfferTable rows={offerRows} selectedLevel={selectedLevel} />
          </main>
        )}
      </div>
    </div>
  );
}
