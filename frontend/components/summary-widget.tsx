import React from "react";

interface SummaryWidgetProps {
  total: number;
  completed: number;
  processing: number;
  failed: number;
  isLoading?: boolean;
}

export function SummaryWidget({ total, completed, processing, failed, isLoading = false }: SummaryWidgetProps) {
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const processingPercent = total > 0 ? Math.round((processing / total) * 100) : 0;
  const failedPercent = total > 0 ? Math.round((failed / total) * 100) : 0;

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8" aria-label="payment summary widget">
      <div className="glass-panel rounded-lg p-5 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Payments</span>
        </div>
        <div className="mt-4 flex items-baseline">
          <span className="font-outfit text-3xl font-bold tracking-tight text-zinc-900">{isLoading ? "..." : total}</span>
          <span className="ml-2 text-xs text-zinc-400">Txns</span>
        </div>
      </div>

      <div className="glass-panel rounded-lg p-5 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">Completed</span>
        </div>
        <div className="mt-4 flex items-baseline">
          <span className="font-outfit text-3xl font-bold tracking-tight text-emerald-600">{isLoading ? "..." : completed}</span>
          <span className="ml-2 text-xs font-semibold text-emerald-600/80 bg-emerald-50 px-1.5 py-0.5 rounded">{completedPercent}%</span>
        </div>
      </div>

      <div className="glass-panel rounded-lg p-5 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">Processing</span>
        </div>
        <div className="mt-4 flex items-baseline">
          <span className="font-outfit text-3xl font-bold tracking-tight text-amber-600">{isLoading ? "..." : processing}</span>
          <span className="ml-2 text-xs font-semibold text-amber-600/80 bg-amber-50 px-1.5 py-0.5 rounded">{processingPercent}%</span>
        </div>
      </div>

      <div className="glass-panel rounded-lg p-5 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">Failed</span>
        </div>
        <div className="mt-4 flex items-baseline">
          <span className="font-outfit text-3xl font-bold tracking-tight text-rose-600">{isLoading ? "..." : failed}</span>
          <span className="ml-2 text-xs font-semibold text-rose-600/80 bg-rose-50 px-1.5 py-0.5 rounded">{failedPercent}%</span>
        </div>
      </div>
    </section>
  );
}
