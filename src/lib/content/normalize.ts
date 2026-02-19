import type { DomainContent, ExpertContent, OpportunityContent, InstitutionContent, RelatedLink } from "./types";

export function toStrArray(v: string[] | string | null | undefined): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    if (v.trim() === "") return [];
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch {
      return [v];
    }
  }
  return [];
}

export function toRelatedLinks(v: RelatedLink[] | string | null | undefined): RelatedLink[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function domainToApiShape(
  d: DomainContent,
  opts: {
    parent?: { id: string; name: string } | null;
    children?: { id: string; name: string }[];
    outEdges?: { edgeType: string; to: { id: string; name: string } }[];
    inEdges?: { edgeType: string; from: { id: string; name: string } }[];
    experiments?: { id: string; title: string; year: number | null; blockchainUsed: string | null; description: string | null }[];
    opportunityLinks?: { opportunity: { id: string; title: string; stage: string } }[];
    expertDomains?: { expert: { id: string; name: string; affiliation: string | null } }[];
  } = {}
) {
  const tags = toStrArray(d.tags);
  const primitives = toStrArray(d.ethereumPrimitives);
  const relatedLinks = d.relatedLinks;
  const relatedStr = Array.isArray(relatedLinks)
    ? JSON.stringify(relatedLinks)
    : typeof relatedLinks === "string"
      ? relatedLinks
      : "";
  return {
    id: d.slug,
    name: d.name,
    definition: d.definition ?? null,
    summary: d.summary ?? null,
    challenges: d.challenges ?? null,
    opportunities: d.opportunities ?? null,
    ethereumPrimitives: primitives.length ? JSON.stringify(primitives) : null,
    valueProposition: d.valueProposition ?? null,
    relatedLinks: relatedStr || null,
    maturityLevel: d.maturityLevel ?? null,
    tags: tags.length ? JSON.stringify(tags) : null,
    parent: opts.parent ?? null,
    children: opts.children ?? [],
    outEdges: opts.outEdges ?? [],
    inEdges: opts.inEdges ?? [],
    experiments: opts.experiments ?? [],
    opportunityLinks: opts.opportunityLinks ?? [],
    expertDomains: opts.expertDomains ?? [],
  };
}

export function expertToApiShape(e: ExpertContent, domainTags?: { domain: { id: string; name: string } }[]) {
  const skillsTags = toStrArray(e.skillsTags);
  return {
    id: e.slug,
    name: e.name,
    affiliation: e.affiliation ?? null,
    skillsTags: skillsTags.length ? JSON.stringify(skillsTags) : null,
    expertiseDomains: Array.isArray(e.expertiseDomains) ? JSON.stringify(e.expertiseDomains) : (e.expertiseDomains ?? null),
    region: e.region ?? null,
    languages: Array.isArray(e.languages) ? JSON.stringify(e.languages) : (e.languages ?? null),
    availability: e.availability ?? null,
    contactPath: e.contactPath ?? null,
    referencesLinks: e.referencesLinks ?? null,
    ethereumAlignmentNotes: e.ethereumAlignmentNotes ?? null,
    domainTags: domainTags ?? [],
  };
}

export function opportunityToApiShape(
  o: OpportunityContent,
  opts: {
    institutions?: { institution: { id: string; name: string } }[];
    domains?: { domain: { id: string; name: string } }[];
  } = {}
) {
  return {
    id: o.slug,
    title: o.title,
    description: o.description ?? null,
    stage: o.stage ?? "long_list",
    priority: o.priority ?? null,
    fitScore: o.fitScore ?? null,
    budgetBand: o.budgetBand ?? null,
    nextStep: o.nextStep ?? null,
    dueDate: o.dueDate ?? null,
    pocFlagshipFlag: o.pocFlagshipFlag ?? false,
    links: typeof o.links === "string" ? o.links : Array.isArray(o.links) ? JSON.stringify(o.links) : null,
    institutions: opts.institutions ?? [],
    domains: opts.domains ?? [],
  };
}

export function institutionToApiShape(i: InstitutionContent) {
  const tags = toStrArray(i.tags);
  return {
    id: i.slug,
    name: i.name,
    type: i.type,
    country: i.country ?? null,
    region: i.region ?? null,
    description: i.description ?? null,
    status: i.status ?? null,
    tags: tags.length ? JSON.stringify(tags) : null,
  };
}
