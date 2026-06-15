import { useMemo } from "react";
import type { SkillBranch } from "../../shared/api/types";
import {
  SKILL_TREE_COLS,
  SKILL_TREE_ROWS,
  SKILL_TREE_SLOTS,
  buildConnectorEdges,
} from "./skill-tree-layout";
import { SkillNode } from "./skill-node";
import "./skill-tree-canvas.css";

interface SkillTreeCanvasProps {
  branches: SkillBranch[];
  selectedId: number;
  onSelect: (branchId: number) => void;
}

export function SkillTreeCanvas({ branches, selectedId, onSelect }: SkillTreeCanvasProps) {
  const branchById = useMemo(() => new Map(branches.map((branch) => [branch.id, branch])), [branches]);
  const connectorEdges = useMemo(() => buildConnectorEdges(), []);

  return (
    <div className="skill-tree-canvas">
      <div className="skill-tree-canvas__stone" aria-hidden />
      <div className="skill-tree-canvas__stage">
        <svg
          className="skill-tree-canvas__wires"
          viewBox={`0 0 ${SKILL_TREE_COLS} ${SKILL_TREE_ROWS}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          {connectorEdges.map((edge) => {
            const parent = branchById.get(edge.parentId);
            const lit = (parent?.progress ?? 0) > 0;

            return (
              <line
                key={`${edge.parentId}-${edge.childId}`}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                className={lit ? "skill-tree-canvas__wire--lit" : "skill-tree-canvas__wire"}
              />
            );
          })}
        </svg>

        <div
          className="skill-tree-canvas__grid"
          style={{
            gridTemplateColumns: `repeat(${SKILL_TREE_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${SKILL_TREE_ROWS}, 1fr)`,
          }}
        >
          {SKILL_TREE_SLOTS.map((slot) => {
            const branch = branchById.get(slot.branchId);
            if (!branch) return null;

            return (
              <div
                key={slot.branchId}
                className="skill-tree-canvas__cell"
                style={{ gridColumn: slot.col + 1, gridRow: slot.row + 1 }}
              >
                <SkillNode
                  branch={branch}
                  icon={slot.icon}
                  selected={selectedId === slot.branchId}
                  onSelect={() => onSelect(slot.branchId)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
