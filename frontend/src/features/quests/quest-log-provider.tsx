import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { Quest, QuestStatus } from "../../shared/api/types";

export interface QuestLogFilters {
  stage_id?: number;
  domain?: string;
  status?: QuestStatus;
}

interface QuestLogState {
  filters: QuestLogFilters;
  quests: Quest[];
  isLoading: boolean;
  expandedId: number | null;
}

interface QuestLogActions {
  setFilter: (key: keyof QuestLogFilters, value: string | number | undefined) => void;
  updateStatus: (id: number, status: QuestStatus) => void;
  updateNotes: (id: number, notes: string, evidence: string) => void;
  toggleExpand: (id: number) => void;
}

interface QuestLogMeta {
  isPending: boolean;
}

const QuestLogContext = createContext<{
  state: QuestLogState;
  actions: QuestLogActions;
  meta: QuestLogMeta;
} | null>(null);

export function QuestLogProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<QuestLogFilters>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["quests", filters],
    queryFn: () => api.getQuests(filters),
  });

  const mutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof api.updateQuest>[1] }) =>
      api.updateQuest(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const value = useMemo(
    () => ({
      state: {
        filters,
        quests: data?.quests ?? [],
        isLoading,
        expandedId,
      },
      actions: {
        setFilter: (key: keyof QuestLogFilters, value: string | number | undefined) => {
          setFilters((prev) => ({ ...prev, [key]: value === "" ? undefined : value }));
        },
        updateStatus: (id: number, status: QuestStatus) => {
          mutation.mutate({ id, body: { status } });
        },
        updateNotes: (id: number, notes: string, evidence: string) => {
          mutation.mutate({ id, body: { notes, evidence } });
        },
        toggleExpand: (id: number) => {
          setExpandedId((cur) => (cur === id ? null : id));
        },
      },
      meta: { isPending: mutation.isPending },
    }),
    [filters, data?.quests, isLoading, expandedId, mutation],
  );

  return <QuestLogContext value={value}>{children}</QuestLogContext>;
}

export function useQuestLog() {
  const ctx = use(QuestLogContext);
  if (!ctx) throw new Error("useQuestLog outside provider");
  return ctx;
}
