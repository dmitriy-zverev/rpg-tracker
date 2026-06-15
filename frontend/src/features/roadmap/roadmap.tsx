import { useEffect, useState } from "react";
import { RoadmapProvider, useRoadmap } from "./roadmap-provider";
import { OverworldMap, StageDetailPanel } from "./overworld-map";
import { ScreenFrame } from "../../shared/ui/screen-frame/screen-frame";
import { ScreenLoader } from "../../shared/ui/screen-loader/screen-loader";
import "./roadmap.css";

function RoadmapScreen() {
  const { state } = useRoadmap();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const active = state.stages.findIndex((stage) => stage.progress > 0 && stage.progress < 1);
    if (active >= 0) setSelectedIndex(active);
  }, [state.stages]);

  if (state.isLoading) {
    return <ScreenLoader label="Charting world..." />;
  }

  const selectedStage = state.stages[selectedIndex];
  if (!selectedStage) return null;

  return (
    <ScreenFrame
      title="World Map"
      subtitle={`Act ${selectedStage.index <= 5 ? 1 : selectedStage.index <= 11 ? 2 : 3} · ${selectedStage.name}`}
    >
      <div className="roadmap-screen">
        <OverworldMap
          stages={state.stages}
          selectedIndex={selectedStage.index}
          onSelect={(index) => {
            const page = state.stages.findIndex((stage) => stage.index === index);
            if (page >= 0) setSelectedIndex(page);
          }}
        />
        <StageDetailPanel stage={selectedStage} />
      </div>
    </ScreenFrame>
  );
}

export function RoadmapPage() {
  return (
    <RoadmapProvider>
      <RoadmapScreen />
    </RoadmapProvider>
  );
}
