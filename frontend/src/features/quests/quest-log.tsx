import { useState } from "react";
import { QuestLogProvider, useQuestLog } from "./quest-log-provider";
import { PixelPanel } from "../../shared/ui/pixel-panel/pixel-panel";
import { QuestTypeIcon } from "../../shared/ui/quest-type-icon/quest-type-icon";
import { DomainBadge } from "../../shared/ui/domain-badge/domain-badge";
import type { Quest, QuestStatus } from "../../shared/api/types";
import "./quest-log.css";

const STATUSES: QuestStatus[] = ["not_started", "in_progress", "review", "blocked", "done"];

function Toolbar() {
  const { state, actions } = useQuestLog();
  return (
    <div className="quest-toolbar">
      <select
        value={state.filters.status ?? ""}
        onChange={(e) => actions.setFilter("status", e.target.value || undefined)}
      >
        <option value="">All status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      <input
        placeholder="Domain filter"
        value={state.filters.domain ?? ""}
        onChange={(e) => actions.setFilter("domain", e.target.value || undefined)}
      />
    </div>
  );
}

function QuestRowDetails({ quest }: { quest: Quest }) {
  const { actions } = useQuestLog();
  const [notes, setNotes] = useState(quest.notes);
  const [evidence, setEvidence] = useState(quest.evidence);

  return (
    <div className="quest-row__details">
      <label>
        Evidence
        <textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} rows={2} />
      </label>
      <label>
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </label>
      <button
        type="button"
        className="pixel-button"
        onClick={() => actions.updateNotes(quest.id, notes, evidence)}
      >
        Save scroll
      </button>
    </div>
  );
}

function QuestRow({ quest }: { quest: Quest }) {
  const { state, actions } = useQuestLog();
  const expanded = state.expandedId === quest.id;

  return (
    <div className={`quest-row${expanded ? " quest-row--open" : ""}`}>
      <div className="quest-row__main">
        <QuestTypeIcon type={quest.quest_type} />
        <div className="quest-row__title">{quest.title}</div>
        <DomainBadge name={quest.domain} color="#60a5fa" icon="◆" />
        <span className="stats">
          {quest.earned_xp}/{quest.xp} XP
        </span>
        <select
          className="quest-row__status"
          value={quest.status}
          onChange={(e) => actions.updateStatus(quest.id, e.target.value as QuestStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="button" className="pixel-button" onClick={() => actions.toggleExpand(quest.id)}>
          {expanded ? "−" : "+"}
        </button>
      </div>
      {expanded && <QuestRowDetails quest={quest} />}
    </div>
  );
}

function List() {
  const { state } = useQuestLog();
  if (state.isLoading) return <p>Loading quests...</p>;
  return (
    <div className="quest-list">
      {state.quests.map((q, i) => (
        <div key={q.id} className="stagger-item" style={{ animationDelay: `${i * 30}ms` }}>
          <QuestRow quest={q} />
        </div>
      ))}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="quest-log">{children}</div>;
}

export const QuestLog = { Frame, Toolbar, List };

export function QuestLogPage() {
  return (
    <QuestLogProvider>
      <PixelPanel.Frame>
        <PixelPanel.Header>Quest Log</PixelPanel.Header>
        <PixelPanel.Body>
          <QuestLog.Frame>
            <QuestLog.Toolbar />
            <QuestLog.List />
          </QuestLog.Frame>
        </PixelPanel.Body>
      </PixelPanel.Frame>
    </QuestLogProvider>
  );
}
