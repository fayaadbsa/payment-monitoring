import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/auth-store";

describe("auth store", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it("starts unauthenticated", () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("login persists auth state", () => {
    useAuthStore.getState().login("cs@test.com", "customer", "token-123");

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe("token-123");
    expect(localStorage.getItem("auth_token")).toBe("token-123");
    expect(localStorage.getItem("auth_user")).toContain("cs@test.com");
  });

  it("logout clears auth state", () => {
    useAuthStore.getState().login("ops@test.com", "operation", "token-456");
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });
});
