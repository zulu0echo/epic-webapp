// Map sector (top-level domain name) to Tailwind colours for the graph — distinct and visually appealing
export const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "Digital Identity & Credentials": { bg: "bg-indigo-200", border: "border-indigo-500", text: "text-indigo-900" },
  "Payments & Public Finance": { bg: "bg-emerald-200", border: "border-emerald-500", text: "text-emerald-900" },
  "Registries & Records": { bg: "bg-amber-200", border: "border-amber-500", text: "text-amber-900" },
  "Service Delivery & Case Management": { bg: "bg-violet-200", border: "border-violet-500", text: "text-violet-900" },
  "Supply Chain & Logistics": { bg: "bg-sky-200", border: "border-sky-500", text: "text-sky-900" },
  "Data Governance & Interoperability": { bg: "bg-slate-200", border: "border-slate-500", text: "text-slate-900" },
  "Civic & Democratic Processes": { bg: "bg-rose-200", border: "border-rose-500", text: "text-rose-900" },
  "Climate & MRV": { bg: "bg-teal-200", border: "border-teal-500", text: "text-teal-900" },
  "Education & Workforce": { bg: "bg-orange-200", border: "border-orange-500", text: "text-orange-900" },
  "Health": { bg: "bg-pink-200", border: "border-pink-500", text: "text-pink-900" },
};

export function getSectorStyle(sector: string, tier: string) {
  const style = SECTOR_COLORS[sector] ?? { bg: "bg-slate-200", border: "border-slate-400", text: "text-slate-800" };
  const tierBorder = tier === "root" ? "border-2 font-bold shadow" : "border-2";
  return `${style.bg} ${style.border} ${style.text} ${tierBorder}`;
}
