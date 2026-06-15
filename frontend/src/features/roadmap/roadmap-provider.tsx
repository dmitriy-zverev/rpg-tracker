import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { RoadmapStage } from "../../shared/api/types";

const RoadmapContext = createContext<{
  state: { stages: RoadmapStage[]; isLoading: boolean; expandedId: number | null };
  actions: { toggleExpand: (index: number) => void };
  meta: { loading: boolean };
} | null>(null);

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["roadmap"],
    queryFn: api.getRoadmapStages,
  });

  const value = useMemo(
    () => ({
      state: {
        stages: data?.stages ?? [],
        isLoading,
        expandedId,
      },
      actions: {
        toggleExpand: (index: number) => {
          setExpandedId((cur) => (cur === index ? null : index));
        },
      },
      meta: { loading: isLoading },
    }),
    [data?.stages, isLoading, expandedId],
  );

  return <RoadmapContext value={value}>{children}</RoadmapContext>;
}

export function useRoadmap() {
  const ctx = use(RoadmapContext);
  if (!ctx) throw new Error("useRoadmap outside provider");
  return ctx;
}
