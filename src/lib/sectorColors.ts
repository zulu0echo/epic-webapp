// Map sector (top-level domain name) to a full colour theme — used in map nodes, tree, detail panel, and domain pages
export type DomainTheme = {
  bg: string;
  border: string;
  text: string;
  accent: string;
  accentHover: string;
  lightBg: string;
  lightBorder: string;
  ring: string;
};

const DEFAULT_THEME: DomainTheme = {
  bg: "bg-slate-200",
  border: "border-slate-500",
  text: "text-slate-900",
  accent: "text-slate-600",
  accentHover: "hover:text-slate-800",
  lightBg: "bg-slate-50",
  lightBorder: "border-slate-200",
  ring: "ring-slate-500",
};

export const DOMAIN_THEMES: Record<string, DomainTheme> = {
  "Digital Identity & Credentials": {
    bg: "bg-indigo-200",
    border: "border-indigo-500",
    text: "text-indigo-900",
    accent: "text-indigo-600",
    accentHover: "hover:text-indigo-700",
    lightBg: "bg-indigo-50",
    lightBorder: "border-indigo-200",
    ring: "ring-indigo-500",
  },
  "Payments & Public Finance": {
    bg: "bg-emerald-200",
    border: "border-emerald-500",
    text: "text-emerald-900",
    accent: "text-emerald-600",
    accentHover: "hover:text-emerald-700",
    lightBg: "bg-emerald-50",
    lightBorder: "border-emerald-200",
    ring: "ring-emerald-500",
  },
  "Registries & Records": {
    bg: "bg-amber-200",
    border: "border-amber-500",
    text: "text-amber-900",
    accent: "text-amber-700",
    accentHover: "hover:text-amber-800",
    lightBg: "bg-amber-50",
    lightBorder: "border-amber-200",
    ring: "ring-amber-500",
  },
  "Service Delivery & Case Management": {
    bg: "bg-violet-200",
    border: "border-violet-500",
    text: "text-violet-900",
    accent: "text-violet-600",
    accentHover: "hover:text-violet-700",
    lightBg: "bg-violet-50",
    lightBorder: "border-violet-200",
    ring: "ring-violet-500",
  },
  "Supply Chain & Logistics": {
    bg: "bg-sky-200",
    border: "border-sky-500",
    text: "text-sky-900",
    accent: "text-sky-600",
    accentHover: "hover:text-sky-700",
    lightBg: "bg-sky-50",
    lightBorder: "border-sky-200",
    ring: "ring-sky-500",
  },
  "Data Governance & Interoperability": {
    bg: "bg-slate-200",
    border: "border-slate-500",
    text: "text-slate-900",
    accent: "text-slate-600",
    accentHover: "hover:text-slate-700",
    lightBg: "bg-slate-50",
    lightBorder: "border-slate-200",
    ring: "ring-slate-500",
  },
  "Civic & Democratic Processes": {
    bg: "bg-rose-200",
    border: "border-rose-500",
    text: "text-rose-900",
    accent: "text-rose-600",
    accentHover: "hover:text-rose-700",
    lightBg: "bg-rose-50",
    lightBorder: "border-rose-200",
    ring: "ring-rose-500",
  },
  "Climate & MRV": {
    bg: "bg-teal-200",
    border: "border-teal-500",
    text: "text-teal-900",
    accent: "text-teal-600",
    accentHover: "hover:text-teal-700",
    lightBg: "bg-teal-50",
    lightBorder: "border-teal-200",
    ring: "ring-teal-500",
  },
  "Education & Workforce": {
    bg: "bg-orange-200",
    border: "border-orange-500",
    text: "text-orange-900",
    accent: "text-orange-600",
    accentHover: "hover:text-orange-700",
    lightBg: "bg-orange-50",
    lightBorder: "border-orange-200",
    ring: "ring-orange-500",
  },
  "Health": {
    bg: "bg-pink-200",
    border: "border-pink-500",
    text: "text-pink-900",
    accent: "text-pink-600",
    accentHover: "hover:text-pink-700",
    lightBg: "bg-pink-50",
    lightBorder: "border-pink-200",
    ring: "ring-pink-500",
  },
};

/** For backward compatibility: Tailwind classes for map node (bg, border, text). */
export const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string }> = Object.fromEntries(
  Object.entries(DOMAIN_THEMES).map(([k, v]) => [k, { bg: v.bg, border: v.border, text: v.text }])
);

export function getSectorTheme(sector: string): DomainTheme {
  return DOMAIN_THEMES[sector] ?? DEFAULT_THEME;
}

/** Node style for graph: bg, border, text, and optional extra (e.g. font-bold for root). */
export function getSectorStyle(sector: string, tier: string) {
  const theme = getSectorTheme(sector);
  const tierBorder = tier === "root" ? "border-2 font-bold shadow" : "border-2";
  return `${theme.bg} ${theme.border} ${theme.text} ${tierBorder}`;
}
