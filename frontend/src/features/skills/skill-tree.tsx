import { useEffect, useMemo, useState } from "react";
import { SkillTreeProvider, useSkillTree } from "./skill-tree-provider";
import { SkillTreeCanvas } from "./skill-tree-canvas";
import { SkillDetailPanel } from "./skill-detail-panel";
import { SKILL_TREE_SLOTS } from "./skill-tree-layout";
import { ScreenFrame } from "../../shared/ui/screen-frame/screen-frame";
import { ScreenLoader } from "../../shared/ui/screen-loader/screen-loader";
import "./skill-tree.css";

function SkillScreen() {
  const { state } = useSkillTree();
  const [selectedId, setSelectedId] = useState(1);

  const slotByBranchId = useMemo(
    () => new Map(SKILL_TREE_SLOTS.map((slot) => [slot.branchId, slot])),
    [],
  );

  useEffect(() => {
    const active = state.branches.find((branch) => branch.progress > 0 && branch.progress < 1);
    if (active) setSelectedId(active.id);
  }, [state.branches]);

  if (state.isLoading) {
    return <ScreenLoader label="Studying talents..." />;
  }

  const selectedBranch = state.branches.find((branch) => branch.id === selectedId) ?? state.branches[0];
  if (!selectedBranch) return null;

  const selectedSlot = slotByBranchId.get(selectedBranch.id);

  return (
    <ScreenFrame title="Skill Tree" subtitle={selectedBranch.name}>
      <div className="skill-screen">
        <SkillTreeCanvas
          branches={state.branches}
          selectedId={selectedBranch.id}
          onSelect={setSelectedId}
        />
        <SkillDetailPanel branch={selectedBranch} icon={selectedSlot?.icon ?? "✦"} />
      </div>
    </ScreenFrame>
  );
}

export function SkillTreePage() {
  return (
    <SkillTreeProvider>
      <SkillScreen />
    </SkillTreeProvider>
  );
}
