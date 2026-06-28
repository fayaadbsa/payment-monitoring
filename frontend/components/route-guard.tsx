"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Run initialization on client mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    } else if (isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Premium loading page
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-full w-full rounded-full border-4 border-zinc-200"></div>
            <div className="absolute h-full w-full animate-spin rounded-full border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent"></div>
          </div>
          <p className="font-outfit text-xs font-semibold tracking-wider text-zinc-500 uppercase animate-pulse">
            Initializing Session...
          </p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content before redirect
  const isPublicPath = pathname === "/login";
  if (!isAuthenticated && !isPublicPath) {
    return <div className="flex min-h-screen bg-white" />;
  }

  if (isAuthenticated && isPublicPath) {
    return <div className="flex min-h-screen bg-white" />;
  }

  return <>{children}</>;
}
