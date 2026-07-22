import type { CountryDatum, Development, MapLayer, SourceLink, SubScore } from "./types";

// ---------------------------------------------------------------------------
// SNAPSHOT DATA
//
// Illustrative snapshots compiled from the public sources linked on each layer
// and, for the regulatory layer, from the official government / regulator pages
// linked per country. Used so the map renders without a live network dependency;
// the shapes match the live-ingestion target in
// docs/institutional-data-map/README.md so the swap is a data-source change.
//
// Every value links back to a source (the §0 provenance principle). Numeric keys
// are ISO 3166-1 codes matching the world-atlas topojson.
// ---------------------------------------------------------------------------

const toRecord = (rows: CountryDatum[]): Record<string, CountryDatum> =>
  rows.reduce<Record<string, CountryDatum>>((acc, r) => {
    acc[r.id] = r;
    return acc;
  }, {});

// Aggregator / tracker sources ---------------------------------------------
const SRC = {
  rated: { label: "Rated Network — validator geo-distribution", url: "https://explorer.rated.network/network?network=mainnet" },
  ethernodes: { label: "ethernodes.org — node country distribution", url: "https://ethernodes.org/countries" },
  clientDiversity: { label: "clientdiversity.org", url: "https://clientdiversity.org/" },
  migalabs: { label: "MigaLabs / monitoreth.io", url: "https://migalabs.io/" },
  wbInflation: { label: "World Bank — inflation, consumer prices (FP.CPI.TOTL.ZG)", url: "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG" },
  wbRemittances: { label: "World Bank — personal remittances, % of GDP (BX.TRF.PWKR.DT.GD.ZS)", url: "https://data.worldbank.org/indicator/BX.TRF.PWKR.DT.GD.ZS" },
  defillama: { label: "DefiLlama — stablecoin circulating supply", url: "https://defillama.com/stablecoins" },
  stride: { label: "STRIDE — Global Stablecoin Regulation Tracker", url: "https://tracker.stride.sc/" },
  atlantic: { label: "Atlantic Council — Cryptocurrency Regulation Tracker", url: "https://www.atlanticcouncil.org/programs/geoeconomics-center/cryptoregulationtracker/" },
  mica: { label: "Latham & Watkins — MiCA Regulation Tracker", url: "https://www.lw.com/en/markets-in-crypto-assets-regulation-tracker" },
  rwaxyz: { label: "RWA.xyz — tokenized real-world assets", url: "https://app.rwa.xyz/" },
  defillamaRwa: { label: "DefiLlama — RWA category TVL", url: "https://defillama.com/protocols/RWA" },
  atlanticCbdc: { label: "Atlantic Council — Central Bank Digital Currency Tracker", url: "https://www.atlanticcouncil.org/cbdctracker/" },
} satisfies Record<string, SourceLink>;

// Official government / regulator / primary sources ------------------------
const OFF = {
  esmaMica: { label: "ESMA — Markets in Crypto-Assets (MiCA)", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" },
  eurlexMica: { label: "EUR-Lex — Regulation (EU) 2023/1114 (MiCA), full text", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114" },
  eba: { label: "European Banking Authority — MiCA (stablecoins/ART-EMT)", url: "https://www.eba.europa.eu/regulation-and-policy/markets-crypto-assets" },
  bafin: { label: "BaFin — crypto supervision (Germany)", url: "https://www.bafin.de/EN/" },
  amf: { label: "AMF — digital assets (France)", url: "https://www.amf-france.org/en" },
  afm: { label: "AFM — crypto (Netherlands)", url: "https://www.afm.nl/en" },
  cbi: { label: "Central Bank of Ireland — VASPs/MiCA", url: "https://www.centralbank.ie/regulation/markets-update" },
  consob: { label: "CONSOB — crypto-assets (Italy)", url: "https://www.consob.it/web/consob-and-its-activities/crypto-assets" },
  cnmv: { label: "CNMV — crypto (Spain)", url: "https://www.cnmv.es/portal/home.aspx" },
  secUS: { label: "U.S. SEC — Crypto Assets", url: "https://www.sec.gov/securities-topics/crypto-assets" },
  cftc: { label: "U.S. CFTC — Digital Assets", url: "https://www.cftc.gov/digitalassets/index.htm" },
  usTreasury: { label: "U.S. Department of the Treasury", url: "https://home.treasury.gov/" },
  genius: { label: "U.S. Congress — GENIUS Act (record)", url: "https://www.congress.gov/search?q=GENIUS%20Act" },
  fca: { label: "UK FCA — Cryptoassets", url: "https://www.fca.org.uk/firms/cryptoassets" },
  hmt: { label: "UK HM Treasury", url: "https://www.gov.uk/government/organisations/hm-treasury" },
  finma: { label: "FINMA — Switzerland", url: "https://www.finma.ch/en/" },
  jfsa: { label: "Japan Financial Services Agency (FSA)", url: "https://www.fsa.go.jp/en/" },
  vara: { label: "Dubai Virtual Assets Regulatory Authority (VARA)", url: "https://www.vara.ae/" },
  adgm: { label: "Abu Dhabi Global Market (ADGM)", url: "https://www.adgm.com/" },
  csaCanada: { label: "Canadian Securities Administrators (CSA)", url: "https://www.securities-administrators.ca/" },
  asic: { label: "Australia ASIC — crypto-assets", url: "https://asic.gov.au/" },
  auTreasury: { label: "Australian Treasury — digital assets", url: "https://treasury.gov.au/" },
  fscKorea: { label: "Korea Financial Services Commission (FSC)", url: "https://www.fsc.go.kr/eng/" },
  bcb: { label: "Banco Central do Brasil — crypto framework", url: "https://www.bcb.gov.br/en" },
  rbi: { label: "Reserve Bank of India", url: "https://www.rbi.org.in/" },
  sebi: { label: "Securities and Exchange Board of India (SEBI)", url: "https://www.sebi.gov.in/" },
  secNigeria: { label: "Nigeria SEC — digital assets rules", url: "https://sec.gov.ng/" },
  spkTurkey: { label: "Türkiye Capital Markets Board (SPK)", url: "https://www.cmb.gov.tr/" },
  bappebti: { label: "Indonesia — Bappebti (crypto commodity regulator)", url: "https://bappebti.go.id/" },
  cbr: { label: "Bank of Russia — digital assets", url: "https://www.cbr.ru/eng/" },
  pboc: { label: "People's Bank of China", url: "http://www.pbc.gov.cn/en/3688006/index.html" },
} satisfies Record<string, SourceLink>;

// ---------------------------------------------------------------------------
// Layer 1 — Validator / node decentralization
// ---------------------------------------------------------------------------
const val = (id: string, name: string, value: number, note?: string, metrics?: CountryDatum["metrics"]): CountryDatum => ({
  id, name, value, note, source: SRC.ethernodes, metrics,
});

const validatorRows: CountryDatum[] = [
  val("840", "United States", 45.0, "Largest share of hosted nodes; heavy reliance on US-based cloud (AWS, Hetzner, OVH).", [
    { label: "Share of nodes", value: "~45%", source: SRC.ethernodes },
    { label: "Dominant hosting", value: "AWS · Hetzner · OVH", source: SRC.rated },
    { label: "Client diversity", value: "Geth still >⅓ execution share", source: SRC.clientDiversity },
  ]),
  val("276", "Germany", 12.5, "Second-largest hub; significant AWS Frankfurt and Hetzner capacity.", [
    { label: "Share of nodes", value: "~12.5%", source: SRC.ethernodes },
    { label: "Dominant hosting", value: "Hetzner · AWS eu-central", source: SRC.rated },
  ]),
  val("246", "Finland", 4.2),
  val("826", "United Kingdom", 4.0),
  val("250", "France", 3.6),
  val("528", "Netherlands", 3.2),
  val("124", "Canada", 2.8),
  val("372", "Ireland", 2.4, "Elevated by AWS eu-west-1 (Dublin) region hosting."),
  val("036", "Australia", 2.1),
  val("392", "Japan", 1.8),
  val("756", "Switzerland", 1.6),
  val("410", "South Korea", 1.5),
  val("643", "Russia", 1.4),
  val("752", "Sweden", 1.2),
  val("616", "Poland", 1.1),
  val("156", "China", 1.0),
  val("076", "Brazil", 0.9),
  val("356", "India", 0.9),
  val("380", "Italy", 0.8),
  val("724", "Spain", 0.8),
  val("040", "Austria", 0.6),
  val("578", "Norway", 0.5),
  val("203", "Czechia", 0.5),
  val("704", "Vietnam", 0.4),
  val("710", "South Africa", 0.3),
  val("554", "New Zealand", 0.3),
];

// ---------------------------------------------------------------------------
// Layer 2 — Stablecoin dollar-access demand (MODELED)
// ---------------------------------------------------------------------------
const sc = (id: string, name: string, index: number, inflation: string, remittances: string, note?: string): CountryDatum => ({
  id, name, value: index, note, source: SRC.wbInflation,
  metrics: [
    { label: "Inflation (annual %)", value: inflation, source: SRC.wbInflation },
    { label: "Remittances (% of GDP)", value: remittances, source: SRC.wbRemittances },
    { label: "Modeled access-demand index", value: `${index} / 100 (modeled)`, source: SRC.defillama },
  ],
});

const stablecoinRows: CountryDatum[] = [
  sc("862", "Venezuela", 98, "~190%", "n/a", "Hyperinflation history; dollar substitution already widespread."),
  sc("422", "Lebanon", 96, "~70%", "~28%", "Banking-sector collapse drives cash-dollar and stablecoin demand."),
  sc("032", "Argentina", 95, "~135%", "~0.2%", "Persistent high inflation and capital controls."),
  sc("716", "Zimbabwe", 92, "~60%", "~8%", "Repeated currency instability."),
  sc("566", "Nigeria", 90, "~28%", "~6%", "Large remittance market and naira depreciation."),
  sc("792", "Turkey", 88, "~45%", "~0.3%", "Lira depreciation and high inflation."),
  sc("818", "Egypt", 84, "~30%", "~5%", "Currency devaluation; sizable remittance inflows."),
  sc("804", "Ukraine", 82, "~13%", "~9%", "Wartime currency pressure and diaspora remittances."),
  sc("586", "Pakistan", 80, "~24%", "~8%", "High inflation and remittance reliance."),
  sc("288", "Ghana", 78, "~23%", "~6%", "Cedi depreciation."),
  sc("231", "Ethiopia", 74, "~28%", "~4%", "High inflation; growing diaspora transfers."),
  sc("608", "Philippines", 72, "~4%", "~9%", "One of the world's largest remittance markets."),
  sc("404", "Kenya", 70, "~7%", "~4%", "Established mobile-money and remittance corridors."),
  sc("050", "Bangladesh", 66, "~9%", "~5%", "Major remittance recipient."),
  sc("484", "Mexico", 58, "~5%", "~4%", "Largest remittance corridor globally (US→MX)."),
  sc("356", "India", 55, "~5%", "~3%", "Largest absolute remittance inflows."),
  sc("170", "Colombia", 52, "~7%", "~3%", ""),
  sc("704", "Vietnam", 50, "~4%", "~5%", ""),
  sc("076", "Brazil", 45, "~4%", "~0.3%", ""),
  sc("710", "South Africa", 40, "~5%", "~0.3%", ""),
  sc("826", "United Kingdom", 10, "~3%", "~0.1%", "Reference economy — low latent access demand."),
  sc("840", "United States", 8, "~3%", "~0.1%", "Reference economy."),
  sc("276", "Germany", 6, "~3%", "~0.2%", "Reference economy."),
  sc("392", "Japan", 5, "~2%", "~0.1%", "Reference economy."),
];

// ---------------------------------------------------------------------------
// Layer 3 — Regulatory status (PHASE) — enriched with official sources,
// sub-scores, dated developments, framework + effective date, and trend.
// ---------------------------------------------------------------------------
const REG_PHASES = ["Prohibitive", "Restricted", "Framework advancing", "Comprehensive framework"];
const subs = (stable: number, custody: number, tax: number, market: number): SubScore[] => [
  { label: "Stablecoins", value: stable, max: 3 },
  { label: "Custody / licensing", value: custody, max: 3 },
  { label: "Taxation clarity", value: tax, max: 3 },
  { label: "Market structure", value: market, max: 3 },
];

const MICA_DEV: Development[] = [
  { date: "2024-06-30", text: "MiCA stablecoin rules (asset-referenced & e-money tokens) began to apply.", source: OFF.eba },
  { date: "2024-12-30", text: "MiCA fully applicable; CASP authorisation regime in force across the EU.", source: OFF.esmaMica },
];

const euRow = (id: string, name: string, national: SourceLink): CountryDatum => ({
  id, name, value: 3, phase: 3, source: SRC.mica,
  note: `${name} applies the EU-wide MiCA regime; ${national.label.split(" —")[0]} is the national competent authority.`,
  framework: "EU MiCA — Regulation (EU) 2023/1114",
  effectiveDate: "Fully applicable 30 Dec 2024",
  trend: "▲ Comprehensive since MiCA (2024)",
  subScores: subs(3, 3, 2, 3),
  developments: MICA_DEV,
  // Dedupe: some members have no distinct national page here, so `national`
  // may equal esmaMica — avoid a duplicate source (and duplicate React key).
  officialSources: [OFF.esmaMica, OFF.eurlexMica, national].filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i,
  ),
});

const regulatoryRows: CountryDatum[] = [
  // EU / MiCA
  euRow("276", "Germany", OFF.bafin),
  euRow("250", "France", OFF.amf),
  euRow("528", "Netherlands", OFF.afm),
  euRow("372", "Ireland", OFF.cbi),
  euRow("380", "Italy", OFF.consob),
  euRow("724", "Spain", OFF.cnmv),
  euRow("040", "Austria", OFF.esmaMica),
  euRow("616", "Poland", OFF.esmaMica),
  euRow("752", "Sweden", OFF.esmaMica),
  euRow("246", "Finland", OFF.esmaMica),
  euRow("620", "Portugal", OFF.esmaMica),
  euRow("056", "Belgium", OFF.esmaMica),
  euRow("208", "Denmark", OFF.esmaMica),
  euRow("203", "Czechia", OFF.esmaMica),
  euRow("300", "Greece", OFF.esmaMica),
  // Non-EU comprehensive
  {
    id: "756", name: "Switzerland", value: 3, phase: 3, source: SRC.atlantic,
    note: "Mature DLT framework; FINMA licenses and token/stablecoin guidance.",
    framework: "DLT Act + FINMA guidelines", effectiveDate: "2021", trend: "▲ Comprehensive (established)",
    subScores: subs(2, 3, 3, 3), officialSources: [OFF.finma],
    developments: [{ date: "2021", text: "DLT Act provisions entered into force, enabling tokenised securities and DLT trading venues.", source: OFF.finma }],
  },
  {
    id: "392", name: "Japan", value: 3, phase: 3, source: SRC.atlantic,
    note: "Licensed exchanges under the FSA; stablecoin issuance framework in force.",
    framework: "Payment Services Act (amended)", effectiveDate: "2023", trend: "▲ Comprehensive (2023)",
    subScores: subs(3, 3, 2, 3), officialSources: [OFF.jfsa],
    developments: [{ date: "2023", text: "Amended Payment Services Act took effect, establishing a stablecoin regime.", source: OFF.jfsa }],
  },
  {
    id: "784", name: "United Arab Emirates", value: 3, phase: 3, source: SRC.atlantic,
    note: "Operational frameworks via VARA (Dubai) and ADGM (Abu Dhabi).",
    framework: "VARA + ADGM regimes", effectiveDate: "2023", trend: "▲ Comprehensive (2023)",
    subScores: subs(3, 3, 3, 3), officialSources: [OFF.vara, OFF.adgm],
    developments: [{ date: "2023", text: "VARA full market regulations issued; licensed VASP activity underway.", source: OFF.vara }],
  },
  // Framework advancing
  {
    id: "840", name: "United States", value: 2, phase: 2, source: SRC.atlantic,
    note: "Federal stablecoin law plus an evolving SEC/CFTC market-structure approach; spot ETPs trading.",
    framework: "GENIUS Act (stablecoins) + agency rules", effectiveDate: "2025 (stablecoins)", trend: "▲ Advanced with GENIUS Act (2025)",
    subScores: subs(3, 2, 2, 2),
    officialSources: [OFF.secUS, OFF.cftc, OFF.usTreasury, OFF.genius],
    developments: [
      { date: "2025", text: "GENIUS Act established a federal framework for payment stablecoins.", source: OFF.genius },
      { date: "2024", text: "Spot crypto exchange-traded products approved and trading.", source: OFF.secUS },
    ],
  },
  {
    id: "826", name: "United Kingdom", value: 2, phase: 2, source: SRC.atlantic,
    note: "FCA cryptoasset regime being introduced; authorisation window expected 2026–2027.",
    framework: "FSMA-based cryptoasset regime (in progress)", effectiveDate: "2026–2027 (expected)", trend: "▲ Advancing",
    subScores: subs(2, 2, 2, 2), officialSources: [OFF.fca, OFF.hmt],
    developments: [{ date: "2026–2027", text: "FCA developing the cryptoasset authorisation regime; applications expected to open.", source: OFF.fca }],
  },
  {
    id: "124", name: "Canada", value: 2, phase: 2, source: SRC.atlantic,
    note: "Securities-law registration for crypto trading platforms via the CSA.",
    framework: "CSA registration regime", effectiveDate: "2023", trend: "▲ Advancing",
    subScores: subs(2, 2, 2, 2), officialSources: [OFF.csaCanada],
    developments: [{ date: "2023", text: "CSA tightened pre-registration undertakings for crypto trading platforms.", source: OFF.csaCanada }],
  },
  {
    id: "036", name: "Australia", value: 2, phase: 2, source: SRC.atlantic,
    note: "Licensing framework for digital-asset platforms under development.",
    framework: "Digital asset platform reforms (in progress)", effectiveDate: "in progress", trend: "▲ Advancing",
    subScores: subs(2, 2, 2, 1), officialSources: [OFF.asic, OFF.auTreasury],
    developments: [{ date: "2024–2025", text: "Treasury and ASIC progressing a licensing framework for digital-asset platforms.", source: OFF.auTreasury }],
  },
  {
    id: "410", name: "South Korea", value: 2, phase: 2, source: SRC.atlantic,
    note: "User-protection law in force; further market rules advancing.",
    framework: "Virtual Asset User Protection Act", effectiveDate: "2024", trend: "▲ Advancing (2024)",
    subScores: subs(1, 2, 2, 2), officialSources: [OFF.fscKorea],
    developments: [{ date: "2024", text: "Virtual Asset User Protection Act took effect.", source: OFF.fscKorea }],
  },
  {
    id: "076", name: "Brazil", value: 2, phase: 2, source: SRC.atlantic,
    note: "Central Bank implementing the crypto-assets legal framework.",
    framework: "Law 14.478 (crypto-assets)", effectiveDate: "2023", trend: "▲ Advancing",
    subScores: subs(2, 2, 2, 2), officialSources: [OFF.bcb],
    developments: [{ date: "2023–2025", text: "Banco Central do Brasil running consultations to implement the crypto-assets law.", source: OFF.bcb }],
  },
  // Restricted
  {
    id: "356", name: "India", value: 1, phase: 1, source: SRC.atlantic,
    note: "Permitted and taxed, but no comprehensive framework; RBI cautious, PMLA obligations apply.",
    framework: "Taxation + PMLA obligations (no comprehensive law)", effectiveDate: "2022–2023", trend: "→ Stable",
    subScores: subs(0, 1, 2, 1), officialSources: [OFF.rbi, OFF.sebi],
    developments: [{ date: "2023", text: "Crypto brought under anti-money-laundering (PMLA) reporting obligations.", source: OFF.rbi }],
  },
  {
    id: "566", name: "Nigeria", value: 1, phase: 1, source: SRC.atlantic,
    note: "SEC digital-asset rules coexist with earlier banking-sector caution.",
    framework: "SEC rules on digital assets", effectiveDate: "2022", trend: "▲ Opening",
    subScores: subs(1, 1, 1, 1), officialSources: [OFF.secNigeria],
    developments: [{ date: "2022", text: "SEC issued rules on the issuance and custody of digital assets.", source: OFF.secNigeria }],
  },
  {
    id: "360", name: "Indonesia", value: 1, phase: 1, source: SRC.atlantic,
    note: "Trading permitted under the commodity regulator; oversight transitioning.",
    framework: "Bappebti commodity framework", effectiveDate: "2019", trend: "→ Transitioning",
    subScores: subs(1, 1, 1, 1), officialSources: [OFF.bappebti],
  },
  {
    id: "792", name: "Turkey", value: 1, phase: 1, source: SRC.atlantic,
    note: "Payments use banned; registration and licensing rules for exchanges.",
    framework: "Capital-markets crypto amendments", effectiveDate: "2024", trend: "→ Restricted",
    subScores: subs(0, 1, 1, 1), officialSources: [OFF.spkTurkey],
    developments: [{ date: "2024", text: "Capital-markets law amended to license and supervise crypto-asset service providers.", source: OFF.spkTurkey }],
  },
  {
    id: "643", name: "Russia", value: 1, phase: 1, source: SRC.atlantic,
    note: "Permitted for cross-border settlement; domestic payment use restricted.",
    framework: "Digital financial assets law", effectiveDate: "2021", trend: "→ Restricted",
    subScores: subs(0, 1, 1, 1), officialSources: [OFF.cbr],
  },
  // Prohibitive
  {
    id: "156", name: "China", value: 0, phase: 0, source: SRC.atlantic,
    note: "Comprehensive ban on crypto trading and mining.",
    framework: "Multi-agency prohibition", effectiveDate: "2021", trend: "▼ Prohibitive (2021)",
    subScores: subs(0, 0, 0, 0), officialSources: [OFF.pboc],
    developments: [{ date: "2021", text: "Authorities reaffirmed a comprehensive ban on crypto trading and mining.", source: OFF.pboc }],
  },
];

// ---------------------------------------------------------------------------
// Layer 4 — Institutional operating readiness (MODELED, composite)
// 70% regulatory clarity + 30% local infrastructure availability.
// ---------------------------------------------------------------------------
function buildReadiness(reg: Record<string, CountryDatum>, validator: Record<string, CountryDatum>): CountryDatum[] {
  return Object.values(reg).map((r) => {
    const regClarity = Math.round(((r.phase ?? 0) / 3) * 100);
    const v = validator[r.id]?.value;
    const infra = v != null ? Math.min(100, Math.round(v * 6)) : 25;
    const index = Math.round(regClarity * 0.7 + infra * 0.3);
    return {
      id: r.id,
      name: r.name,
      value: index,
      note: "Modeled composite: 70% regulatory clarity + 30% local infrastructure availability.",
      source: SRC.atlantic,
      metrics: [
        { label: "Regulatory clarity", value: `${regClarity} / 100`, source: r.officialSources?.[0] ?? r.source },
        { label: "Local infrastructure", value: v != null ? `${v}% of nodes` : "limited data", source: SRC.ethernodes },
        { label: "Readiness (modeled)", value: `${index} / 100 (modeled)` },
      ],
    } satisfies CountryDatum;
  });
}

// ---------------------------------------------------------------------------
// Layer 5 — Tokenized real-world assets (RWA) by issuer domicile
// ---------------------------------------------------------------------------
const rwa = (id: string, name: string, bn: number, note?: string): CountryDatum => ({
  id, name, value: bn, note, source: SRC.rwaxyz,
  metrics: [{ label: "Tokenized value", value: `$${bn.toFixed(1)}B`, source: SRC.rwaxyz }],
});
const rwaRows: CountryDatum[] = [
  rwa("840", "United States", 8.5, "Largest issuer base — tokenized Treasuries and money-market funds (e.g. large asset-manager products)."),
  rwa("442", "Luxembourg", 1.2, "Fund-domicile hub for tokenized securities."),
  rwa("372", "Ireland", 0.9, "Fund-domicile hub."),
  rwa("756", "Switzerland", 0.7, "DLT Act enables tokenized securities issuance."),
  rwa("826", "United Kingdom", 0.5),
  rwa("276", "Germany", 0.3, "Electronic Securities Act (eWpG) supports tokenized bonds."),
  rwa("250", "France", 0.25),
  rwa("392", "Japan", 0.2),
  rwa("784", "United Arab Emirates", 0.15),
  rwa("076", "Brazil", 0.1),
];

// ---------------------------------------------------------------------------
// Layer 6 — CBDC status (retail central bank digital currency)
// ---------------------------------------------------------------------------
const CBDC_PHASES = ["Inactive", "Research", "Pilot", "Launched"];
const cbdc = (id: string, name: string, phase: number, note: string): CountryDatum => ({
  id, name, value: phase, phase, note, source: SRC.atlanticCbdc,
});
const cbdcRows: CountryDatum[] = [
  cbdc("566", "Nigeria", 3, "eNaira launched (retail CBDC in circulation)."),
  cbdc("388", "Jamaica", 3, "JAM-DEX launched."),
  cbdc("044", "Bahamas", 3, "Sand Dollar launched."),
  cbdc("156", "China", 2, "e-CNY in large-scale pilot across many cities."),
  cbdc("356", "India", 2, "Digital Rupee (e₹) retail pilot underway."),
  cbdc("643", "Russia", 2, "Digital ruble pilot underway."),
  cbdc("076", "Brazil", 2, "Drex pilot underway."),
  cbdc("410", "South Korea", 2, "Retail CBDC pilot programme."),
  cbdc("276", "Germany", 2, "Euro area — digital euro preparation phase."),
  cbdc("250", "France", 2, "Euro area — digital euro preparation phase."),
  cbdc("380", "Italy", 2, "Euro area — digital euro preparation phase."),
  cbdc("724", "Spain", 2, "Euro area — digital euro preparation phase."),
  cbdc("528", "Netherlands", 2, "Euro area — digital euro preparation phase."),
  cbdc("826", "United Kingdom", 1, "'Digital pound' in design/research phase."),
  cbdc("840", "United States", 1, "Research only; no decision to issue a retail CBDC."),
  cbdc("392", "Japan", 1, "Pilot/research programme."),
  cbdc("124", "Canada", 1, "Contingency research; no launch decision."),
  cbdc("036", "Australia", 1, "Wholesale/retail research projects."),
];

const validatorData = toRecord(validatorRows);
const regulatoryData = toRecord(regulatoryRows);
const readinessData = toRecord(buildReadiness(regulatoryData, validatorData));

// ---------------------------------------------------------------------------
export const LAYERS: MapLayer[] = [
  {
    id: "validator-decentralization",
    label: "Validator & node decentralization",
    shortLabel: "Decentralization",
    eyebrow: "Network resilience",
    description:
      "Share of Ethereum nodes hosted in each country. Concentration in a few jurisdictions and cloud providers is a resilience and censorship-risk concern for staking and custody products.",
    audience: "Risk, custody & staking-product teams",
    unit: "% of nodes",
    kind: "sequential",
    isModeled: false,
    classification: "measured",
    methodology:
      "Share of reachable Ethereum nodes whose IP geolocates to each country, aggregated across Rated Network, ethernodes.org and MigaLabs. Counts nodes, not stake. Limitations: IP geolocation attributes cloud-hosted nodes to the datacenter's country (e.g. AWS Dublin inflates Ireland), and VPNs/relays can mask true origin. Live target cadence: hourly.",
    cadence: "hourly (target)",
    asOf: "2026-07 snapshot",
    higherMeans: "Higher = more hosted nodes concentrated in this country",
    legend: [
      { color: "#dde2f6", label: "< 0.5%", lo: 0, hi: 0.5 },
      { color: "#ccd3f4", label: "0.5–1%", lo: 0.5, hi: 1 },
      { color: "#aab2e6", label: "1–3%", lo: 1, hi: 3 },
      { color: "#8590d9", label: "3–8%", lo: 3, hi: 8 },
      { color: "#4a55b0", label: "8–20%", lo: 8, hi: 20 },
      { color: "#101349", label: "> 20%", lo: 20, hi: Infinity },
    ],
    sources: [SRC.rated, SRC.ethernodes, SRC.clientDiversity, SRC.migalabs],
    data: validatorData,
  },
  {
    id: "stablecoin-access",
    label: "Stablecoin dollar-access demand",
    shortLabel: "Stablecoin access",
    eyebrow: "Payments & inclusion · modeled",
    description:
      "Modeled index of latent demand for stablecoin dollar access, combining consumer-price inflation and remittance reliance. A proxy for where stablecoins on Ethereum meet real economic need.",
    audience: "Payments, FX & financial-inclusion teams",
    unit: "index (modeled)",
    kind: "sequential",
    isModeled: true,
    classification: "modeled",
    methodology:
      "A 0–100 proxy for latent dollar-access demand — not a measurement of on-chain flows. Inputs: consumer-price inflation and personal remittances as a share of GDP (World Bank), normalized to 0–100 and combined, then contextualized against live aggregate stablecoin supply (DefiLlama). Higher inflation and remittance reliance raise the index. Country-level *measured* stablecoin flows require licensed data (Chainalysis / Allium / Artemis Pro) and are out of scope for the free snapshot.",
    cadence: "inputs annual (World Bank); supply hourly (DefiLlama)",
    asOf: "2026-07 snapshot",
    higherMeans: "Higher = stronger modeled case for stablecoin dollar access",
    legend: [
      { color: "#dde2f6", label: "0–20", lo: 0, hi: 20 },
      { color: "#ccd3f4", label: "20–40", lo: 20, hi: 40 },
      { color: "#8590d9", label: "40–60", lo: 40, hi: 60 },
      { color: "#3f4aa0", label: "60–80", lo: 60, hi: 80 },
      { color: "#101349", label: "80–100", lo: 80, hi: Infinity },
    ],
    sources: [SRC.wbInflation, SRC.wbRemittances, SRC.defillama],
    data: toRecord(stablecoinRows),
  },
  {
    id: "regulatory-status",
    label: "Regulatory status",
    shortLabel: "Regulation",
    eyebrow: "Policy & compliance",
    description:
      "Regulatory posture toward digital assets and stablecoins, as an ordinal phase from prohibitive to a comprehensive framework — with official sources, sub-domain scores, and dated developments per jurisdiction.",
    audience: "Legal, compliance & market-entry teams",
    unit: "phase",
    kind: "phase",
    isModeled: false,
    classification: "assessed",
    methodology:
      "An editorial classification, not a computed metric. Each jurisdiction is placed on a 0–3 phase (Prohibitive → Restricted → Framework advancing → Comprehensive framework) based on primary legislation and the official regulator pages linked per country, cross-checked against the STRIDE, Atlantic Council and MiCA trackers. Four sub-domains — stablecoins, custody/licensing, taxation clarity, market structure — are each scored 0–3. Every entry is dated and links to its statute and regulator; postures change, so the as-of date is authoritative.",
    cadence: "reviewed monthly",
    asOf: "2026-07 snapshot",
    higherMeans: "Deeper = clearer, more comprehensive regulatory framework",
    legend: REG_PHASES.map((label, i) => ({
      color: ["#dde2f6", "#aab2e6", "#5b68c7", "#101349"][i],
      label: `${i} · ${label}`,
    })),
    sources: [SRC.stride, SRC.atlantic, SRC.mica],
    data: regulatoryData,
  },
  {
    id: "institutional-readiness",
    label: "Institutional operating readiness",
    shortLabel: "Readiness",
    eyebrow: "Composite · modeled",
    description:
      "A composite of regulatory clarity (70%) and local infrastructure availability (30%) — a single view of where institutions can most readily operate. Modeled from the regulation and decentralization layers.",
    audience: "Strategy & market-entry teams",
    unit: "readiness index (modeled)",
    kind: "sequential",
    isModeled: true,
    classification: "modeled",
    methodology:
      "A composite score: readiness = 0.70 × regulatory clarity + 0.30 × local infrastructure. Regulatory clarity = (regulatory phase ÷ 3) × 100. Local infrastructure = min(100, node-share % × 6); jurisdictions with regulatory data but no node data are floored at 25. Computed only for jurisdictions present in the regulatory layer. Weights are a deliberate editorial choice (regulation dominates institutional operability) and can be tuned.",
    cadence: "derived from source layers",
    asOf: "2026-07 snapshot",
    higherMeans: "Higher = clearer rules and more local infrastructure",
    legend: [
      { color: "#dde2f6", label: "0–20", lo: 0, hi: 20 },
      { color: "#ccd3f4", label: "20–40", lo: 20, hi: 40 },
      { color: "#8590d9", label: "40–60", lo: 40, hi: 60 },
      { color: "#3f4aa0", label: "60–80", lo: 60, hi: 80 },
      { color: "#101349", label: "80–100", lo: 80, hi: Infinity },
    ],
    sources: [SRC.atlantic, SRC.mica, SRC.ethernodes],
    data: readinessData,
  },
  {
    id: "rwa-tokenization",
    label: "Tokenized real-world assets (RWA)",
    shortLabel: "RWA",
    eyebrow: "Asset management",
    description:
      "Value of tokenized real-world assets (Treasuries, funds, bonds) by issuer domicile. The clearest signal of institutional on-chain issuance on Ethereum.",
    audience: "Asset managers & capital-markets teams",
    unit: "$B tokenized",
    kind: "sequential",
    isModeled: false,
    classification: "measured",
    methodology:
      "Value of tokenized real-world assets attributed to the issuer's domicile, from RWA.xyz and the DefiLlama RWA category. Domicile attribution can differ from where the underlying asset or investor sits (e.g. a US manager issuing via a Luxembourg fund vehicle). Live target cadence: hourly.",
    cadence: "hourly (target)",
    asOf: "2026-07 snapshot",
    higherMeans: "Higher = more tokenized real-world-asset value issued from this country",
    legend: [
      { color: "#dde2f6", label: "< $0.25B", lo: 0, hi: 0.25 },
      { color: "#aab2e6", label: "$0.25–1B", lo: 0.25, hi: 1 },
      { color: "#5b68c7", label: "$1–5B", lo: 1, hi: 5 },
      { color: "#101349", label: "> $5B", lo: 5, hi: Infinity },
    ],
    sources: [SRC.rwaxyz, SRC.defillamaRwa],
    data: toRecord(rwaRows),
  },
  {
    id: "cbdc-status",
    label: "CBDC status",
    shortLabel: "CBDC",
    eyebrow: "Central bank digital currency",
    description:
      "Retail central bank digital currency status per country — the sovereign-money backdrop institutions weigh alongside stablecoins and tokenized assets.",
    audience: "Policy & strategy teams",
    unit: "phase",
    kind: "phase",
    isModeled: false,
    classification: "assessed",
    methodology:
      "Retail CBDC status classified 0–3 (Inactive → Research → Pilot → Launched) from the Atlantic Council CBDC Tracker and central-bank announcements. Euro-area members are shown at the shared 'digital euro' preparation stage. Reviewed periodically.",
    cadence: "reviewed monthly",
    asOf: "2026-07 snapshot",
    higherMeans: "Deeper = closer to a live retail CBDC",
    legend: CBDC_PHASES.map((label, i) => ({
      color: ["#dde2f6", "#aab2e6", "#5b68c7", "#101349"][i],
      label: `${i} · ${label}`,
    })),
    sources: [SRC.atlanticCbdc],
    data: toRecord(cbdcRows),
  },
];

export const NO_DATA_COLOR = "#f4f6fd";
export const REGULATORY_PHASE_LABELS = REG_PHASES;
export const TOTAL_COUNTRIES = 195;
