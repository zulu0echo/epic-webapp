// Types for the Ethereum Institutional Data Map.
// See docs/institutional-data-map/README.md for the design & data-sourcing plan.
//
// Provenance principle (§0 of the plan): every value carries a link back to its
// source, an as-of date, and a modeled/measured flag. These types enforce that a
// layer cannot exist without at least one source, and let individual country data
// points carry their own source link.

export type LayerId =
  | "validator-decentralization"
  | "stablecoin-access"
  | "regulatory-status"
  | "institutional-readiness"
  | "rwa-tokenization"
  | "cbdc-status";

export type LayerKind = "sequential" | "phase";

/** How a layer's primary value is derived — drives the methodology labeling. */
export type Classification = "measured" | "modeled" | "assessed";

export interface SourceLink {
  label: string;
  url: string;
}

/** A single drill-down row shown in the country panel, optionally sourced. */
export interface MetricRow {
  label: string;
  value: string;
  source?: SourceLink;
}

/** A 0..max ordinal sub-score for a country (e.g. a regulatory sub-domain). */
export interface SubScore {
  label: string;
  value: number;
  max: number;
  note?: string;
}

/** A dated policy/regulatory development, linked to an official/legitimate source. */
export interface Development {
  date: string;
  text: string;
  source?: SourceLink;
}

export interface CountryDatum {
  /** Numeric ISO 3166-1 code — matches the world-atlas topojson `id`. */
  id: string;
  name: string;
  /** Primary metric for the choropleth. null = no data (rendered as a gap). */
  value: number | null;
  /** Ordinal phase index (regulatory layer only): 0..N-1 into the layer legend. */
  phase?: number;
  /** Extra rows for the drill-down panel; each may carry its own source. */
  metrics?: MetricRow[];
  note?: string;
  /** Primary source for this country's data point. */
  source?: SourceLink;
  // --- Regulatory enrichment (optional) ---
  /** Ordinal sub-domain scores (e.g. stablecoins, custody, tax, market structure). */
  subScores?: SubScore[];
  /** Named framework / statute this posture is based on. */
  framework?: string;
  /** When the framework took (or takes) effect. */
  effectiveDate?: string;
  /** Short trajectory note, e.g. "▲ advanced with GENIUS Act (2025)". */
  trend?: string;
  /** Dated policy developments with official-source links. */
  developments?: Development[];
  /** Government / regulator / primary-source links for this jurisdiction. */
  officialSources?: SourceLink[];
}

export interface LegendStop {
  color: string;
  label: string;
  /** Inclusive lower / exclusive upper bound for sequential layers. */
  lo?: number;
  hi?: number;
}

export interface MapLayer {
  id: LayerId;
  label: string;
  shortLabel: string;
  eyebrow: string;
  description: string;
  /** Institutional angle — who cares and why. */
  audience: string;
  unit: string;
  kind: LayerKind;
  /** True when the primary metric is modeled/inferred rather than measured. */
  isModeled: boolean;
  /** measured / modeled / assessed — shown as a badge and in the methodology. */
  classification: Classification;
  /** Plain-language statement of exactly how the value is derived, incl. formula. */
  methodology: string;
  /** Ingestion cadence target for the live pipeline (e.g. "hourly", "annual"). */
  cadence: string;
  asOf: string;
  /** One line explaining what a higher value means. */
  higherMeans: string;
  legend: LegendStop[];
  sources: SourceLink[];
  /** Country data keyed by numeric ISO 3166-1 code. */
  data: Record<string, CountryDatum>;
}
