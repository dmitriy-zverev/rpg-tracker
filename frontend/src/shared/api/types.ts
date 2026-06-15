export type QuestStatus = "not_started" | "in_progress" | "review" | "blocked" | "done";
export type QuestType = "main" | "crafting" | "debug" | "test" | "boss";
export type Priority = "A" | "B" | "C";

export interface Domain {
  slug: string;
  name: string;
  color: string;
  icon: string;
}

export interface Quest {
  id: number;
  stage_index: number;
  stage_name: string;
  domain: string;
  quest_type: QuestType;
  title: string;
  priority: Priority;
  status: QuestStatus;
  estimated_hours: number;
  xp: number;
  earned_xp: number;
  progress: number;
  notes: string;
  evidence: string;
  start_date: string | null;
  deadline: string | null;
}

export interface Dashboard {
  player: { name: string; title: string };
  level: number;
  rank: string;
  total_xp: number;
  xp_to_next_level: number;
  quest_counts: Record<string, number>;
  domains: Array<Domain & { available_xp: number; earned_xp: number; progress: number }>;
  stages: Array<{ index: number; name: string; month: number; priority: Priority; progress: number }>;
}

export interface RoadmapStage {
  index: number;
  name: string;
  focus: string;
  priority: Priority;
  month: number;
  domain: string;
  curriculum: string;
  resources: string;
  stage_project: string;
  transition_criteria: string;
  ai_accelerator: string;
  anti_crisis_value: string;
  available_xp: number;
  earned_xp: number;
  progress: number;
}

export interface SkillBranch {
  id: number;
  name: string;
  meaning: string;
  domains: string[];
  next_unlock: string;
  anti_ai_value: string;
  available_xp: number;
  earned_xp: number;
  progress: number;
}
