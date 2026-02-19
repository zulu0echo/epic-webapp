import { NextResponse } from "next/server";
import { getInstitutions } from "@/lib/content";
import { institutionToApiShape } from "@/lib/content/normalize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const type = searchParams.get("type") ?? "";
  const status = searchParams.get("status") ?? "";
  const list = await getInstitutions();
  let filtered = list;
  if (q) filtered = filtered.filter((i) => i.name.toLowerCase().includes(q));
  if (type) filtered = filtered.filter((i) => i.type === type);
  if (status) filtered = filtered.filter((i) => i.status === status);
  const withCount = filtered.map((i) => ({
    ...institutionToApiShape(i),
    _count: { contacts: 0, opportunities: 0 },
  }));
  return NextResponse.json(withCount);
}

export async function POST() {
  return NextResponse.json(
    { error: "Content is file-based. Add JSON files in content/institutions/." },
    { status: 501 }
  );
}
