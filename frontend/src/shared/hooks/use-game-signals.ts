import { useEffect, useMemo, useState } from "react";
import type { Dashboard } from "../api/types";

export type GameAttention = "active" | "unlock" | "milestone" | "explore" | "calm";

export interface GameSignals {
  attention: GameAttention;
  tickerLines: string[];
  nudgeText: string | null;
  nudgeCta: string | null;
  pulseHud: boolean;
  pulseLog: boolean;
  pulseMap: boolean;
}

export function deriveGameSignals(data: Dashboard | undefined): GameSignals {
  if (!data) {
    return {
      attention: "calm",
      tickerLines: ["Syncing adventurer data..."],
      nudgeText: null,
      nudgeCta: null,
      pulseHud: false,
      pulseLog: false,
      pulseMap: false,
    };
  }

  const current = data.current_quest;
  const suggested = data.suggested_quest;
  const almostLevel = data.xp_to_next_level > 0 && data.xp_to_next_level <= 48;
  const notStarted = data.quest_counts.not_started ?? 0;

  if (current) {
    return {
      attention: almostLevel ? "milestone" : "active",
      tickerLines: [`Active quest — ${current.title}`],
      nudgeText: null,
      nudgeCta: null,
      pulseHud: true,
      pulseLog: true,
      pulseMap: false,
    };
  }

  if (suggested) {
    return {
      attention: "unlock",
      tickerLines: [`Quest ready — ${suggested.title}`],
      nudgeText: null,
      nudgeCta: null,
      pulseHud: true,
      pulseLog: false,
      pulseMap: false,
    };
  }

  if (notStarted > 0) {
    return {
      attention: "explore",
      tickerLines: ["No active quest — open the map"],
      nudgeText: null,
      nudgeCta: null,
      pulseHud: false,
      pulseLog: false,
      pulseMap: true,
    };
  }

  return {
    attention: "calm",
    tickerLines: [],
    nudgeText: null,
    nudgeCta: null,
    pulseHud: false,
    pulseLog: false,
    pulseMap: false,
  };
}

export function useRotatingLine(lines: string[], intervalMs = 4200): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (lines.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [lines, intervalMs]);

  useEffect(() => {
    setIndex(0);
  }, [lines.join("|")]);

  return lines[index] ?? "";
}

export function useGameSignals(data: Dashboard | undefined): GameSignals {
  return useMemo(() => deriveGameSignals(data), [data]);
}
