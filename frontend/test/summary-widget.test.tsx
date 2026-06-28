import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryWidget } from "@/components/summary-widget";

describe("SummaryWidget", () => {
  it("renders the correct totals and percentages", () => {
    render(<SummaryWidget total={50} completed={40} processing={7} failed={3} />);

    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("14%")).toBeInTheDocument();
    expect(screen.getByText("6%")).toBeInTheDocument();
  });

  it("renders 'transactions' label on the total widget", () => {
    render(<SummaryWidget total={10} completed={8} processing={1} failed={1} />);
    expect(screen.getByText("transactions")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<SummaryWidget total={0} completed={0} processing={0} failed={0} isLoading />);
    const ellipsis = screen.getAllByText("…");
    expect(ellipsis.length).toBeGreaterThanOrEqual(4);
  });

  it("shows 0% for all when total is 0", () => {
    render(<SummaryWidget total={0} completed={0} processing={0} failed={0} />);
    const zeros = screen.getAllByText("0%");
    expect(zeros.length).toBe(3);
  });
});
