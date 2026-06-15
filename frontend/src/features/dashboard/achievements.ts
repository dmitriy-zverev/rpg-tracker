import type { Dashboard } from "../../shared/api/types";

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  icon: string;
  earned: boolean;
  progressLabel?: string;
}

export function buildAchievements(data: Dashboard): Achievement[] {
  const cleared = data.quest_counts.done ?? 0;
  const bossesDone = data.campaign.acts.reduce((sum, act) => sum + act.boss_done, 0);
  const actsCleared = data.campaign.acts.filter((act) => act.status === "cleared").length;
  const domainsMastered = data.domains.filter((domain) => domain.progress >= 1).length;
  const zonesCleared = data.stages.filter((stage) => stage.progress >= 1).length;

  return [
    {
      id: "first-clear",
      title: "First Clear",
      detail: "Complete your first quest",
      icon: "◆",
      earned: cleared >= 1,
      progressLabel: `${Math.min(cleared, 1)}/1`,
    },
    {
      id: "quest-veteran",
      title: "Quest Veteran",
      detail: "Clear 25 quests",
      icon: "▣",
      earned: cleared >= 25,
      progressLabel: `${cleared}/25`,
    },
    {
      id: "boss-hunter",
      title: "Boss Hunter",
      detail: "Slay a boss quest",
      icon: "☠",
      earned: bossesDone >= 1,
      progressLabel: `${bossesDone}/1`,
    },
    {
      id: "act-breaker",
      title: "Act Breaker",
      detail: "Clear a campaign act",
      icon: "⬡",
      earned: actsCleared >= 1,
      progressLabel: `${actsCleared}/1`,
    },
    {
      id: "domain-sage",
      title: "Domain Sage",
      detail: "Master a domain at 100% XP",
      icon: "✦",
      earned: domainsMastered >= 1,
      progressLabel: `${domainsMastered}/1`,
    },
    {
      id: "zone-conqueror",
      title: "Zone Conqueror",
      detail: "Clear a world-map zone",
      icon: "◎",
      earned: zonesCleared >= 1,
      progressLabel: `${zonesCleared}/1`,
    },
    {
      id: "rank-rise",
      title: "Rank Rise",
      detail: "Reach Backend Initiate (Lv 4)",
      icon: "↑",
      earned: data.level >= 4,
      progressLabel: `Lv ${data.level}`,
    },
    {
      id: "campaign-pledge",
      title: "Campaign Pledge",
      detail: "Earn XP in your active campaign",
      icon: "⚔",
      earned: data.campaign.earned_xp > 0,
      progressLabel: `${(data.campaign.progress * 100).toFixed(0)}%`,
    },
  ];
}
