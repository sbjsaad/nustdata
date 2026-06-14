"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiClientError } from "@/lib/api";
import type { PaginationMeta } from "@/lib/types";

interface UsePaginatedFetchOptions {
  endpoint: string;
  listKey: string;
  initialLimit?: number;
  filters?: Record<string, string>;
  enabled?: boolean;
}

function buildQueryParams(
  page: number,
  limit: number,
  filters: Record<string, string>
) {
  return new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== "")
    ),
  });
}

export function usePaginatedFetch<T>({
  endpoint,
  listKey,
  initialLimit = 10,
  filters = {},
  enabled = true,
}: UsePaginatedFetchOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const filterKey = JSON.stringify(filters);

  const fetchData = useCallback(
    async (page: number, limit: number) => {
      if (!enabled) return;

      setLoading(true);
      setError("");

      try {
        const params = buildQueryParams(
          page,
          limit,
          JSON.parse(filterKey) as Record<string, string>
        );
        const data = await api.get<Record<string, unknown>>(`${endpoint}?${params}`);
        setItems((data[listKey] as T[]) || []);
        setPagination({
          page: data.page as number,
          limit: data.limit as number,
          total: data.total as number,
          totalPages: data.totalPages as number,
          hasNextPage: data.hasNextPage as boolean,
          hasPrevPage: data.hasPrevPage as boolean,
        });
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [endpoint, listKey, filterKey, enabled]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const params = buildQueryParams(
          1,
          initialLimit,
          JSON.parse(filterKey) as Record<string, string>
        );
        const data = await api.get<Record<string, unknown>>(`${endpoint}?${params}`);

        if (cancelled) return;

        setItems((data[listKey] as T[]) || []);
        setPagination({
          page: data.page as number,
          limit: data.limit as number,
          total: data.total as number,
          totalPages: data.totalPages as number,
          hasNextPage: data.hasNextPage as boolean,
          hasPrevPage: data.hasPrevPage as boolean,
        });
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiClientError ? err.message : "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [endpoint, listKey, filterKey, enabled, initialLimit]);

  const setPage = (page: number) => fetchData(page, pagination.limit);
  const setLimit = (limit: number) => fetchData(1, limit);
  const refresh = () => fetchData(pagination.page, pagination.limit);

  return { items, pagination, loading, error, setPage, setLimit, refresh };
}
