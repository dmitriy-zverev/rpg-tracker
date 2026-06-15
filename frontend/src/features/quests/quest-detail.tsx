import { useState } from "react";
import { useQuestLog } from "./quest-log-provider";
import { QUEST_STATUS_LABELS, QUEST_TYPE_LABELS } from "../../shared/campaign/labels";
import type { Quest, QuestStatus } from "../../shared/api/types";
import "./quest-log.css";

const STATUSES: QuestStatus[] = ["not_started", "in_progress", "review", "blocked", "done"];

const FIELD_ICONS = {
  evidence: "◇",
  notes: "▤",
  status: "◷",
  save: "▣",
} as const;

interface QuestDetailFieldProps {
  icon: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

function QuestDetailField({ icon, label, value, placeholder, onChange, readOnly }: QuestDetailFieldProps) {
  return (
    <label className="quest-detail__field">
      <span className="quest-detail__field-icon" title={label} aria-hidden>
        {icon}
      </span>
      <textarea
        className="quest-detail__field-input"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
      />
    </label>
  );
}

function QuestDetailHeader({ quest }: { quest: Quest }) {
  const typeLabel = QUEST_TYPE_LABELS[quest.quest_type];

  return (
    <div className="quest-detail__header">
      <span className={`quest-detail__badge${quest.quest_type === "boss" ? " quest-detail__badge--boss" : ""}`}>
        Act {quest.act_number} · {typeLabel}
      </span>
      <h3 className="quest-detail__title prose">{quest.title}</h3>
    </div>
  );
}

function QuestDetailMeta({ quest }: { quest: Quest }) {
  return (
    <div className="quest-detail__chips">
      <span className="quest-detail__chip">{quest.stage_name}</span>
      <span className="quest-detail__chip">{quest.domain}</span>
      <span className="quest-detail__chip">{quest.estimated_hours}h</span>
      <span className="quest-detail__chip quest-detail__chip--xp">
        {quest.earned_xp}/{quest.xp} XP
      </span>
    </div>
  );
}

function QuestDetailActions({ quest }: { quest: Quest }) {
  const { actions, meta } = useQuestLog();

  if (quest.status === "done") return null;

  const isBoss = quest.quest_type === "boss";
  const primaryLabel =
    quest.status === "not_started" ? "Begin Quest" : isBoss ? "▶ Slay Boss" : "▶ Mark Cleared";

  return (
    <div className="quest-detail__actions">
      {quest.status === "not_started" ? (
        <button
          type="button"
          className="pixel-button pixel-button--primary quest-detail__cta"
          disabled={meta.isPending}
          onClick={() => actions.updateStatus(quest.id, "in_progress")}
        >
          {primaryLabel}
        </button>
      ) : (
        <button
          type="button"
          className={`pixel-button pixel-button--primary quest-detail__cta${isBoss ? " pixel-button--boss" : ""}`}
          disabled={meta.isPending}
          onClick={() => actions.updateStatus(quest.id, "done")}
        >
          {primaryLabel}
        </button>
      )}
    </div>
  );
}

function QuestDetailCleared() {
  return <p className="quest-detail__cleared stats">◆ Quest cleared — XP earned</p>;
}

function QuestDetailNotes({ quest }: { quest: Quest }) {
  const { actions, meta } = useQuestLog();
  const [notes, setNotes] = useState(quest.notes);
  const [evidence, setEvidence] = useState(quest.evidence);
  const isDone = quest.status === "done";
  const dirty = notes !== quest.notes || evidence !== quest.evidence;

  return (
    <div className={`quest-detail__notes${isDone ? " quest-detail__notes--done" : ""}`}>
      <div className="quest-detail__toolbar">
        {!isDone && (
          <div className="quest-detail__status-wrap">
            <span className="quest-detail__toolbar-icon" title="Status" aria-hidden>
              {FIELD_ICONS.status}
            </span>
            <select
              className="quest-detail__status"
              aria-label="Quest status"
              value={quest.status}
              onChange={(e) => actions.updateStatus(quest.id, e.target.value as QuestStatus)}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {QUEST_STATUS_LABELS[status] ?? status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="button"
          className={`pixel-button quest-detail__save${dirty ? " quest-detail__save--dirty" : ""}`}
          disabled={meta.isPending || isDone}
          aria-label="Save evidence and notes"
          title="Save"
          onClick={() => actions.updateNotes(quest.id, notes, evidence)}
        >
          <span className="quest-detail__save-icon" aria-hidden>
            {FIELD_ICONS.save}
          </span>
          <span className="quest-detail__save-label stats">Save</span>
        </button>
      </div>

      <div className="quest-detail__fields">
        <QuestDetailField
          icon={FIELD_ICONS.evidence}
          label="Evidence"
          placeholder="Links, commits, demos…"
          value={evidence}
          readOnly={isDone}
          onChange={setEvidence}
        />
        <QuestDetailField
          icon={FIELD_ICONS.notes}
          label="Notes"
          placeholder="What you learned, blockers…"
          value={notes}
          readOnly={isDone}
          onChange={setNotes}
        />
      </div>
    </div>
  );
}

function QuestDetailRoot({ quest }: { quest: Quest }) {
  const isBoss = quest.quest_type === "boss";
  const isDone = quest.status === "done";

  return (
    <div
      className={`quest-detail${isBoss ? " quest-detail--boss" : ""}${isDone ? " quest-detail--done" : ""}`}
    >
      <QuestDetailHeader quest={quest} />
      <QuestDetailMeta quest={quest} />
      {isDone ? <QuestDetailCleared /> : <QuestDetailActions quest={quest} />}
      <QuestDetailNotes quest={quest} />
    </div>
  );
}

export const QuestDetail = Object.assign(QuestDetailRoot, {
  Header: QuestDetailHeader,
  Meta: QuestDetailMeta,
  Actions: QuestDetailActions,
  Cleared: QuestDetailCleared,
  Notes: QuestDetailNotes,
});
