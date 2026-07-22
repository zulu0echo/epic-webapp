# content/metrics

Committed data snapshots for the **Ethereum Institutional Data Map**
(`/institutional-map`). Written by `scripts/ingest-metrics.mjs`.

## How it works

The map currently seeds from `src/lib/dataviz/data.ts` (a hand-verified snapshot).
The refresh script pulls the free sources and writes JSON here, accruing history
over time so the data can move to continuous updates without a database:

| File | Contents | Source |
|---|---|---|
| `stablecoins.json` | aggregate + Ethereum stablecoin supply | DefiLlama (free, no key) |
| `worldbank.json` | latest inflation / remittances per country | World Bank Indicators API |
| `policy-news.json` | per-country policy news, classified (topic · direction) | GDELT + Claude classification |
| `history.json` | appended dated points (grows each run) | all of the above |

## Running

```bash
node scripts/ingest-metrics.mjs
```

Requires Node 18+ and network access to `stablecoins.llama.fi`, `api.worldbank.org`,
and `api.gdeltproject.org` (add these to a **Custom** network policy in Claude Code
on the web — they are not in the default Trusted allowlist). Set `ANTHROPIC_API_KEY`
to classify news with Claude; otherwise a keyword fallback is used.

Schedule it (CI or a Routine) to keep the snapshots fresh and build real history.
Until then, the committed `data.ts` snapshot and the illustrative sparkline history
stand in — both clearly labeled in the UI.
