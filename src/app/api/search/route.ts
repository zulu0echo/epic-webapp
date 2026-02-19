import { NextResponse } from "next/server";
import { getDomains, getInstitutions, getOpportunities, getExperts } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q || q.length < 2) {
    return NextResponse.json({
      domains: [],
      institutions: [],
      contacts: [],
      opportunities: [],
      experts: [],
    });
  }
  const [domains, institutions, opportunities, experts] = await Promise.all([
    getDomains(),
    getInstitutions(),
    getOpportunities(),
    getExperts(),
  ]);
  const match = (s: string) => s.toLowerCase().includes(q);
  return NextResponse.json({
    domains: domains.filter((d) => match(d.name)).slice(0, 20).map((d) => ({ id: d.slug, name: d.name })),
    institutions: institutions.filter((i) => match(i.name)).slice(0, 20).map((i) => ({ id: i.slug, name: i.name, type: i.type })),
    contacts: [],
    opportunities: opportunities.filter((o) => match(o.title)).slice(0, 20).map((o) => ({ id: o.slug, title: o.title, stage: o.stage ?? "long_list" })),
    experts: experts.filter((e) => match(e.name)).slice(0, 20).map((e) => ({ id: e.slug, name: e.name, affiliation: e.affiliation ?? null })),
  });
}
