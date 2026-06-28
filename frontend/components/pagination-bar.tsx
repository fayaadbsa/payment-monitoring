"use client";

import React from "react";

interface PaginationBarProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}

const LIMIT_OPTIONS = [10, 20, 50];

export function PaginationBar({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build visible page numbers: always show first, last, current ±1, with ellipsis
  const getPages = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1"
      aria-label="pagination"
    >
      {/* Count info */}
      <p className="text-xs text-zinc-500">
        {total === 0 ? (
          "No transactions"
        ) : (
          <>
            Showing{" "}
            <strong className="text-zinc-700">
              {from}–{to}
            </strong>{" "}
            of <strong className="text-zinc-700">{total}</strong> transactions
          </>
        )}
      </p>

      <div className="flex items-center gap-3">
        {/* Limit selector */}
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Rows
          </label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {LIMIT_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            id="prev-page-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex h-7 w-7 items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 text-xs transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            ‹
          </button>

          {getPages().map((p, idx) =>
            p === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-7 w-7 items-center justify-center text-xs text-zinc-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                id={`page-btn-${p}`}
                onClick={() => onPageChange(p as number)}
                className={`flex h-7 w-7 items-center justify-center rounded border text-xs font-medium transition ${
                  p === page
                    ? "border-red-600 bg-red-600 text-white shadow-sm"
                    : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            id="next-page-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 text-xs transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
