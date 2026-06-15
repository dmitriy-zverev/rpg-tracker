import type { ReactNode } from "react";
import type { RoadmapStage } from "../../shared/api/types";
import { DomainBadge } from "../../shared/ui/domain-badge/domain-badge";
import { RoadmapBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { useRoadmap } from "./roadmap-provider";
import "./stage-card.css";

function Frame({ stage, children }: { stage: RoadmapStage; children: ReactNode }) {
  const { state, actions } = useRoadmap();
  const expanded = state.expandedId === stage.index;

  return (
    <article className={`stage-card${expanded ? " stage-card--open" : ""}`}>
      <header className="stage-card__header">
        <span className="stage-card__month stats">M{stage.month}</span>
        <div className="stage-card__title-block">
          <h3 className="stage-card__name">{stage.name}</h3>
          <p className="stage-card__focus">{stage.focus}</p>
        </div>
        <span className={`stage-card__priority stage-card__priority--${stage.priority.toLowerCase()}`}>
          {stage.priority}
        </span>
        <DomainBadge name={stage.domain} color="#60a5fa" icon="◆" />
        <div className="stage-card__progress">
          <RoadmapBar progress={stage.progress} />
          <span className="stats">{(stage.progress * 100).toFixed(0)}%</span>
        </div>
        <button type="button" className="pixel-button" onClick={() => actions.toggleExpand(stage.index)}>
          {expanded ? "Close" : "Open"}
        </button>
      </header>
      {expanded && children}
    </article>
  );
}

function Details({ children }: { children: ReactNode }) {
  return <div className="stage-card__details">{children}</div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="stage-card__section">
      <h4>{title}</h4>
      <div className="stage-card__section-body">{children}</div>
    </section>
  );
}

function Curriculum({ text }: { text: string }) {
  const items = text.split("\n").filter(Boolean);
  return (
    <Section title="Curriculum">
      <ul className="stage-card__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Section>
  );
}

function Resources({ text }: { text: string }) {
  return (
    <Section title="Resources">
      <p>{text}</p>
    </Section>
  );
}

function Project({ text }: { text: string }) {
  return (
    <Section title="Stage Project">
      <p>{text}</p>
    </Section>
  );
}

function Criteria({ text }: { text: string }) {
  return (
    <Section title="Transition Criteria">
      <p>{text}</p>
    </Section>
  );
}

function Accelerator({ text }: { text: string }) {
  return (
    <Section title="AI Accelerator">
      <p>{text}</p>
    </Section>
  );
}

export const StageCard = { Frame, Details, Curriculum, Resources, Project, Criteria, Accelerator };
