/** Diablo-style 3-path tree: root → mid tier → capstones */

export interface SkillTreeSlot {
  branchId: number;
  col: number;
  row: number;
  parents: number[];
  icon: string;
}

export interface SkillTreeEdge {
  parentId: number;
  childId: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const SKILL_TREE_SLOTS: SkillTreeSlot[] = [
  { branchId: 1, col: 1, row: 2, parents: [], icon: "◈" },
  { branchId: 2, col: 0, row: 1, parents: [1], icon: "▣" },
  { branchId: 3, col: 1, row: 1, parents: [1], icon: "◎" },
  { branchId: 4, col: 2, row: 1, parents: [1], icon: "◇" },
  { branchId: 5, col: 0, row: 0, parents: [2], icon: "✦" },
  { branchId: 6, col: 1, row: 0, parents: [3], icon: "◷" },
  { branchId: 7, col: 2, row: 0, parents: [4], icon: "⬡" },
];

export const SKILL_TREE_COLS = 3;
export const SKILL_TREE_ROWS = 3;

export function slotCenter(col: number, row: number): { x: number; y: number } {
  return { x: col + 0.5, y: row + 0.5 };
}

/** Icon socket within a grid cell (labels sit below the node). */
export function slotWirePoint(
  col: number,
  row: number,
  end: "top" | "bottom",
): { x: number; y: number } {
  return { x: col + 0.5, y: row + (end === "top" ? 0.16 : 0.44) };
}

export function buildConnectorEdges(): SkillTreeEdge[] {
  const edges: SkillTreeEdge[] = [];

  for (const slot of SKILL_TREE_SLOTS) {
    for (const parentId of slot.parents) {
      const parent = SKILL_TREE_SLOTS.find((entry) => entry.branchId === parentId);
      if (!parent) continue;

      const start = slotWirePoint(parent.col, parent.row, "top");
      const end = slotWirePoint(slot.col, slot.row, "bottom");

      edges.push({
        parentId,
        childId: slot.branchId,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      });
    }
  }

  return edges;
}
