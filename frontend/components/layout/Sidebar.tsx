"use client";

import { memo } from "react";
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

export const Sidebar = memo(function Sidebar({
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
      className={`fixed inset-y-0 left-0 z-50 flex w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
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
            <h1 className="truncate text-base font-bold leading-tight">NUST CEME</h1>
            <p className="truncate text-xs text-slate-400">Student Billing System</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          if (item.label === "Dashboard") {
            const active = pathname === "/dashboard" || pathname === "/dashboard/";
            return (
              <div key={item.href} className="group flex flex-col">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <svg
                    className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                
                {/* Submenu on hover */}
                <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out pl-6 space-y-1 group-hover:max-h-48 group-hover:py-1">
                  {[
                    { name: "NS", query: "NS" },
                    { name: "ASC", query: "AES" },
                    { name: "PC", query: "PC" },
                    { name: "GC", query: "GC" },
                  ].map((sub) => (
                    <Link
                      key={sub.name}
                      href={`/dashboard?category=${sub.query}`}
                      onClick={onClose}
                      className="flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-indigo-600/20 hover:text-white transition duration-200"
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

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
});
