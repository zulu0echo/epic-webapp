import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const status = searchParams.get("status") ?? "";
  const where: { deletedAt: null; name?: { contains: string }; type?: string; status?: string } = { deletedAt: null };
  if (q) where.name = { contains: q };
  if (type) where.type = type;
  if (status) where.status = status;
  const list = await prisma.institution.findMany({
    where,
    include: { _count: { select: { contacts: true, opportunities: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, type, country, region, description, alignmentNotes, relationshipOwner, status, tags } = body;
  if (!name || !type) {
    return NextResponse.json({ error: "name and type required" }, { status: 400 });
  }
  const institution = await prisma.institution.create({
    data: {
      name: String(name),
      type: String(type),
      country: country ?? "",
      region: region ?? "",
      description: description ?? "",
      alignmentNotes: alignmentNotes ?? "",
      relationshipOwner: relationshipOwner ?? "",
      status: status ?? "prospect",
      tags: Array.isArray(tags) ? JSON.stringify(tags) : (tags ?? ""),
    },
  });
  return NextResponse.json(institution);
}
