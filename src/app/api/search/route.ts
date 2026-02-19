import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q || q.length < 2) {
    return NextResponse.json({ domains: [], institutions: [], contacts: [], opportunities: [], experts: [] });
  }
  const [domains, institutions, contacts, opportunities, experts] = await Promise.all([
    prisma.domain.findMany({
      where: { deletedAt: null, name: { contains: q } },
      select: { id: true, name: true },
      take: 20,
    }),
    prisma.institution.findMany({
      where: { deletedAt: null, name: { contains: q } },
      select: { id: true, name: true, type: true },
      take: 20,
    }),
    prisma.contact.findMany({
      where: { deletedAt: null, name: { contains: q } },
      select: { id: true, name: true, institutionId: true },
      take: 20,
    }),
    prisma.opportunity.findMany({
      where: { deletedAt: null, title: { contains: q } },
      select: { id: true, title: true, stage: true },
      take: 20,
    }),
    prisma.expert.findMany({
      where: { deletedAt: null, name: { contains: q } },
      select: { id: true, name: true, affiliation: true },
      take: 20,
    }),
  ]);
  return NextResponse.json({
    domains,
    institutions,
    contacts,
    opportunities,
    experts,
  });
}
