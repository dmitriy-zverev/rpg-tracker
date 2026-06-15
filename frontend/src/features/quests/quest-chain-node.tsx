import type { Quest } from "../../shared/api/types";
import { QuestTypeIcon } from "../../shared/ui/quest-type-icon/quest-type-icon";
import { QUEST_TYPE_NODE_LABELS } from "../../shared/campaign/labels";
import "./quest-log.css";

interface QuestNodeProps {
  quest: Quest;
  step: number;
  onSelect: () => void;
  className?: string;
}

function QuestNodeRoot({ quest, step, onSelect, className = "" }: QuestNodeProps) {
  return (
    <button
      type="button"
      className={`quest-node quest-node--${quest.status} ${className}`.trim()}
      onClick={onSelect}
    >
      <span className="quest-node__step">{step}</span>
      <QuestTypeIcon type={quest.quest_type} />
      <span className="quest-node__type">{QUEST_TYPE_NODE_LABELS[quest.quest_type]}</span>
      <span className="quest-node__xp">
        {quest.earned_xp}/{quest.xp}
      </span>
    </button>
  );
}

function Boss({ quest, step, onSelect, className = "" }: QuestNodeProps) {
  return (
    <QuestNodeRoot
      quest={quest}
      step={step}
      onSelect={onSelect}
      className={`quest-node--boss ${className}`.trim()}
    />
  );
}

function Selected({ quest, step, onSelect, className = "" }: QuestNodeProps) {
  return (
    <QuestNodeRoot
      quest={quest}
      step={step}
      onSelect={onSelect}
      className={`quest-node--selected ${className}`.trim()}
    />
  );
}

export const QuestNode = Object.assign(QuestNodeRoot, { Boss, Selected });
