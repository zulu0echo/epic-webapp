import { NextResponse } from "next/server";
import { getExperts, getDomains, getOpportunities } from "@/lib/content";
import { matchExpertsToDomainOrOpportunity } from "@/lib/matching";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainId = searchParams.get("domainId");
  const opportunityId = searchParams.get("opportunityId");
  if (!domainId && !opportunityId) {
    return NextResponse.json({ error: "domainId or opportunityId required" }, { status: 400 });
  }
  const [experts, domains, opportunities] = await Promise.all([
    getExperts(),
    getDomains(),
    getOpportunities(),
  ]);
  const result = await matchExpertsToDomainOrOpportunity(
    { domainId: domainId ?? undefined, opportunityId: opportunityId ?? undefined },
    { experts, domains, opportunities }
  );
  return NextResponse.json(result);
}
