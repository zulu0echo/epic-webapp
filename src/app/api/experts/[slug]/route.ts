import { NextResponse } from "next/server";
import { getExpertBySlug } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import type { ExpertContent } from "@/lib/content/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const expert = await getExpertBySlug(slug);
  if (!expert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(expert);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const expert = await getExpertBySlug(slug);
  if (!expert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: Partial<ExpertContent>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updated: ExpertContent = {
    slug: expert.slug,
    name: body.name ?? expert.name,
    affiliation: body.affiliation !== undefined ? body.affiliation : expert.affiliation,
    skillsTags: body.skillsTags !== undefined ? body.skillsTags : expert.skillsTags,
    expertiseDomains: body.expertiseDomains !== undefined ? body.expertiseDomains : expert.expertiseDomains,
    region: body.region !== undefined ? body.region : expert.region,
    languages: body.languages !== undefined ? body.languages : expert.languages,
    availability: body.availability !== undefined ? body.availability : expert.availability,
    contactPath: body.contactPath !== undefined ? body.contactPath : expert.contactPath,
    referencesLinks: body.referencesLinks !== undefined ? body.referencesLinks : expert.referencesLinks,
    ethereumAlignmentNotes: body.ethereumAlignmentNotes !== undefined ? body.ethereumAlignmentNotes : expert.ethereumAlignmentNotes,
    domainSlugs: Array.isArray(body.domainSlugs) ? body.domainSlugs : (body.domainSlugs !== undefined ? [] : (expert.domainSlugs ?? [])),
  };

  const filePath = path.join(CONTENT_DIR, "experts", `${slug}.json`);
  const existing = await readFile(filePath, "utf-8").catch(() => "{}");
  let existingData: Record<string, unknown> = {};
  try {
    existingData = JSON.parse(existing);
  } catch {
    // use updated only
  }
  const merged = { ...existingData, ...updated };
  await writeFile(filePath, JSON.stringify(merged, null, 2), "utf-8");
  return NextResponse.json(updated);
}
