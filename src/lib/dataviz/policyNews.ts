import type { SourceLink } from "./types";

// ---------------------------------------------------------------------------
// POLICY-NEWS FEED (precomputed & committed)
//
// Per-country regulatory/policy items with a classification (topic + direction).
// In production these are produced by scripts/ingest-metrics.mjs: GDELT DOC 2.0
// is queried per country for crypto/stablecoin/RWA/Ethereum policy, each article
// is classified by Claude (relevance, topic, enabling↔restrictive direction) and
// deduped, then the result is committed here. This committed snapshot is a
// curated, hand-verified stand-in compiled from official / reputable sources so
// the feed is meaningful before the pipeline runs. Keys are ISO 3166-1 codes.
// ---------------------------------------------------------------------------

export type NewsTopic = "stablecoin" | "rwa" | "market-structure" | "cbdc" | "general";
export type NewsDirection = "enabling" | "restrictive" | "neutral";

export interface NewsItem {
  date: string;
  headline: string;
  topic: NewsTopic;
  direction: NewsDirection;
  source: SourceLink;
}

const S = {
  sec: { label: "U.S. SEC", url: "https://www.sec.gov/securities-topics/crypto-assets" },
  congress: { label: "U.S. Congress (GENIUS Act)", url: "https://www.congress.gov/search?q=GENIUS%20Act" },
  esma: { label: "ESMA (MiCA)", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" },
  fca: { label: "UK FCA", url: "https://www.fca.org.uk/firms/cryptoassets" },
  jfsa: { label: "Japan FSA", url: "https://www.fsa.go.jp/en/" },
  vara: { label: "Dubai VARA", url: "https://www.vara.ae/" },
  fscKorea: { label: "Korea FSC", url: "https://www.fsc.go.kr/eng/" },
  bcb: { label: "Banco Central do Brasil", url: "https://www.bcb.gov.br/en" },
  rbi: { label: "Reserve Bank of India", url: "https://www.rbi.org.in/" },
  secNigeria: { label: "Nigeria SEC", url: "https://sec.gov.ng/" },
  spk: { label: "Türkiye SPK", url: "https://www.cmb.gov.tr/" },
  pboc: { label: "People's Bank of China", url: "http://www.pbc.gov.cn/en/3688006/index.html" },
  hmt: { label: "UK HM Treasury", url: "https://www.gov.uk/government/organisations/hm-treasury" },
  eba: { label: "European Banking Authority", url: "https://www.eba.europa.eu/regulation-and-policy/markets-crypto-assets" },
} satisfies Record<string, SourceLink>;

// Dated 2025–2026 developments. Curated from official sources; refreshed to the
// most recent milestones (the ingestion script replaces these with live GDELT +
// classification output when it runs).
export const POLICY_NEWS: Record<string, NewsItem[]> = {
  "840": [
    { date: "2025-07", headline: "GENIUS Act signed into law, establishing a federal framework for payment stablecoins", topic: "stablecoin", direction: "enabling", source: S.congress },
    { date: "2025", headline: "SEC rescinds SAB 121 and stands up a Crypto Task Force to develop clearer rules", topic: "market-structure", direction: "enabling", source: S.sec },
    { date: "2025", headline: "CLARITY market-structure bill advances in Congress", topic: "market-structure", direction: "enabling", source: S.congress },
  ],
  "276": [
    { date: "2025", headline: "ESMA/EBA finalise MiCA technical standards; BaFin authorises CASPs", topic: "market-structure", direction: "enabling", source: S.esma },
    { date: "2025", headline: "EBA supervises asset-referenced & e-money token issuers under MiCA", topic: "stablecoin", direction: "enabling", source: S.eba },
  ],
  "250": [{ date: "2025", headline: "AMF authorising crypto-asset service providers as MiCA transitional period winds down", topic: "market-structure", direction: "enabling", source: S.esma }],
  "826": [
    { date: "2025-04", headline: "HM Treasury publishes draft legislation bringing cryptoassets into the regulatory perimeter", topic: "market-structure", direction: "enabling", source: S.hmt },
    { date: "2026", headline: "FCA consulting on the cryptoasset regime; firm authorisations expected", topic: "market-structure", direction: "enabling", source: S.fca },
  ],
  "392": [{ date: "2025", headline: "FSA proposes regulating crypto under the Financial Instruments and Exchange Act and cutting crypto tax", topic: "market-structure", direction: "enabling", source: S.jfsa }],
  "784": [{ date: "2025", headline: "VARA updates virtual-asset rulebooks; licensed activity expands in Dubai", topic: "market-structure", direction: "enabling", source: S.vara }],
  "410": [{ date: "2025", headline: "Regulators advance second-phase digital-asset legislation and a won-stablecoin framework", topic: "stablecoin", direction: "enabling", source: S.fscKorea }],
  "076": [{ date: "2025", headline: "Banco Central consults on VASP licensing and stablecoin / FX rules", topic: "market-structure", direction: "neutral", source: S.bcb }],
  "356": [{ date: "2025", headline: "Government maintains crypto taxation; policy discussion paper still awaited", topic: "general", direction: "neutral", source: S.rbi }],
  "566": [{ date: "2025", headline: "Investments and Securities Act recognises digital assets as securities; SEC licensing underway", topic: "market-structure", direction: "enabling", source: S.secNigeria }],
  "792": [{ date: "2025", headline: "Capital Markets Board issues secondary regulations licensing crypto-asset platforms", topic: "market-structure", direction: "neutral", source: S.spk }],
  "156": [{ date: "2025", headline: "Mainland maintains its crypto ban while monitoring Hong Kong's new stablecoin regime", topic: "general", direction: "restrictive", source: S.pboc }],
};
