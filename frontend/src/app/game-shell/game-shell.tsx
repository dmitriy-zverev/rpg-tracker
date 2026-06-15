import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useGameSignals, useRotatingLine } from "../../shared/hooks/use-game-signals";
import { useLevelUpCelebration } from "../../shared/hooks/use-level-up-celebration";
import { useTheme } from "../../shared/hooks/use-theme";
import { questLogPath } from "../../shared/quests/paths";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { LevelUpModal } from "../../shared/ui/level-up-modal/level-up-modal";
import { PomodoroTimer } from "../../features/pomodoro/pomodoro-timer";
import { PlayerSessionProvider, usePlayerSession } from "./player-session-provider";
import { PageStage } from "./page-stage";
import "./game-shell.css";

const NAV = [
  { to: "/", label: "HERO", icon: "◈", pulseKey: "pulseHud" as const },
  { to: "/roadmap", label: "WORLD", icon: "◎", pulseKey: "pulseMap" as const },
  { to: "/quests", label: "QUESTS", icon: "▣", pulseKey: "pulseLog" as const },
  { to: "/skills", label: "TALENTS", icon: "✦", pulseKey: null },
];

function GameShellLayout() {
  const { state } = usePlayerSession();
  const data = state.data;
  const signals = useGameSignals(data);
  const hint = useRotatingLine(signals.tickerLines, 5000);
  const showHint = signals.attention !== "calm";
  const levelUp = useLevelUpCelebration(data?.level);
  const { isLight, toggleTheme } = useTheme();
  const location = useLocation();

  const level = data?.level ?? 1;
  const rank = data?.rank ?? "...";
  const xpPct = data ? ((data.total_xp % 350) / 350) * 100 : 0;
  const questsNavTo = questLogPath(data?.current_quest?.id ?? data?.suggested_quest?.id);

  return (
    <div className="game-shell">
      <header className="game-shell__bar pixel-panel">
        <div className="game-shell__identity">
          <button
            type="button"
            className={`game-shell__avatar${isLight ? " game-shell__avatar--light" : ""}`}
            onClick={toggleTheme}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            title={isLight ? "Dark mode" : "Light mode"}
          >
            {isLight ? "🧝" : "🧙"}
          </button>
          <div className="game-shell__player">
            <span className="game-shell__name display">{data?.player.name ?? "..."}</span>
            <span className="game-shell__meta stats">
              LV {level} · {rank} · {data?.total_xp ?? 0} XP
            </span>
            <RoadmapBar progress={xpPct / 100} />
          </div>
        </div>

        <div className="game-shell__toolbar">
          <nav className="game-shell__nav" aria-label="Main">
            {NAV.map((item) => {
              const pulse = item.pulseKey ? signals[item.pulseKey] : false;
              const to = item.to === "/quests" ? questsNavTo : item.to;
              return (
                <NavLink
                  key={item.to}
                  to={to}
                  className={({ isActive }) => {
                    const active =
                      item.to === "/quests" ? location.pathname === "/quests" : isActive;
                    return `game-shell__tab${active ? " game-shell__tab--active" : ""}`;
                  }}
                  end={item.to === "/"}
                >
                  <span className="game-shell__tab-icon-wrap">
                    <span className="game-shell__tab-icon" aria-hidden>
                      {item.icon}
                    </span>
                    {pulse && <span className="game-shell__tab-beacon" aria-hidden />}
                  </span>
                  <span className="game-shell__tab-label">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <PomodoroTimer questTitle={data?.current_quest?.title ?? data?.suggested_quest?.title} />
        </div>
      </header>

      {showHint && (
        <p className={`game-shell__hint game-shell__hint--${signals.attention}`} role="status">
          {hint}
        </p>
      )}

      <main className="game-shell__stage pixel-panel">
        <PageStage>
          <Outlet />
        </PageStage>
      </main>

      <div className="crt-overlay" aria-hidden />
      <LevelUpModal
        visible={levelUp.visible}
        level={data?.level ?? 1}
        rank={data?.rank ?? "..."}
        onDismiss={levelUp.dismiss}
      />
    </div>
  );
}

export function GameShell() {
  return (
    <PlayerSessionProvider>
      <GameShellLayout />
    </PlayerSessionProvider>
  );
}
