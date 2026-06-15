import { DashboardProvider, useDashboard } from "./dashboard-provider";
import { QuestFocusPanel } from "../quests/quest-focus-panel";
import { CampaignOverview } from "../campaign/campaign-overview";
import { ScreenFrame } from "../../shared/ui/screen-frame/screen-frame";
import { ScreenLoader } from "../../shared/ui/screen-loader/screen-loader";
import { usePager } from "../../shared/hooks/use-pager";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { DomainBadge } from "../../shared/ui/domain-badge/domain-badge";
import type { CampaignDetail, Dashboard } from "../../shared/api/types";
import { buildAchievements } from "./achievements";
import "./dashboard.css";

const RANKS = [
  { min: 1, title: "Apprentice" },
  { min: 4, title: "Backend Initiate" },
  { min: 7, title: "Systems Explorer" },
  { min: 10, title: "Firmware Adept" },
  { min: 13, title: "Hardware Ranger" },
  { min: 16, title: "Embedded Knight" },
  { min: 19, title: "Systems Architect" },
];

const SLIDES = ["Overview", "Campaign", "Achievements"] as const;

function nextBossLabel(campaign: CampaignDetail, level: number): string {
  const pendingAct = campaign.acts.find((act) => act.status === "active" && act.boss_done < act.boss_total);
  if (pendingAct) return `Act ${pendingAct.number}`;

  const nextRank = RANKS.find((rank) => rank.min > level);
  if (nextRank) return `Lv ${nextRank.min}`;

  return "Cleared";
}

function OverviewDomainPulse({ domains }: { domains: Dashboard["domains"] }) {
  const topDomains = [...domains].sort((a, b) => b.progress - a.progress).slice(0, 4);
  if (topDomains.length === 0) return null;

  return (
    <div className="dash-domain-pulse" aria-label="Domain progress">
      {topDomains.map((domain) => (
        <article key={domain.slug} className="dash-domain-pulse__cell">
          <DomainBadge name={domain.name} color={domain.color} icon={domain.icon} />
          <RoadmapBar progress={domain.progress} />
          <span className="dash-domain-pulse__meta stats">
            {domain.earned_xp}/{domain.available_xp} XP
          </span>
        </article>
      ))}
    </div>
  );
}

function OverviewMotivationChips() {
  const { state } = useDashboard();
  const dashboard = state.data;
  if (!dashboard) return null;

  const counts = dashboard.quest_counts;
  const activeCount = counts.in_progress ?? 0;
  const clearedCount = counts.done ?? 0;
  const nextBoss = nextBossLabel(dashboard.campaign, dashboard.level);

  return (
    <div className="dash-motivation-chips" aria-label="Quest momentum">
      <div className="dash-motivation-chip dash-motivation-chip--active">
        <span className="dash-motivation-chip__value stats">{activeCount}</span>
        <span className="dash-motivation-chip__label">Active</span>
      </div>
      <div className="dash-motivation-chip dash-motivation-chip--cleared">
        <span className="dash-motivation-chip__value stats">{clearedCount}</span>
        <span className="dash-motivation-chip__label">Cleared</span>
      </div>
      <div className="dash-motivation-chip dash-motivation-chip--boss">
        <span className="dash-motivation-chip__value stats">{nextBoss}</span>
        <span className="dash-motivation-chip__label">Next boss</span>
      </div>
    </div>
  );
}

function OverviewSlide() {
  const { state } = useDashboard();
  const dashboard = state.data;
  if (!dashboard) return null;

  const campaign = dashboard.campaign;
  const hasJourneyLink = Boolean(dashboard.current_quest ?? dashboard.suggested_quest);

  return (
    <div className="dash-slide dash-slide--overview">
      <header className="dash-campaign-strip">
        <h2 className="dash-campaign-strip__name display">{campaign.name}</h2>
        <div className="dash-campaign-strip__track">
          <RoadmapBar progress={campaign.progress} />
        </div>
        <span className="dash-campaign-strip__xp stats">
          {campaign.earned_xp}/{campaign.available_xp} XP · {(campaign.progress * 100).toFixed(0)}%
        </span>
      </header>
      <div className={`dash-overview-grid${hasJourneyLink ? " dash-overview-grid--linked" : ""}`}>
        <QuestFocusPanel linked={hasJourneyLink} />
        <aside className={`dash-journey${hasJourneyLink ? " dash-journey--linked" : ""}`} aria-label="Rank and momentum">
          <header className="dash-journey__head">
            <h3 className="dash-journey__title display">Rank</h3>
            <span className="dash-journey__rank stats">
              Lv {dashboard.level} · {dashboard.rank}
            </span>
          </header>
          <div className="dash-tier-track">
            {RANKS.map((rank, index) => {
              const isLit = dashboard.level >= rank.min;
              const isCurrent =
                isLit && (RANKS[index + 1] ? dashboard.level < RANKS[index + 1].min : true);
              return (
                <div
                  key={rank.min}
                  className={`dash-tier${isLit ? " dash-tier--lit" : ""}${isCurrent ? " dash-tier--current" : ""}${isCurrent && hasJourneyLink ? " dash-tier--path" : ""}`}
                >
                  <span className="dash-tier__lv stats">{rank.min}</span>
                  <span className="dash-tier__name">{rank.title}</span>
                </div>
              );
            })}
          </div>
          <OverviewDomainPulse domains={dashboard.domains} />
          <OverviewMotivationChips />
        </aside>
      </div>
    </div>
  );
}

function AchievementsSlide() {
  const { state } = useDashboard();
  const dashboard = state.data;
  if (!dashboard) return null;

  const achievements = buildAchievements(dashboard);
  const earnedCount = achievements.filter((item) => item.earned).length;

  return (
    <div className="dash-slide dash-slide--progress">
      <section className="dash-progress-section dash-progress-section--achievements" aria-labelledby="dash-achievements-title">
        <header className="dash-progress-section__head">
          <h3 id="dash-achievements-title" className="dash-progress-section__title display">
            Achievements
          </h3>
          <span className="dash-progress-section__meta">
            {earnedCount}/{achievements.length} earned
          </span>
        </header>
        <div className="dash-achievements-grid">
          {achievements.map((achievement) => (
            <article
              key={achievement.id}
              className={`dash-achievement-card${achievement.earned ? " dash-achievement-card--earned" : ""}`}
            >
              <span className="dash-achievement-card__icon" aria-hidden>
                {achievement.icon}
              </span>
              <div className="dash-achievement-card__body">
                <h4 className="dash-achievement-card__title display">{achievement.title}</h4>
                <p className="dash-achievement-card__detail">{achievement.detail}</p>
              </div>
              {achievement.progressLabel && (
                <span className="dash-achievement-card__progress">{achievement.progressLabel}</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="dash-progress-section dash-progress-section--domains" aria-labelledby="dash-domains-title">
        <header className="dash-progress-section__head">
          <h3 id="dash-domains-title" className="dash-progress-section__title display">
            Domains
          </h3>
          <span className="dash-progress-section__meta">{dashboard.domains.length} tracks</span>
        </header>
        <div className="dash-domains-grid">
          {dashboard.domains.map((domain) => (
            <div key={domain.slug} className="dash-domain-card">
              <DomainBadge name={domain.name} color={domain.color} icon={domain.icon} />
              <span className="dash-domain-card__xp">
                {domain.earned_xp}/{domain.available_xp}
              </span>
              <RoadmapBar progress={domain.progress} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardScreen() {
  const { state } = useDashboard();
  const pager = usePager(SLIDES.length, 0);

  if (state.isLoading) {
    return <ScreenLoader label="Reading grimoire..." />;
  }

  return (
    <ScreenFrame title={SLIDES[pager.page]}>
      <ScreenFrame.Pager
        page={pager.page}
        total={SLIDES.length}
        onPrev={pager.prev}
        onNext={pager.next}
        canPrev={pager.canPrev}
        canNext={pager.canNext}
      />
      {pager.page === 0 && <OverviewSlide />}
      {pager.page === 1 && <CampaignOverview />}
      {pager.page === 2 && <AchievementsSlide />}
    </ScreenFrame>
  );
}

export function DashboardPageRoot() {
  return (
    <DashboardProvider>
      <DashboardScreen />
    </DashboardProvider>
  );
}
