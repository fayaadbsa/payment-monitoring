import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "@/components/filter-bar";

const defaultProps = {
  statusFilter: "all",
  searchId: "",
  searchMerchant: "",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  isLoading: false,
  onStatusFilter: vi.fn(),
  onSearchId: vi.fn(),
  onSearchMerchant: vi.fn(),
  onStartDate: vi.fn(),
  onEndDate: vi.fn(),
  onMinAmount: vi.fn(),
  onMaxAmount: vi.fn(),
  onReset: vi.fn(),
  onRefresh: vi.fn(),
};

describe("FilterBar", () => {
  it("renders all status filter buttons", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("calls onStatusFilter with correct value when clicking status buttons", () => {
    const onStatusFilter = vi.fn();
    render(<FilterBar {...defaultProps} onStatusFilter={onStatusFilter} />);
    fireEvent.click(screen.getByText("Completed"));
    expect(onStatusFilter).toHaveBeenCalledWith("completed");
  });

  it("calls onSearchId when typing in ID input", () => {
    const onSearchId = vi.fn();
    render(<FilterBar {...defaultProps} onSearchId={onSearchId} />);
    fireEvent.change(screen.getByPlaceholderText("Search by ID..."), {
      target: { value: "PAY-1" },
    });
    expect(onSearchId).toHaveBeenCalledWith("PAY-1");
  });

  it("calls onSearchMerchant when typing in merchant input", () => {
    const onSearchMerchant = vi.fn();
    render(<FilterBar {...defaultProps} onSearchMerchant={onSearchMerchant} />);
    fireEvent.change(screen.getByPlaceholderText("Search by merchant..."), {
      target: { value: "Acme" },
    });
    expect(onSearchMerchant).toHaveBeenCalledWith("Acme");
  });

  it("does NOT show Clear all filters when no active filters", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.queryByText("Clear all filters")).not.toBeInTheDocument();
  });

  it("shows Clear all filters when search is active", () => {
    render(<FilterBar {...defaultProps} searchId="PAY-1" />);
    expect(screen.getByText("Clear all filters")).toBeInTheDocument();
  });

  it("calls onReset when Clear all filters is clicked", () => {
    const onReset = vi.fn();
    render(<FilterBar {...defaultProps} statusFilter="completed" onReset={onReset} />);
    fireEvent.click(screen.getByText("Clear all filters"));
    expect(onReset).toHaveBeenCalled();
  });

  it("shows a refresh button in the filter bar and calls onRefresh when clicked", () => {
    const onRefresh = vi.fn();
    render(<FilterBar {...defaultProps} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: /refresh/i }));
    expect(onRefresh).toHaveBeenCalled();
  });
});
