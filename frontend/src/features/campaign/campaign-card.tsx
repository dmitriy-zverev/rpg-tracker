import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { CampaignSummary } from "../../shared/api/types";
import { campaignEnterRoute, campaignEnterLabel } from "../../shared/campaign/labels";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import "./campaign-card.css";

interface CampaignCardProps {
  campaign: CampaignSummary;
  children?: ReactNode;
}

function CampaignCardRoot({ campaign, children }: CampaignCardProps) {
  const cleared = campaign.progress >= 1;

  return (
    <article className={`campaign-card${cleared ? " campaign-card--cleared" : ""}`}>
      <header className="campaign-card__head">
        <h3 className="campaign-card__name display">{campaign.name}</h3>
        <div className="campaign-card__badges">{children}</div>
      </header>
      <p className="campaign-card__tagline stats">{campaign.tagline}</p>
      <RoadmapBar progress={campaign.progress} />
      <div className="campaign-card__meta stats">
        <span>
          {campaign.acts_cleared}/{campaign.act_count} acts
        </span>
        <span>
          {campaign.earned_xp}/{campaign.available_xp} XP
        </span>
      </div>
      <Link className="campaign-card__link stats" to={campaignEnterRoute(campaign.slug)}>
        {campaignEnterLabel(campaign.slug)} →
      </Link>
    </article>
  );
}

function ActiveBadge() {
  return <span className="campaign-card__badge stats">Active</span>;
}

function DoneBadge() {
  return <span className="campaign-card__badge campaign-card__badge--done stats">Done</span>;
}

export const CampaignCard = Object.assign(CampaignCardRoot, {
  ActiveBadge,
  DoneBadge,
});
