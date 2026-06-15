export interface MapWaypoint {
  x: number;
  y: number;
  act: 1 | 2 | 3;
}

export type MapAct = 1 | 2 | 3;

/** Six waypoints per act — spread for act-scoped zoom (100×100 viewBox). */
export const ACT_WAYPOINTS: Record<MapAct, MapWaypoint[]> = {
  1: [
    { x: 14, y: 82, act: 1 },
    { x: 28, y: 68, act: 1 },
    { x: 42, y: 76, act: 1 },
    { x: 56, y: 58, act: 1 },
    { x: 72, y: 68, act: 1 },
    { x: 86, y: 52, act: 1 },
  ],
  2: [
    { x: 12, y: 74, act: 2 },
    { x: 26, y: 58, act: 2 },
    { x: 42, y: 66, act: 2 },
    { x: 58, y: 48, act: 2 },
    { x: 74, y: 56, act: 2 },
    { x: 88, y: 40, act: 2 },
  ],
  3: [
    { x: 16, y: 78, act: 3 },
    { x: 32, y: 62, act: 3 },
    { x: 48, y: 70, act: 3 },
    { x: 64, y: 52, act: 3 },
    { x: 78, y: 60, act: 3 },
    { x: 90, y: 44, act: 3 },
  ],
};

export const ACT_LABELS: Array<{ act: MapAct; x: number; y: number; label: string }> = [
  { act: 1, x: 8, y: 94, label: "ACT I" },
  { act: 2, x: 8, y: 94, label: "ACT II" },
  { act: 3, x: 8, y: 94, label: "ACT III" },
];

export const ACT_FIRST_STAGE_INDEX: Record<MapAct, number> = {
  1: 0,
  2: 6,
  3: 12,
};

export function actForStageIndex(stageIndex: number): MapAct {
  if (stageIndex <= 5) return 1;
  if (stageIndex <= 11) return 2;
  return 3;
}

export function slotInAct(stageIndex: number): number {
  if (stageIndex <= 5) return stageIndex;
  if (stageIndex <= 11) return stageIndex - 6;
  return stageIndex - 12;
}

export function waypointsForAct(act: MapAct): MapWaypoint[] {
  return ACT_WAYPOINTS[act];
}

export function trailPathD(waypoints: ReadonlyArray<{ x: number; y: number }>): string {
  if (waypoints.length === 0) return "";
  if (waypoints.length === 1) return `M ${waypoints[0].x} ${waypoints[0].y}`;

  let path = `M ${waypoints[0].x} ${waypoints[0].y}`;
  for (let index = 0; index < waypoints.length - 1; index += 1) {
    const previous = waypoints[Math.max(0, index - 1)];
    const current = waypoints[index];
    const next = waypoints[index + 1];
    const after = waypoints[Math.min(waypoints.length - 1, index + 2)];
    const control1x = current.x + (next.x - previous.x) / 6;
    const control1y = current.y + (next.y - previous.y) / 6;
    const control2x = next.x - (after.x - current.x) / 6;
    const control2y = next.y - (after.y - current.y) / 6;
    path += ` C ${control1x} ${control1y}, ${control2x} ${control2y}, ${next.x} ${next.y}`;
  }
  return path;
}

export function trailLegPathD(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const bendX = midX + (to.y - from.y) * 0.12;
  const bendY = midY - (to.x - from.x) * 0.12;
  return `M ${from.x} ${from.y} Q ${bendX} ${bendY}, ${to.x} ${to.y}`;
}

export function waypointForStage(stageIndex: number): MapWaypoint {
  const act = actForStageIndex(stageIndex);
  const slot = slotInAct(stageIndex);
  return ACT_WAYPOINTS[act][slot] ?? ACT_WAYPOINTS[act][ACT_WAYPOINTS[act].length - 1];
}
