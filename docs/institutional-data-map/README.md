# Ethereum Institutional Data Map — Design & Data-Sourcing Plan

**Status:** Draft / design spec
**Owner:** EPIC team
**Last updated:** 2026-07-22

A HungerMap-style interactive world map
([hungermap.wfp.org](https://hungermap.wfp.org/food?w=ipc-phase-3&m=percentage)) that
demonstrates Ethereum-relevant data continuously and freely, framed for an institutional
audience (treasury, risk, compliance, asset management, policy).

The reference map works because it combines: a **geographic choropleth**, a **severity/phase
axis** *and* a **prevalence/percentage axis**, a **live + predictive** data pipeline (never
blank), and enough **credibility** to be used operationally. This spec adapts that model to
Ethereum data using only free, continuously-updated sources.

---

## 0. Non-negotiable principle: every data point links to its source

This is a tool for institutions. Trust comes from provenance, not polish. Therefore:

- **Every value rendered on the map or in a panel must carry a clickable link back to the
  primary source** for that specific data point (the API response, the tracker entry, the news
  article, the regulator page).
- **Every value must show a freshness/as-of timestamp** and the ingest cadence of its layer.
- **Modeled or inferred values must be labeled as modeled**, with a link to the methodology and
  to the inputs used.
- No unsourced numbers, ever. If a source can't be linked, the data point doesn't ship.

Implementation: every record in our store carries a `provenance` object
(`{ sourceName, sourceUrl, retrievedAt, cadence, license, isModeled, methodologyUrl? }`),
and the UI is responsible for surfacing `sourceUrl` on hover/click for each figure.

---

## 1. The core constraint

On-chain Ethereum data is **abundant, free, and real-time — but chain-level or address-level,
never country-level.** Addresses are pseudonymous; nothing on-chain says *where* a user is.
Since HungerMap is fundamentally a *map*, the geographic dimension is the thing we must solve —
and for stablecoin *flows* specifically, country-level data is mostly paywalled.

This splits candidate maps into feasibility tiers for "free + continuous + geographic":

| Map concept | Free + continuous + geographic? | Why |
|---|---|---|
| **Validator / node decentralization** | Fully | Node IPs geolocate directly — natively geographic, free, live |
| **Stablecoin dollar-access** | Partially | Supply/volume free & live but *chain-level*; country-level needs paid data or proxies |
| **RWA tokenization** | Partially | Values free & live; geography = issuer *domicile* (slow-changing, partly gated) |
| **Regulatory status** | Geographic by nature, but no free API | Curated trackers + live news classification |
| **Adoption index** | Not live | Chainalysis report is annual, not a free live API |

**Design consequence:** the validator/decentralization map is the only concept where
free + continuous + geographic is *fully* satisfiable today. The stablecoin map is the strongest
narrative but needs a free *proxy* model for its geographic layer. Build the former first; layer
the latter with clearly-labeled modeled data.

---

## 2. Source catalog by data layer

All sources below are free. "Key" = requires a free API key. Confirm rate limits and licenses at
integration time; record each in the `provenance.license` field.

### 2.1 On-chain fundamentals (free, no key, real-time) — the "size" data

| Source | Endpoint | Key? | Cadence | Provides |
|---|---|---|---|---|
| **DefiLlama Stablecoins** | `https://stablecoins.llama.fi/stablecoins?includePrices=true` | No | ~hourly | All stablecoins, circulating supply |
| DefiLlama Stablecoins | `https://stablecoins.llama.fi/stablecoincharts/all` | No | ~hourly | Historical aggregate supply |
| DefiLlama Stablecoins | `https://stablecoins.llama.fi/stablecoincharts/{chain}` | No | ~hourly | Per-chain (Ethereum, each L2) supply |
| **DefiLlama TVL/RWA** | `https://api.llama.fi/protocols` (filter RWA category) | No | ~hourly | Tokenized-asset TVL by protocol |
| **Etherscan** | `https://api.etherscan.io/api` | Yes (free) | real-time | Gas, tx counts, contract flows (drill-down) |

Docs: [DefiLlama API SDK](https://github.com/DefiLlama/api-sdk) ·
[DefiLlama free tier](https://eco.com/support/en/articles/14800367-defillama-free-tvl-and-defi-analytics)

### 2.2 Geographic on-chain data — the part that makes it a *map*

**Validator / node geography (the free win):**

| Source | URL | Key? | Cadence | Provides |
|---|---|---|---|---|
| **Rated Network** | [docs.rated.network](https://docs.rated.network/) | Free tier | ~hourly | Validator geo-distribution, client diversity, operator ratings |
| **clientdiversity.org** | [clientdiversity.org](https://clientdiversity.org/) | No | daily | Execution/consensus client share |
| **MigaLabs / monitoreth.io** | [migalabs.io](https://migalabs.io/) | No | ~daily | Node counts by country + client |
| **ethernodes.org** | [ethernodes.org](https://ethernodes.org/) | No | ~daily | Execution client + country distribution |

> Note: **beaconcha.in** free API keys were deprecated (now a 30-day trial) — prefer Rated +
> clientdiversity + MigaLabs for the free/continuous requirement.

**Stablecoin / adoption geography (the hard part):**
- No free live country-level API exists. Free options, in order of preference:
  1. **Proxy model (recommended for free/continuous):** render country-level "dollar-access
     demand" from free macro geography (§2.3) sized by live on-chain supply (§2.1). Label as
     modeled; link to methodology and to both input sources.
  2. **[Chainalysis Geography of Crypto](https://www.chainalysis.com/reports/2025-geo-crypto-report/)**
     — authoritative country rankings incl. stablecoin use; free to *read*, annual, manual ingest.
  3. **[Artemis](https://www.artemis.xyz/pricing)** — free "Lite" tier for chain-level
     supply/volume; country-level stablecoin analytics gated to paid.

### 2.3 Macro / institutional overlays (free, no key, geographic)

| Source | Endpoint / example | Cadence | Provides |
|---|---|---|---|
| **World Bank Indicators** | `https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG?format=json` | annual | Inflation (`FP.CPI.TOTL.ZG`), FX (`PA.NUS.FCRF`), remittances (`BX.TRF.PWKR.CD.DT`), GDP (`NY.GDP.MKTP.CD`) |
| **IMF DataMapper** | `https://www.imf.org/external/datamapper/api/` | varies | Higher-frequency FX/inflation for some series |
| **exchangerate.host** (or similar) | free FX API | daily | Live currency rates → daily depreciation as a severity axis |

Docs: [World Bank Indicators API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation)

---

## 3. Regulatory & policy-news layer

Two distinct needs, different sources:
**(A)** current regulatory *status* per country — the slow-changing baseline that colors the map
(the "phase", mirroring IPC phases: banned → restricted → framework-in-progress → clear);
**(B)** a live *news stream* of policy changes — the feed in the country drill-down panel.

### 3.1 Regulatory status baseline (free, curated, periodic)

Maintained *for us* — ingest their state rather than deriving it. Each country entry links back
to the tracker entry it came from.

| Source | URL | Coverage |
|---|---|---|
| **STRIDE Global Stablecoin Regulation Tracker** | [tracker.stride.sc](https://tracker.stride.sc/) | 200+ countries; MiCA / US GENIUS Act / issuer licenses — **best fit for the stablecoin phase axis** |
| **Atlantic Council Crypto Regulation Tracker** | [atlanticcouncil.org](https://www.atlanticcouncil.org/programs/geoeconomics-center/cryptoregulationtracker/) | Legal / partial-ban / total-ban across largest economies |
| **Latham & Watkins MiCA Tracker** | [lw.com](https://www.lw.com/en/markets-in-crypto-assets-regulation-tracker) | EU MiCA subtopics + status |
| **PwC Global Crypto Regulation Report** | [legal.pwc.de](https://legal.pwc.de/en/services/pwc-legals-eu-regulatory-compliance-operations/pwcs-global-crypto-regulation-report) | Global reference, annual PDF |

Cadence: refresh monthly. Mostly HTML/PDF — expect light scraping or periodic manual ingest.
This is the "ground truth phase," not the live feed.

### 3.2 Live policy-news feed (free, real-time, per-country)

- **GDELT DOC 2.0 API — the engine.** Free, **no key, effectively unlimited**. Filter by
  `country:<CODE>` + crypto themes/keywords (`stablecoin`, `MiCA`, `CBDC`, `tokenization`,
  `Ethereum`, `digital asset`); returns title, URL, domain, source country, language, date.
  **Machine-translates 65 languages into English** — catches non-English regulatory stories.
  Caveat: DOC API covers only the **last ~3 months** (older data via GDELT BigQuery/raw exports,
  also free), and it is research-grade/noisy — needs §3.3 classification.
  Docs: [GDELT DOC 2.0](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/) ·
  [Python client](https://github.com/alex9smith/gdelt-doc-api)
- **Official regulator RSS (authoritative primary sources)** —
  [SEC](https://www.sec.gov/about/rss-feeds), [ESMA](https://www.esma.europa.eu/press-news/esma-news),
  FCA, MAS, etc. Aggregate the top ~20 regulators; use to promote/verify GDELT hits. Each item
  links straight to the regulator's page.
- **Production-safe supplements** — The Guardian API (free, commercial-OK) and NewsData.io
  (200 req/day, commercial-OK). **Avoid** NewsAPI.org / GNews / mediastack free tiers — they
  forbid commercial/production use, delay articles 24h, or are HTTP-only.
  Ref: [free news APIs & limitations](https://apitube.io/blog/best-free-news-apis-honest-limitations) ·
  [comparison](https://newsmesh.co/best-news-apis)

Free-and-legal news stack: **GDELT + Guardian + NewsData + regulator RSS**.

### 3.3 Classification layer (where Claude fits; makes it institutional-grade)

A lightweight LLM pass on each ingested article — the piece that separates a credible
institutional tool from an RSS reader:

1. **Relevance filter** — is this actually crypto/stablecoin/RWA/Ethereum policy? (kills noise)
2. **Topic tag** — stablecoin / RWA / Ethereum-staking / general blockchain / CBDC
3. **Policy direction** — enabling ↔ restrictive ↔ neutral → the severity signal; can auto-nudge
   the regulatory-phase color when a confirmed law changes
4. **Dedup + entity resolution** — collapse many outlets covering one event into one event

Every classified event retains the **original article URL** as its source link (principle §0);
the LLM summary never replaces the primary link.

---

## 4. Architecture — keeping it continuously fresh

1. **Scheduled ingestion, not live client calls.** Cron/worker pulls each source on its natural
   cadence, normalizes into our store with a `provenance` object (§0). The map reads *our* cache,
   so a source going down never blanks the map.
2. **Per-source cadence tiers:** real-time (on-chain), daily (FX/news), monthly (trackers/World
   Bank), annual (Chainalysis/PwC). Every layer timestamped in the UI.
3. **Gap-fill (HungerMap's key trick).** Where country-level on-chain data doesn't exist, model
   it from free macro proxies and **label it modeled** with a methodology link. Never blank, never
   fake-precise.
4. **Provenance is enforced at ingest**, not bolted on later: a record without a resolvable
   `sourceUrl` is rejected by the pipeline.

---

## 5. Recommendation / phasing

- **Phase 1 — Validator/node decentralization map (launch).** Fully free + continuous +
  geographic today (Rated + clientdiversity + MigaLabs). Institutional angle: network resilience
  / staking-concentration risk.
- **Phase 2 — Stablecoin dollar-access view.** Free proxy model (DefiLlama supply × World Bank
  inflation/remittances), clearly labeled modeled. Clean upgrade path: swap the proxy for
  Chainalysis/Artemis-Pro country data later without changing the UI.
- **Phase 3 — Regulatory phase choropleth + live policy-news drill-down** (§3), with the Claude
  classification layer.
- **Cross-cutting:** the §0 source-linking principle ships in Phase 1 and applies to every layer.

### Honest gaps
- True country-level stablecoin *flows* require paid data (Chainalysis / Allium / Artemis Pro) —
  free path is the labeled proxy.
- Regulatory trackers are periodic and partly manual; live *status* can lag a real change by days
  until the classifier or tracker confirms it.
- GDELT's 3-month window means persistent history lives in *our* store — ingest from day one.
- World Bank macro data is annual — good for context/color-scale, not "live."

---

## 6. Source index

**On-chain / financial data**
- [DefiLlama API SDK](https://github.com/DefiLlama/api-sdk) ·
  [DefiLlama free tier](https://eco.com/support/en/articles/14800367-defillama-free-tvl-and-defi-analytics)
- [RWA.xyz platform overview](https://app.rwa.xyz/platform-overview) ·
  [RWA.xyz review/API](https://cryptoadventure.com/rwa-xyz-review-tokenized-asset-data-api-and-2026-outlook/)
- [Artemis pricing/free tier](https://www.artemis.xyz/pricing) ·
  [Artemis API docs](https://www.artemis.ai/docs/welcome/overview)

**Validator / decentralization**
- [Rated Network docs](https://docs.rated.network/) ·
  [Geographic Diversity](https://geographicdiversity.org/) ·
  [Messari validator decentralization report](https://messari.io/report/evaluating-validator-decentralization-geographic-and-infrastructure-distribution-in-proof-of-stake-networks)

**Macro overlays**
- [World Bank Indicators API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation)

**Adoption**
- [Chainalysis 2025 Geography of Crypto](https://www.chainalysis.com/reports/2025-geo-crypto-report/) ·
  [2025 Global Adoption Index](https://www.chainalysis.com/blog/2025-global-crypto-adoption-index/)

**Regulatory status trackers**
- [STRIDE Stablecoin Regulation Tracker](https://tracker.stride.sc/) ·
  [Atlantic Council Crypto Regulation Tracker](https://www.atlanticcouncil.org/programs/geoeconomics-center/cryptoregulationtracker/) ·
  [Latham MiCA Tracker](https://www.lw.com/en/markets-in-crypto-assets-regulation-tracker) ·
  [PwC Global Crypto Regulation Report 2026](https://legal.pwc.de/en/services/pwc-legals-eu-regulatory-compliance-operations/pwcs-global-crypto-regulation-report)

**Policy news**
- [GDELT DOC 2.0 API](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/) ·
  [GDELT Python client](https://github.com/alex9smith/gdelt-doc-api)
- [SEC RSS feeds](https://www.sec.gov/about/rss-feeds) ·
  [ESMA News](https://www.esma.europa.eu/press-news/esma-news)
- [Free news APIs & limitations](https://apitube.io/blog/best-free-news-apis-honest-limitations) ·
  [News API comparison](https://newsmesh.co/best-news-apis)
