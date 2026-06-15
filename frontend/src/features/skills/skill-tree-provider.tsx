import { createContext, use, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import type { SkillBranch } from "../../shared/api/types";

const SkillTreeContext = createContext<{
  state: { branches: SkillBranch[]; isLoading: boolean };
  meta: { loading: boolean };
} | null>(null);

export function SkillTreeProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: api.getSkillBranches,
  });

  const value = useMemo(
    () => ({
      state: { branches: data?.branches ?? [], isLoading },
      meta: { loading: isLoading },
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
