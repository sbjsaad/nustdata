"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { getDefaultPageMeta, type PageMeta } from "@/lib/routeMeta";

const PageMetaContext = createContext<PageMeta>({ title: "NUST EME Billing" });

type OverrideState = {
  path: string;
  meta: Partial<PageMeta>;
};

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const defaults = useMemo(() => getDefaultPageMeta(pathname), [pathname]);
  const [override, setOverride] = useState<OverrideState | null>(null);

  const activeOverride = override?.path === pathname ? override.meta : null;

  const meta = useMemo(
    () => ({
      title: activeOverride?.title ?? defaults.title,
      subtitle: activeOverride?.subtitle ?? defaults.subtitle,
    }),
    [defaults, activeOverride]
  );

  return (
    <PageMetaContext.Provider value={meta}>
      <PageMetaSetterContext.Provider value={setOverride}>{children}</PageMetaSetterContext.Provider>
    </PageMetaContext.Provider>
  );
}

const PageMetaSetterContext = createContext<
  (state: OverrideState | null) => void
>(() => {});

export function usePageMeta(meta?: Partial<PageMeta>) {
  const pathname = usePathname();
  const setOverride = useContext(PageMetaSetterContext);
  const title = meta?.title;
  const subtitle = meta?.subtitle;

  useEffect(() => {
    if (!title && !subtitle) return;
    setOverride({ path: pathname, meta: { title, subtitle } });
    return () => setOverride(null);
  }, [pathname, title, subtitle, setOverride]);
}

export function usePageMetaValue() {
  return useContext(PageMetaContext);
}
