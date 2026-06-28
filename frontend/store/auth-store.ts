import { create } from "zustand";

interface User {
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: string, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (typeof window === "undefined") return;
    try {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");
      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error("Failed to load auth state from localStorage:", e);
      set({ isLoading: false });
    }
  },

  login: (email, role, token) => {
    const user = { email, role };
    set({ token, user, isAuthenticated: true });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to save auth state to localStorage:", e);
      }
    }
  },

  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } catch (e) {
        console.error("Failed to clear auth state from localStorage:", e);
      }
    }
  },
}));
export default useAuthStore;
