import type { Dashboard, Domain, Quest, QuestStatus, RoadmapStage, SkillBranch } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getDashboard: () => request<Dashboard>("/api/v1/dashboard/"),
  getDomains: () => request<{ domains: Domain[] }>("/api/v1/domains/"),
  getQuests: (params?: { stage_id?: number; domain?: string; status?: QuestStatus }) => {
    const search = new URLSearchParams();
    if (params?.stage_id != null) search.set("stage_id", String(params.stage_id));
    if (params?.domain) search.set("domain", params.domain);
    if (params?.status) search.set("status", params.status);
    const q = search.toString();
    return request<{ quests: Quest[] }>(`/api/v1/quests/${q ? `?${q}` : ""}`);
  },
  updateQuest: (id: number, body: Partial<Pick<Quest, "status" | "notes" | "evidence">>) =>
    request<Quest>(`/api/v1/quests/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  getRoadmapStages: () => request<{ stages: RoadmapStage[] }>("/api/v1/roadmap/stages"),
  getSkillBranches: () => request<{ branches: SkillBranch[] }>("/api/v1/skills/branches"),
};
