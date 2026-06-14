"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AuthGuard } from "../auth/AuthGuard";

export function DashboardLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          />
        )}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            title={title}
            subtitle={subtitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
