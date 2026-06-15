import { createContext, use, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { Dashboard } from "../../shared/api/types";

export interface PlayerSessionState {
  data: Dashboard | undefined;
  isLoading: boolean;
}

export interface PlayerSessionActions {
  refresh: () => void;
}

export interface PlayerSessionMeta {
  queryKey: readonly ["dashboard"];
}

interface PlayerSessionContextValue {
  state: PlayerSessionState;
  actions: PlayerSessionActions;
  meta: PlayerSessionMeta;
}

const PlayerSessionContext = createContext<PlayerSessionContextValue | null>(null);

export function PlayerSessionProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
  });

  const value = useMemo<PlayerSessionContextValue>(
    () => ({
      state: { data, isLoading },
      actions: { refresh: () => void refetch() },
      meta: { queryKey: ["dashboard"] as const },
    }),
    [data, isLoading, refetch],
  );

  return <PlayerSessionContext value={value}>{children}</PlayerSessionContext>;
}

export function usePlayerSession() {
  const ctx = use(PlayerSessionContext);
  if (!ctx) throw new Error("usePlayerSession outside PlayerSessionProvider");
  return ctx;
}
