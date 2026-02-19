# EPIC Map App

Production-quality web app for the **Ethereum Foundation EPIC team** (Ethereum Public Infrastructure and Commons) to map GovTech / Digital Public Infrastructure (DPI) domains where Ethereum can be applied, and to maintain a consolidated database of institutional opportunities, contacts, and a Rolodex of Ethereum-aligned experts.

## Features

- **Map Explorer**: Interactive taxonomy tree (left), graph view (center) with pan/zoom and focus mode, and detail panel (right) with tabs: Overview, Challenges & Opportunities, Key Actors, Experiments, Experts, Opportunities.
- **Rolodex**: Table of experts with filters; match experts to a domain or opportunity (via URL params) with explainable scoring.
- **CRM**: Institutions, contacts, opportunities pipeline; weekly review (updated this week, stale).
- **Admin**: Export domains (JSON), export CRM (CSV). Content is file-based (see `content/`).
- **Global search**: Search across domains, institutions, opportunities, experts.

## Tech stack

- **Next.js 14** (App Router)
- **File-based content** (JSON in `content/`) — no database required
- **React Flow** for the map graph
- **Tailwind CSS** + Radix UI primitives

## Setup and run locally

No database required. All data is loaded from JSON files in the `content/` directory.

```bash
# 1. Go to the app directory
cd epic-map-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:3001** in your browser.

Sample content is included in `content/domains/`, `content/experts/`, `content/opportunities/`, and `content/institutions/`. Add or edit JSON files there; see **content/README.md** for the file format.

### Deploy to Vercel

Deploy as usual (e.g. connect the repo to Vercel). No database or environment variables are needed for map, Rolodex, or CRM — they read from the `content/` folder in the repo.

- **Contact** and **Vendor / Ecosystem** forms send to **epic@ethereum.org** (they open your default email client with To and body pre-filled).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Build for production |
| `npm run db:seed` | (No-op) Content is file-based; edit files in `content/`. |
| `npm run test` | Run Vitest tests |

## Data model

- **Domain**: Hierarchical taxonomy (name, definition, summary, challenges, opportunities, ethereum primitives, maturity, tags); edges to other domains (depends_on, enables, adjacent_to).
- **Experiment**: Prior blockchain/Ethereum pilots (title, year, description, outcomes, links, blockchain used).
- **Institution**: Gov/agency/multilateral/NGO/vendor/coalition; country, status, tags.
- **Contact**: Linked to institution; champion flag, influence, last contacted.
- **Opportunity**: Pipeline (long_list → screening → exploration → evaluation → engagement → post_engagement); linked to institutions and domains.
- **Expert**: Rolodex entry (affiliation, expertise domains, skills tags, region, languages, availability); linked to domains.

## Where to edit

- **Taxonomy (domains)**: Add or edit JSON files in **`content/domains/`**. Filename (without `.json`) = slug. See `content/README.md` for the schema. Use **Admin** to export domains as JSON.
- **Experts**: `content/experts/*.json`
- **Opportunities**: `content/opportunities/*.json`
- **Institutions**: `content/institutions/*.json`
- **Individual pages**: Each entry has a page at `/domains/[slug]`, `/experts/[slug]`, `/opportunities/[slug]`, `/institutions/[slug]`.

## Matching (Rolodex ↔ domain/opportunity)

- **Endpoint**: `GET /api/experts/match?domainId=...` or `?opportunityId=...`
- **Scoring**: Weighted overlap of domain tags, skills, region, language; deterministic and explainable (reasons array).
- **Rolodex with match**: Open `/rolodex?domainId=xxx` or `/rolodex?opportunityId=xxx` to see match results at the top.

## Export / import

- **Export domains**: Admin → Export → “Export domains (JSON)”.
- **Export CRM**: Admin → Export → “Export CRM (CSV)”.
- **Full taxonomy**: Re-run `npm run db:seed` (wipes and reseeds) or extend `prisma/seed.ts`.

## Taxonomy maintenance

1. **Add a new top-level domain**: Create `content/domains/your-slug.json` with `name`, optional `definition`, `summary`, `tags`, `edges`, etc. Use `parentSlug: null` or omit it for roots.
2. **Add subdomains**: Create a new domain file with `parentSlug: "parent-slug"`.
3. **Add relationships**: In each domain JSON, set `edges: [{ "toSlug": "other-slug", "edgeType": "depends_on" }]` (or `enables`, `adjacent_to`).
4. **Add experiments**: In the domain JSON, set `experiments: [{ "title", "year", "blockchainUsed", "description" }]`.

## License

CC0-1.0 (align with EPIC Map content repo).
