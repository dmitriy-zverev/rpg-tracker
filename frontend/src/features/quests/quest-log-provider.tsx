import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { Quest, QuestStatus } from "../../shared/api/types";

export interface QuestLogState {
  quests: Quest[];
  isLoading: boolean;
  selectedQuestId: number | null;
  error: string | null;
}

export interface QuestLogActions {
  selectQuest: (id: number) => void;
  clearSelection: () => void;
  updateStatus: (id: number, status: QuestStatus) => void;
  updateNotes: (id: number, notes: string, evidence: string) => void;
}

export interface QuestLogMeta {
  isPending: boolean;
}

interface QuestLogContextValue {
  state: QuestLogState;
  actions: QuestLogActions;
  meta: QuestLogMeta;
}

const QuestLogContext = createContext<QuestLogContextValue | null>(null);

export function QuestLogProvider({ children }: { children: ReactNode }) {
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["quests"],
    queryFn: () => api.getQuests(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof api.updateQuest>[1] }) =>
      api.updateQuest(id, body),
    onMutate: () => setError(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const value = useMemo<QuestLogContextValue>(
    () => ({
      state: {
        quests: data?.quests ?? [],
        isLoading,
        selectedQuestId,
        error,
      },
      actions: {
        selectQuest: (id: number) => setSelectedQuestId(id),
        clearSelection: () => setSelectedQuestId(null),
        updateStatus: (id: number, status: QuestStatus) => {
          mutation.mutate({ id, body: { status } });
        },
        updateNotes: (id: number, notes: string, evidence: string) => {
          mutation.mutate({ id, body: { notes, evidence } });
        },
      },
      meta: { isPending: mutation.isPending },
    }),
    [data?.quests, isLoading, selectedQuestId, error, mutation],
  );

  return <QuestLogContext value={value}>{children}</QuestLogContext>;
}

export function useQuestLog() {
  const ctx = use(QuestLogContext);
  if (!ctx) throw new Error("useQuestLog outside provider");
  return ctx;
}
