import type { QuestType } from "../api/types";

export const QUEST_TYPE_LABELS: Record<QuestType, string> = {
  main: "Lesson",
  crafting: "Practice",
  debug: "Trial",
  test: "Proof",
  boss: "Boss Fight",
};

export const QUEST_TYPE_NODE_LABELS: Record<QuestType, string> = {
  main: "Lesson",
  crafting: "Practice",
  debug: "Trial",
  test: "Proof",
  boss: "Boss",
};

export const QUEST_STATUS_LABELS: Record<string, string> = {
  not_started: "New",
  in_progress: "In Progress",
  review: "Review",
  blocked: "Blocked",
  done: "Cleared",
};

export const ACT_STATUS_LABELS: Record<string, string> = {
  locked: "Sealed",
  active: "Open",
  cleared: "Conquered",
};

export function campaignEnterRoute(slug: string): string {
  return slug === "tutorial" ? "/quests" : "/roadmap";
}

export function campaignEnterLabel(slug: string): string {
  return slug === "tutorial" ? "Start tutorial" : "Enter world";
}

export function questCtaLabel(campaignSlug: string, mode: "resume" | "start"): string {
  const trial = campaignSlug === "tutorial";
  if (mode === "resume") return trial ? "Continue Trial" : "Resume Quest";
  return trial ? "Start Trial" : "Start Quest";
}
