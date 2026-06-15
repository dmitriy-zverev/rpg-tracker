import type { QuestType } from "../../api/types";
import "./quest-type-icon.css";

const ICONS: Record<QuestType, string> = {
  main: "◈",
  crafting: "▣",
  debug: "◎",
  test: "◇",
  boss: "✦",
};

export function QuestTypeIcon({ type }: { type: QuestType }) {
  return (
    <span className={`quest-type-icon quest-type-icon--${type}`} title={type} aria-hidden>
      {ICONS[type]}
    </span>
  );
}
