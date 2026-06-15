import { RoadmapProvider, useRoadmap } from "./roadmap-provider";
import { StageCard } from "./stage-card";
import { PixelPanel } from "../../shared/ui/pixel-panel/pixel-panel";
import "./roadmap.css";

function Trail() {
  const { state } = useRoadmap();
  if (state.isLoading) return <p>Loading map...</p>;

  return (
    <div className="roadmap-trail">
      {state.stages.map((stage, i) => (
        <div key={stage.index} className="stagger-item" style={{ animationDelay: `${i * 40}ms` }}>
          <StageCard.Frame stage={stage}>
            <StageCard.Details>
              <StageCard.Curriculum text={stage.curriculum} />
              <StageCard.Resources text={stage.resources} />
              <StageCard.Project text={stage.stage_project} />
              <StageCard.Criteria text={stage.transition_criteria} />
              <StageCard.Accelerator text={stage.ai_accelerator} />
            </StageCard.Details>
          </StageCard.Frame>
        </div>
      ))}
    </div>
  );
}

export function RoadmapPage() {
  return (
    <RoadmapProvider>
      <PixelPanel.Frame>
        <PixelPanel.Header>Learning Map</PixelPanel.Header>
        <PixelPanel.Body>
          <div className="roadmap">
            <p className="roadmap__intro">
              18-stage quest line — expand each lantern to read curriculum and projects.
            </p>
            <Trail />
          </div>
        </PixelPanel.Body>
      </PixelPanel.Frame>
    </RoadmapProvider>
  );
}
