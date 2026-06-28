import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { useAuthStore } from "@/store/auth-store";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("login page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email: "cs@test.com", role: "customer", token: "token-abc" }),
    }) as unknown as typeof fetch;
  });

  it("shows validation error for invalid email", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign In" }).closest("form")!);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it("autofills credentials when clicking credential button", () => {
    render(<LoginPage />);
    const csButton = screen.getByRole("button", { name: /customer support/i });
    fireEvent.click(csButton);
    expect((screen.getByLabelText(/email address/i) as HTMLInputElement).value).toBe("cs@test.com");
  });

  it("submits login and calls the api", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "cs@test.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign In" }).closest("form")!);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith("/");
  });
});
