"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import config from "@/config";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);

    const apiBaseUrl = config.backendApiUrl;

    try {
      const res = await fetch(`${apiBaseUrl}/dashboard/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token && data.email && data.role) {
          login(data.email, data.role, data.token);
          router.push("/");
          return;
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Auth API connection failed:", err);
      setError(
        "Unable to connect to live authentication API. Please check if the Go backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-zinc-50 py-12 sm:px-6 lg:px-8">
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="flex justify-center text-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-red-600 text-white shadow-sm">
              <svg
                className="h-5 w-5"
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
            <span className="font-outfit text-xl font-bold tracking-tight text-zinc-900">
              Dupay{" "}
              <span className="text-red-600 font-medium">
                Payment Monitor
              </span>
            </span>
          </div>
        </div>
        <h2 className="mt-6 text-center font-outfit text-3xl font-bold tracking-tight text-zinc-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-550">
          Monitor and manage payments securely
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="glass-panel border-zinc-200 bg-white px-4 py-8 shadow-sm sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-5 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2.5 animate-fade-in">
              <svg
                className="h-5 w-5 shrink-0 text-red-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block font-outfit text-sm font-semibold text-zinc-800"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cs@test.com"
                  className="glass-input block w-full rounded border-zinc-400 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-550 shadow-sm focus:border-red-500 focus:ring-red-500/10 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-outfit text-sm font-semibold text-zinc-800"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input block w-full rounded border-zinc-400 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-550 shadow-sm focus:border-red-500 focus:ring-red-500/10 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded bg-red-600 hover:bg-red-700 px-4 py-2.5 font-outfit text-sm font-bold text-white shadow-sm transition disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          {/* Quick Help Box */}
          <div className="mt-6 border-t border-zinc-200 pt-5">
            <p className="font-outfit text-xs font-bold uppercase tracking-wider text-zinc-500">
              Credentials
            </p>
            <div className="mt-2 space-y-1.5 text-sm text-zinc-900">
              <div className="flex justify-between items-center rounded bg-zinc-150 p-2.5 border border-zinc-300">
                <span>
                  Customer Support: <strong className="text-zinc-950 font-extrabold font-outfit">cs@test.com</strong>
                </span>
                <span className="font-mono text-xs text-zinc-950 font-bold uppercase tracking-widest bg-white border border-zinc-300 px-2 py-0.5 rounded">
                  password
                </span>
              </div>
              <div className="flex justify-between items-center rounded bg-zinc-150 p-2.5 border border-zinc-300">
                <span>
                  Operations: <strong className="text-zinc-950 font-extrabold font-outfit">operation@test.com</strong>
                </span>
                <span className="font-mono text-xs text-zinc-950 font-bold uppercase tracking-widest bg-white border border-zinc-300 px-2 py-0.5 rounded">
                  password
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
