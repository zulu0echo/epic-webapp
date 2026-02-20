// Per-domain colour themes. Each domain slug gets a distinct colour (map, tree, detail panel, domain pages).
export type DomainTheme = {
  bg: string;
  border: string;
  text: string;
  accent: string;
  accentHover: string;
  lightBg: string;
  lightBorder: string;
  ring: string;
  /** Lighter text for subdomain rows in taxonomy tree (depth >= 2). */
  treeTextLight?: string;
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
  treeTextLight: "text-slate-500",
};

// 46 literal themes so Tailwind JIT includes all classes
const PALETTE: DomainTheme[] = [
  { bg: "bg-indigo-200", border: "border-indigo-500", text: "text-indigo-900", accent: "text-indigo-600", accentHover: "hover:text-indigo-700", lightBg: "bg-indigo-50", lightBorder: "border-indigo-200", ring: "ring-indigo-500" },
  { bg: "bg-emerald-200", border: "border-emerald-500", text: "text-emerald-900", accent: "text-emerald-600", accentHover: "hover:text-emerald-700", lightBg: "bg-emerald-50", lightBorder: "border-emerald-200", ring: "ring-emerald-500" },
  { bg: "bg-amber-200", border: "border-amber-500", text: "text-amber-900", accent: "text-amber-700", accentHover: "hover:text-amber-800", lightBg: "bg-amber-50", lightBorder: "border-amber-200", ring: "ring-amber-500" },
  { bg: "bg-violet-200", border: "border-violet-500", text: "text-violet-900", accent: "text-violet-600", accentHover: "hover:text-violet-700", lightBg: "bg-violet-50", lightBorder: "border-violet-200", ring: "ring-violet-500" },
  { bg: "bg-sky-200", border: "border-sky-500", text: "text-sky-900", accent: "text-sky-600", accentHover: "hover:text-sky-700", lightBg: "bg-sky-50", lightBorder: "border-sky-200", ring: "ring-sky-500" },
  { bg: "bg-rose-200", border: "border-rose-500", text: "text-rose-900", accent: "text-rose-600", accentHover: "hover:text-rose-700", lightBg: "bg-rose-50", lightBorder: "border-rose-200", ring: "ring-rose-500" },
  { bg: "bg-teal-200", border: "border-teal-500", text: "text-teal-900", accent: "text-teal-600", accentHover: "hover:text-teal-700", lightBg: "bg-teal-50", lightBorder: "border-teal-200", ring: "ring-teal-500" },
  { bg: "bg-orange-200", border: "border-orange-500", text: "text-orange-900", accent: "text-orange-600", accentHover: "hover:text-orange-700", lightBg: "bg-orange-50", lightBorder: "border-orange-200", ring: "ring-orange-500" },
  { bg: "bg-pink-200", border: "border-pink-500", text: "text-pink-900", accent: "text-pink-600", accentHover: "hover:text-pink-700", lightBg: "bg-pink-50", lightBorder: "border-pink-200", ring: "ring-pink-500" },
  { bg: "bg-slate-200", border: "border-slate-500", text: "text-slate-900", accent: "text-slate-600", accentHover: "hover:text-slate-700", lightBg: "bg-slate-50", lightBorder: "border-slate-200", ring: "ring-slate-500" },
  { bg: "bg-cyan-200", border: "border-cyan-500", text: "text-cyan-900", accent: "text-cyan-600", accentHover: "hover:text-cyan-700", lightBg: "bg-cyan-50", lightBorder: "border-cyan-200", ring: "ring-cyan-500" },
  { bg: "bg-lime-200", border: "border-lime-500", text: "text-lime-900", accent: "text-lime-600", accentHover: "hover:text-lime-700", lightBg: "bg-lime-50", lightBorder: "border-lime-200", ring: "ring-lime-500" },
  { bg: "bg-fuchsia-200", border: "border-fuchsia-500", text: "text-fuchsia-900", accent: "text-fuchsia-600", accentHover: "hover:text-fuchsia-700", lightBg: "bg-fuchsia-50", lightBorder: "border-fuchsia-200", ring: "ring-fuchsia-500" },
  { bg: "bg-red-200", border: "border-red-500", text: "text-red-900", accent: "text-red-600", accentHover: "hover:text-red-700", lightBg: "bg-red-50", lightBorder: "border-red-200", ring: "ring-red-500" },
  { bg: "bg-yellow-200", border: "border-yellow-500", text: "text-yellow-900", accent: "text-yellow-600", accentHover: "hover:text-yellow-700", lightBg: "bg-yellow-50", lightBorder: "border-yellow-200", ring: "ring-yellow-500" },
  { bg: "bg-blue-200", border: "border-blue-500", text: "text-blue-900", accent: "text-blue-600", accentHover: "hover:text-blue-700", lightBg: "bg-blue-50", lightBorder: "border-blue-200", ring: "ring-blue-500" },
  { bg: "bg-green-200", border: "border-green-500", text: "text-green-900", accent: "text-green-600", accentHover: "hover:text-green-700", lightBg: "bg-green-50", lightBorder: "border-green-200", ring: "ring-green-500" },
  { bg: "bg-stone-200", border: "border-stone-500", text: "text-stone-900", accent: "text-stone-600", accentHover: "hover:text-stone-700", lightBg: "bg-stone-50", lightBorder: "border-stone-200", ring: "ring-stone-500" },
  { bg: "bg-zinc-200", border: "border-zinc-500", text: "text-zinc-900", accent: "text-zinc-600", accentHover: "hover:text-zinc-700", lightBg: "bg-zinc-50", lightBorder: "border-zinc-200", ring: "ring-zinc-500" },
  { bg: "bg-indigo-300", border: "border-indigo-600", text: "text-indigo-900", accent: "text-indigo-600", accentHover: "hover:text-indigo-700", lightBg: "bg-indigo-50", lightBorder: "border-indigo-200", ring: "ring-indigo-500" },
  { bg: "bg-emerald-300", border: "border-emerald-600", text: "text-emerald-900", accent: "text-emerald-600", accentHover: "hover:text-emerald-700", lightBg: "bg-emerald-50", lightBorder: "border-emerald-200", ring: "ring-emerald-500" },
  { bg: "bg-amber-300", border: "border-amber-600", text: "text-amber-900", accent: "text-amber-700", accentHover: "hover:text-amber-800", lightBg: "bg-amber-50", lightBorder: "border-amber-200", ring: "ring-amber-500" },
  { bg: "bg-violet-300", border: "border-violet-600", text: "text-violet-900", accent: "text-violet-600", accentHover: "hover:text-violet-700", lightBg: "bg-violet-50", lightBorder: "border-violet-200", ring: "ring-violet-500" },
  { bg: "bg-sky-300", border: "border-sky-600", text: "text-sky-900", accent: "text-sky-600", accentHover: "hover:text-sky-700", lightBg: "bg-sky-50", lightBorder: "border-sky-200", ring: "ring-sky-500" },
  { bg: "bg-rose-300", border: "border-rose-600", text: "text-rose-900", accent: "text-rose-600", accentHover: "hover:text-rose-700", lightBg: "bg-rose-50", lightBorder: "border-rose-200", ring: "ring-rose-500" },
  { bg: "bg-teal-300", border: "border-teal-600", text: "text-teal-900", accent: "text-teal-600", accentHover: "hover:text-teal-700", lightBg: "bg-teal-50", lightBorder: "border-teal-200", ring: "ring-teal-500" },
  { bg: "bg-orange-300", border: "border-orange-600", text: "text-orange-900", accent: "text-orange-600", accentHover: "hover:text-orange-700", lightBg: "bg-orange-50", lightBorder: "border-orange-200", ring: "ring-orange-500" },
  { bg: "bg-pink-300", border: "border-pink-600", text: "text-pink-900", accent: "text-pink-600", accentHover: "hover:text-pink-700", lightBg: "bg-pink-50", lightBorder: "border-pink-200", ring: "ring-pink-500" },
  { bg: "bg-cyan-300", border: "border-cyan-600", text: "text-cyan-900", accent: "text-cyan-600", accentHover: "hover:text-cyan-700", lightBg: "bg-cyan-50", lightBorder: "border-cyan-200", ring: "ring-cyan-500" },
  { bg: "bg-lime-300", border: "border-lime-600", text: "text-lime-900", accent: "text-lime-600", accentHover: "hover:text-lime-700", lightBg: "bg-lime-50", lightBorder: "border-lime-200", ring: "ring-lime-500" },
  { bg: "bg-fuchsia-300", border: "border-fuchsia-600", text: "text-fuchsia-900", accent: "text-fuchsia-600", accentHover: "hover:text-fuchsia-700", lightBg: "bg-fuchsia-50", lightBorder: "border-fuchsia-200", ring: "ring-fuchsia-500" },
  { bg: "bg-red-300", border: "border-red-600", text: "text-red-900", accent: "text-red-600", accentHover: "hover:text-red-700", lightBg: "bg-red-50", lightBorder: "border-red-200", ring: "ring-red-500" },
  { bg: "bg-yellow-300", border: "border-yellow-600", text: "text-yellow-900", accent: "text-yellow-600", accentHover: "hover:text-yellow-700", lightBg: "bg-yellow-50", lightBorder: "border-yellow-200", ring: "ring-yellow-500" },
  { bg: "bg-blue-300", border: "border-blue-600", text: "text-blue-900", accent: "text-blue-600", accentHover: "hover:text-blue-700", lightBg: "bg-blue-50", lightBorder: "border-blue-200", ring: "ring-blue-500" },
  { bg: "bg-green-300", border: "border-green-600", text: "text-green-900", accent: "text-green-600", accentHover: "hover:text-green-700", lightBg: "bg-green-50", lightBorder: "border-green-200", ring: "ring-green-500" },
  { bg: "bg-stone-300", border: "border-stone-600", text: "text-stone-900", accent: "text-stone-600", accentHover: "hover:text-stone-700", lightBg: "bg-stone-50", lightBorder: "border-stone-200", ring: "ring-stone-500" },
  { bg: "bg-zinc-300", border: "border-zinc-600", text: "text-zinc-900", accent: "text-zinc-600", accentHover: "hover:text-zinc-700", lightBg: "bg-zinc-50", lightBorder: "border-zinc-200", ring: "ring-zinc-500" },
  { bg: "bg-indigo-100", border: "border-indigo-400", text: "text-indigo-900", accent: "text-indigo-600", accentHover: "hover:text-indigo-700", lightBg: "bg-indigo-50", lightBorder: "border-indigo-200", ring: "ring-indigo-500" },
  { bg: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-900", accent: "text-emerald-600", accentHover: "hover:text-emerald-700", lightBg: "bg-emerald-50", lightBorder: "border-emerald-200", ring: "ring-emerald-500" },
  { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-900", accent: "text-amber-700", accentHover: "hover:text-amber-800", lightBg: "bg-amber-50", lightBorder: "border-amber-200", ring: "ring-amber-500" },
  { bg: "bg-violet-100", border: "border-violet-400", text: "text-violet-900", accent: "text-violet-600", accentHover: "hover:text-violet-700", lightBg: "bg-violet-50", lightBorder: "border-violet-200", ring: "ring-violet-500" },
  { bg: "bg-sky-100", border: "border-sky-400", text: "text-sky-900", accent: "text-sky-600", accentHover: "hover:text-sky-700", lightBg: "bg-sky-50", lightBorder: "border-sky-200", ring: "ring-sky-500" },
  { bg: "bg-rose-100", border: "border-rose-400", text: "text-rose-900", accent: "text-rose-600", accentHover: "hover:text-rose-700", lightBg: "bg-rose-50", lightBorder: "border-rose-200", ring: "ring-rose-500" },
  { bg: "bg-teal-100", border: "border-teal-400", text: "text-teal-900", accent: "text-teal-600", accentHover: "hover:text-teal-700", lightBg: "bg-teal-50", lightBorder: "border-teal-200", ring: "ring-teal-500" },
  { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-900", accent: "text-orange-600", accentHover: "hover:text-orange-700", lightBg: "bg-orange-50", lightBorder: "border-orange-200", ring: "ring-orange-500" },
  { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-900", accent: "text-pink-600", accentHover: "hover:text-pink-700", lightBg: "bg-pink-50", lightBorder: "border-pink-200", ring: "ring-pink-500" },
  { bg: "bg-cyan-100", border: "border-cyan-400", text: "text-cyan-900", accent: "text-cyan-600", accentHover: "hover:text-cyan-700", lightBg: "bg-cyan-50", lightBorder: "border-cyan-200", ring: "ring-cyan-500" },
  { bg: "bg-lime-100", border: "border-lime-400", text: "text-lime-900", accent: "text-lime-600", accentHover: "hover:text-lime-700", lightBg: "bg-lime-50", lightBorder: "border-lime-200", ring: "ring-lime-500" },
  { bg: "bg-fuchsia-100", border: "border-fuchsia-400", text: "text-fuchsia-900", accent: "text-fuchsia-600", accentHover: "hover:text-fuchsia-700", lightBg: "bg-fuchsia-50", lightBorder: "border-fuchsia-200", ring: "ring-fuchsia-500" },
  { bg: "bg-red-100", border: "border-red-400", text: "text-red-900", accent: "text-red-600", accentHover: "hover:text-red-700", lightBg: "bg-red-50", lightBorder: "border-red-200", ring: "ring-red-500" },
  { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-900", accent: "text-yellow-600", accentHover: "hover:text-yellow-700", lightBg: "bg-yellow-50", lightBorder: "border-yellow-200", ring: "ring-yellow-500" },
  { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-900", accent: "text-blue-600", accentHover: "hover:text-blue-700", lightBg: "bg-blue-50", lightBorder: "border-blue-200", ring: "ring-blue-500" },
  { bg: "bg-green-100", border: "border-green-400", text: "text-green-900", accent: "text-green-600", accentHover: "hover:text-green-700", lightBg: "bg-green-50", lightBorder: "border-green-200", ring: "ring-green-500" },
];

// All 46 domain slugs in stable alphabetical order
const DOMAIN_SLUGS = [
  "aid-disbursement", "audit-trails", "benefits-eligibility", "business-registry", "carbon-mrv",
  "certificates", "civic-and-democratic-processes", "civil-registry", "climate-and-mrv", "consent",
  "credentialed-participation", "credentials-education", "customs", "data-governance-and-interoperability",
  "data-sharing", "digital-identity-and-credentials", "education-and-workforce", "environmental-registries",
  "food-aid", "g2p-payments", "grants-tracking", "health", "humanitarian-ids", "inter-agency-coordination",
  "kyc-kyb", "land-registry", "licensing", "patient-records-pointers", "payments-and-public-finance",
  "pharmaceuticals", "portable-records", "procurement-and-invoicing", "program-integrity", "provider-credentialing",
  "public-consultations", "public-goods-logistics", "registries-and-records", "selective-disclosure",
  "service-delivery-and-case-management", "skills-verification", "standards", "supply-chain-and-logistics",
  "supply-integrity", "transparency", "treasury-transparency", "verifiable-credentials",
];

/** Theme by domain slug — each domain has its own colour. */
export const DOMAIN_THEMES_BY_SLUG: Record<string, DomainTheme> = Object.fromEntries(
  DOMAIN_SLUGS.map((slug, i) => [slug, PALETTE[i] ?? DEFAULT_THEME])
);

/** Root name → theme (for legend and taxonomy tree). Includes tree text shades. */
export const DOMAIN_THEMES: Record<string, DomainTheme> = {
  "Digital Identity & Credentials": { ...PALETTE[0]!, treeTextLight: "text-indigo-500" },
  "Payments & Public Finance": { ...PALETTE[1]!, treeTextLight: "text-emerald-500" },
  "Registries & Records": { ...PALETTE[2]!, treeTextLight: "text-amber-500" },
  "Service Delivery & Case Management": { ...PALETTE[3]!, treeTextLight: "text-violet-500" },
  "Supply Chain & Logistics": { ...PALETTE[4]!, treeTextLight: "text-sky-500" },
  "Data Governance & Interoperability": { ...PALETTE[5]!, treeTextLight: "text-rose-500" },
  "Civic & Democratic Processes": { ...PALETTE[6]!, treeTextLight: "text-teal-500" },
  "Climate & MRV": { ...PALETTE[7]!, treeTextLight: "text-orange-500" },
  "Education & Workforce": { ...PALETTE[8]!, treeTextLight: "text-pink-500" },
  "Health": { ...PALETTE[9]!, treeTextLight: "text-slate-500" },
};

/** For backward compatibility: Tailwind classes for map node (bg, border, text). */
export const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string }> = Object.fromEntries(
  Object.entries(DOMAIN_THEMES).map(([k, v]) => [k, { bg: v.bg, border: v.border, text: v.text }])
);

/** Get theme by domain slug (preferred) or by root/sector name. */
export function getSectorTheme(sectorOrSlug: string): DomainTheme {
  return DOMAIN_THEMES_BY_SLUG[sectorOrSlug] ?? DOMAIN_THEMES[sectorOrSlug] ?? DEFAULT_THEME;
}

/** Get theme by domain slug only. */
export function getThemeBySlug(slug: string): DomainTheme {
  return DOMAIN_THEMES_BY_SLUG[slug] ?? DEFAULT_THEME;
}

/** Node style for graph: bg, border, text. Uses slug for per-domain colour. */
export function getSectorStyle(sectorOrSlug: string, tier: string) {
  const theme = getSectorTheme(sectorOrSlug);
  const tierBorder = tier === "root" ? "border-2 font-bold shadow" : "border-2";
  return `${theme.bg} ${theme.border} ${theme.text} ${tierBorder}`;
}

/** Text class for taxonomy tree by depth: root = one colour (dark), subdomains = lighter shades. */
export function getTreeTextClass(rootName: string, depth: number): string {
  const theme = DOMAIN_THEMES[rootName] ?? DEFAULT_THEME;
  if (depth === 0) return theme.text;
  if (depth === 1) return theme.accent;
  return theme.treeTextLight ?? theme.accent;
}

/** CSS color (hex) for taxonomy tree text by depth. Use inline style so colour always applies. */
const TREE_TEXT_COLORS: Record<string, [string, string, string]> = {
  "Digital Identity & Credentials": ["#312e81", "#4f46e5", "#6366f1"],
  "Payments & Public Finance": ["#064e3b", "#059669", "#10b981"],
  "Registries & Records": ["#78350f", "#b45309", "#d97706"],
  "Service Delivery & Case Management": ["#4c1d95", "#6d28d9", "#7c3aed"],
  "Supply Chain & Logistics": ["#0c4a6e", "#0284c7", "#0ea5e9"],
  "Data Governance & Interoperability": ["#881337", "#e11d48", "#f43f5e"],
  "Civic & Democratic Processes": ["#134e4a", "#0d9488", "#14b8a6"],
  "Climate & MRV": ["#7c2d12", "#ea580c", "#f97316"],
  "Education & Workforce": ["#831843", "#db2777", "#ec4899"],
  "Health": ["#1e293b", "#475569", "#64748b"],
};

export function getTreeTextColor(rootName: string, depth: number): string {
  const shades = TREE_TEXT_COLORS[rootName] ?? ["#1e293b", "#475569", "#64748b"];
  if (depth === 0) return shades[0]!;
  if (depth === 1) return shades[1]!;
  return shades[2]!;
}

/** Hex color for map edges and minimap by sector/root name. Uses the accent (middle) shade. */
export function getSectorEdgeColor(sectorOrRootName: string): string {
  const shades = TREE_TEXT_COLORS[sectorOrRootName];
  if (shades) return shades[1] ?? shades[0]!;
  return "#475569";
}
