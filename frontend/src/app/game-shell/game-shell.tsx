import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/client";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { LevelUpModal } from "../../shared/ui/level-up-modal/level-up-modal";
import "./game-shell.css";

const NAV = [
  { to: "/", label: "HUD", icon: "🏠" },
  { to: "/roadmap", label: "Map", icon: "🗺️" },
  { to: "/quests", label: "Log", icon: "📜" },
  { to: "/skills", label: "Tree", icon: "🌲" },
];

export function GameShell() {
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: api.getDashboard });

  const level = data?.level ?? 1;
  const rank = data?.rank ?? "...";
  const xpPct = data
    ? ((data.total_xp % 350) / 350) * 100
    : 0;

  return (
    <div className="game-shell">
      <aside className="party-strip pixel-panel">
        <div className="party-strip__avatar">🧙</div>
        <div className="party-strip__name display">{data?.player.name ?? "..."}</div>
        <div className="party-strip__rank">{rank}</div>
        <div className="party-strip__level stats">LV {level}</div>
        <RoadmapBar progress={xpPct / 100} />
        <nav className="party-strip__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `rune-nav${isActive ? " rune-nav--active" : ""}`}
              end={item.to === "/"}
            >
              <span>{item.icon}</span>
              <span className="display">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-panel pixel-panel">
        <div className="main-panel__inner">
          <Outlet />
        </div>
      </main>
      <div className="crt-overlay" aria-hidden />
      <LevelUpModal />
    </div>
  );
}
