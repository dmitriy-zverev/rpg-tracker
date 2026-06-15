import type { CSSProperties } from "react";
import type { SkillBranch } from "../../shared/api/types";
import "./skill-node.css";

export interface SkillNodeTier {
  label: string;
  className: string;
}

export function skillNodeTier(progress: number): SkillNodeTier {
  if (progress >= 0.75) return { label: "III", className: "skill-tier--gold" };
  if (progress >= 0.4) return { label: "II", className: "skill-tier--silver" };
  if (progress > 0) return { label: "I", className: "skill-tier--bronze" };
  return { label: "·", className: "skill-tier--dim" };
}

interface SkillNodeProps {
  branch: SkillBranch;
  icon: string;
  selected: boolean;
  onSelect: () => void;
}

export function SkillNode({ branch, icon, selected, onSelect }: SkillNodeProps) {
  const tier = skillNodeTier(branch.progress);
  const active = branch.progress > 0 && branch.progress < 1;
  const mastered = branch.progress >= 0.75;
  const invested = branch.progress > 0;

  return (
    <div className="skill-tree-slot">
      <button
        type="button"
        className={[
          "skill-node",
          selected ? "skill-node--selected" : "",
          active ? "skill-node--active" : "",
          mastered ? "skill-node--mastered" : "",
          invested ? "skill-node--invested" : "skill-node--dim",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={onSelect}
        aria-label={branch.name}
        style={{ "--node-fill": `${Math.round(branch.progress * 100)}%` } as CSSProperties}
      >
        <span className="skill-node__frame" aria-hidden />
        <span className="skill-node__icon" aria-hidden>
          {icon}
        </span>
        <span className={`skill-node__rank stats ${tier.className}`}>{tier.label}</span>
      </button>
      <span className="skill-node__label stats">{branch.name}</span>
    </div>
  );
}
