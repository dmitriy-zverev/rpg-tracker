import { DashboardProvider, useDashboard } from "./dashboard-provider";
import { PixelPanel } from "../../shared/ui/pixel-panel/pixel-panel";
import { HudStat } from "../../shared/ui/hud-stat/hud-stat";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { DomainBadge } from "../../shared/ui/domain-badge/domain-badge";
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

function PlayerHud() {
  const { state } = useDashboard();
  const d = state.data;
  if (!d) return null;
  const xpPct = ((d.total_xp % 350) / 350) * 100;

  return (
    <div className="player-hud">
      <div className="player-hud__hero">
        <span className="player-hud__avatar">🧙</span>
        <div>
          <h1>{d.player.name}</h1>
          <p className="player-hud__title">{d.player.title}</p>
          <p className="stats">
            LV {d.level} · {d.rank}
          </p>
        </div>
      </div>
      <div className="player-hud__xp">
        <span className="stats">{d.total_xp} XP · {d.xp_to_next_level} to next</span>
        <RoadmapBar progress={xpPct / 100} />
      </div>
      <RankLadder currentLevel={d.level} />
    </div>
  );
}

function RankLadder({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="rank-ladder">
      {RANKS.map((r) => (
        <div
          key={r.min}
          className={`rank-ladder__step${currentLevel >= r.min ? " rank-ladder__step--lit" : ""}`}
        >
          <span className="stats">{r.min}</span>
          <span>{r.title}</span>
        </div>
      ))}
    </div>
  );
}

function QuestStatsGrid() {
  const { state } = useDashboard();
  const counts = state.data?.quest_counts;
  if (!counts) return null;
  return (
    <div className="quest-stats-grid">
      {Object.entries(counts).map(([key, val]) => (
        <HudStat.Tile key={key}>
          <HudStat.Label>{key.replace("_", " ")}</HudStat.Label>
          <HudStat.Value>{val}</HudStat.Value>
        </HudStat.Tile>
      ))}
    </div>
  );
}

function DomainXpTable() {
  const { state } = useDashboard();
  const domains = state.data?.domains;
  if (!domains) return null;
  return (
    <table className="domain-table">
      <thead>
        <tr>
          <th>Domain</th>
          <th>XP</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        {domains.map((d) => (
          <tr key={d.slug}>
            <td>
              <DomainBadge name={d.name} color={d.color} icon={d.icon} />
            </td>
            <td className="stats">
              {d.earned_xp}/{d.available_xp}
            </td>
            <td>
              <RoadmapBar progress={d.progress} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StageProgressChart() {
  const { state } = useDashboard();
  const stages = state.data?.stages;
  if (!stages) return null;
  return (
    <div className="stage-chart">
      {stages.map((s) => (
        <div key={s.index} className="stage-chart__row">
          <span className="stage-chart__label">
            M{s.month} {s.name}
          </span>
          <div className="stage-chart__bar-wrap">
            <div className="stage-chart__bar" style={{ width: `${s.progress * 100}%` }} />
          </div>
          <span className="stats">{(s.progress * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="dashboard">{children}</div>;
}

export const Dashboard = { Frame, PlayerHud, QuestStatsGrid, DomainXpTable, StageProgressChart };

export function DashboardPage() {
  const { state } = useDashboard();
  if (state.isLoading) return <p>Loading war room...</p>;

  return (
    <Dashboard.Frame>
      <Dashboard.PlayerHud />
      <section className="dashboard__section">
        <h2>Quest Status</h2>
        <Dashboard.QuestStatsGrid />
      </section>
      <section className="dashboard__section">
        <h2>Domain XP</h2>
        <Dashboard.DomainXpTable />
      </section>
      <section className="dashboard__section">
        <h2>Stage Progress</h2>
        <Dashboard.StageProgressChart />
      </section>
    </Dashboard.Frame>
  );
}

export function DashboardPageRoot() {
  return (
    <DashboardProvider>
      <PixelPanel.Frame>
        <PixelPanel.Header>War Room</PixelPanel.Header>
        <PixelPanel.Body>
          <DashboardPage />
        </PixelPanel.Body>
      </PixelPanel.Frame>
    </DashboardProvider>
  );
}
