import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { fromId, toId, edgeType } = body;
  if (!fromId || !toId || !edgeType) {
    return NextResponse.json({ error: "fromId, toId, edgeType required" }, { status: 400 });
  }
  const valid = ["depends_on", "enables", "adjacent_to"];
  if (!valid.includes(edgeType)) {
    return NextResponse.json({ error: "edgeType must be depends_on, enables, or adjacent_to" }, { status: 400 });
  }
  const edge = await prisma.domainEdge.create({
    data: { fromId, toId, edgeType },
  });
  return NextResponse.json(edge);
}
