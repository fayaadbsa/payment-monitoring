"use client";

import React, { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { usePaymentStore } from "@/store/payment-store";
import { DashboardHeader } from "@/components/dashboard-header";
import { SummaryWidget } from "@/components/summary-widget";
import { FilterBar } from "@/components/filter-bar";
import { PaymentsTable } from "@/components/payments-table";
import { PaginationBar } from "@/components/pagination-bar";

type SortField = "id" | "merchant" | "created_at" | "amount" | "status";

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();

  const {
    payments,
    isLoading,
    error,
    statusFilter,
    searchId,
    searchMerchant,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortField,
    sortOrder,
    page,
    limit,
    total,
    totalCompleted,
    totalProcessing,
    totalFailed,
    setStatusFilter,
    setSearchId,
    setSearchMerchant,
    setStartDate,
    setEndDate,
    setMinAmount,
    setMaxAmount,
    setSortField,
    setSortOrder,
    setPage,
    setLimit,
    fetchPayments,
  } = usePaymentStore();

  // Fetch on any filter/sort/page change
  useEffect(() => {
    if (token) fetchPayments(token, logout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    statusFilter,
    searchId,
    searchMerchant,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortField,
    sortOrder,
    page,
    limit,
  ]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
    },
    [sortField, sortOrder, setSortField, setSortOrder]
  );

  const handleReset = useCallback(() => {
    setStatusFilter("all");
    setSearchId("");
    setSearchMerchant("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
  }, [
    setStatusFilter,
    setSearchId,
    setSearchMerchant,
    setStartDate,
    setEndDate,
    setMinAmount,
    setMaxAmount,
  ]);

  const handleSync = useCallback(() => {
    if (token) fetchPayments(token, logout);
  }, [token, fetchPayments, logout]);

  return (
    <div className="flex-1 bg-zinc-50/50 min-h-screen pb-16">
      <DashboardHeader
        email={user?.email}
        role={user?.role}
        isLoading={isLoading}
        onSync={handleSync}
        onLogout={logout}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Error banner */}
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

        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-outfit text-2xl font-bold tracking-tight text-zinc-900">
            Payment Monitoring
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Overview of transactional safety, settlement speeds, and merchant transaction health.
          </p>
        </div>

        {/* Summary widgets — driven by backend status counts */}
        <SummaryWidget
          total={total}
          completed={totalCompleted}
          processing={totalProcessing}
          failed={totalFailed}
          isLoading={isLoading && payments.length === 0}
        />

        {/* Filters */}
        <FilterBar
          statusFilter={statusFilter}
          searchId={searchId}
          searchMerchant={searchMerchant}
          startDate={startDate}
          endDate={endDate}
          minAmount={minAmount}
          maxAmount={maxAmount}
          isLoading={isLoading}
          onStatusFilter={setStatusFilter}
          onSearchId={setSearchId}
          onSearchMerchant={setSearchMerchant}
          onStartDate={setStartDate}
          onEndDate={setEndDate}
          onMinAmount={setMinAmount}
          onMaxAmount={setMaxAmount}
          onReset={handleReset}
          onRefresh={handleSync}
        />

        {/* Table */}
        <section className="animate-fade-in">
          <PaymentsTable
            payments={payments}
            isLoading={isLoading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onResetFilters={handleReset}
            statusFilter={statusFilter}
            searchId={searchId}
            searchMerchant={searchMerchant}
          />

          {/* Pagination */}
          {(payments.length > 0 || total > 0) && (
            <PaginationBar
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          )}
        </section>
      </main>
    </div>
  );
}
