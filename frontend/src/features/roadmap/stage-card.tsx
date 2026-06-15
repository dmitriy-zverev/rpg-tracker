import type { ReactNode } from "react";
import type { RoadmapStage } from "../../shared/api/types";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import "./stage-card.css";

interface PanelProps {
  stage: RoadmapStage;
  children: ReactNode;
}

function Panel({ stage, children }: PanelProps) {
  return (
    <article className="stage-detail">
      <header className="stage-detail__head">
        <div className="stage-detail__title-block">
          <div className="stage-detail__title-row">
            <span className={`stage-detail__priority stage-detail__priority--${stage.priority.toLowerCase()}`}>
              {stage.priority}
            </span>
            <h3 className="stage-detail__name">{stage.name}</h3>
          </div>
          <span className="stage-detail__domain">{stage.domain}</span>
        </div>
      </header>
      <p className="stage-detail__focus">{stage.focus}</p>
      <div className="stage-detail__progress">
        <RoadmapBar progress={stage.progress} />
        <span className="stage-detail__xp">
          {stage.earned_xp}/{stage.available_xp} XP
        </span>
      </div>
      <div className="stage-detail__scroll">{children}</div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="stage-detail__section">
      <h4 className="stage-detail__section-title">{title}</h4>
      {children}
    </section>
  );
}

function Curriculum({ text }: { text: string }) {
  const items = text.split("\n").filter(Boolean);
  return (
    <Section title="Curriculum">
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Section>
  );
}

function Project({ text }: { text: string }) {
  return (
    <Section title="Project">
      <p>{text}</p>
    </Section>
  );
}

export const StageCard = {
  Panel,
  Curriculum,
  Project,
};
