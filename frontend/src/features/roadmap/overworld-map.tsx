import type { RoadmapStage } from "../../shared/api/types";
import { domainIcon } from "../../shared/campaign/domain-icons";
import { StageCard } from "./stage-card";
import {
  ACT_FIRST_STAGE_INDEX,
  ACT_LABELS,
  actForStageIndex,
  trailLegPathD,
  trailPathD,
  type MapAct,
  waypointsForAct,
  waypointForStage,
} from "./overworld-map-layout";
import "./overworld-map.css";

type SegmentState = "cleared" | "active" | "locked";

interface MapNodeState {
  selected: boolean;
  cleared: boolean;
  active: boolean;
  locked: boolean;
}

function shortLandmarkName(name: string): string {
  const segment = name.split(/[:—–-]/).pop()?.trim() ?? name;
  if (segment.length <= 11) return segment;
  return `${segment.slice(0, 10)}…`;
}

function mapNodeState(stage: RoadmapStage, selectedIndex: number, locked: boolean): MapNodeState {
  const cleared = stage.progress >= 1;
  return {
    selected: stage.index === selectedIndex,
    cleared,
    active: stage.progress > 0 && !cleared,
    locked,
  };
}

function mapNodeClassName(base: string, state: MapNodeState): string {
  return [
    base,
    state.selected ? `${base}--selected` : "",
    state.cleared ? `${base}--cleared` : "",
    state.active ? `${base}--active` : "",
    state.locked ? `${base}--locked` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function isStageLocked(stages: RoadmapStage[], stageIndex: number): boolean {
  if (stageIndex === 0) return false;
  const previous = stages.find((stage) => stage.index === stageIndex - 1);
  return previous ? previous.progress < 1 : false;
}

function segmentState(
  fromStage: RoadmapStage | undefined,
  toStage: RoadmapStage | undefined,
): SegmentState {
  if (!fromStage || !toStage) return "locked";
  if (fromStage.progress < 1) return "locked";
  if (toStage.progress > 0 && toStage.progress < 1) return "active";
  return "cleared";
}

const ACT_TITLES: Record<MapAct, string> = {
  1: "Act I — Foundations",
  2: "Act II — Systems",
  3: "Act III — Mastery",
};

interface MapCanvasArtProps {
  act: MapAct;
  trail: string;
  segments: Array<{ d: string; state: SegmentState }>;
}

function ActTerrain({ act }: { act: MapAct }) {
  if (act === 1) {
    return (
      <>
        <path
          className="overworld-map__water"
          d="M0 100 L0 58 Q22 52 38 62 L58 56 Q78 50 100 44 L100 100 Z"
          opacity="0.9"
        />
        <path className="overworld-map__highland" d="M0 42 Q28 32 52 38 T100 28 L100 0 L0 0 Z" />
        <ellipse cx="22" cy="62" rx="12" ry="7" fill="rgba(48, 62, 38, 0.24)" />
        <ellipse cx="62" cy="54" rx="14" ry="8" fill="rgba(48, 62, 38, 0.2)" />
      </>
    );
  }
  if (act === 2) {
    return (
      <>
        <path
          className="overworld-map__water"
          d="M0 100 L0 78 Q30 72 48 66 L72 70 Q88 68 100 62 L100 100 Z"
          opacity="0.75"
        />
        <path className="overworld-map__highland" d="M0 36 Q34 22 58 28 T100 16 L100 0 L0 0 Z" />
        <path
          d="M6 48 L16 38 L28 42 L40 32 L52 36 L64 28 L76 32 L88 24"
          fill="none"
          stroke="rgba(58, 48, 36, 0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse cx="44" cy="44" rx="10" ry="6" fill="rgba(48, 62, 38, 0.22)" />
      </>
    );
  }
  return (
    <>
      <path className="overworld-map__highland" d="M0 48 Q24 36 48 40 T100 24 L100 0 L0 0 Z" />
      <path
        d="M10 56 L22 46 L34 50 L48 40 L62 44 L76 36 L90 40"
        fill="none"
        stroke="rgba(58, 48, 36, 0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M88 10 L90 4 L92 10 L90 12 Z M90 4 L90 1"
        fill="none"
        stroke="rgba(184, 148, 58, 0.55)"
        strokeWidth="0.5"
      />
      <ellipse cx="70" cy="34" rx="11" ry="7" fill="rgba(48, 62, 38, 0.18)" />
    </>
  );
}

function MapCanvasArt({ act, trail, segments }: MapCanvasArtProps) {
  const actLabel = ACT_LABELS.find((label) => label.act === act);

  return (
    <svg
      className="overworld-map__art"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <radialGradient id="map-vignette" cx="50%" cy="45%" r="72%">
          <stop offset="0%" stopColor="rgba(28, 20, 12, 0)" />
          <stop offset="100%" stopColor="rgba(12, 8, 4, 0.55)" />
        </radialGradient>
        <linearGradient id="map-parchment" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2f261c" />
          <stop offset="40%" stopColor="#221c14" />
          <stop offset="100%" stopColor="#14100c" />
        </linearGradient>
        <linearGradient id="map-water" x1="0%" y1="100%" x2="80%" y2="20%">
          <stop offset="0%" stopColor="rgba(28, 48, 62, 0.55)" />
          <stop offset="100%" stopColor="rgba(18, 32, 42, 0.15)" />
        </linearGradient>
        <linearGradient id="map-trail-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(201, 162, 39, 0.2)" />
          <stop offset="50%" stopColor="rgba(201, 162, 39, 0.55)" />
          <stop offset="100%" stopColor="rgba(201, 162, 39, 0.25)" />
        </linearGradient>
        <pattern id="map-parchment-weave" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 M-1 1 L1 -1 M3 5 L5 3" stroke="rgba(92, 74, 40, 0.06)" strokeWidth="0.35" />
        </pattern>
        <filter id="map-paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0.1 0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      <rect className="overworld-map__parchment" width="100" height="100" />
      <rect className="overworld-map__parchment-weave" width="100" height="100" fill="url(#map-parchment-weave)" opacity="0.85" />
      <rect
        className="overworld-map__parchment overworld-map__grain"
        width="100"
        height="100"
        filter="url(#map-paper-grain)"
        opacity="0.32"
      />

      <ActTerrain act={act} />

      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        fill="none"
        stroke="rgba(122, 100, 56, 0.35)"
        strokeWidth="0.6"
        rx="1"
      />
      <rect
        x="3.5"
        y="3.5"
        width="93"
        height="93"
        fill="none"
        stroke="rgba(58, 48, 36, 0.45)"
        strokeWidth="0.35"
        rx="0.5"
      />

      {segments.map((segment, index) => (
        <g key={`trail-leg-${index}`}>
          <path
            className={`overworld-map__trail-glow overworld-map__trail-glow--${segment.state}`}
            d={segment.d}
            fill="none"
            stroke="url(#map-trail-glow)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`overworld-map__trail overworld-map__trail--${segment.state}`}
            d={segment.d}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      <path
        className="overworld-map__trail-ghost"
        d={trail}
        fill="none"
        stroke="rgba(122, 100, 56, 0.12)"
        strokeWidth="0.8"
        strokeDasharray="1.5 2"
        strokeLinecap="round"
      />

      {actLabel && (
        <text x={actLabel.x} y={actLabel.y} className="overworld-map__act-label">
          {actLabel.label}
        </text>
      )}

      <rect width="100" height="100" fill="url(#map-vignette)" pointerEvents="none" />
    </svg>
  );
}

interface OverworldMapProps {
  stages: RoadmapStage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function OverworldMap({ stages, selectedIndex, onSelect }: OverworldMapProps) {
  const viewAct = actForStageIndex(selectedIndex);
  const actWaypoints = waypointsForAct(viewAct);
  const trail = trailPathD(actWaypoints);
  const actStages = stages.filter((stage) => actForStageIndex(stage.index) === viewAct);

  const segments = actWaypoints.slice(0, -1).map((from, legIndex) => {
    const to = actWaypoints[legIndex + 1];
    const fromStage = stages.find((stage) => stage.index === ACT_FIRST_STAGE_INDEX[viewAct] + legIndex);
    const toStage = stages.find((stage) => stage.index === ACT_FIRST_STAGE_INDEX[viewAct] + legIndex + 1);
    return {
      d: trailLegPathD(from, to),
      state: segmentState(fromStage, toStage),
    };
  });

  function selectAct(act: MapAct) {
    onSelect(ACT_FIRST_STAGE_INDEX[act]);
  }

  return (
    <div className="overworld-map">
      <div className="overworld-map__act-bar" role="tablist" aria-label="Campaign acts">
        {([1, 2, 3] as const).map((act) => (
          <button
            key={act}
            type="button"
            role="tab"
            aria-selected={viewAct === act}
            className={`overworld-map__act-tab${viewAct === act ? " overworld-map__act-tab--active" : ""}`}
            onClick={() => selectAct(act)}
          >
            {ACT_TITLES[act]}
          </button>
        ))}
      </div>
      <div className="overworld-map__canvas">
        <div className="overworld-map__scene">
          <MapCanvasArt act={viewAct} trail={trail} segments={segments} />
          <div className="overworld-map__nodes">
            {actStages.map((stage) => {
              const waypoint = waypointForStage(stage.index);
              const locked = isStageLocked(stages, stage.index);
              const nodeState = mapNodeState(stage, selectedIndex, locked);

              return (
                <div
                  key={stage.index}
                  className="overworld-map__node-slot"
                  style={{ left: `${waypoint.x}%`, top: `${waypoint.y}%` }}
                >
                  <button
                    type="button"
                    className={mapNodeClassName("overworld-map__node", nodeState)}
                    onClick={() => onSelect(stage.index)}
                    title={stage.name}
                    disabled={locked}
                    aria-disabled={locked}
                  >
                    <span className="overworld-map__pin-icon" aria-hidden>
                      {domainIcon(stage.domain)}
                    </span>
                    <span className="overworld-map__pin-name">{shortLandmarkName(stage.name)}</span>
                    <span className="overworld-map__node-badge">M{stage.month}</span>
                    {nodeState.selected && (
                      <span className="overworld-map__marker" aria-hidden>
                        ◆
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StageDetailPanel({ stage }: { stage: RoadmapStage }) {
  return (
    <StageCard.Panel stage={stage}>
      <StageCard.Curriculum text={stage.curriculum} />
      <StageCard.Project text={stage.stage_project} />
    </StageCard.Panel>
  );
}
