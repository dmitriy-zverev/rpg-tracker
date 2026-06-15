import { createContext, use, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { Dashboard } from "../../shared/api/types";

const DashboardContext = createContext<{
  state: { data: Dashboard | undefined; isLoading: boolean };
  meta: { loading: boolean };
} | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
  });

  const value = useMemo(
    () => ({
      state: { data, isLoading },
      meta: { loading: isLoading },
    }),
    [data, isLoading],
  );

  return <DashboardContext value={value}>{children}</DashboardContext>;
}

export function useDashboard() {
  const ctx = use(DashboardContext);
  if (!ctx) throw new Error("useDashboard outside provider");
  return ctx;
}
