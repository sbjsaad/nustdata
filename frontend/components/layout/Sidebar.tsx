"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, getUser } from "@/lib/auth";
import { BrandLogo } from "./BrandLogo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/students", label: "Students", icon: "🎓" },
  { href: "/billing", label: "Billing", icon: "📋" },
  { href: "/invoices", label: "Invoices", icon: "🧾" },
  { href: "/charges", label: "Charges", icon: "💰" },
  { href: "/upload", label: "Excel Upload", icon: "📤" },
  { href: "/categories", label: "Categories", icon: "📁" },
];

export function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative border-b border-slate-700 px-4 py-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 pr-8">
          <BrandLogo size="md" />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight">NUST EME</h1>
            <p className="truncate text-xs text-slate-400">Student Billing System</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        {user && (
          <div className="mb-3">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-red-600/20 hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
