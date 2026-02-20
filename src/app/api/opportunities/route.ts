import { NextResponse } from "next/server";
import { getOpportunities, getDomains, getInstitutions, getOpportunitySlugs } from "@/lib/content";
import { opportunityToApiShape } from "@/lib/content/normalize";
import { isAdmin } from "@/lib/auth";
import path from "path";
import { writeFile } from "fs/promises";
import type { OpportunityContent } from "@/lib/content/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function slugSafe(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

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

export async function POST(request: Request) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Partial<OpportunityContent> & { title?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const title = (body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const existingSlugs = await getOpportunitySlugs();
  let slug = (body.slug ?? slugSafe(title)).trim() || slugSafe(title);
  if (!slug) slug = "opportunity";
  let candidate = slug;
  let n = 0;
  while (existingSlugs.includes(candidate)) {
    n++;
    candidate = `${slug}-${n}`;
  }
  slug = candidate;

  const updatedAt = new Date().toISOString();
  const opportunity: OpportunityContent & { updatedAt?: string } = {
    slug,
    title,
    description: body.description?.trim() || undefined,
    stage: body.stage?.trim() || "long_list",
    priority: body.priority?.trim() || undefined,
    domainSlugs: Array.isArray(body.domainSlugs) ? body.domainSlugs : (body.domainSlugs ? [] : []),
    institutionSlugs: Array.isArray(body.institutionSlugs) ? body.institutionSlugs : (body.institutionSlugs ? [] : []),
    nextStep: body.nextStep?.trim() || undefined,
    dueDate: body.dueDate ?? undefined,
    updatedAt,
  };

  const filePath = path.join(CONTENT_DIR, "opportunities", `${slug}.json`);
  await writeFile(filePath, JSON.stringify(opportunity, null, 2), "utf-8");
  return NextResponse.json({ ...opportunity, id: slug });
}
