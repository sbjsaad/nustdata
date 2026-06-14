"use client";

import { usePageMeta } from "./PageMetaContext";

export function DashboardLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  usePageMeta({ title, subtitle });
  return <>{children}</>;
}
