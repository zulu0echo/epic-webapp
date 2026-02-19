import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type TreeNode = { id: string; name: string; children?: TreeNode[] };

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
  const filterTree = (node: TreeNode): TreeNode | null => {
    const match = filter(node.name);
    const children = (node.children?.map((c) => filterTree(c)).filter(Boolean) ?? []) as TreeNode[];
    if (match || children.length) return { id: node.id, name: node.name, children };
    return null;
  };
  const filtered = roots.map((r) => filterTree(r as TreeNode)).filter(Boolean);
  return NextResponse.json(filtered);
}
