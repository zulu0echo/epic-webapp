import type { LayerId } from "./types";

// ---------------------------------------------------------------------------
// ILLUSTRATIVE history for sparklines.
//
// Real history accrues once the ingestion script (scripts/ingest-metrics.mjs)
// runs on a schedule and appends dated points. Until then this generates a
// deterministic, clearly-labeled illustrative back-series so the trend UI is
// meaningful in the demo. Deterministic (seeded from id+layer) so it does not
// change between renders. NOT a real measurement.
// ---------------------------------------------------------------------------

const POINTS = 12; // ~12 monthly points

function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic illustrative monthly series ending at the current value. */
export function illustrativeHistory(layerId: LayerId, countryId: string, current: number): number[] {
  let s = seed(`${layerId}:${countryId}`);
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  // Gentle upward drift from ~80% of current, with small noise.
  const start = current * (0.78 + rnd() * 0.12);
  const series: number[] = [];
  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1);
    const base = start + (current - start) * t;
    const noise = (rnd() - 0.5) * current * 0.05;
    series.push(Math.max(0, +(base + noise).toFixed(2)));
  }
  series[POINTS - 1] = current; // anchor the last point to the real snapshot value
  return series;
}

export const HISTORY_IS_ILLUSTRATIVE = true;
