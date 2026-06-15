const DOMAIN_ICONS: Record<string, string> = {
  tutorial: "📜",
  "c-systems": "⚔️",
  linux: "🐧",
  "iot-networks": "📡",
  electronics: "🔧",
  firmware: "🔥",
  debug: "🧭",
  rtos: "⏱️",
  pcb: "🧩",
  testing: "🧪",
  security: "🔐",
};

export function domainIcon(slug: string): string {
  return DOMAIN_ICONS[slug] ?? "✦";
}
