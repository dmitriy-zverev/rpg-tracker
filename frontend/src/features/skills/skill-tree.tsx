import { SkillTreeProvider, useSkillTree } from "./skill-tree-provider";
import { BranchCard } from "./branch-card";
import { PixelPanel } from "../../shared/ui/pixel-panel/pixel-panel";
import "./skill-tree.css";

function Grid() {
  const { state } = useSkillTree();
  if (state.isLoading) return <p>Loading skill tree...</p>;

  return (
    <div className="skill-grid">
      {state.branches.map((branch, i) => (
        <div key={branch.id} className="stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
          <BranchCard.Frame branch={branch} index={i} />
        </div>
      ))}
    </div>
  );
}

export function SkillTreePage() {
  return (
    <SkillTreeProvider>
      <PixelPanel.Frame>
        <PixelPanel.Header>Skill Constellation</PixelPanel.Header>
        <PixelPanel.Body>
          <div className="skill-tree">
            <p className="skill-tree__intro">Seven branches — progress unlocks the next tier of craft.</p>
            <Grid />
          </div>
        </PixelPanel.Body>
      </PixelPanel.Frame>
    </SkillTreeProvider>
  );
}
