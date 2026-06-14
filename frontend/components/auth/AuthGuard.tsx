"use client";

import { useSyncExternalStore, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getAuthServerSnapshot,
  getAuthSnapshot,
  getClientMountedSnapshot,
  getServerMountedSnapshot,
  subscribeAuth,
} from "@/lib/auth";
import { BrandLogo } from "../layout/BrandLogo";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const redirected = useRef(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    getClientMountedSnapshot,
    getServerMountedSnapshot
  );

  const authenticated = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  useEffect(() => {
    if (mounted && !authenticated && !redirected.current) {
      redirected.current = true;
      router.replace("/login");
    }
  }, [mounted, authenticated, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <BrandLogo size="lg" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
