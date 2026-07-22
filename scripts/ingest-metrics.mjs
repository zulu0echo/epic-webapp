#!/usr/bin/env node
/**
 * Ingestion / refresh script for the Ethereum Institutional Data Map.
 *
 * Architecture: "committed snapshots + script". This script pulls the FREE
 * sources, (optionally) classifies policy news with Claude, and writes JSON
 * snapshots into content/metrics/. Running it on a schedule (CI / a Routine)
 * refreshes the data AND accrues real history over time — no database and no
 * runtime network dependency for the app.
 *
 * REQUIREMENTS
 *   - Node 18+ (global fetch).
 *   - Network access to the source hosts. In Claude Code on the web these are
 *     NOT in the default Trusted allowlist — add them under a Custom network
 *     policy: stablecoins.llama.fi, api.worldbank.org, api.gdeltproject.org.
 *   - Optional: ANTHROPIC_API_KEY to classify policy news with Claude. Without
 *     it, the script falls back to keyword-based classification.
 *
 * USAGE
 *   node scripts/ingest-metrics.mjs
 *
 * OUTPUT (content/metrics/)
 *   stablecoins.json      latest aggregate + per-chain stablecoin supply
 *   worldbank.json        latest inflation / remittances per country
 *   policy-news.json      classified per-country policy news
 *   history.json          appended dated points (accrues over time)
 *
 * NOTE: the app currently seeds from src/lib/dataviz/data.ts. Wiring the app to
 * prefer these generated snapshots (via the /api/metrics route + a loader that
 * reads content/metrics/) is the follow-up once this script runs regularly.
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "content", "metrics");
const RETRIES = 4;

async function getJson(url) {
  let delay = 2000;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "epic-institutional-map/1.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === RETRIES) throw err;
      console.warn(`  retry ${attempt + 1} for ${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

async function ingestStablecoins() {
  console.log("• DefiLlama stablecoins…");
  const all = await getJson("https://stablecoins.llama.fi/stablecoins?includePrices=true");
  const eth = await getJson("https://stablecoins.llama.fi/stablecoincharts/Ethereum");
  const total = (all.peggedAssets ?? []).reduce((s, a) => s + (a.circulating?.peggedUSD ?? 0), 0);
  const latestEth = Array.isArray(eth) ? eth[eth.length - 1] : null;
  return {
    totalCirculatingUSD: total,
    ethereumCirculatingUSD: latestEth?.totalCirculatingUSD?.peggedUSD ?? null,
    count: (all.peggedAssets ?? []).length,
    source: "https://defillama.com/stablecoins",
  };
}

async function ingestWorldBank(indicator, iso3List) {
  console.log(`• World Bank ${indicator}…`);
  const out = {};
  for (const iso3 of iso3List) {
    try {
      const rows = await getJson(
        `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicator}?format=json&per_page=5&mrv=1`,
      );
      const point = Array.isArray(rows) && rows[1] ? rows[1].find((r) => r.value != null) : null;
      if (point) out[iso3] = { value: point.value, year: point.date };
    } catch (err) {
      console.warn(`  ${iso3}: ${err.message}`);
    }
  }
  return { indicator, values: out, source: `https://data.worldbank.org/indicator/${indicator}` };
}

// GDELT DOC 2.0 — free, no key, 3-month window, machine-translated.
async function ingestPolicyNews(countryCode) {
  const query = encodeURIComponent(
    `(stablecoin OR "digital asset" OR cryptocurrency OR tokenization OR MiCA OR CBDC) sourcecountry:${countryCode}`,
  );
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&format=json&maxrecords=15&sort=datedesc`;
  const data = await getJson(url);
  return (data.articles ?? []).map((a) => ({ title: a.title, url: a.url, domain: a.domain, date: a.seendate }));
}

const RULES = [
  { topic: "stablecoin", re: /stablecoin|usd[ct]|pyusd|e-money/i },
  { topic: "rwa", re: /tokeniz|real-world asset|treasur|money market/i },
  { topic: "cbdc", re: /cbdc|digital euro|digital pound|e-cny|digital rupee/i },
  { topic: "market-structure", re: /license|authoris|regist|framework|regulat/i },
];
const ENABLING = /approv|licens|authoris|framework|permit|clarity|adopt/i;
const RESTRICTIVE = /ban|prohibit|restrict|halt|crackdown|penalt|warn/i;

function classifyByRules(title) {
  const topic = RULES.find((r) => r.re.test(title))?.topic ?? "general";
  const direction = RESTRICTIVE.test(title) ? "restrictive" : ENABLING.test(title) ? "enabling" : "neutral";
  return { topic, direction };
}

async function classifyWithClaude(articles) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return articles.map((a) => ({ ...a, ...classifyByRules(a.title) }));
  // Minimal Claude classification call (api.anthropic.com is allowlisted).
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content:
            "For each headline, return JSON array of {i, relevant:boolean, topic:one of stablecoin|rwa|cbdc|market-structure|general, direction:one of enabling|restrictive|neutral}. Headlines:\n" +
            articles.map((a, i) => `${i}. ${a.title}`).join("\n"),
        }],
      }),
    });
    const json = await res.json();
    const text = json.content?.[0]?.text ?? "[]";
    const tags = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1));
    return articles
      .map((a, i) => {
        const t = tags.find((x) => x.i === i);
        return t && t.relevant ? { ...a, topic: t.topic, direction: t.direction } : null;
      })
      .filter(Boolean);
  } catch (err) {
    console.warn(`  Claude classification failed (${err.message}); using rules.`);
    return articles.map((a) => ({ ...a, ...classifyByRules(a.title) }));
  }
}

async function appendHistory(record) {
  const file = path.join(OUT, "history.json");
  let hist = [];
  try {
    hist = JSON.parse(await readFile(file, "utf8"));
  } catch {
    /* first run */
  }
  hist.push(record);
  await writeFile(file, JSON.stringify(hist, null, 2));
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const stamp = process.env.INGEST_DATE || new Date().toISOString().slice(0, 10);

  const stablecoins = await ingestStablecoins();
  await writeFile(path.join(OUT, "stablecoins.json"), JSON.stringify(stablecoins, null, 2));

  const iso3 = ["ARG", "NGA", "TUR", "EGY", "PAK", "IND", "PHL", "MEX", "BRA", "USA", "GBR", "DEU"];
  const inflation = await ingestWorldBank("FP.CPI.TOTL.ZG", iso3);
  const remittances = await ingestWorldBank("BX.TRF.PWKR.DT.GD.ZS", iso3);
  await writeFile(path.join(OUT, "worldbank.json"), JSON.stringify({ inflation, remittances }, null, 2));

  const newsCountries = ["US", "GB", "DE", "FR", "JP", "KR", "BR", "IN", "NG", "TR", "CN"];
  const news = {};
  for (const c of newsCountries) {
    try {
      const raw = await ingestPolicyNews(c);
      news[c] = await classifyWithClaude(raw);
      console.log(`  ${c}: ${news[c].length} items`);
    } catch (err) {
      console.warn(`  ${c}: ${err.message}`);
    }
  }
  await writeFile(path.join(OUT, "policy-news.json"), JSON.stringify(news, null, 2));

  await appendHistory({ date: stamp, stablecoins, inflation: inflation.values });

  console.log(`\n✓ Snapshots written to ${OUT}`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
