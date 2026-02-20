import dynamic from "next/dynamic";

const MapExplorer = dynamic(() => import("@/components/MapExplorer").then((m) => m.MapExplorer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center flex-1 min-h-0 bg-slate-50/80">
      <p className="text-slate-600 font-medium">Loading map…</p>
    </div>
  ),
});

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ domainId?: string }>;
}) {
  const { domainId } = await searchParams;
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden">
      <MapExplorer initialDomainId={domainId ?? null} />
    </div>
  );
}
