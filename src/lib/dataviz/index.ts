export * from "./types";
export { LAYERS, NO_DATA_COLOR, REGULATORY_PHASE_LABELS, TOTAL_COUNTRIES } from "./data";
export { illustrativeHistory, HISTORY_IS_ILLUSTRATIVE } from "./history";
export { POLICY_NEWS, type NewsItem, type NewsTopic, type NewsDirection } from "./policyNews";
export { INDIGO3, AMBER3, mix, terciles, binValue } from "./bivariate";

import { LAYERS, NO_DATA_COLOR, TOTAL_COUNTRIES } from "./data";
import type { CountryDatum, LayerId, MapLayer } from "./types";

export function getLayer(id: LayerId): MapLayer {
  const layer = LAYERS.find((l) => l.id === id);
  if (!layer) throw new Error(`Unknown layer: ${id}`);
  return layer;
}

/** Resolve the fill color for a country under a given layer. */
export function colorFor(layer: MapLayer, datum: CountryDatum | undefined): string {
  if (!datum || datum.value == null) return NO_DATA_COLOR;
  if (layer.kind === "phase") {
    const idx = datum.phase ?? Math.round(datum.value);
    return layer.legend[idx]?.color ?? NO_DATA_COLOR;
  }
  const stop = layer.legend.find(
    (s) => datum.value! >= (s.lo ?? -Infinity) && datum.value! < (s.hi ?? Infinity),
  );
  return stop?.color ?? layer.legend[layer.legend.length - 1]?.color ?? NO_DATA_COLOR;
}

/** Human-readable primary value for tooltips / panels. */
export function formatValue(layer: MapLayer, datum: CountryDatum | undefined): string {
  if (!datum || datum.value == null) return "No data";
  if (layer.kind === "phase") {
    const idx = datum.phase ?? Math.round(datum.value);
    return layer.legend[idx]?.label ?? String(datum.value);
  }
  if (layer.unit.includes("index")) return `${datum.value} / 100`;
  if (layer.unit.includes("%")) return `${datum.value}%`;
  return String(datum.value);
}

/** Countries with data under a layer, sorted by value descending (for the table view). */
export function rankedCountries(layer: MapLayer): CountryDatum[] {
  return Object.values(layer.data)
    .filter((d) => d.value != null)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}

/** How many countries carry data under a layer, out of the world total. */
export function coverage(layer: MapLayer): { withData: number; total: number } {
  return { withData: rankedCountries(layer).length, total: TOTAL_COUNTRIES };
}

function csvEscape(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a CSV (with sources) for the current layer — institutions expect an export. */
export function toCsv(layer: MapLayer): string {
  const header = ["Country", "ISO", "Value", "Unit", "Source", "SourceURL", "AsOf", "Modeled"];
  const rows = rankedCountries(layer).map((d) => [
    d.name,
    d.id,
    layer.kind === "phase" ? formatValue(layer, d) : (d.value ?? ""),
    layer.unit,
    d.source?.label ?? "",
    d.source?.url ?? "",
    layer.asOf,
    String(layer.isModeled),
  ]);
  return [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
}
