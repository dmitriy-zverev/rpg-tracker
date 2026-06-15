export function DomainBadge({ name, icon }: { name: string; color?: string; icon: string }) {
  return (
    <span className="domain-badge">
      <span>{icon}</span> {name}
    </span>
  );
}
