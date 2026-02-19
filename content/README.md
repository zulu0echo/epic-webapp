# File-based content

All map, Rolodex, and CRM data is loaded from JSON files in this directory. No database is required.

## Structure

- **`domains/`** — One `.json` file per domain. Filename (without `.json`) = **slug** used in URLs and links.
  - Required: `name`
  - Optional: `parentSlug`, `definition`, `summary`, `challenges`, `opportunities`, `tags` (array or JSON string), `ethereumPrimitives` (array or JSON string), `maturityLevel`, `valueProposition`, `relatedLinks` (array of `{ label, url }`), `edges` (array of `{ toSlug, edgeType }` where `edgeType` is `depends_on` | `enables` | `adjacent_to`), `experiments` (array of `{ title, year?, blockchainUsed?, description? }`).

- **`experts/`** — One `.json` file per expert.
  - Required: `name`
  - Optional: `affiliation`, `skillsTags` (array or JSON string), `domainSlugs` (array of domain slugs), `region`, `languages`, `availability`, `contactPath`, `referencesLinks`, `ethereumAlignmentNotes`.

- **`opportunities/`** — One `.json` file per opportunity.
  - Required: `title`
  - Optional: `description`, `stage`, `priority`, `fitScore`, `budgetBand`, `nextStep`, `dueDate`, `pocFlagshipFlag`, `links`, `domainSlugs`, `institutionSlugs`.

- **`institutions/`** — One `.json` file per institution.
  - Required: `name`, `type`
  - Optional: `country`, `region`, `description`, `status`, `tags`.

## Individual pages

- **Domains**: `/domains/[slug]` (e.g. `/domains/digital-identity-and-credentials`)
- **Experts**: `/experts/[slug]`
- **Opportunities**: `/opportunities/[slug]`
- **Institutions**: `/institutions/[slug]`

Slugs are the filename without `.json`. Use lowercase, hyphens, and no spaces (e.g. `digital-identity-and-credentials`).

## Adding content

1. Add a new `.json` file in the right folder with the slug as filename.
2. Restart the dev server or redeploy; the app will pick up the new file.
