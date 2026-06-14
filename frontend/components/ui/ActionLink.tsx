"use client";

import Link from "next/link";

interface ActionLinkProps {
  href?: string;
  label: string;
  variant?: "view" | "edit" | "delete";
  onClick?: () => void;
}

const styles = {
  view: "text-indigo-600 hover:underline",
  edit: "text-amber-600 hover:underline",
  delete: "text-red-600 hover:underline",
};

export function ActionLink({ href, label, variant = "view", onClick }: ActionLinkProps) {
  const className = `text-sm font-medium ${styles[variant]}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {label}
      </button>
    );
  }

  if (!href) return null;

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function ActionGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}
