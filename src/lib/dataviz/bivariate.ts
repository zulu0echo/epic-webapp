import type { CountryDatum, MapLayer } from "./types";

// Bivariate-overlay helpers (pure; unit-tested in dataviz.test.ts).
export const INDIGO3 = ["#dde2f6", "#8590d9", "#101349"]; // primary layer axis
export const AMBER3 = ["#f6edbe", "#e3c04e", "#8a6a12"]; // compare layer axis

/** Average two #rrggbb colors into one. */
export function mix(a: string, b: string): string {
  const p = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const c = (x: number, y: number) =>
    Math.round((x + y) / 2)
      .toString(16)
      .padStart(2, "0");
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

/** Tercile thresholds for a layer's values-with-data. */
export function terciles(layer: MapLayer): [number, number] {
  const vals = Object.values(layer.data)
    .map((d) => d.value)
    .filter((v): v is number => v != null)
    .sort((a, b) => a - b);
  if (vals.length < 3) return [0, 0];
  return [vals[Math.floor(vals.length / 3)], vals[Math.floor((2 * vals.length) / 3)]];
}

/** Bin a datum's value into 0|1|2 for the bivariate matrix, or null if no data. */
export function binValue(layer: MapLayer, datum: CountryDatum | undefined, th: [number, number]): number | null {
  if (!datum || datum.value == null) return null;
  if (layer.kind === "phase") {
    const p = datum.phase ?? Math.round(datum.value);
    return p <= 1 ? 0 : p === 2 ? 1 : 2;
  }
  return datum.value < th[0] ? 0 : datum.value < th[1] ? 1 : 2;
}
