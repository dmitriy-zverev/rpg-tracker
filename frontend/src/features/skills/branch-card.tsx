import type { SkillBranch } from "../../shared/api/types";
import { DomainBadge } from "../../shared/ui/domain-badge/domain-badge";
import { SkillBar } from "../../shared/ui/pixel-progress/pixel-progress";
import "./branch-card.css";

const BRANCH_ICONS = ["⚔️", "🛡️", "🔧", "⚡", "📡", "🧪", "🏰"];

function Frame({ branch, index }: { branch: SkillBranch; index: number }) {
  return (
    <article className="branch-card">
      <div className="branch-card__sigil">{BRANCH_ICONS[index % BRANCH_ICONS.length]}</div>
      <h3 className="branch-card__name">{branch.name}</h3>
      <p className="branch-card__meaning">{branch.meaning}</p>
      <div className="branch-card__domains">
        {branch.domains.map((d) => (
          <DomainBadge key={d} name={d} color="#a78bfa" icon="✦" />
        ))}
      </div>
      <div className="branch-card__progress">
        <SkillBar progress={branch.progress} />
        <span className="stats">
          {branch.earned_xp}/{branch.available_xp} XP · {(branch.progress * 100).toFixed(0)}%
        </span>
      </div>
      <div className="branch-card__unlock">
        <span className="branch-card__unlock-label">Next unlock</span>
        <p>{branch.next_unlock}</p>
      </div>
      <p className="branch-card__anti-ai">{branch.anti_ai_value}</p>
    </article>
  );
}

export const BranchCard = { Frame };
