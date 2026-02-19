import { NextResponse } from "next/server";
import {
  getDomainBySlug,
  getDomains,
  getExperts,
  getOpportunities,
} from "@/lib/content";
import { domainToApiShape } from "@/lib/content/normalize";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const slug = (await params).id;
  const [domain, allDomains, experts, opportunities] = await Promise.all([
    getDomainBySlug(slug),
    getDomains(),
    getExperts(),
    getOpportunities(),
  ]);
  if (!domain) return NextResponse.json({ error: "Not found" }, { status: 404 });

  function getRootName(slug: string): string {
    const d = allDomains.find((x) => x.slug === slug);
    if (!d || !d.parentSlug) return d?.name ?? "";
    return getRootName(d.parentSlug);
  }
  const rootName = getRootName(domain.slug);

  const parent = domain.parentSlug
    ? allDomains.find((d) => d.slug === domain.parentSlug)
    : null;
  const children = allDomains.filter((d) => d.parentSlug === domain.slug);
  const outEdges = (domain.edges ?? []).map((e) => {
    const to = allDomains.find((d) => d.slug === e.toSlug);
    return {
      edgeType: e.edgeType,
      to: to ? { id: to.slug, name: to.name } : { id: e.toSlug, name: e.toSlug },
    };
  });
  const inEdges = allDomains.flatMap((d) =>
    (d.edges ?? [])
      .filter((e) => e.toSlug === domain.slug)
      .map((e) => ({
        edgeType: e.edgeType,
        from: { id: d.slug, name: d.name },
      }))
  );
  const experiments = (domain.experiments ?? []).map((ex, i) => ({
    id: `${domain.slug}-exp-${i}`,
    title: ex.title,
    year: ex.year ?? null,
    blockchainUsed: ex.blockchainUsed ?? null,
    description: ex.description ?? null,
  }));
  const opportunityLinks = opportunities
    .filter((o) => (o.domainSlugs ?? []).includes(domain.slug))
    .map((o) => ({ opportunity: { id: o.slug, title: o.title, stage: o.stage ?? "long_list" } }));
  const expertDomains = experts
    .filter((e) => (e.domainSlugs ?? []).includes(domain.slug))
    .map((e) => ({ expert: { id: e.slug, name: e.name, affiliation: e.affiliation ?? null } }));

  const shape = domainToApiShape(domain, {
    parent: parent ? { id: parent.slug, name: parent.name } : null,
    children: children.map((c) => ({ id: c.slug, name: c.name })),
    outEdges,
    inEdges,
    experiments,
    opportunityLinks,
    expertDomains,
  });
  return NextResponse.json({
    ...shape,
    rootName,
    references: domain.references ?? [],
    featuredExperts: domain.featuredExperts ?? [],
  });
}

export async function PATCH() {
  return NextResponse.json(
    { error: "Content is file-based. Edit JSON files in content/domains/." },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Content is file-based. Remove or rename the file in content/domains/." },
    { status: 501 }
  );
}
