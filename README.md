# EPIC Map App

Production-quality web app for the **Ethereum Foundation EPIC team** (Ethereum Public Infrastructure and Commons) to map GovTech / Digital Public Infrastructure (DPI) domains where Ethereum can be applied, and to maintain a consolidated database of institutional opportunities, contacts, and a Rolodex of Ethereum-aligned experts.

## Features

- **Map Explorer**: Interactive taxonomy tree (left), graph view (center) with pan/zoom and focus mode, and detail panel (right) with tabs: Overview, Challenges & Opportunities, Key Actors, Experiments, Experts, Opportunities.
- **Rolodex**: Table of experts with filters; match experts to a domain or opportunity (via URL params) with explainable scoring.
- **CRM**: Institutions, contacts, opportunities pipeline; weekly review (updated this week, stale).
- **Admin**: Taxonomy editing (via API/Prisma Studio), export domains (JSON), export CRM (CSV).
- **Global search**: Search across domains, institutions, opportunities, experts.

## Tech stack

- **Next.js 14** (App Router)
- **Prisma** + **SQLite**
- **React Flow** for the map graph
- **Tailwind CSS** + Radix UI primitives

## Setup and run locally

```bash
# 1. Go to the app directory
cd epic-map-app

# 2. Install dependencies
npm install

# 3. Create the database (SQLite at prisma/dev.db)
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma db push

# 4. Seed the starter DPI taxonomy and sample data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Then open **http://localhost:3001** in your browser.

- **Contact** and **Vendor / Ecosystem** forms send to **epic@ethereum.org** (they open your default email client with To and body pre-filled).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Build for production |
| `npm run db:push` | Push Prisma schema to DB (no migrations) |
| `npm run db:seed` | Run seed script (taxonomy + sample data) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run test` | Run Vitest tests |

## Data model

- **Domain**: Hierarchical taxonomy (name, definition, summary, challenges, opportunities, ethereum primitives, maturity, tags); edges to other domains (depends_on, enables, adjacent_to).
- **Experiment**: Prior blockchain/Ethereum pilots (title, year, description, outcomes, links, blockchain used).
- **Institution**: Gov/agency/multilateral/NGO/vendor/coalition; country, status, tags.
- **Contact**: Linked to institution; champion flag, influence, last contacted.
- **Opportunity**: Pipeline (long_list → screening → exploration → evaluation → engagement → post_engagement); linked to institutions and domains.
- **Expert**: Rolodex entry (affiliation, expertise domains, skills tags, region, languages, availability); linked to domains.

## Where to edit

- **Taxonomy (domains)**: Use **Admin** → API instructions, or `npx prisma studio` to edit `Domain` and `DomainEdge`. Seed is in `prisma/seed.ts`.
- **Add domain**: `POST /api/domains` with `name`, optional `parentId`, `definition`, `summary`, `challenges`, `opportunities`, `tags` (JSON array), `ethereumPrimitives` (JSON array), `maturityLevel`.
- **Add edge**: `POST /api/domains/edges` with `fromId`, `toId`, `edgeType` (depends_on | enables | adjacent_to).
- **Add opportunity**: `POST /api/opportunities` with `title`, optional `stage`, `priority`, `institutionIds`, `domainIds`.
- **Add expert**: `POST /api/experts` with `name`, optional `skillsTags`, `expertiseDomains`, `domainIds`.

## Matching (Rolodex ↔ domain/opportunity)

- **Endpoint**: `GET /api/experts/match?domainId=...` or `?opportunityId=...`
- **Scoring**: Weighted overlap of domain tags, skills, region, language; deterministic and explainable (reasons array).
- **Rolodex with match**: Open `/rolodex?domainId=xxx` or `/rolodex?opportunityId=xxx` to see match results at the top.

## Export / import

- **Export domains**: Admin → Export → “Export domains (JSON)”.
- **Export CRM**: Admin → Export → “Export CRM (CSV)”.
- **Full taxonomy**: Re-run `npm run db:seed` (wipes and reseeds) or extend `prisma/seed.ts`.

## Taxonomy maintenance

1. **Add a new top-level domain**: Insert in `TAXONOMY` in `prisma/seed.ts` (or create via API after seed).
2. **Add subdomains**: Add to the `children` array of the parent in the seed, or `POST /api/domains` with `parentId` set.
3. **Add relationships**: `POST /api/domains/edges` with `fromId`, `toId`, `edgeType`.
4. **Add experiments**: Create `Experiment` and `ExperimentDomain` in seed or via Prisma; link to domain IDs.

## License

CC0-1.0 (align with EPIC Map content repo).
