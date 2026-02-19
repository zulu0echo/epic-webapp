import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const roots = await prisma.domain.findMany({
    where: { parentId: null, deletedAt: null },
    include: {
      children: {
        where: { deletedAt: null },
        include: {
          children: { where: { deletedAt: null }, select: { id: true, name: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });
  const filter = (name: string) =>
    !q || name.toLowerCase().includes(q.toLowerCase());
  const filterTree = (node: { id: string; name: string; children?: { id: string; name: string; children?: unknown[] }[] }) => {
    const match = filter(node.name);
    const children = node.children?.map((c) => filterTree(c as never)).filter(Boolean) ?? [];
    if (match || children.length) return { id: node.id, name: node.name, children };
    return null;
  };
  const filtered = roots.map((r) => filterTree(r as never)).filter(Boolean);
  return NextResponse.json(filtered);
}
