import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const focusId = searchParams.get("focusId");
  const kHop = Math.min(parseInt(searchParams.get("k") ?? "2", 10) || 2, 3);
  const tagFilter = searchParams.get("tags"); // comma-separated
  const maturityFilter = searchParams.get("maturity");

  const domains = await prisma.domain.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, parentId: true, tags: true, maturityLevel: true },
  });
  const idToRoot = new Map<string, string>();
  const roots = domains.filter((d) => !d.parentId);
  function getRootId(id: string): string {
    const d = domains.find((x) => x.id === id);
    if (!d || !d.parentId) return d?.id ?? id;
    return getRootId(d.parentId);
  }
  domains.forEach((d) => {
    const rootName = roots.find((r) => r.id === getRootId(d.id))?.name ?? d.name;
    idToRoot.set(d.id, rootName);
  });
  const edges = await prisma.domainEdge.findMany({
    where: { deletedAt: null },
    select: { fromId: true, toId: true, edgeType: true },
  });

  let nodeIds = new Set(domains.map((d) => d.id));
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
    .filter((d) => nodeIds.has(d.id))
    .filter((d) => {
      if (maturityFilter && d.maturityLevel !== maturityFilter) return false;
      if (tagSet && d.tags) {
        try {
          const tags = JSON.parse(d.tags) as string[];
          if (!tags.some((t) => tagSet.has(t))) return false;
        } catch {
          return true;
        }
      }
      return true;
    })
    .map((d, i) => ({
      id: d.id,
      label: d.name,
      parentId: d.parentId ?? null,
      position: { x: (i % 5) * 180, y: Math.floor(i / 5) * 100 },
      sector: idToRoot.get(d.id) ?? "",
      tier: d.parentId ? "child" : "root",
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
