import { MapExplorer } from "@/components/MapExplorer";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ domainId?: string }>;
}) {
  const { domainId } = await searchParams;
  return <MapExplorer initialDomainId={domainId ?? null} />;
}
