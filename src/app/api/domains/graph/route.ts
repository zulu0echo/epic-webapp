import { NextResponse } from "next/server";
import { getDomains } from "@/lib/content";
import { toStrArray } from "@/lib/content/normalize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const focusId = searchParams.get("focusId");
  const kHop = Math.min(parseInt(searchParams.get("k") ?? "2", 10) || 2, 3);
  const tagFilter = searchParams.get("tags");
  const maturityFilter = searchParams.get("maturity");

  const domains = await getDomains();
  const idToRoot = new Map<string, string>();
  const roots = domains.filter((d) => !d.parentSlug || !domains.some((x) => x.slug === d.parentSlug));
  function getRootId(slug: string): string {
    const d = domains.find((x) => x.slug === slug);
    if (!d || !d.parentSlug) return d?.slug ?? slug;
    return getRootId(d.parentSlug);
  }
  domains.forEach((d) => {
    const rootName = roots.find((r) => r.slug === getRootId(d.slug))?.name ?? d.name;
    idToRoot.set(d.slug, rootName);
  });

  const edges: { fromId: string; toId: string; edgeType: string }[] = [];
  for (const d of domains) {
    for (const e of d.edges ?? []) {
      edges.push({ fromId: d.slug, toId: e.toSlug, edgeType: e.edgeType });
    }
  }

  let nodeIds = new Set(domains.map((d) => d.slug));
  if (focusId) {
    const neighborIds = new Set<string>([focusId]);
    let current = new Set<string>([focusId]);
    for (let i = 0; i < kHop; i++) {
      const next = new Set<string>();
      for (const e of edges) {
        if (current.has(e.fromId)) next.add(e.toId);
        if (current.has(e.toId)) next.add(e.fromId);
      }
      next.forEach((id) => neighborIds.add(id));
      current = next;
    }
    nodeIds = neighborIds;
  }

  const tagSet = tagFilter ? new Set(tagFilter.split(",").map((t) => t.trim())) : null;
  const nodes = domains
    .filter((d) => nodeIds.has(d.slug))
    .filter((d) => {
      if (maturityFilter && d.maturityLevel !== maturityFilter) return false;
      if (tagSet) {
        const tags = toStrArray(d.tags);
        if (tags.length && !tags.some((t) => tagSet.has(t))) return false;
      }
      return true;
    })
    .map((d, i) => ({
      id: d.slug,
      label: d.name,
      parentId: d.parentSlug ?? null,
      position: { x: (i % 5) * 180, y: Math.floor(i / 5) * 100 },
      sector: idToRoot.get(d.slug) ?? "",
      tier: d.parentSlug ? "child" : "root",
    }));

  const nodeIdSet = new Set(nodes.map((n) => n.id));
  const graphEdges = edges
    .filter((e) => nodeIdSet.has(e.fromId) && nodeIdSet.has(e.toId))
    .map((e, i) => ({
      id: `e${i}-${e.fromId}-${e.toId}`,
      source: e.fromId,
      target: e.toId,
      type: e.edgeType,
    }));

  return NextResponse.json({ nodes, edges: graphEdges });
}
