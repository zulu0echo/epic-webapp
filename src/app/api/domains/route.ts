import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId") ?? undefined;
  const q = searchParams.get("q") ?? "";
  const where: { parentId?: string | null; deletedAt?: null; name?: { contains: string } } = {
    deletedAt: null,
  };
  if (parentId !== undefined) where.parentId = parentId || null;
  if (q) where.name = { contains: q };
  const list = await prisma.domain.findMany({
    where,
    include: {
      _count: { select: { children: true } },
      parent: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId, definition, summary, challenges, opportunities, ethereumPrimitives, valueProposition, relatedLinks, maturityLevel, tags } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    const domain = await prisma.domain.create({
      data: {
        name: name.trim(),
        parentId: parentId || null,
        definition: definition ?? "",
        summary: summary ?? "",
        challenges: challenges ?? "",
        opportunities: opportunities ?? "",
        ethereumPrimitives: typeof ethereumPrimitives === "string" ? ethereumPrimitives : JSON.stringify(ethereumPrimitives ?? []),
        valueProposition: valueProposition ?? "",
        relatedLinks: typeof relatedLinks === "string" ? relatedLinks : JSON.stringify(relatedLinks ?? []),
        maturityLevel: maturityLevel ?? "idea",
        tags: typeof tags === "string" ? tags : JSON.stringify(tags ?? []),
      },
    });
    return NextResponse.json(domain);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create domain" }, { status: 500 });
  }
}
