import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const domain = await prisma.domain.findFirst({
    where: { id, deletedAt: null },
    include: {
      parent: { select: { id: true, name: true } },
      children: { where: { deletedAt: null }, select: { id: true, name: true } },
      outEdges: {
        where: { deletedAt: null },
        include: { to: { select: { id: true, name: true } } },
      },
      inEdges: {
        where: { deletedAt: null },
        include: { from: { select: { id: true, name: true } } },
      },
      experiments: { include: { experiment: true } },
      opportunityLinks: { include: { opportunity: true } },
      expertDomains: { include: { expert: true } },
    },
  });
  if (!domain) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(domain);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const allowed = [
    "name", "parentId", "definition", "summary", "challenges", "opportunities",
    "ethereumPrimitives", "valueProposition", "relatedLinks", "maturityLevel", "tags",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
  if (Array.isArray(data.ethereumPrimitives)) data.ethereumPrimitives = JSON.stringify(data.ethereumPrimitives);
  if (Array.isArray(data.relatedLinks)) data.relatedLinks = JSON.stringify(data.relatedLinks);
  const domain = await prisma.domain.update({
    where: { id },
    data: data as never,
  });
  return NextResponse.json(domain);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.domain.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
