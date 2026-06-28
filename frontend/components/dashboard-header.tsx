"use client";

import React from "react";

interface DashboardHeaderProps {
  email?: string;
  role?: string;
  isLoading: boolean;
  onSync: () => void;
  onLogout: () => void;
}

export function DashboardHeader({
  email,
  role,
  isLoading,
  onSync,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-white shadow-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="font-outfit text-lg font-bold tracking-tight text-zinc-900">
              Dupay <span className="font-medium text-red-600">Payment Monitoring</span>
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div className="hidden flex-col text-right md:flex">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Account
              </span>
              <span className="text-xs font-medium text-zinc-700">{email}</span>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-600">
              {role}
            </div>

            <button
              id="sync-live-btn"
              onClick={onSync}
              disabled={isLoading}
              title="Sync live payments"
              className="flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:border-zinc-400 disabled:opacity-50"
            >
              <svg
                className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Sync
            </button>

            <button
              id="logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-400 hover:text-zinc-900"
            >
              Logout
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
