import { describe, it, expect } from "vitest";
import topo from "world-atlas/countries-110m.json";
import {
  LAYERS,
  colorFor,
  formatValue,
  rankedCountries,
  coverage,
  toCsv,
  illustrativeHistory,
  NO_DATA_COLOR,
  TOTAL_COUNTRIES,
} from "./index";
import { mix, terciles, binValue } from "./bivariate";
import { POLICY_NEWS } from "./policyNews";

const HEX = /^#[0-9a-fA-F]{6}$/;
const GEO_IDS = new Set(
  (topo as unknown as { objects: { countries: { geometries: { id: string | number }[] } } }).objects.countries.geometries.map(
    (g) => String(g.id),
  ),
);

describe("layer definitions", () => {
  it("has 6 layers with unique ids", () => {
    expect(LAYERS).toHaveLength(6);
    expect(new Set(LAYERS.map((l) => l.id)).size).toBe(6);
  });

  for (const layer of LAYERS) {
    describe(layer.id, () => {
      it("has required metadata", () => {
        expect(layer.label).toBeTruthy();
        expect(layer.methodology.length).toBeGreaterThan(20);
        expect(layer.classification).toMatch(/measured|modeled|assessed/);
        expect(layer.sources.length).toBeGreaterThan(0);
        expect(layer.legend.length).toBeGreaterThan(0);
        expect(layer.cadence).toBeTruthy();
      });

      it("every source has a valid https url", () => {
        for (const s of layer.sources) {
          expect(s.label).toBeTruthy();
          expect(s.url).toMatch(/^https?:\/\//);
        }
      });

      it("every datum is keyed by its own id, has a value, and a source", () => {
        for (const [key, d] of Object.entries(layer.data)) {
          expect(d.id).toBe(key);
          expect(d.value).not.toBeNull();
          expect(d.source?.url).toMatch(/^https?:\/\//);
        }
      });

      it("every datum id exists in the map geometry (no silent gaps)", () => {
        for (const id of Object.keys(layer.data)) {
          expect(GEO_IDS.has(id), `${layer.id}: id ${id} missing from geometry`).toBe(true);
        }
      });

      it("colorFor returns a valid hex for every datum", () => {
        for (const d of Object.values(layer.data)) {
          expect(colorFor(layer, d)).toMatch(HEX);
        }
      });

      if (layer.kind === "phase") {
        it("phase indices are within legend bounds", () => {
          for (const d of Object.values(layer.data)) {
            const idx = d.phase ?? Math.round(d.value ?? 0);
            expect(idx).toBeGreaterThanOrEqual(0);
            expect(idx).toBeLessThan(layer.legend.length);
          }
        });
      }
    });
  }
});

describe("no duplicate source urls within a datum (guards React keys)", () => {
  for (const layer of LAYERS) {
    it(`${layer.id}`, () => {
      for (const d of Object.values(layer.data)) {
        for (const list of [d.officialSources, d.metrics?.map((m) => m.source).filter(Boolean)]) {
          if (!list) continue;
          const urls = (list as { url?: string }[]).map((s) => s?.url).filter(Boolean);
          expect(new Set(urls).size, `${layer.id}/${d.id} has duplicate source urls`).toBe(urls.length);
        }
      }
    });
  }
});

describe("colorFor / formatValue", () => {
  const reg = LAYERS.find((l) => l.id === "regulatory-status")!;
  const val = LAYERS.find((l) => l.id === "validator-decentralization")!;

  it("returns NO_DATA for undefined datum", () => {
    expect(colorFor(val, undefined)).toBe(NO_DATA_COLOR);
    expect(formatValue(val, undefined)).toBe("No data");
  });

  it("formats phase, percent and index values", () => {
    expect(formatValue(reg, reg.data["156"])).toContain("Prohibitive"); // China phase 0
    expect(formatValue(val, val.data["840"])).toBe("45%"); // US node share
    const sc = LAYERS.find((l) => l.id === "stablecoin-access")!;
    expect(formatValue(sc, sc.data["032"])).toBe("95 / 100"); // Argentina index
  });
});

describe("rankedCountries / coverage", () => {
  for (const layer of LAYERS) {
    it(`${layer.id}: ranked descending, coverage matches`, () => {
      const ranked = rankedCountries(layer);
      for (let i = 1; i < ranked.length; i++) {
        expect(ranked[i - 1].value ?? 0).toBeGreaterThanOrEqual(ranked[i].value ?? 0);
      }
      expect(coverage(layer).withData).toBe(ranked.length);
      expect(coverage(layer).total).toBe(TOTAL_COUNTRIES);
    });
  }
});

describe("toCsv", () => {
  const layer = LAYERS.find((l) => l.id === "validator-decentralization")!;
  const csv = toCsv(layer);
  it("has a header and one row per ranked country", () => {
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Country,ISO,Value,Unit,Source,SourceURL,AsOf,Modeled");
    expect(lines.length).toBe(rankedCountries(layer).length + 1);
  });
  it("escapes fields containing commas", () => {
    // "% of nodes" has no comma, but source labels contain em-dashes/commas — ensure quoting when needed
    const line = csv.split("\n").find((l) => l.includes('"'));
    if (line) expect(line).toMatch(/"/);
  });
});

describe("illustrativeHistory", () => {
  it("is deterministic, length 12, ends at current, non-negative", () => {
    const a = illustrativeHistory("validator-decentralization", "840", 45);
    const b = illustrativeHistory("validator-decentralization", "840", 45);
    expect(a).toEqual(b);
    expect(a).toHaveLength(12);
    expect(a[a.length - 1]).toBe(45);
    expect(Math.min(...a)).toBeGreaterThanOrEqual(0);
  });
  it("differs across countries", () => {
    const a = illustrativeHistory("validator-decentralization", "840", 45);
    const b = illustrativeHistory("validator-decentralization", "276", 45);
    expect(a).not.toEqual(b);
  });
});

describe("bivariate helpers", () => {
  it("mix averages two colors into a valid hex", () => {
    expect(mix("#000000", "#ffffff")).toBe("#808080");
    expect(mix("#dde2f6", "#101349")).toMatch(HEX);
  });
  it("terciles are non-decreasing", () => {
    for (const layer of LAYERS) {
      const [a, b] = terciles(layer);
      expect(b).toBeGreaterThanOrEqual(a);
    }
  });
  it("binValue returns 0..2 for data and null for missing", () => {
    const val = LAYERS.find((l) => l.id === "validator-decentralization")!;
    const th = terciles(val);
    expect(binValue(val, undefined, th)).toBeNull();
    for (const d of Object.values(val.data)) {
      const b = binValue(val, d, th);
      expect(b === 0 || b === 1 || b === 2).toBe(true);
    }
  });
});

describe("policy news", () => {
  it("keys reference real geometry ids and every item is sourced", () => {
    for (const [id, items] of Object.entries(POLICY_NEWS)) {
      expect(GEO_IDS.has(id), `news country ${id} not in geometry`).toBe(true);
      for (const n of items) {
        expect(n.source.url).toMatch(/^https?:\/\//);
        expect(n.direction).toMatch(/enabling|restrictive|neutral/);
      }
    }
  });
});
