import type { Quest } from "../api/types";

export function questLogPath(questId?: number | null): string {
  if (questId == null) return "/quests";
  return `/quests?q=${questId}`;
}

export function resolveFocusQuestId(quests: Quest[], questIdParam: string | null): number | null {
  const paramId = Number(questIdParam);
  if (Number.isFinite(paramId) && paramId > 0 && quests.some((quest) => quest.id === paramId)) {
    return paramId;
  }

  return (
    quests.find((quest) => quest.status === "in_progress")?.id ??
    quests.find((quest) => quest.status === "not_started")?.id ??
    quests[0]?.id ??
    null
  );
}

export function chainIndexForQuest(chains: Array<{ quests: Quest[] }>, questId: number): number {
  const index = chains.findIndex((chain) => chain.quests.some((quest) => quest.id === questId));
  return index >= 0 ? index : 0;
}
