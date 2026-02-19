"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { parseJsonArray } from "@/lib/parsers";

type RelatedLink = { label: string; url: string };

type Domain = {
  id: string;
  name: string;
  definition: string | null;
  summary: string | null;
  challenges: string | null;
  opportunities: string | null;
  ethereumPrimitives: string | null;
  valueProposition: string | null;
  relatedLinks: string | null;
  maturityLevel: string | null;
  tags: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string; name: string }[];
  outEdges?: { edgeType: string; to: { id: string; name: string } }[];
  inEdges?: { edgeType: string; from: { id: string; name: string } }[];
  experiments?: { experiment: { id: string; title: string; year: number | null; blockchainUsed: string | null; description: string | null } }[];
  opportunityLinks?: { opportunity: { id: string; title: string; stage: string } }[];
  expertDomains?: { expert: { id: string; name: string; affiliation: string | null } }[];
};

export function DomainDetailPanel({ domainId, onClose }: { domainId: string; onClose: () => void }) {
  const [domain, setDomain] = useState<Domain | null>(null);
  const [tab, setTab] = useState<"overview" | "challenges" | "opportunities" | "experiments" | "experts" | "pipeline">("overview");

  useEffect(() => {
    fetch(`/api/domains/${domainId}`)
      .then((r) => r.json())
      .then(setDomain)
      .catch(() => setDomain(null));
  }, [domainId]);

  if (!domain) {
    return (
      <div className="p-4 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/50">
        <span className="text-slate-500 text-sm">Loading...</span>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const tags = parseJsonArray(domain.tags);
  const primitives = parseJsonArray(domain.ethereumPrimitives);
  let relatedLinks: RelatedLink[] = [];
  try {
    if (domain.relatedLinks) relatedLinks = JSON.parse(domain.relatedLinks) as RelatedLink[];
  } catch {
    relatedLinks = [];
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200/80 bg-white flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-bold text-slate-900 truncate">{domain.name}</h2>
          {domain.parent && (
            <p className="text-xs text-slate-500 mt-0.5">Parent: {domain.parent.name}</p>
          )}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 shrink-0 transition-colors" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex border-b border-slate-200/80 overflow-x-auto bg-slate-50/50 px-1">
        {(["overview", "challenges", "opportunities", "experiments", "experts", "pipeline"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2.5 text-sm font-medium capitalize border-b-2 whitespace-nowrap transition-colors ${
              tab === t
                ? "border-indigo-500 text-indigo-600 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            {t === "pipeline" ? "Pipeline" : t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4 text-sm bg-white">
        {tab === "overview" && (
          <>
            <section className="mb-4">
              <h3 className="font-medium text-slate-700 mb-1">Description</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{domain.definition || domain.summary || "—"}</p>
            </section>
            {domain.summary && domain.summary !== domain.definition && (
              <section className="mb-4">
                <h3 className="font-medium text-slate-700 mb-1">Summary</h3>
                <p className="text-slate-600 whitespace-pre-wrap">{domain.summary}</p>
              </section>
            )}
            {domain.valueProposition && (
              <section className="mb-4 p-4 rounded-xl bg-indigo-50/80 border border-indigo-100">
                <h3 className="font-semibold text-indigo-800 mb-1.5">How Ethereum could be used (value prop)</h3>
                <p className="text-indigo-900/90 text-sm whitespace-pre-wrap leading-relaxed">{domain.valueProposition}</p>
              </section>
            )}
            <section className="mb-4">
              <h3 className="font-medium text-slate-700 mb-1">Maturity</h3>
              <span className="text-slate-600">{domain.maturityLevel ?? "—"}</span>
            </section>
            {tags.length > 0 && (
              <section className="mb-4">
                <h3 className="font-medium text-slate-700 mb-1">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {primitives.length > 0 && (
              <section className="mb-4">
                <h3 className="font-medium text-slate-700 mb-1">Ethereum primitives</h3>
                <div className="flex flex-wrap gap-1.5">
                  {primitives.map((p) => (
                    <span key={p} className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {relatedLinks.length > 0 && (
              <section>
                <h3 className="font-medium text-slate-700 mb-1">Use cases & case studies</h3>
                <ul className="space-y-1">
                  {relatedLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                        {link.label || link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
        {tab === "challenges" && (
          <div>
            <div className="whitespace-pre-wrap text-slate-600">{domain.challenges || "—"}</div>
            {(domain.challenges?.includes("(") || domain.challenges?.includes("World Bank") || domain.challenges?.includes("OECD")) && (
              <p className="mt-3 text-xs text-slate-500 border-t pt-2">Inline citations (e.g. World Bank, OECD, W3C) refer to public reports and standards. Full references can be added in the taxonomy.</p>
            )}
          </div>
        )}
        {tab === "opportunities" && (
          <div>
            <div className="whitespace-pre-wrap text-slate-600">{domain.opportunities || "—"}</div>
            {(domain.opportunities?.includes("(") || domain.opportunities?.includes("World Bank") || domain.opportunities?.includes("OECD")) && (
              <p className="mt-3 text-xs text-slate-500 border-t pt-2">Inline citations refer to public research and pilots. Full references can be added in the taxonomy.</p>
            )}
          </div>
        )}
        {tab === "experiments" && (
          <ul className="space-y-2">
            {(domain.experiments ?? []).length === 0 ? (
              <li className="text-slate-500">No experiments linked.</li>
            ) : (
              domain.experiments!.map(({ experiment: e }) => (
                <li key={e.id} className="epic-card p-3">
                  <span className="font-medium text-slate-800">{e.title}</span>
                  {e.year != null && <span className="text-slate-500 ml-1">({e.year})</span>}
                  {e.blockchainUsed && <span className="text-slate-500 ml-1">· {e.blockchainUsed}</span>}
                  {e.description && <p className="text-slate-600 mt-1 text-xs">{e.description}</p>}
                </li>
              ))
            )}
          </ul>
        )}
        {tab === "experts" && (
          <ul className="space-y-2">
            {(domain.expertDomains ?? []).length === 0 ? (
              <li className="text-slate-500">No experts linked. Use Rolodex → Match to find experts for this domain.</li>
            ) : (
              domain.expertDomains!.map(({ expert: e }) => (
                <li key={e.id} className="epic-card p-3">
                  <span className="font-medium text-slate-800">{e.name}</span>
                  {e.affiliation && <span className="text-slate-500 ml-1">· {e.affiliation}</span>}
                </li>
              ))
            )}
          </ul>
        )}
        {tab === "pipeline" && (
          <ul className="space-y-2">
            {(domain.opportunityLinks ?? []).length === 0 ? (
              <li className="text-slate-500">No opportunities linked.</li>
            ) : (
              domain.opportunityLinks!.map(({ opportunity: o }) => (
                <li key={o.id} className="epic-card p-3">
                  <a href={`/crm/opportunities?id=${o.id}`} className="font-medium text-indigo-600 hover:underline">
                    {o.title}
                  </a>
                  <span className="text-slate-500 ml-1">· {o.stage}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
