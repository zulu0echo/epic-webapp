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
} satisfies Record<string, SourceLink>;

export const POLICY_NEWS: Record<string, NewsItem[]> = {
  "840": [
    { date: "2025", headline: "GENIUS Act establishes a federal framework for payment stablecoins", topic: "stablecoin", direction: "enabling", source: S.congress },
    { date: "2024", headline: "Spot crypto exchange-traded products approved and begin trading", topic: "market-structure", direction: "enabling", source: S.sec },
  ],
  "276": [{ date: "2024-12", headline: "MiCA fully applicable; CASP authorisation regime live across the EU", topic: "market-structure", direction: "enabling", source: S.esma }],
  "250": [{ date: "2024-12", headline: "MiCA fully applicable; AMF authorising crypto-asset service providers", topic: "market-structure", direction: "enabling", source: S.esma }],
  "826": [{ date: "2026", headline: "FCA cryptoasset authorisation regime being introduced", topic: "market-structure", direction: "enabling", source: S.fca }],
  "392": [{ date: "2023", headline: "Amended Payment Services Act creates a stablecoin regime", topic: "stablecoin", direction: "enabling", source: S.jfsa }],
  "784": [{ date: "2023", headline: "VARA full market regulations issued; licensed VASP activity underway", topic: "market-structure", direction: "enabling", source: S.vara }],
  "410": [{ date: "2024", headline: "Virtual Asset User Protection Act takes effect", topic: "market-structure", direction: "enabling", source: S.fscKorea }],
  "076": [{ date: "2024", headline: "Central bank running consultations to implement the crypto-assets law", topic: "market-structure", direction: "neutral", source: S.bcb }],
  "356": [{ date: "2023", headline: "Crypto brought under anti-money-laundering (PMLA) reporting", topic: "general", direction: "restrictive", source: S.rbi }],
  "566": [{ date: "2022", headline: "SEC issues rules on issuance and custody of digital assets", topic: "market-structure", direction: "enabling", source: S.secNigeria }],
  "792": [{ date: "2024", headline: "Capital-markets law amended to license crypto-asset service providers", topic: "market-structure", direction: "neutral", source: S.spk }],
  "156": [{ date: "2021", headline: "Authorities reaffirm comprehensive ban on crypto trading and mining", topic: "general", direction: "restrictive", source: S.pboc }],
};
