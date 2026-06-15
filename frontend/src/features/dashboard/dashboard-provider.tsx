import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePlayerSession } from "../../app/game-shell/player-session-provider";
import { api } from "../../shared/api/client";
import type { Dashboard } from "../../shared/api/types";

export interface DashboardState {
  data: Dashboard | undefined;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardActions {
  startQuest: (id: number) => void;
}

export interface DashboardMeta {
  isStarting: boolean;
}

interface DashboardContextValue {
  state: DashboardState;
  actions: DashboardActions;
  meta: DashboardMeta;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const playerSession = usePlayerSession();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const startMutation = useMutation({
    mutationFn: (id: number) => api.updateQuest(id, { status: "in_progress" }),
    onMutate: () => setError(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playerSession.meta.queryKey });
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const value = useMemo<DashboardContextValue>(
    () => ({
      state: {
        data: playerSession.state.data,
        isLoading: playerSession.state.isLoading,
        error,
      },
      actions: { startQuest: (id: number) => startMutation.mutate(id) },
      meta: { isStarting: startMutation.isPending },
    }),
    [playerSession.state.data, playerSession.state.isLoading, error, startMutation],
  );

  return <DashboardContext value={value}>{children}</DashboardContext>;
}

export function useDashboard() {
  const ctx = use(DashboardContext);
  if (!ctx) throw new Error("useDashboard outside provider");
  return ctx;
}
