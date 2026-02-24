import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CarbonMRVSidebar } from "./CarbonMRVSidebar";
import { PoCMobileNav } from "./PoCMobileNav";

export const metadata = {
  title: "Carbon MRV PoC — Proof of concepts — EPIC",
  description:
    "Carbon MRV proof of concept: dataset commitments, verifier attestations, registry. Docs, spec, and source on GitHub.",
};

export default function CarbonMRVPocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="epic-section-wide flex flex-1 gap-8 py-6">
        <aside className="w-56 shrink-0 hidden md:block">
          <CarbonMRVSidebar />
        </aside>
        <main className="min-w-[min(100%,320px)] flex-1">
          <PoCMobileNav />
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 -ml-2 hover:bg-slate-100 hover:text-slate-700 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
              Map Explorer
            </Link>
            <span className="text-slate-300" aria-hidden>
              /
            </span>
            <Link
              href="/proof-of-concepts/carbon-mrv"
              className="rounded-md px-2 py-1 hover:bg-slate-100 hover:text-slate-700 hover:underline"
            >
              Carbon MRV PoC
            </Link>
          </div>
          <div className="max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
