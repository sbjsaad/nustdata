"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { BrandLogo } from "./BrandLogo";

export function Header({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const [cmsId, setCmsId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cmsId.trim()) {
      router.push(`/students/${encodeURIComponent(cmsId.trim())}`);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="mt-0.5 shrink-0 rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link href="/dashboard" className="mt-0.5 shrink-0 lg:hidden" aria-label="Go to dashboard">
            <BrandLogo size="sm" />
          </Link>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2 lg:max-w-md">
          <Input
            placeholder="Search by CMS ID..."
            value={cmsId}
            onChange={(e) => setCmsId(e.target.value)}
            className="min-w-0 flex-1"
          />
          <Button type="submit" variant="primary" className="shrink-0">
            Search
          </Button>
        </form>
      </div>
    </header>
  );
}
