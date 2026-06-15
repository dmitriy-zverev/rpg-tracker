import { useDashboard } from "../dashboard/dashboard-provider";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { ActCard } from "./act-card";
import { CampaignCard } from "./campaign-card";
import "../dashboard/dashboard.css";
import "./act-card.css";
import "./campaign-card.css";

export function CampaignOverview() {
  const { state } = useDashboard();
  const campaign = state.data?.campaign;
  const campaigns = state.data?.campaigns;
  if (!campaign || !campaigns) return null;

  return (
    <div className="dash-slide dash-slide--campaign">
      <div className="dash-campaign-list">
        {campaigns.map((item) => (
          <div
            key={item.slug}
            className={item.slug === campaign.slug ? "campaign-card-wrap campaign-card-wrap--active" : "campaign-card-wrap"}
          >
            <CampaignCard campaign={item}>
              {item.slug === campaign.slug && <CampaignCard.ActiveBadge />}
              {item.progress >= 1 && <CampaignCard.DoneBadge />}
            </CampaignCard>
          </div>
        ))}
      </div>
      <section className="dash-campaign-detail" aria-labelledby="campaign-detail-title">
        <header className="campaign-hero">
          <h2 id="campaign-detail-title" className="campaign-hero__name display">
            {campaign.name}
          </h2>
          <p className="campaign-hero__tagline stats">{campaign.tagline}</p>
          <div className="campaign-hero__progress">
            <RoadmapBar progress={campaign.progress} />
            <span className="campaign-hero__xp stats">
              {campaign.earned_xp}/{campaign.available_xp} XP
            </span>
          </div>
        </header>
        <div className="dash-act-grid">
          {campaign.acts.map((act) => (
            <ActCard key={act.slug} act={act} campaignSlug={campaign.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}
