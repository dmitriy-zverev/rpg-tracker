import { Link } from "react-router-dom";
import { useDashboard } from "../dashboard/dashboard-provider";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { QuestTypeIcon } from "../../shared/ui/quest-type-icon/quest-type-icon";
import { questCtaLabel } from "../../shared/campaign/labels";
import { questLogPath } from "../../shared/quests/paths";
import type { Quest } from "../../shared/api/types";
import "../dashboard/dashboard.css";

function QuestMeta({ quest }: { quest: Quest }) {
  return (
    <div className="dash-quest-card__meta stats">
      <span>{quest.stage_name}</span>
      <span>·</span>
      <span>{quest.domain}</span>
      <span>·</span>
      <span>{quest.estimated_hours}h</span>
      <span>·</span>
      <span>
        {quest.earned_xp}/{quest.xp} XP
      </span>
    </div>
  );
}

function QuestCtaHint({ quest }: { quest: Quest }) {
  const remainingXp = Math.max(quest.xp - quest.earned_xp, 0);
  return (
    <span className="dash-quest-card__cta-hint stats">
      {remainingXp > 0 ? `${remainingXp} XP left` : "Ready to clear"}
      {quest.estimated_hours > 0 ? ` · ~${quest.estimated_hours}h` : ""}
    </span>
  );
}

function UpNextSummary({ quests }: { quests: Quest[] }) {
  const next = quests[0];
  if (!next) return null;

  return (
    <p className="dash-up-next-summary stats">
      <span className="dash-up-next-summary__label">Next up</span>
      <span className="dash-up-next-summary__name">{next.title}</span>
      <span className="dash-up-next-summary__xp">{next.xp} XP</span>
    </p>
  );
}

export function QuestFocusPanel({ linked = false }: { linked?: boolean }) {
  const { state, actions, meta } = useDashboard();
  const dashboard = state.data;
  if (!dashboard) return null;

  const current = dashboard.current_quest;
  const suggested = dashboard.suggested_quest;
  const upNext = dashboard.up_next_quests;
  const headline = current ? "Now" : suggested ? "Next" : "Clear";
  const campaignSlug = dashboard.campaign.slug;

  return (
    <section
      className={`dash-quest-focus${linked ? " dash-quest-focus--linked" : ""}`}
      aria-labelledby="dash-quest-focus-title"
    >
      <h2 id="dash-quest-focus-title" className="display dash-quest-focus__title">
        {headline}
      </h2>

      {state.error && <p className="dash-quest-focus__error stats">{state.error}</p>}

      {current ? (
        <article className="dash-quest-card dash-quest-card--active">
          <div className="dash-quest-card__row">
            <QuestTypeIcon type={current.quest_type} />
            <h3 className="dash-quest-card__name prose">{current.title}</h3>
          </div>
          <QuestMeta quest={current} />
          <RoadmapBar progress={current.progress} />
          <Link className="pixel-button pixel-button--primary dash-quest-card__cta" to={questLogPath(current.id)}>
            <span className="dash-quest-card__cta-label">▶ {questCtaLabel(campaignSlug, "resume")}</span>
            <QuestCtaHint quest={current} />
          </Link>
          <UpNextSummary quests={upNext} />
          <div className="dash-quest-card__secondary">
            <Link className="dash-quest-card__link stats" to={questLogPath(current.id)}>
              Open log →
            </Link>
          </div>
        </article>
      ) : suggested ? (
        <article className="dash-quest-card dash-quest-card--ready">
          <div className="dash-quest-card__row">
            <QuestTypeIcon type={suggested.quest_type} />
            <h3 className="dash-quest-card__name prose">{suggested.title}</h3>
          </div>
          <QuestMeta quest={suggested} />
          <button
            type="button"
            className="pixel-button pixel-button--primary dash-quest-card__cta"
            disabled={meta.isStarting}
            onClick={() => actions.startQuest(suggested.id)}
          >
            <span className="dash-quest-card__cta-label">
              {meta.isStarting ? "Starting..." : `▶ ${questCtaLabel(campaignSlug, "start")}`}
            </span>
            {!meta.isStarting && <QuestCtaHint quest={suggested} />}
          </button>
          <UpNextSummary quests={upNext} />
          <div className="dash-quest-card__secondary">
            <Link className="dash-quest-card__link stats" to={questLogPath(suggested.id)}>
              Details →
            </Link>
          </div>
        </article>
      ) : (
        <article className="dash-quest-card dash-quest-card--idle">
          <p className="dash-quest-card__idle stats">Pick next stage on the map.</p>
          <Link className="pixel-button pixel-button--primary dash-quest-card__cta" to="/roadmap">
            ▶ Enter World
          </Link>
        </article>
      )}
    </section>
  );
}
