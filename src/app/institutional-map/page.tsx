import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

export const metadata = {
  title: "Ethereum Institutional Data Map — EPIC",
  description:
    "An interactive world map of Ethereum data for institutions: validator decentralization, stablecoin dollar-access demand, and regulatory status — with a source link on every data point.",
};

const InstitutionalMap = dynamic(() => import("@/components/InstitutionalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-slate-50/80">
      <p className="font-medium text-slate-600">Loading map…</p>
    </div>
  ),
});

export default function InstitutionalMapPage() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <details className="group shrink-0 border-b border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer items-center gap-3 px-6 py-2.5">
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Ethereum Foundation · EPIC
            </span>
            <h1 className="truncate text-lg font-extrabold text-epic-ink sm:text-xl">
              Ethereum Institutional Data Map
            </h1>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
            About
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          </span>
        </summary>
        <p className="epic-body max-w-3xl px-6 pb-4 text-sm">
          Ethereum data demonstrated on an interactive world map, framed for institutions. Toggle
          between network decentralization, stablecoin dollar-access demand, and regulatory status.
          Every value links back to its primary source; modeled layers are labeled as such.
        </p>
      </details>
      <InstitutionalMap />
    </div>
  );
}
