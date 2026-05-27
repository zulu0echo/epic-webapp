# EPIC Map App

Production-quality web app for the **Ethereum Foundation EPIC team** (Ethereum Public Infrastructure and Commons) to map GovTech / Digital Public Infrastructure (DPI) domains where Ethereum can be applied, and to publish open resources for self-sovereign users and public institutions.

## Features

- **Map Explorer**: Interactive taxonomy tree (left), graph view (center) with pan/zoom and focus mode, and detail panel (right) with tabs: Overview, Challenges & Opportunities, Key Actors, Experiments, Experts.
- **Admin**: Export domains (JSON), add/edit domains and edges. Content is file-based (see `content/`).
- **Global search**: Search across domains, institutions, opportunities, experts, blog posts, and static pages.
- **Proof of concepts**: Carbon MRV PoC with open spec, docs, and reference implementation.
- **PoC template**: Structured template for documenting domain proof of concepts.

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

Deploy as usual (e.g. connect the repo to Vercel). No database is required for the map or public pages — they read from the `content/` folder in the repo.

- **Contact** form sends to **epic@ethereum.org** (opens your default email client with To and body pre-filled).
- **Admin** (optional): set `EPIC_ADMIN_SECRET` in environment variables to enable admin login for domain management.

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
- **Institution**, **Opportunity**, **Expert**: Optional reference content in JSON; surfaced in search and domain pages where linked.

## Where to edit

- **Taxonomy (domains)**: Add or edit JSON files in **`content/domains/`**. Filename (without `.json`) = slug. See `content/README.md` for the schema. Use **Admin** to export domains as JSON.
- **Experts**: `content/experts/*.json`
- **Opportunities**: `content/opportunities/*.json`
- **Institutions**: `content/institutions/*.json`
- **Individual pages**: Each entry has a page at `/domains/[slug]`, `/experts/[slug]`, `/opportunities/[slug]`, `/institutions/[slug]`.

## Export / import

- **Export domains**: Admin → Export → “Export domains (JSON)”.

## Taxonomy maintenance

1. **Add a new top-level domain**: Create `content/domains/your-slug.json` with `name`, optional `definition`, `summary`, `tags`, `edges`, etc. Use `parentSlug: null` or omit it for roots.
2. **Add subdomains**: Create a new domain file with `parentSlug: "parent-slug"`.
3. **Add relationships**: In each domain JSON, set `edges: [{ "toSlug": "other-slug", "edgeType": "depends_on" }]` (or `enables`, `adjacent_to`).
4. **Add experiments**: In the domain JSON, set `experiments: [{ "title", "year", "blockchainUsed", "description" }]`.

## License

CC0-1.0 (align with EPIC Map content repo).
