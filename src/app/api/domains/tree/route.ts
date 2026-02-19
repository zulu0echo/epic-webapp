import { NextResponse } from "next/server";
import { getDomains } from "@/lib/content";

type TreeNode = { id: string; name: string; rootName?: string; children?: TreeNode[] };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const domains = await getDomains();
  const bySlug = new Map(domains.map((d) => [d.slug, d]));
  const roots = domains.filter((d) => !d.parentSlug || !bySlug.has(d.parentSlug));

  function getRootName(slug: string): string {
    const d = bySlug.get(slug);
    if (!d || !d.parentSlug) return d?.name ?? "";
    return getRootName(d.parentSlug);
  }

  function buildTree(slug: string): TreeNode | null {
    const d = bySlug.get(slug);
    if (!d) return null;
    const match = !q || d.name.toLowerCase().includes(q);
    const children = domains
      .filter((c) => c.parentSlug === slug)
      .map((c) => buildTree(c.slug))
      .filter((n): n is TreeNode => n !== null);
    const rootName = getRootName(d.slug);
    if (match || children.length)
      return { id: d.slug, name: d.name, rootName: rootName || undefined, children: children.length ? children : undefined };
    return null;
  }

  const filtered = roots.map((r) => buildTree(r.slug)).filter((n): n is TreeNode => n !== null);
  return NextResponse.json(filtered);
}
