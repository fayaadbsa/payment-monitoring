import React from "react";

interface SummaryWidgetProps {
  total: number;
  completed: number;
  processing: number;
  failed: number;
  isLoading?: boolean;
}

export function SummaryWidget({
  total,
  completed,
  processing,
  failed,
  isLoading = false,
}: SummaryWidgetProps) {
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const processingPercent = total > 0 ? Math.round((processing / total) * 100) : 0;
  const failedPercent = total > 0 ? Math.round((failed / total) * 100) : 0;

  return (
    <section
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      aria-label="payment summary widget"
    >
      {/* Total */}
      <div className="glass-panel rounded-lg p-5 border border-zinc-200 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Payments
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 text-zinc-600">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-outfit text-4xl font-bold tracking-tight text-zinc-900">
            {isLoading ? "…" : total}
          </span>
          <span className="text-sm text-zinc-400 font-medium">transactions</span>
        </div>
        <p className="mt-2 text-xs text-zinc-400">Total matching records</p>
      </div>

      {/* Completed */}
      <div className="glass-panel rounded-lg p-5 border border-zinc-200 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Completed
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 text-emerald-600">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-outfit text-4xl font-bold tracking-tight text-emerald-600">
            {isLoading ? "…" : completed}
          </span>
          <span className="text-sm font-semibold text-emerald-600/80 bg-emerald-50 px-1.5 py-0.5 rounded">
            {completedPercent}%
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-400">Successful settled transactions</p>
      </div>

      {/* Processing */}
      <div className="glass-panel rounded-lg p-5 border border-zinc-200 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Processing
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-50 text-amber-600">
            <svg
              className="h-4 w-4 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-outfit text-4xl font-bold tracking-tight text-amber-600">
            {isLoading ? "…" : processing}
          </span>
          <span className="text-sm font-semibold text-amber-600/80 bg-amber-50 px-1.5 py-0.5 rounded">
            {processingPercent}%
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-400">Pending network confirmations</p>
      </div>

      {/* Failed */}
      <div className="glass-panel rounded-lg p-5 border border-zinc-200 transition-all">
        <div className="flex items-center justify-between">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Failed
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-600">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-outfit text-4xl font-bold tracking-tight text-red-600">
            {isLoading ? "…" : failed}
          </span>
          <span className="text-sm font-semibold text-red-600/80 bg-red-50 px-1.5 py-0.5 rounded">
            {failedPercent}%
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-400">Rejected bank/processor transfers</p>
      </div>
    </section>
  );
}
