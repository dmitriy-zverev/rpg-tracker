import { createContext, use, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { RoadmapStage } from "../../shared/api/types";

export interface RoadmapState {
  stages: RoadmapStage[];
  isLoading: boolean;
}

export interface RoadmapActions {}

export interface RoadmapMeta {}

interface RoadmapContextValue {
  state: RoadmapState;
  actions: RoadmapActions;
  meta: RoadmapMeta;
}

const RoadmapContext = createContext<RoadmapContextValue | null>(null);

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["roadmap"],
    queryFn: api.getRoadmapStages,
  });

  const value = useMemo<RoadmapContextValue>(
    () => ({
      state: {
        stages: data?.stages ?? [],
        isLoading,
      },
      actions: {},
      meta: {},
    }),
    [data?.stages, isLoading],
  );

  return <RoadmapContext value={value}>{children}</RoadmapContext>;
}

export function useRoadmap() {
  const ctx = use(RoadmapContext);
  if (!ctx) throw new Error("useRoadmap outside provider");
  return ctx;
}
