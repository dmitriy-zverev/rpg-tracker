import { createContext, use, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { SkillBranch } from "../../shared/api/types";

export interface SkillTreeState {
  branches: SkillBranch[];
  isLoading: boolean;
}

export interface SkillTreeActions {}

export interface SkillTreeMeta {}

interface SkillTreeContextValue {
  state: SkillTreeState;
  actions: SkillTreeActions;
  meta: SkillTreeMeta;
}

const SkillTreeContext = createContext<SkillTreeContextValue | null>(null);

export function SkillTreeProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: api.getSkillBranches,
  });

  const value = useMemo<SkillTreeContextValue>(
    () => ({
      state: { branches: data?.branches ?? [], isLoading },
      actions: {},
      meta: {},
    }),
    [data?.branches, isLoading],
  );

  return <SkillTreeContext value={value}>{children}</SkillTreeContext>;
}

export function useSkillTree() {
  const ctx = use(SkillTreeContext);
  if (!ctx) throw new Error("useSkillTree outside provider");
  return ctx;
}
