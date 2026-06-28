import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardHeader } from "@/components/dashboard-header";

describe("DashboardHeader", () => {
  const defaultProps = {
    email: "test@example.com",
    role: "operations",
    onLogout: vi.fn(),
  };

  it("renders user information and app title", () => {
    render(<DashboardHeader {...defaultProps} />);
    expect(screen.getByText("Dupay")).toBeInTheDocument();
    expect(screen.getByText("Payment Monitoring")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("operations")).toBeInTheDocument();
  });

  it("triggers onLogout when clicking the logout button", () => {
    const onLogout = vi.fn();
    render(<DashboardHeader {...defaultProps} onLogout={onLogout} />);
    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("renders Sync Live button when onSync is provided", () => {
    const onSync = vi.fn();
    render(<DashboardHeader {...defaultProps} onSync={onSync} />);
    const syncBtn = screen.getByRole("button", { name: /sync live/i });
    expect(syncBtn).toBeInTheDocument();

    fireEvent.click(syncBtn);
    expect(onSync).toHaveBeenCalledOnce();
  });

  it("disables Sync Live button when isLoading is active", () => {
    const onSync = vi.fn();
    render(<DashboardHeader {...defaultProps} onSync={onSync} isLoading={true} />);
    const syncBtn = screen.getByRole("button", { name: /sync live/i });
    expect(syncBtn).toBeDisabled();
  });
});
