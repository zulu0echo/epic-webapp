import { NextResponse } from "next/server";
import { LAYERS } from "@/lib/dataviz";

// The map currently reads bundled snapshot data (see src/lib/dataviz/data.ts).
// This handler exposes the same shape over HTTP so the data source can move to
// continuous live ingestion (DefiLlama, World Bank, Rated, regulatory trackers)
// without any change to the client. When live fetching lands here, wrap each
// upstream call in try/catch and fall back to LAYERS, then set a real revalidate.
export const revalidate = 3600; // seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("layer");
  if (id) {
    const layer = LAYERS.find((l) => l.id === id);
    if (!layer) {
      return NextResponse.json({ error: `Unknown layer: ${id}` }, { status: 404 });
    }
    return NextResponse.json(layer);
  }
  return NextResponse.json({ layers: LAYERS });
}

export async function POST() {
  return NextResponse.json(
    { error: "Metrics are snapshot/derived data. Updates come from the ingestion pipeline, not this endpoint." },
    { status: 501 },
  );
}
