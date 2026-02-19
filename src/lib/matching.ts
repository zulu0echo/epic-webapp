import type { DomainContent, ExpertContent, OpportunityContent } from "@/lib/content";
import { toStrArray } from "@/lib/content/normalize";

export interface MatchResult {
  expertId: string;
  name: string;
  score: number;
  reasons: string[];
}

const WEIGHTS = {
  domainOverlap: 40,
  skillsOverlap: 30,
  regionRelevance: 15,
  languageRelevance: 10,
  pastExperiment: 5,
};

export async function matchExpertsToDomainOrOpportunity(
  _opts: { domainId?: string; opportunityId?: string },
  data: {
    experts: ExpertContent[];
    domains: DomainContent[];
    opportunities: OpportunityContent[];
  }
): Promise<{ matches: MatchResult[] }> {
  const experts = data.experts ?? [];
  const domains = data.domains ?? [];
  const opportunities = data.opportunities ?? [];
  const domainBySlug = new Map(domains.map((d) => [d.slug, d]));

  let targetDomainSlugs: string[] = [];
  let targetTags: string[] = [];
  let targetRegion = "";
  let targetLanguages: string[] = [];

  if (_opts.domainId) {
    const domain = domainBySlug.get(_opts.domainId);
    if (domain) {
      targetDomainSlugs = [domain.slug];
      targetTags = toStrArray(domain.tags);
    }
  } else if (_opts.opportunityId) {
    const opp = opportunities.find((o) => o.slug === _opts.opportunityId);
    if (opp) {
      targetDomainSlugs = opp.domainSlugs ?? [];
      targetTags = (opp.domainSlugs ?? [])
        .flatMap((slug) => toStrArray(domainBySlug.get(slug)?.tags));
      const instSlugs = opp.institutionSlugs ?? [];
      // Region from first institution would need getInstitutions - skip for now or pass in
      targetRegion = "";
    }
  }

  const matches: MatchResult[] = experts.map((expert) => {
    const reasons: string[] = [];
    let score = 0;
    const expertDomainSlugs = new Set(expert.domainSlugs ?? []);
    const expertTags = new Set([
      ...toStrArray(expert.skillsTags),
      ...(expert.domainSlugs ?? []).flatMap((slug) =>
        toStrArray(domainBySlug.get(slug)?.tags)
      ),
    ]);
    const expertRegions = (expert.region ?? "").toLowerCase();
    const expertLangs = new Set(toStrArray(expert.languages).map((l) => l.toLowerCase()));

    const domainOverlap = targetDomainSlugs.filter((id) => expertDomainSlugs.has(id)).length;
    if (domainOverlap > 0) {
      const pct = Math.min(100, (domainOverlap / Math.max(1, targetDomainSlugs.length)) * 100);
      score += (WEIGHTS.domainOverlap * pct) / 100;
      reasons.push(`Domain match (${domainOverlap} of ${targetDomainSlugs.length})`);
    }

    const tagOverlap = targetTags.filter((t) => expertTags.has(t)).length;
    if (tagOverlap > 0) {
      const pct = Math.min(100, (tagOverlap / Math.max(1, targetTags.length)) * 100);
      score += (WEIGHTS.skillsOverlap * pct) / 100;
      reasons.push(`Skills/tags match (${tagOverlap} tags)`);
    }

    if (targetRegion && expertRegions.includes(targetRegion.toLowerCase())) {
      score += WEIGHTS.regionRelevance;
      reasons.push("Region match");
    } else if (expertRegions.includes("global")) {
      score += WEIGHTS.regionRelevance * 0.5;
      reasons.push("Global availability");
    }

    if (targetLanguages.length && targetLanguages.some((l) => expertLangs.has(l.toLowerCase()))) {
      score += WEIGHTS.languageRelevance;
      reasons.push("Language match");
    }

    if (reasons.length === 0) reasons.push("No strong match (consider manual review)");
    if (score > 0) score = Math.round(Math.min(100, score));

    return {
      expertId: expert.slug,
      name: expert.name,
      score,
      reasons,
    };
  });

  matches.sort((a, b) => b.score - a.score);
  return { matches: matches.slice(0, 15) };
}
