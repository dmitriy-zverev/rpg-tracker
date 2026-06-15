export function DomainBadge({ name, color, icon }: { name: string; color: string; icon: string }) {
  return (
    <span
      className="domain-badge"
      style={{ borderLeftColor: color, background: `${color}22` }}
    >
      <span>{icon}</span> {name}
    </span>
  );
}
