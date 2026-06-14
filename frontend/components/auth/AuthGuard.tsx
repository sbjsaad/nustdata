"use client";

import { useSyncExternalStore, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { BrandLogo } from "../layout/BrandLogo";

function subscribe() {
  return () => {};
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(
    subscribe,
    () => isAuthenticated(),
    () => false
  );

  useEffect(() => {
    if (!authenticated) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <BrandLogo size="lg" />
        <p className="text-sm text-slate-500">Checking session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
