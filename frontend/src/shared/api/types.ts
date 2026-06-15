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
  campaign_slug: string;
  act_number: number;
}

export interface ActSummary {
  number: number;
  slug: string;
  name: string;
  tagline: string;
  stage_from: number;
  stage_to: number;
  available_xp: number;
  earned_xp: number;
  progress: number;
  quest_total: number;
  quest_done: number;
  boss_total: number;
  boss_done: number;
  stages_total: number;
  stages_cleared: number;
  status: "locked" | "active" | "cleared";
}

export interface CampaignDetail {
  slug: string;
  name: string;
  tagline: string;
  discipline: string;
  progress: number;
  earned_xp: number;
  available_xp: number;
  acts: ActSummary[];
}

export interface CampaignSummary {
  slug: string;
  name: string;
  tagline: string;
  discipline: string;
  progress: number;
  earned_xp: number;
  available_xp: number;
  act_count: number;
  acts_cleared: number;
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
  campaign: CampaignDetail;
  campaigns: CampaignSummary[];
  current_quest: Quest | null;
  suggested_quest: Quest | null;
  up_next_quests: Quest[];
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
