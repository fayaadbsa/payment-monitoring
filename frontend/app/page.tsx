"use client";

import React, { useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import { usePaymentStore } from "@/store/payment-store";
import { formatCurrency, formatDate } from "@/utils/format";

type SortField = "created_at" | "amount";

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const {
    payments,
    isLoading,
    error,
    statusFilter,
    searchId,
    sortField,
    sortOrder,
    setStatusFilter,
    setSearchId,
    setSortField,
    setSortOrder,
    fetchPayments,
  } = usePaymentStore();

  // Load metrics dynamically from the returned payments list
  const metrics = useMemo(() => {
    return {
      total: payments.length,
      completed: payments.filter((p) => p.status === "completed").length,
      processing: payments.filter((p) => p.status === "processing").length,
      failed: payments.filter((p) => p.status === "failed").length,
    };
  }, [payments]);

  // Trigger fetch when parameters or auth state changes
  useEffect(() => {
    if (token) {
      fetchPayments(token, logout);
    }
  }, [token, statusFilter, searchId, sortField, sortOrder, fetchPayments, logout]);

  // Handle sorting toggle click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleSync = () => {
    if (token) {
      fetchPayments(token, logout);
    }
  };

  return (
    <div className="flex-1 bg-zinc-50/50 min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md transition-all">
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
                Dupay{" "}
                <span className="text-red-600 font-medium">
                  Payment Monitor
                </span>
              </span>

              {/* API Mode Indicator */}
              <div className="ml-3 hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Connected
              </div>
            </div>

            {/* Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Account
                </span>
                <span className="text-xs font-medium text-zinc-700">
                  {user?.email}
                </span>
              </div>

              <div className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-600">
                {user?.role}
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded border border-zinc-300 hover:border-zinc-400 bg-white px-3 py-1.5 font-outfit text-xs font-semibold text-zinc-700 hover:text-zinc-900 shadow-sm transition-all"
              >
                <span>Logout</span>
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

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Notice Alert (if error) */}
        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-3 animate-fade-in">
            <svg
              className="h-5 w-5 shrink-0 text-red-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}

        {/* Dashboard Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-outfit text-2xl font-bold tracking-tight text-zinc-900">
              Payment Monitoring
            </h1>
            <p className="text-zinc-500 mt-1 text-xs">
              Overview of transactional safety, settlement speeds, and merchant transaction health.
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 self-start sm:self-center font-outfit text-xs font-semibold rounded border border-zinc-300 bg-white px-4 py-2 hover:bg-zinc-50 transition shadow-sm text-zinc-700"
          >
            <svg
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89"
              />
            </svg>
            <span>Sync Live</span>
          </button>
        </div>

        {/* Metrics Grid Widgets */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Card 1: Total Payments */}
          <div className="glass-panel rounded-lg p-5 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Total Payments
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 text-zinc-700">
                <svg
                  className="h-4.5 w-4.5"
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
            <div className="mt-4 flex items-baseline">
              <span className="font-outfit text-3xl font-bold tracking-tight text-zinc-900">
                {isLoading && payments.length === 0 ? "..." : metrics.total}
              </span>
              <span className="ml-2 text-xs text-zinc-400">Txns</span>
            </div>
            <p className="mt-2 text-[10px] text-zinc-400">Total processed database records</p>
          </div>

          {/* Card 2: Completed Payments */}
          <div className="glass-panel rounded-lg p-5 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Completed
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 text-emerald-600">
                <svg
                  className="h-4.5 w-4.5"
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
            <div className="mt-4 flex items-baseline">
              <span className="font-outfit text-3xl font-bold tracking-tight text-emerald-600">
                {isLoading && payments.length === 0 ? "..." : metrics.completed}
              </span>
              <span className="ml-2 text-xs font-semibold text-emerald-600/80 bg-emerald-50 px-1.5 py-0.5 rounded">
                {metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0}%
              </span>
            </div>
            <p className="mt-2 text-[10px] text-zinc-400">Successful settled transactions</p>
          </div>

          {/* Card 3: Processing Payments */}
          <div className="glass-panel rounded-lg p-5 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Processing
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-50 text-amber-600">
                <svg
                  className="h-4.5 w-4.5 animate-pulse"
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
            <div className="mt-4 flex items-baseline">
              <span className="font-outfit text-3xl font-bold tracking-tight text-amber-600">
                {isLoading && payments.length === 0 ? "..." : metrics.processing}
              </span>
              <span className="ml-2 text-xs font-semibold text-amber-600/80 bg-amber-50 px-1.5 py-0.5 rounded">
                {metrics.total > 0 ? Math.round((metrics.processing / metrics.total) * 100) : 0}%
              </span>
            </div>
            <p className="mt-2 text-[10px] text-zinc-400">Pending network confirmations</p>
          </div>

          {/* Card 4: Failed Payments */}
          <div className="glass-panel rounded-lg p-5 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Failed
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-600">
                <svg
                  className="h-4.5 w-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="font-outfit text-3xl font-bold tracking-tight text-red-600">
                {isLoading && payments.length === 0 ? "..." : metrics.failed}
              </span>
              <span className="ml-2 text-xs font-semibold text-red-600/80 bg-red-50 px-1.5 py-0.5 rounded">
                {metrics.total > 0 ? Math.round((metrics.failed / metrics.total) * 100) : 0}%
              </span>
            </div>
            <p className="mt-2 text-[10px] text-zinc-400">Rejected bank/processor transfers</p>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section className="glass-panel mb-6 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          {/* Status Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All Payments" },
              { id: "completed", label: "Completed" },
              { id: "processing", label: "Processing" },
              { id: "failed", label: "Failed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
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

          {/* Search ID input */}
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Payment ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="glass-input block w-full pl-9 pr-8 py-1.5 text-xs rounded border-zinc-300 bg-white"
            />
            {searchId && (
              <button
                onClick={() => setSearchId("")}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-450 hover:text-zinc-650"
              >
                <svg
                  className="h-3.5 w-3.5"
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
        </section>

        {/* Payments list section */}
        <section className="animate-fade-in">
          {/* Skeleton Loaders */}
          {isLoading && payments.length === 0 ? (
            <div className="glass-panel rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-zinc-200 p-4">
                <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
              </div>
              <div className="p-4 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 py-2 border-b border-zinc-150 last:border-0"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 bg-zinc-200 rounded animate-pulse" />
                      <div className="h-3 w-1/3 bg-zinc-200/60 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
                    <div className="h-6 w-24 bg-zinc-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : payments.length === 0 ? (
            /* Empty State Container */
            <div className="glass-panel rounded-lg p-12 text-center shadow-sm flex flex-col items-center justify-center animate-fade-in">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-zinc-50 text-zinc-400 mb-4 border border-zinc-200">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="font-outfit text-base font-bold text-zinc-800">
                No transactions found
              </h3>
              <p className="text-zinc-550 mt-1 max-w-md text-xs">
                We couldn't find any payments matching status{" "}
                <span className="font-semibold text-zinc-600 uppercase">"{statusFilter}"</span>
                {searchId && (
                  <span>
                    {" "}
                    and ID matching{" "}
                    <span className="font-semibold text-zinc-600">"{searchId}"</span>
                  </span>
                )}
                .
              </p>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setSearchId("");
                }}
                className="mt-4 font-outfit text-xs font-semibold rounded bg-red-600 hover:bg-red-700 text-white px-4 py-2 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Dynamic Tables/Cards wrapper */
            <>
              {/* DESKTOP TABLE LAYOUT (hidden on mobile) */}
              <div className="hidden md:block glass-panel rounded-lg overflow-hidden border border-zinc-200">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50 font-outfit text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        Payment ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left">
                        Merchant Name
                      </th>
                      <th
                        scope="col"
                        onClick={() => handleSort("created_at")}
                        className="px-6 py-3 text-left cursor-pointer hover:bg-zinc-100 select-none group transition"
                      >
                        <div className="flex items-center gap-1">
                          <span>Created Date</span>
                          <span className="text-zinc-450 group-hover:text-zinc-650 transition">
                            {sortField === "created_at" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        onClick={() => handleSort("amount")}
                        className="px-6 py-3 text-right cursor-pointer hover:bg-zinc-100 select-none group transition"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Amount</span>
                          <span className="text-zinc-450 group-hover:text-zinc-650 transition">
                            {sortField === "amount" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 bg-white text-xs">
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        className="transition-all hover:bg-zinc-50/50"
                      >
                        {/* ID */}
                        <td className="px-6 py-3 whitespace-nowrap font-mono font-semibold text-zinc-600">
                          {p.id}
                        </td>
                        {/* Merchant */}
                        <td className="px-6 py-3 whitespace-nowrap font-semibold text-zinc-800">
                          {p.merchant}
                        </td>
                        {/* Created Date */}
                        <td className="px-6 py-3 whitespace-nowrap text-zinc-500">
                          {formatDate(p.created_at)}
                        </td>
                        {/* Amount */}
                        <td className="px-6 py-3 whitespace-nowrap text-right font-bold text-zinc-900">
                          {formatCurrency(p.amount)}
                        </td>
                        {/* Status Badge */}
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold capitalize border ${
                              p.status === "completed"
                                ? "badge-completed"
                                : p.status === "processing"
                                  ? "badge-processing"
                                  : "badge-failed"
                            }`}
                          >
                            <span
                              className={`h-1 w-1 rounded-full ${
                                p.status === "completed"
                                  ? "bg-emerald-500"
                                  : p.status === "processing"
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-red-500"
                              }`}
                            />
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD LAYOUT (hidden on desktop) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="glass-panel rounded-lg p-4 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-mono text-xs font-semibold text-zinc-500">
                          {p.id}
                        </span>
                        <h4 className="font-bold text-zinc-800 mt-0.5 text-sm">
                          {p.merchant}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold capitalize border ${
                          p.status === "completed"
                            ? "badge-completed"
                            : p.status === "processing"
                              ? "badge-processing"
                              : "badge-failed"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="border-t border-zinc-100 pt-2 flex justify-between items-baseline">
                      <span className="text-[10px] text-zinc-500">
                        {formatDate(p.created_at)}
                      </span>
                      <span className="font-bold text-zinc-900 text-sm">
                        {formatCurrency(p.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Counts footer */}
              <div className="mt-4 text-xs text-zinc-500 px-1">
                Showing <strong>{payments.length}</strong> transactions
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
