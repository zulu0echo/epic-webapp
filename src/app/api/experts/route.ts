import { NextResponse } from "next/server";
import { getExperts, getDomains } from "@/lib/content";
import { expertToApiShape } from "@/lib/content/normalize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const [experts, domains] = await Promise.all([getExperts(), getDomains()]);
  const domainBySlug = new Map(domains.map((d) => [d.slug, d]));
  let list = experts;
  if (q) list = list.filter((e) => e.name.toLowerCase().includes(q));
  const withDomainTags = list.map((e) => {
    const domainTags = (e.domainSlugs ?? [])
      .map((slug) => domainBySlug.get(slug))
      .filter(Boolean)
      .map((d) => ({ domain: { id: d!.slug, name: d!.name } }));
    return expertToApiShape(e, domainTags);
  });
  return NextResponse.json(withDomainTags);
}

export async function POST() {
  return NextResponse.json(
    { error: "Content is file-based. Add JSON files in content/experts/." },
    { status: 501 }
  );
}
