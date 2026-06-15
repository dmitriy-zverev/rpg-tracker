import type { QuestType } from "../../api/types";

const ICONS: Record<QuestType, string> = {
  main: "⚔️",
  crafting: "🔨",
  debug: "🧭",
  test: "🧪",
  boss: "💀",
};

export function QuestTypeIcon({ type }: { type: QuestType }) {
  return <span title={type}>{ICONS[type]}</span>;
}
