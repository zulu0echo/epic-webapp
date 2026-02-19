import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Content is file-based. Add edges in each domain JSON file under the \"edges\" array (toSlug, edgeType)." },
    { status: 501 }
  );
}
