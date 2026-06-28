import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentsTable } from "@/components/payments-table";

const mockPayments = [
  {
    id: "PAY-1",
    merchant: "Acme Corp",
    amount: "150.50",
    status: "completed",
    created_at: "2026-06-28T10:00:00Z",
  },
  {
    id: "PAY-2",
    merchant: "Globex",
    amount: "2500.00",
    status: "processing",
    created_at: "2026-06-28T11:00:00Z",
  },
];

const defaultProps = {
  payments: mockPayments,
  isLoading: false,
  sortField: "created_at" as const,
  sortOrder: "desc" as const,
  onSort: vi.fn(),
  onResetFilters: vi.fn(),
  statusFilter: "all",
  searchId: "",
  searchMerchant: "",
};

describe("PaymentsTable", () => {
  it("renders table headers and payments list", () => {
    render(<PaymentsTable {...defaultProps} />);

    // Check headers
    expect(screen.getByText("Payment ID")).toBeInTheDocument();
    expect(screen.getByText("Merchant Name")).toBeInTheDocument();
    expect(screen.getByText("Created Date")).toBeInTheDocument();
    expect(screen.getAllByText("Amount")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Status")[0]).toBeInTheDocument();

    // Check payment data
    expect(screen.getAllByText("PAY-1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Acme Corp")[0]).toBeInTheDocument();
    expect(screen.getAllByText("$150.50")[0]).toBeInTheDocument();

    expect(screen.getAllByText("PAY-2")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Globex")[0]).toBeInTheDocument();
    expect(screen.getAllByText("$2,500.00")[0]).toBeInTheDocument();
  });

  it("calls onSort with appropriate field when header is clicked", () => {
    const onSort = vi.fn();
    render(<PaymentsTable {...defaultProps} onSort={onSort} />);

    // Click Merchant Name header
    fireEvent.click(screen.getByText("Merchant Name"));
    expect(onSort).toHaveBeenCalledWith("merchant");
  });

  it("renders empty state when payments list is empty", () => {
    render(<PaymentsTable {...defaultProps} payments={[]} />);
    expect(screen.getByText("No transactions found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset filters/i })).toBeInTheDocument();
  });

  it("calls onResetFilters when reset button on empty state is clicked", () => {
    const onResetFilters = vi.fn();
    render(<PaymentsTable {...defaultProps} payments={[]} onResetFilters={onResetFilters} />);
    fireEvent.click(screen.getByRole("button", { name: /reset filters/i }));
    expect(onResetFilters).toHaveBeenCalledOnce();
  });

  it("renders loading skeletons when isLoading is true and no payments", () => {
    const { container } = render(
      <PaymentsTable {...defaultProps} payments={[]} isLoading={true} />
    );
    // Skeleton divs should have animate-pulse
    const pulses = container.getElementsByClassName("animate-pulse");
    expect(pulses.length).toBeGreaterThan(0);
  });
});
