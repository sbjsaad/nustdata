"use client";

import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const canPrev = hasPrevPage ?? page > 1;
  const canNext = hasNextPage ?? page < totalPages;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {onLimitChange && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        )}
        <Button variant="secondary" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <span className="px-2 text-sm text-slate-600">
          Page {page} of {totalPages}
        </span>
        <Button variant="secondary" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
