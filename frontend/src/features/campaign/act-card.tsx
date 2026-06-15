import { Link } from "react-router-dom";
import type { ActSummary } from "../../shared/api/types";
import { ACT_STATUS_LABELS, campaignEnterRoute } from "../../shared/campaign/labels";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import "./act-card.css";

interface ActCardProps {
  act: ActSummary;
  campaignSlug?: string;
}

export function ActCard({ act, campaignSlug }: ActCardProps) {
  const isBoss = act.boss_total > 0;
  const statusLabel = ACT_STATUS_LABELS[act.status] ?? act.status;
  const enterLink = campaignSlug ? campaignEnterRoute(campaignSlug) : "/roadmap";

  return (
    <article className={`act-card act-card--${act.status}`}>
      <header className="act-card__head">
        <span className="act-card__number stats">Act {act.number}</span>
        <span className={`act-card__status stats act-card__status--${act.status}`}>{statusLabel}</span>
      </header>
      <h3 className="act-card__name display">{act.name}</h3>
      <p className="act-card__tagline stats">{act.tagline}</p>
      <RoadmapBar progress={act.progress} />
      <div className="act-card__stats stats">
        <span>{act.quest_done}/{act.quest_total} quests</span>
        {isBoss && (
          <span className="act-card__boss">
            ☠ {act.boss_done}/{act.boss_total} bosses
          </span>
        )}
        <span>{act.stages_cleared}/{act.stages_total} zones</span>
      </div>
      <div className="act-card__xp stats">
        {act.earned_xp}/{act.available_xp} XP
      </div>
      {act.status !== "locked" && (
        <Link className="act-card__link stats" to={enterLink}>
          Enter act →
        </Link>
      )}
    </article>
  );
}
