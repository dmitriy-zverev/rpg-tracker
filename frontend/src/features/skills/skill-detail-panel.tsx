import type { SkillBranch } from "../../shared/api/types";
import { DomainBadge } from "../../shared/ui/domain-badge/domain-badge";
import { SkillBar } from "../../shared/ui/pixel-progress/pixel-progress";
import { skillNodeTier } from "./skill-node";
import "./skill-node.css";
import "./skill-detail-panel.css";

interface SkillDetailPanelProps {
  branch: SkillBranch;
  icon: string;
}

export function SkillDetailPanel({ branch, icon }: SkillDetailPanelProps) {
  const tier = skillNodeTier(branch.progress);
  const tierLabel = branch.progress >= 0.75 ? "Gold" : branch.progress >= 0.4 ? "Silver" : branch.progress > 0 ? "Bronze" : "Unlearned";

  return (
    <aside className="skill-detail">
      <div className="skill-detail__ornament" aria-hidden />
      <header className="skill-detail__head">
        <span className="skill-detail__sigil" aria-hidden>
          {icon}
        </span>
        <div className="skill-detail__titles">
          <span className={`skill-detail__tier stats ${tier.className}`}>{tierLabel}</span>
          <h3 className="skill-detail__name display">{branch.name}</h3>
        </div>
      </header>

      <p className="skill-detail__meaning">{branch.meaning}</p>

      <div className="skill-detail__domains">
        {branch.domains.map((domain) => (
          <DomainBadge key={domain} name={domain} color="#b39ad4" icon="✦" />
        ))}
      </div>

      <div className="skill-detail__progress">
        <SkillBar progress={branch.progress} />
        <span className="stats">
          {branch.earned_xp}/{branch.available_xp} XP · {(branch.progress * 100).toFixed(0)}%
        </span>
      </div>

      <div className="skill-detail__unlock">
        <span className="skill-detail__unlock-label display">Next rank</span>
        <p>{branch.next_unlock}</p>
      </div>

      <p className="skill-detail__flavor stats">{branch.anti_ai_value}</p>
    </aside>
  );
}
