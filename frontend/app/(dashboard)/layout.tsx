"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageMetaProvider } from "@/components/layout/PageMetaContext";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PageMetaProvider>
        <DashboardShell>{children}</DashboardShell>
      </PageMetaProvider>
    </AuthGuard>
  );
}
