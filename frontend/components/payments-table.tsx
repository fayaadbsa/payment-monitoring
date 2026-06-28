"use client";

import React from "react";
import { formatCurrency, formatDate } from "@/utils/format";

type SortField = "id" | "merchant" | "created_at" | "amount" | "status";
type SortOrder = "asc" | "desc";

interface Payment {
  id: string;
  merchant: string;
  amount: string;
  status: string;
  created_at: string;
}

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onResetFilters: () => void;
  statusFilter: string;
  searchId: string;
  searchMerchant: string;
}

function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField;
  sortField: SortField;
  sortOrder: SortOrder;
}) {
  if (sortField !== field) return <span className="text-zinc-350">↕</span>;
  return <span className="text-red-600">{sortOrder === "asc" ? "▲" : "▼"}</span>;
}

export function PaymentsTable({
  payments,
  isLoading,
  sortField,
  sortOrder,
  onSort,
  onResetFilters,
  statusFilter,
  searchId,
  searchMerchant,
}: PaymentsTableProps) {
  const thBase =
    "px-4 py-3 text-left font-outfit text-[11px] font-semibold uppercase tracking-wider text-zinc-500 select-none";
  const thSortable = `${thBase} cursor-pointer hover:bg-zinc-100 transition group`;

  if (isLoading && payments.length === 0) {
    return (
      <div className="glass-panel rounded-lg overflow-hidden border border-zinc-200">
        <div className="p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-2 border-b border-zinc-100 last:border-0"
            >
              <div className="h-4 w-28 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-zinc-200/70 rounded animate-pulse" />
              <div className="h-4 w-24 bg-zinc-200/60 rounded animate-pulse flex-1" />
              <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-zinc-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="glass-panel rounded-lg p-12 text-center border border-zinc-200 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-4">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="font-outfit text-base font-bold text-zinc-800">No transactions found</h3>
        <p className="text-zinc-500 mt-1 text-xs max-w-sm">
          No payments match your current filters
          {statusFilter !== "all" && (
            <>
              {" "}
              for status <strong>&quot;{statusFilter}&quot;</strong>
            </>
          )}
          {searchId && (
            <>
              {" "}
              with ID containing <strong>&quot;{searchId}&quot;</strong>
            </>
          )}
          {searchMerchant && (
            <>
              {" "}
              with merchant <strong>&quot;{searchMerchant}&quot;</strong>
            </>
          )}
          .
        </p>
        <button
          id="empty-reset-btn"
          onClick={onResetFilters}
          className="mt-4 font-outfit text-xs font-semibold rounded bg-red-600 hover:bg-red-700 text-white px-4 py-2 transition"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block glass-panel rounded-lg overflow-hidden border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200" aria-label="payments table">
          <thead className="bg-zinc-50">
            <tr>
              <th scope="col" onClick={() => onSort("id")} className={thSortable}>
                <div className="flex items-center gap-1">
                  Payment ID <SortIcon field="id" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th scope="col" onClick={() => onSort("merchant")} className={thSortable}>
                <div className="flex items-center gap-1">
                  Merchant Name{" "}
                  <SortIcon field="merchant" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th scope="col" onClick={() => onSort("created_at")} className={thSortable}>
                <div className="flex items-center gap-1">
                  Created Date{" "}
                  <SortIcon field="created_at" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th
                scope="col"
                onClick={() => onSort("amount")}
                className={`${thSortable} text-right`}
              >
                <div className="flex items-center justify-end gap-1">
                  Amount <SortIcon field="amount" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th scope="col" className={`${thBase} text-center`}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white text-sm">
            {payments.map((p) => (
              <tr key={p.id} className="transition hover:bg-zinc-50/60">
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-semibold text-zinc-600">
                  {p.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-zinc-800">
                  {p.merchant}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-zinc-500 text-xs">
                  {formatDate(p.created_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-zinc-900">
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {payments.map((p) => (
          <div key={p.id} className="glass-panel rounded-lg p-4 border border-zinc-200 space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="font-mono text-[11px] font-semibold text-zinc-500">{p.id}</span>
                <h4 className="font-semibold text-zinc-800 mt-0.5">{p.merchant}</h4>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="border-t border-zinc-100 pt-2 flex justify-between items-baseline">
              <span className="text-[11px] text-zinc-500">{formatDate(p.created_at)}</span>
              <span className="font-bold text-zinc-900">{formatCurrency(p.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    processing: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };
  const dotMap: Record<string, string> = {
    completed: "bg-emerald-500",
    processing: "bg-amber-500 animate-pulse",
    failed: "bg-red-500",
  };
  const cls = map[status] ?? "bg-zinc-50 text-zinc-700 border-zinc-200";
  const dot = dotMap[status] ?? "bg-zinc-400";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold capitalize border ${cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
