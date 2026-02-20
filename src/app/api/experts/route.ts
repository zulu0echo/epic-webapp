import { NextResponse } from "next/server";
import { getExperts, getDomains, getExpertSlugs } from "@/lib/content";
import { expertToApiShape } from "@/lib/content/normalize";
import { isAdmin } from "@/lib/auth";
import path from "path";
import { writeFile } from "fs/promises";
import type { ExpertContent } from "@/lib/content/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function slugSafe(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

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

export async function POST(request: Request) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Partial<ExpertContent> & { slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = (body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const existingSlugs = await getExpertSlugs();
  let slug = (body.slug ?? slugSafe(name)).trim() || slugSafe(name);
  if (!slug) slug = "expert";
  let candidate = slug;
  let n = 0;
  while (existingSlugs.includes(candidate)) {
    n++;
    candidate = `${slug}-${n}`;
  }
  slug = candidate;

  const expert: ExpertContent = {
    slug,
    name,
    affiliation: body.affiliation?.trim() || undefined,
    skillsTags: Array.isArray(body.skillsTags) ? body.skillsTags : (typeof body.skillsTags === "string" && body.skillsTags.trim() ? body.skillsTags.split(",").map((s) => s.trim()).filter(Boolean) : undefined),
    domainSlugs: Array.isArray(body.domainSlugs) ? body.domainSlugs : [],
    region: body.region?.trim() || undefined,
    contactPath: body.contactPath?.trim() || undefined,
    ethereumAlignmentNotes: body.ethereumAlignmentNotes?.trim() || undefined,
  };

  const filePath = path.join(CONTENT_DIR, "experts", `${slug}.json`);
  await writeFile(filePath, JSON.stringify(expert, null, 2), "utf-8");
  return NextResponse.json(expert);
}
