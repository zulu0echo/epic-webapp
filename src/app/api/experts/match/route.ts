import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { matchExpertsToDomainOrOpportunity } from "@/lib/matching";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainId = searchParams.get("domainId");
  const opportunityId = searchParams.get("opportunityId");
  if (!domainId && !opportunityId) {
    return NextResponse.json({ error: "domainId or opportunityId required" }, { status: 400 });
  }
  const result = await matchExpertsToDomainOrOpportunity(prisma, { domainId: domainId ?? undefined, opportunityId: opportunityId ?? undefined });
  return NextResponse.json(result);
}
