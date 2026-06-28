import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaginationBar } from "@/components/pagination-bar";

describe("PaginationBar", () => {
  it("renders correct count info", () => {
    render(
      <PaginationBar
        page={1}
        limit={10}
        total={50}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />
    );
    expect(screen.getByText(/1–10/)).toBeInTheDocument();
    // total appears in both the text node and the select option, use getAllByText
    const fifties = screen.getAllByText("50");
    expect(fifties.length).toBeGreaterThanOrEqual(1);
    // "transactions" is split across text nodes; match the containing paragraph
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(
      <PaginationBar
        page={1}
        limit={10}
        total={50}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <PaginationBar
        page={5}
        limit={10}
        total={50}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("calls onPageChange with correct page when clicking next", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationBar
        page={2}
        limit={10}
        total={50}
        onPageChange={onPageChange}
        onLimitChange={vi.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with correct page when clicking prev", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationBar
        page={3}
        limit={10}
        total={50}
        onPageChange={onPageChange}
        onLimitChange={vi.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onLimitChange when selecting a new limit", () => {
    const onLimitChange = vi.fn();
    render(
      <PaginationBar
        page={1}
        limit={10}
        total={50}
        onPageChange={vi.fn()}
        onLimitChange={onLimitChange}
      />
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });
    expect(onLimitChange).toHaveBeenCalledWith(20);
  });

  it("shows 'No transactions' when total is 0", () => {
    render(
      <PaginationBar page={1} limit={10} total={0} onPageChange={vi.fn()} onLimitChange={vi.fn()} />
    );
    expect(screen.getByText("No transactions")).toBeInTheDocument();
  });
});
