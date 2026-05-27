import { NextResponse } from "next/server";
import { getOpportunities, getDomains, getInstitutions } from "@/lib/content";
import { opportunityToApiShape } from "@/lib/content/normalize";
import type { OpportunityContent } from "@/lib/content/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const [opportunities, domains, institutions] = await Promise.all([
    getOpportunities(),
    getDomains(),
    getInstitutions(),
  ]);
  const domainBySlug = new Map(domains.map((d) => [d.slug, d.name]));
  const instBySlug = new Map(institutions.map((i) => [i.slug, i]));
  let list = opportunities;
  if (stage) list = list.filter((o) => o.stage === stage);
  if (priority) list = list.filter((o) => o.priority === priority);
  const withRelations = list.map((o) => {
    const institutionList = (o.institutionSlugs ?? [])
      .map((slug) => instBySlug.get(slug))
      .filter(Boolean)
      .map((i) => ({ institution: { id: i!.slug, name: i!.name } }));
    const domainList = (o.domainSlugs ?? []).map((slug) => ({
      domain: { id: slug, name: domainBySlug.get(slug) ?? slug },
    }));
    const shape = opportunityToApiShape(o, { institutions: institutionList, domains: domainList });
    return { ...shape, updatedAt: (o as OpportunityContent & { updatedAt?: string }).updatedAt ?? new Date(0).toISOString() };
  });
  return NextResponse.json(withRelations);
}
