export function RoadmapBar({ progress }: { progress: number }) {
  return (
    <div className="pixel-progress pixel-progress--roadmap">
      <div className="pixel-progress__fill" style={{ width: `${Math.min(100, progress * 100)}%` }} />
    </div>
  );
}

export function SkillBar({ progress }: { progress: number }) {
  return (
    <div className="pixel-progress pixel-progress--skill">
      <div className="pixel-progress__fill" style={{ width: `${Math.min(100, progress * 100)}%` }} />
    </div>
  );
}
