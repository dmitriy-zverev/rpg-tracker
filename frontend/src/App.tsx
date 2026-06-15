import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GameShell } from "./app/game-shell/game-shell";
import { DashboardPageRoot } from "./features/dashboard/dashboard";
import { RoadmapPage } from "./features/roadmap/roadmap";
import { QuestLogPage } from "./features/quests/quest-log";
import { SkillTreePage } from "./features/skills/skill-tree";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GameShell />}>
          <Route index element={<DashboardPageRoot />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="quests" element={<QuestLogPage />} />
          <Route path="skills" element={<SkillTreePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
