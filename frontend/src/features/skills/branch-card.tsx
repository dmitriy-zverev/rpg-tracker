import type { SkillBranch } from "../../shared/api/types";
import { DomainBadge } from "../../shared/ui/domain-badge/domain-badge";
import { SkillBar } from "../../shared/ui/pixel-progress/pixel-progress";
import "./branch-card.css";

const BRANCH_ICONS = ["⚔️", "🛡️", "🔧", "⚡", "📡", "🧪", "🏰"];

function branchTier(progress: number): { label: string; className: string } {
  if (progress >= 0.75) return { label: "Gold", className: "branch-card__tier--gold" };
  if (progress >= 0.4) return { label: "Silver", className: "branch-card__tier--silver" };
  return { label: "Bronze", className: "branch-card__tier--bronze" };
}

function Frame({ branch, index }: { branch: SkillBranch; index: number }) {
  const tier = branchTier(branch.progress);

  return (
    <article className="branch-card">
      <div className="branch-card__sigil">{BRANCH_ICONS[index % BRANCH_ICONS.length]}</div>
      <div className="branch-card__head">
        <span className={`branch-card__tier stats ${tier.className}`}>{tier.label}</span>
        <h3 className="branch-card__name">{branch.name}</h3>
      </div>
      <p className="branch-card__meaning">{branch.meaning}</p>
      <div className="branch-card__domains">
        {branch.domains.map((d) => (
          <DomainBadge key={d} name={d} color="#b39ad4" icon="✦" />
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
