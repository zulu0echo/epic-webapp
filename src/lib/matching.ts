import type { PrismaClient } from "@prisma/client";
import { parseJsonArray } from "./parsers";

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
  prisma: PrismaClient,
  opts: { domainId?: string; opportunityId?: string }
): Promise<{ matches: MatchResult[] }> {
  const experts = await prisma.expert.findMany({
    where: { deletedAt: null },
    include: { domainTags: { include: { domain: true } } },
  });

  let targetDomainIds: string[] = [];
  let targetTags: string[] = [];
  let targetRegion = "";
  let targetLanguages: string[] = [];

  if (opts.domainId) {
    const domain = await prisma.domain.findFirst({
      where: { id: opts.domainId, deletedAt: null },
    });
    if (domain) {
      targetDomainIds = [domain.id];
      targetTags = parseJsonArray(domain.tags);
      targetRegion = "";
      targetLanguages = [];
    }
  } else if (opts.opportunityId) {
    const opp = await prisma.opportunity.findMany({
      where: { id: opts.opportunityId, deletedAt: null },
      include: { domains: { include: { domain: true } }, institutions: { include: { institution: true } } },
    });
    const o = opp[0];
    if (o) {
      targetDomainIds = o.domains.map((d) => d.domainId);
      targetTags = o.domains.flatMap((d) => parseJsonArray(d.domain.tags));
      const inst = o.institutions[0]?.institution;
      if (inst?.country) targetRegion = inst.country;
    }
  }

  const matches: MatchResult[] = experts.map((expert) => {
    const reasons: string[] = [];
    let score = 0;

    const expertDomainIds = new Set(expert.domainTags.map((d) => d.domainId));
    const expertTags = new Set([
      ...parseJsonArray(expert.skillsTags),
      ...expert.domainTags.flatMap((d) => parseJsonArray(d.domain.tags)),
    ]);
    const expertRegions = (expert.region ?? "").toLowerCase();
    const expertLangs = new Set(parseJsonArray(expert.languages).map((l) => l.toLowerCase()));

    const domainOverlap = targetDomainIds.filter((id) => expertDomainIds.has(id)).length;
    if (domainOverlap > 0) {
      const pct = Math.min(100, (domainOverlap / Math.max(1, targetDomainIds.length)) * 100);
      score += (WEIGHTS.domainOverlap * pct) / 100;
      reasons.push(`Domain match (${domainOverlap} of ${targetDomainIds.length})`);
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
      expertId: expert.id,
      name: expert.name,
      score,
      reasons,
    };
  });

  matches.sort((a, b) => b.score - a.score);
  return { matches: matches.slice(0, 15) };
}
