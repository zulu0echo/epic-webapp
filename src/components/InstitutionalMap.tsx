"use client";

import { useMemo, useState, useCallback } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Feature } from "geojson";
import worldTopo from "world-atlas/countries-110m.json";
import {
  Banknote,
  BookOpen,
  Building2,
  Coins,
  ExternalLink,
  FileDown,
  Gauge,
  Info,
  Landmark,
  Layers,
  Network,
  ScrollText,
  Table2,
  X,
} from "lucide-react";
import {
  LAYERS,
  colorFor,
  formatValue,
  rankedCountries,
  coverage,
  toCsv,
  illustrativeHistory,
  POLICY_NEWS,
  INDIGO3,
  AMBER3,
  mix,
  terciles,
  binValue,
  NO_DATA_COLOR,
  type CountryDatum,
  type LayerId,
  type MapLayer,
  type NewsDirection,
  type SourceLink,
} from "@/lib/dataviz";
import { cn } from "@/lib/cn";

const WIDTH = 980;
const HEIGHT = 500;

const LAYER_ICONS: Record<LayerId, typeof Network> = {
  "validator-decentralization": Network,
  "stablecoin-access": Coins,
  "regulatory-status": ScrollText,
  "institutional-readiness": Gauge,
  "rwa-tokenization": Building2,
  "cbdc-status": Banknote,
};

function downloadCsv(layer: MapLayer) {
  const blob = new Blob([toCsv(layer)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ethereum-institutional-map__${layer.id}__${layer.asOf.replace(/\s+/g, "-")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Build country features once (module scope — same for every render).
const COUNTRIES: Feature[] = (
  feature(worldTopo as never, (worldTopo as never as { objects: { countries: never } }).objects.countries) as unknown as FeatureCollection
).features.filter((f) => f.id !== "010"); // drop Antarctica

const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], {
  type: "FeatureCollection",
  features: COUNTRIES,
});
const pathGen = geoPath(projection);

const CLASS_STYLE: Record<string, string> = {
  measured: "bg-slate-100 text-slate-600",
  modeled: "bg-epic-yellow-soft/60 text-slate-700",
  assessed: "bg-slate-100 text-slate-600",
};

function ClassBadge({ layer }: { layer: MapLayer }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium capitalize", CLASS_STYLE[layer.classification])}>
      {layer.classification}
    </span>
  );
}

function BivariateLegend({ layer, compareLayer }: { layer: MapLayer; compareLayer: MapLayer }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Bivariate</div>
      <div className="flex items-stretch gap-1">
        <div className="flex items-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
            {compareLayer.shortLabel} →
          </span>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-0.5">
            {[2, 1, 0].map((b) =>
              [0, 1, 2].map((a) => (
                <span key={`${a}-${b}`} className="h-4 w-4" style={{ backgroundColor: mix(INDIGO3[a], AMBER3[b]) }} />
              )),
            )}
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-500">{layer.shortLabel} →</div>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 132;
  const h = 30;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const rng = max - min || 1;
  const y = (v: number) => h - ((v - min) / rng) * (h - 4) - 2;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${y(v)}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke="#5b68c7" strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={w} cy={y(values[values.length - 1])} r={2.5} fill="#101349" />
    </svg>
  );
}

const DIR_STYLE: Record<NewsDirection, { cls: string; icon: string }> = {
  enabling: { cls: "bg-slate-100 text-epic-accent", icon: "▲" },
  restrictive: { cls: "bg-amber-100 text-amber-800", icon: "▼" },
  neutral: { cls: "bg-slate-100 text-slate-500", icon: "→" },
};

function PolicyNewsSection({ countryId }: { countryId: string }) {
  const items = POLICY_NEWS[countryId];
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="epic-label mb-2">Policy news</div>
      <ul className="space-y-3">
        {items.map((n, i) => {
          const dir = DIR_STYLE[n.direction];
          return (
            <li key={i} className="text-sm">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400">{n.date}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase", dir.cls)}>
                  {dir.icon} {n.direction}
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium capitalize text-slate-500">
                  {n.topic.replace("-", " ")}
                </span>
              </div>
              <p className="mt-1 text-slate-600">{n.headline}</p>
              <div className="mt-0.5">
                <SourceRow source={n.source} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11px] italic text-slate-400">
        Classified feed (topic · direction). Live source: GDELT + classification; this snapshot is curated from official sources.
      </p>
    </div>
  );
}

function SourceRow({ source }: { source: SourceLink }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-1.5 text-xs text-slate-600 hover:text-epic-accent-hover"
    >
      <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-slate-400 group-hover:text-epic-accent-hover" />
      <span className="underline decoration-slate-300 underline-offset-2 group-hover:decoration-epic-accent-hover">
        {source.label}
      </span>
    </a>
  );
}

export default function InstitutionalMap() {
  const [layerId, setLayerId] = useState<LayerId>("validator-decentralization");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [compareId, setCompareId] = useState<LayerId | "">("");

  const layer = useMemo<MapLayer>(() => LAYERS.find((l) => l.id === layerId)!, [layerId]);
  const compareLayer = useMemo<MapLayer | null>(
    () => (compareId && compareId !== layerId ? LAYERS.find((l) => l.id === compareId) ?? null : null),
    [compareId, layerId],
  );
  const thA = useMemo(() => terciles(layer), [layer]);
  const thB = useMemo(() => (compareLayer ? terciles(compareLayer) : ([0, 0] as [number, number])), [compareLayer]);
  const fillFor = useCallback(
    (id: string, datum: CountryDatum | undefined): string => {
      if (!compareLayer) return colorFor(layer, datum);
      const a = binValue(layer, datum, thA);
      const b = binValue(compareLayer, compareLayer.data[id], thB);
      return a == null || b == null ? NO_DATA_COLOR : mix(INDIGO3[a], AMBER3[b]);
    },
    [compareLayer, layer, thA, thB],
  );
  const selected = selectedId ? layer.data[selectedId] : undefined;
  const hovered = hover ? layer.data[hover.id] : undefined;
  const hoveredName = useMemo(() => {
    if (!hover) return "";
    return hovered?.name ?? COUNTRIES.find((c) => String(c.id) === hover.id)?.properties?.name ?? "";
  }, [hover, hovered]);

  const onMove = useCallback((e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.closest("svg")?.getBoundingClientRect();
    if (!rect) return;
    setHover({
      id,
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      {/* Controls */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <Layers className="h-3.5 w-3.5" /> Data layer
          </span>
          {LAYERS.map((l) => {
            const Icon = LAYER_ICONS[l.id];
            const active = l.id === layerId;
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setLayerId(l.id);
                  setSelectedId(null);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "border-epic-navy bg-epic-navy text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.shortLabel}
                {l.isModeled && (
                  <span className={cn("rounded px-1 text-[10px] font-semibold uppercase", active ? "bg-white/20" : "bg-slate-100 text-slate-500")}>
                    modeled
                  </span>
                )}
              </button>
            );
          })}
          <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-mono uppercase tracking-[0.12em]">Compare</span>
              <select
                value={compareId}
                onChange={(e) => setCompareId(e.target.value as LayerId | "")}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
              >
                <option value="">Off</option>
                {LAYERS.filter((l) => l.id !== layerId).map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.shortLabel}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              aria-pressed={showMethodology}
              onClick={() => setShowMethodology((s) => !s)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition",
                showMethodology
                  ? "border-epic-navy bg-epic-navy text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <BookOpen className="h-4 w-4" /> Methodology
            </button>
            <button
              type="button"
              onClick={() => downloadCsv(layer)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <FileDown className="h-4 w-4" /> CSV
            </button>
            <button
              type="button"
              aria-pressed={showTable}
              onClick={() => setShowTable((s) => !s)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition",
                showTable
                  ? "border-epic-navy bg-epic-navy text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <Table2 className="h-4 w-4" /> {showTable ? "Map" : "Table"}
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {layer.higherMeans}. <span className="font-medium text-slate-600">{layer.audience}.</span>{" "}
          <span className="italic">{layer.asOf}</span>
        </p>
      </div>

      {/* Snapshot honesty banner */}
      <div className="flex items-start gap-2 border-b border-amber-200/60 bg-epic-yellow-soft/40 px-6 py-2 text-xs text-slate-700">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
        <span>
          Illustrative snapshot compiled from the linked public sources, pending live ingestion (see{" "}
          <code className="rounded bg-white/70 px-1">docs/institutional-data-map</code>). Every value links to its source; modeled layers are labeled.
        </span>
      </div>

      {showMethodology ? (
        <MethodologyView onClose={() => setShowMethodology(false)} />
      ) : (
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Map / table */}
        <div className="relative min-h-[380px] flex-1 bg-slate-50/70 sm:min-h-[560px]">
          {showTable ? (
            <TableView layer={layer} onSelect={(id) => { setSelectedId(id); setShowTable(false); }} />
          ) : (
            <>
              <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="h-full w-full"
                role="img"
                aria-label={`World choropleth — ${layer.label}`}
                onMouseLeave={() => setHover(null)}
              >
                <rect width={WIDTH} height={HEIGHT} fill="transparent" onClick={() => setSelectedId(null)} />
                {COUNTRIES.map((f, i) => {
                  const id = String(f.id);
                  const datum = layer.data[id];
                  const d = pathGen(f) ?? undefined;
                  if (!d) return null;
                  const isSelected = id === selectedId;
                  return (
                    <path
                      key={i}
                      d={d}
                      fill={fillFor(id, datum)}
                      stroke={isSelected ? "#101349" : "#ffffff"}
                      strokeWidth={isSelected ? 1.4 : 0.4}
                      className="cursor-pointer outline-none transition-[stroke,opacity] hover:opacity-80"
                      onMouseMove={(e) => onMove(e, id)}
                      onClick={() => setSelectedId(id)}
                      aria-label={datum ? `${datum.name}: ${formatValue(layer, datum)}` : undefined}
                    />
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hover && hoveredName && (
                <div
                  className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
                  style={{ left: `${hover.x}%`, top: `${Math.max(hover.y - 1.5, 0)}%` }}
                >
                  <div className="font-semibold text-epic-ink">{hoveredName}</div>
                  <div className="text-slate-600">
                    {layer.shortLabel}: {formatValue(layer, hovered)}
                  </div>
                  {compareLayer && (
                    <div className="text-slate-600">
                      {compareLayer.shortLabel}: {formatValue(compareLayer, compareLayer.data[hover.id])}
                    </div>
                  )}
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 z-10 rounded-epic border border-slate-200 bg-white/95 p-3 shadow-epic">
                {compareLayer ? (
                  <BivariateLegend layer={layer} compareLayer={compareLayer} />
                ) : (
                  <>
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                      {layer.unit}
                    </div>
                    <ul className="space-y-1">
                      {layer.legend.map((stop) => (
                        <li key={stop.label} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: stop.color }} />
                          {stop.label}
                        </li>
                      ))}
                      <li className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="h-3 w-3 rounded-sm border border-slate-200" style={{ backgroundColor: NO_DATA_COLOR }} />
                        No data
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Detail / overview panel */}
        <aside className="w-full shrink-0 overflow-auto border-t border-slate-200 bg-white lg:w-96 lg:border-l lg:border-t-0">
          {selected ? (
            <CountryPanel layer={layer} datum={selected} onClose={() => setSelectedId(null)} />
          ) : (
            <LayerOverview layer={layer} onOpenMethodology={() => setShowMethodology(true)} />
          )}
        </aside>
      </div>
      )}
    </div>
  );
}

function LayerOverview({ layer, onOpenMethodology }: { layer: MapLayer; onOpenMethodology: () => void }) {
  const ranked = rankedCountries(layer).slice(0, 5);
  const cov = coverage(layer);
  return (
    <div className="p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{layer.eyebrow}</div>
      <h2 className="epic-heading-3 mt-1">{layer.label}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{layer.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
          Coverage: {cov.withData}/{cov.total} countries
        </span>
        <ClassBadge layer={layer} />
        <span className="italic text-slate-400">{layer.asOf}</span>
      </div>

      <button
        type="button"
        onClick={onOpenMethodology}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-epic-accent hover:text-epic-accent-hover"
      >
        <BookOpen className="h-4 w-4" /> How this is measured →
      </button>

      <div className="mt-4 rounded-epic border border-slate-200 bg-slate-50/60 p-3 text-sm text-slate-600">
        <Info className="mb-1 inline h-3.5 w-3.5 text-slate-400" /> Click a country for its detail and sources.
      </div>

      {ranked.length > 0 && (
        <div className="mt-5">
          <div className="epic-label mb-2">Top by value</div>
          <ul className="space-y-1.5">
            {ranked.map((d) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{d.name}</span>
                <span className="font-mono text-xs text-slate-500">{formatValue(layer, d)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <div className="epic-label mb-2">Sources</div>
        <div className="space-y-1.5">
          {layer.sources.map((s) => (
            <SourceRow key={s.url} source={s} />
          ))}
        </div>
        <p className="mt-3 text-xs italic text-slate-400">{layer.asOf}</p>
      </div>
    </div>
  );
}

function CountryPanel({
  layer,
  datum,
  onClose,
}: {
  layer: MapLayer;
  datum: CountryDatum;
  onClose: () => void;
}) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{layer.shortLabel}</div>
          <h2 className="epic-heading-3 mt-1">{datum.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 rounded-epic border border-slate-200 bg-slate-50/60 p-4">
        <div className="epic-label">{layer.unit}</div>
        <div className="mt-1 text-2xl font-extrabold text-epic-ink">{formatValue(layer, datum)}</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {layer.isModeled && (
            <span className="inline-block rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
              Modeled value
            </span>
          )}
          {datum.trend && (
            <span className="inline-block rounded bg-epic-yellow-soft/60 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
              {datum.trend}
            </span>
          )}
        </div>
        {layer.kind === "sequential" && datum.value != null && (
          <div className="mt-3">
            <Sparkline values={illustrativeHistory(layer.id, datum.id, datum.value)} />
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">
              12-mo trend · illustrative
            </div>
          </div>
        )}
      </div>

      {(datum.framework || datum.effectiveDate) && (
        <dl className="mt-4 space-y-1.5 text-sm">
          {datum.framework && (
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Framework</dt>
              <dd className="text-right font-medium text-slate-700">{datum.framework}</dd>
            </div>
          )}
          {datum.effectiveDate && (
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Effective</dt>
              <dd className="text-right font-medium text-slate-700">{datum.effectiveDate}</dd>
            </div>
          )}
        </dl>
      )}

      {datum.subScores && datum.subScores.length > 0 && (
        <div className="mt-5">
          <div className="epic-label mb-2">Sub-domain scores</div>
          <ul className="space-y-2">
            {datum.subScores.map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-mono text-xs text-slate-500">
                    {s.value}/{s.max}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-epic-slate" style={{ width: `${(s.value / s.max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {datum.metrics && datum.metrics.length > 0 && (
        <div className="mt-5">
          <div className="epic-label mb-2">Breakdown</div>
          <ul className="space-y-2.5">
            {datum.metrics.map((m) => (
              <li key={m.label} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{m.label}</span>
                  <span className="font-mono text-xs text-slate-700">{m.value}</span>
                </div>
                {m.source && (
                  <div className="mt-0.5">
                    <SourceRow source={m.source} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {datum.note && <p className="mt-5 text-sm leading-relaxed text-slate-600">{datum.note}</p>}

      {datum.developments && datum.developments.length > 0 && (
        <div className="mt-6">
          <div className="epic-label mb-2">Recent developments</div>
          <ul className="space-y-3 border-l border-slate-200 pl-3">
            {datum.developments.map((d, i) => (
              <li key={i} className="text-sm">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400">{d.date}</div>
                <p className="mt-0.5 text-slate-600">{d.text}</p>
                {d.source && (
                  <div className="mt-0.5">
                    <SourceRow source={d.source} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {datum.officialSources && datum.officialSources.length > 0 && (
        <div className="mt-6">
          <div className="epic-label mb-2 flex items-center gap-1.5">
            <Landmark className="h-3.5 w-3.5 text-slate-400" /> Official & primary sources
          </div>
          <div className="space-y-1.5">
            {datum.officialSources.map((s) => (
              <SourceRow key={s.url} source={s} />
            ))}
          </div>
        </div>
      )}

      <PolicyNewsSection countryId={datum.id} />

      <div className="mt-6">
        <div className="epic-label mb-2">Compiled from</div>
        {datum.source ? <SourceRow source={datum.source} /> : <p className="text-xs text-slate-400">Layer sources apply.</p>}
        <p className="mt-3 text-xs italic text-slate-400">{layer.asOf}</p>
      </div>
    </div>
  );
}

function MethodologyView({ onClose }: { onClose: () => void }) {
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Methodology</div>
            <h2 className="epic-heading-2 mt-1">How each layer is measured</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to map
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Every value on this map links back to its primary source, shows an as-of date, and is
          labeled by how it was derived. The current figures are an{" "}
          <strong>illustrative snapshot</strong> compiled from the linked public sources; the code is
          structured so moving to continuous live ingestion is a data-source change, not a redesign.
          See the full data-sourcing plan in <code className="rounded bg-slate-100 px-1">docs/institutional-data-map</code>.
        </p>

        {/* Classification definitions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { k: "measured", d: "Observed from primary data (e.g. node counts). Subject to collection limits, not judgment." },
            { k: "modeled", d: "Computed from measured inputs via a stated formula. A proxy, not a direct observation." },
            { k: "assessed", d: "Editorial classification from primary law and official sources, cross-checked against trackers." },
          ].map((c) => (
            <div key={c.k} className="rounded-epic border border-slate-200 bg-slate-50/60 p-3">
              <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize", CLASS_STYLE[c.k])}>
                {c.k}
              </span>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>

        {/* Per-layer methodology */}
        <div className="mt-8 space-y-6">
          {LAYERS.map((l) => (
            <section key={l.id} className="rounded-epic border border-slate-200 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="epic-heading-3">{l.label}</h3>
                <ClassBadge layer={l} />
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
                Metric: {l.unit} · Cadence: {l.cadence}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{l.methodology}</p>
              <div className="mt-4">
                <div className="epic-label mb-1.5">Sources</div>
                <div className="space-y-1.5">
                  {l.sources.map((s) => (
                    <SourceRow key={s.url} source={s} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-epic border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600">
          <div className="epic-label mb-1.5">Limitations &amp; gap-fill</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>Countries without data render as a neutral “No data” gap rather than a guessed value.</li>
            <li>Regulatory postures change; treat each entry's as-of date and linked statute as authoritative.</li>
            <li>Modeled layers are proxies — they indicate where to look, not exact magnitudes.</li>
            <li>Live country-level stablecoin <em>flows</em> require licensed data and are out of scope for the free snapshot.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TableView({ layer, onSelect }: { layer: MapLayer; onSelect: (id: string) => void }) {
  const rows = rankedCountries(layer);
  return (
    <div className="h-full overflow-auto p-6">
      <table className="w-full text-sm">
        <caption className="sr-only">{layer.label} by country</caption>
        <thead>
          <tr className="border-b border-slate-200 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
            <th className="py-2 pr-4 font-medium">Country</th>
            <th className="py-2 pr-4 font-medium">{layer.unit}</th>
            <th className="py-2 font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 pr-4">
                <button type="button" onClick={() => onSelect(d.id)} className="text-slate-700 hover:text-epic-accent-hover hover:underline">
                  {d.name}
                </button>
              </td>
              <td className="py-2 pr-4 font-mono text-xs text-slate-600">{formatValue(layer, d)}</td>
              <td className="py-2">{d.source && <SourceRow source={d.source} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
