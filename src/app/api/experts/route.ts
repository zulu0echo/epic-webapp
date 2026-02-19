import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const where: { deletedAt: null; name?: { contains: string } } = { deletedAt: null };
  if (q) where.name = { contains: q };
  const list = await prisma.expert.findMany({
    where,
    include: { domainTags: { include: { domain: { select: { id: true, name: true } } } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name, affiliation, expertiseDomains, skillsTags, region, languages,
    ethereumAlignmentNotes, conflicts, availability, contactPath, referencesLinks, domainIds,
  } = body;
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const expert = await prisma.expert.create({
    data: {
      name: String(name),
      affiliation: affiliation ?? "",
      expertiseDomains: Array.isArray(expertiseDomains) ? JSON.stringify(expertiseDomains) : (expertiseDomains ?? ""),
      skillsTags: Array.isArray(skillsTags) ? JSON.stringify(skillsTags) : (skillsTags ?? ""),
      region: region ?? "",
      languages: Array.isArray(languages) ? JSON.stringify(languages) : (languages ?? ""),
      ethereumAlignmentNotes: ethereumAlignmentNotes ?? "",
      conflicts: conflicts ?? "",
      availability: availability ?? "",
      contactPath: contactPath ?? "",
      referencesLinks: Array.isArray(referencesLinks) ? JSON.stringify(referencesLinks) : (referencesLinks ?? ""),
    },
  });
  if (Array.isArray(domainIds))
    for (const domId of domainIds) {
      await prisma.expertDomain.create({ data: { expertId: expert.id, domainId: domId } });
    }
  return NextResponse.json(expert);
}
