"use client";

import React from "react";

type SortField = "id" | "merchant" | "created_at" | "amount" | "status";

interface FilterBarProps {
  statusFilter: string;
  searchId: string;
  searchMerchant: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  onStatusFilter: (v: string) => void;
  onSearchId: (v: string) => void;
  onSearchMerchant: (v: string) => void;
  onStartDate: (v: string) => void;
  onEndDate: (v: string) => void;
  onMinAmount: (v: string) => void;
  onMaxAmount: (v: string) => void;
  onReset: () => void;
}

export function FilterBar({
  statusFilter,
  searchId,
  searchMerchant,
  startDate,
  endDate,
  minAmount,
  maxAmount,
  onStatusFilter,
  onSearchId,
  onSearchMerchant,
  onStartDate,
  onEndDate,
  onMinAmount,
  onMaxAmount,
  onReset,
}: FilterBarProps) {
  const STATUS_TABS = [
    { id: "all", label: "All" },
    { id: "completed", label: "Completed" },
    { id: "processing", label: "Processing" },
    { id: "failed", label: "Failed" },
  ];

  const hasActiveFilters =
    statusFilter !== "all" ||
    searchId ||
    searchMerchant ||
    startDate ||
    endDate ||
    minAmount ||
    maxAmount;

  return (
    <section
      className="glass-panel mb-6 rounded-lg p-4 animate-fade-in"
      aria-label="payment filters"
    >
      {/* Row 1: Status pills + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`filter-${tab.id}`}
              onClick={() => onStatusFilter(tab.id)}
              className={`px-3 py-1.5 font-outfit text-xs font-semibold rounded border transition-all ${
                statusFilter === tab.id
                  ? "bg-red-600 border-red-600 text-white shadow-sm"
                  : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={onReset}
            className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Row 2: Search inputs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_0.7fr_1.4fr_1fr]">
        {/* Search by Payment ID */}
        <div className="relative">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Payment ID
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-400">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="search-id-input"
              type="text"
              placeholder="Search by ID..."
              value={searchId}
              onChange={(e) => onSearchId(e.target.value)}
              className="glass-input block w-full rounded border-zinc-300 bg-white py-1.5 pl-8 pr-7 text-xs"
            />
            {searchId && (
              <button
                onClick={() => onSearchId("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-400 hover:text-zinc-600"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search by Merchant */}
        <div className="relative">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Merchant Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-400">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <input
              id="search-merchant-input"
              type="text"
              placeholder="Search by merchant..."
              value={searchMerchant}
              onChange={(e) => onSearchMerchant(e.target.value)}
              className="glass-input block w-full rounded border-zinc-300 bg-white py-1.5 pl-8 pr-7 text-xs"
            />
            {searchMerchant && (
              <button
                onClick={() => onSearchMerchant("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-400 hover:text-zinc-600"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Date Range
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id="start-date-input"
              type="date"
              value={startDate}
              onChange={(e) => onStartDate(e.target.value)}
              className="glass-input block w-full rounded border-zinc-300 bg-white py-1.5 px-2 text-xs"
            />
            <span className="text-zinc-400 text-xs flex-shrink-0">–</span>
            <input
              id="end-date-input"
              type="date"
              value={endDate}
              onChange={(e) => onEndDate(e.target.value)}
              className="glass-input block w-full rounded border-zinc-300 bg-white py-1.5 px-2 text-xs"
            />
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Amount ($)
          </label>
          <div className="flex gap-1.5 items-center">
            <input
              id="min-amount-input"
              type="number"
              min="0"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => onMinAmount(e.target.value)}
              className="glass-input block w-full rounded border-zinc-300 bg-white py-1.5 px-2 text-xs"
            />
            <span className="text-zinc-400 text-xs flex-shrink-0">–</span>
            <input
              id="max-amount-input"
              type="number"
              min="0"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => onMaxAmount(e.target.value)}
              className="glass-input block w-full rounded border-zinc-300 bg-white py-1.5 px-2 text-xs"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
