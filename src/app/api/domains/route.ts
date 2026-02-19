import { NextResponse } from "next/server";
import { getDomains } from "@/lib/content";
import { domainToApiShape } from "@/lib/content/normalize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId") ?? undefined;
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const all = await getDomains();
  let list = [...all];
  if (parentId !== undefined) {
    const target = parentId || null;
    list = list.filter((d) => (d.parentSlug ?? null) === target);
  }
  if (q) list = list.filter((d) => d.name.toLowerCase().includes(q));
  list.sort((a, b) => a.name.localeCompare(b.name));
  const withParent = list.map((d) => {
    const parent = d.parentSlug ? all.find((x) => x.slug === d.parentSlug) : null;
    return domainToApiShape(d, {
      parent: parent ? { id: parent.slug, name: parent.name } : null,
      children: [],
    });
  });
  return NextResponse.json(withParent);
}

export async function POST() {
  return NextResponse.json(
    { error: "Content is file-based. Add or edit JSON files in content/domains/." },
    { status: 501 }
  );
}
