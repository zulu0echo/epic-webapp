import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const where: { deletedAt: null; stage?: string; priority?: string } = { deletedAt: null };
  if (stage) where.stage = stage;
  if (priority) where.priority = priority;
  const list = await prisma.opportunity.findMany({
    where,
    include: {
      institutions: { include: { institution: true } },
      domains: { include: { domain: { select: { id: true, name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    title, description, stage, priority, fitScore, riskNotes, budgetBand,
    nextStep, dueDate, pocFlagshipFlag, links, institutionIds, domainIds,
  } = body;
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const opportunity = await prisma.opportunity.create({
    data: {
      title: String(title),
      description: description ?? "",
      stage: stage ?? "long_list",
      priority: priority ?? "med",
      fitScore: fitScore != null ? Number(fitScore) : null,
      riskNotes: riskNotes ?? "",
      budgetBand: budgetBand ?? "",
      nextStep: nextStep ?? "",
      dueDate: dueDate ? new Date(dueDate) : null,
      pocFlagshipFlag: Boolean(pocFlagshipFlag),
      links: Array.isArray(links) ? JSON.stringify(links) : (links ?? ""),
    },
  });
  if (Array.isArray(institutionIds))
    for (const instId of institutionIds) {
      await prisma.opportunityInstitution.create({ data: { opportunityId: opportunity.id, institutionId: instId } });
    }
  if (Array.isArray(domainIds))
    for (const domId of domainIds) {
      await prisma.opportunityDomain.create({ data: { opportunityId: opportunity.id, domainId: domId } });
    }
  return NextResponse.json(opportunity);
}
