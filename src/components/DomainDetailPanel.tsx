"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { parseJsonArray } from "@/lib/parsers";
import { cn } from "@/lib/cn";
import { getSectorTheme } from "@/lib/sectorColors";

type RelatedLink = { label: string; url: string };

type Domain = {
  id: string;
  name: string;
  rootName?: string | null;
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
  experiments?: { id: string; title: string; year: number | null; blockchainUsed: string | null; description: string | null; url?: string | null }[];
  opportunityLinks?: { opportunity: { id: string; title: string; stage: string } }[];
  expertDomains?: { expert: { id: string; name: string; affiliation: string | null } }[];
  references?: { label: string; url: string }[];
  selfSovereignUser?: string | null;
};

export function DomainDetailPanel({
  domainId,
  onClose,
  onSelectNode,
}: {
  domainId: string;
  onClose: () => void;
  onSelectNode?: (id: string) => void;
}) {
  const [domain, setDomain] = useState<Domain | null>(null);
  const [tab, setTab] = useState<"overview" | "challenges" | "opportunities" | "experiments" | "experts">("overview");

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
  const theme = getSectorTheme(domain.id ?? domainId ?? "");
  let relatedLinks: RelatedLink[] = [];
  try {
    if (domain.relatedLinks) relatedLinks = JSON.parse(domain.relatedLinks) as RelatedLink[];
  } catch {
    relatedLinks = [];
  }

  return (
    <div className="flex flex-col h-full">
      <div className={cn("p-4 border-b flex items-start justify-between gap-2", theme.lightBg, theme.lightBorder)}>
        <div className="min-w-0">
          <h2 className={cn("font-serif text-lg font-bold truncate", theme.text)}>{domain.name}</h2>
          {domain.parent && (
            <p className="text-xs text-slate-500 mt-0.5">Parent: {domain.parent.name}</p>
          )}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 shrink-0 transition-colors" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex border-b border-slate-200/80 overflow-x-auto bg-slate-50/50 px-1">
        {(["overview", "challenges", "opportunities", "experiments", "experts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-2.5 text-sm font-medium capitalize border-b-2 whitespace-nowrap transition-colors",
              tab === t
                ? "bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50",
              tab === t && theme.border,
              tab === t && theme.accent
            )}
          >
            {t === "experiments" ? "Proof of concepts" : t === "experts" ? "Self-sovereign user" : t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4 text-sm bg-white" aria-live="polite" aria-label="Domain details">
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
              <section className={cn("mb-4 p-4 rounded-xl border", theme.lightBg, theme.lightBorder)}>
                <h3 className={cn("font-semibold mb-1.5", theme.text)}>How Ethereum could be used (value prop)</h3>
                <p className={cn("text-sm whitespace-pre-wrap leading-relaxed opacity-90", theme.text)}>{domain.valueProposition}</p>
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
                    <span key={p} className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium", theme.lightBg, theme.accent)}>
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {relatedLinks.length > 0 && (
              <section className="mb-4">
                <h3 className="font-medium text-slate-700 mb-1">Use cases & case studies</h3>
                <ul className="space-y-1">
                  {relatedLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className={cn("text-sm hover:underline", theme.accent, theme.accentHover)}>
                        {link.label || link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {(domain.references?.length ?? 0) > 0 && (
              <section className="mb-4">
                <h3 className="font-medium text-slate-700 mb-1">References & proof of concepts</h3>
                <ul className="space-y-1">
                  {domain.references!.map((ref, i) => (
                    <li key={i}>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className={cn("text-sm hover:underline", theme.accent, theme.accentHover)}>
                        {ref.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {((domain.outEdges?.length ?? 0) + (domain.inEdges?.length ?? 0)) > 0 && (
              <section className="mb-4">
                <h3 className="font-medium text-slate-700 mb-1">Related domains</h3>
                <ul className="space-y-1">
                  {(domain.outEdges ?? []).map((e) => (
                    <li key={`out-${e.to.id}`}>
                      {onSelectNode ? (
                        <button
                          type="button"
                          onClick={() => onSelectNode(e.to.id)}
                          className={cn("text-sm text-left hover:underline", theme.accent, theme.accentHover)}
                        >
                          → {e.to.name}
                        </button>
                      ) : (
                        <a href={`/domains/${e.to.id}`} className={cn("text-sm hover:underline", theme.accent, theme.accentHover)}>
                          → {e.to.name}
                        </a>
                      )}
                      {e.edgeType && <span className="text-slate-400 text-xs ml-1">({e.edgeType.replace("_", " ")})</span>}
                    </li>
                  ))}
                  {(domain.inEdges ?? []).map((e) => (
                    <li key={`in-${e.from.id}`}>
                      {onSelectNode ? (
                        <button
                          type="button"
                          onClick={() => onSelectNode(e.from.id)}
                          className={cn("text-sm text-left hover:underline", theme.accent, theme.accentHover)}
                        >
                          ← {e.from.name}
                        </button>
                      ) : (
                        <a href={`/domains/${e.from.id}`} className={cn("text-sm hover:underline", theme.accent, theme.accentHover)}>
                          ← {e.from.name}
                        </a>
                      )}
                      {e.edgeType && <span className="text-slate-400 text-xs ml-1">({e.edgeType.replace("_", " ")})</span>}
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
              <li className="text-slate-500">No proof of concepts linked.</li>
            ) : (
              domain.experiments!.map((e) => (
                <li key={e.id} className="epic-card p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {e.url ? (
                      e.url.startsWith("/") ? (
                        <Link href={e.url} className={cn("font-medium hover:underline", theme.accent, theme.accentHover)}>
                          {e.title}
                        </Link>
                      ) : (
                        <a href={e.url} target="_blank" rel="noopener noreferrer" className={cn("font-medium hover:underline", theme.accent, theme.accentHover)}>
                          {e.title}
                        </a>
                      )
                    ) : (
                      <span className="font-medium text-slate-800">{e.title}</span>
                    )}
                    {e.url === "/proof-of-concepts/carbon-mrv" && (
                      <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                        built by PSE
                      </span>
                    )}
                  </div>
                  {e.year != null && <span className="text-slate-500 ml-1 text-xs">({e.year})</span>}
                  {e.blockchainUsed && <span className="text-slate-500 ml-1 text-xs">· {e.blockchainUsed}</span>}
                  {e.description && <p className="text-slate-600 mt-1 text-xs">{e.description}</p>}
                </li>
              ))
            )}
          </ul>
        )}
        {tab === "experts" && (
          <div className="text-slate-600 text-sm whitespace-pre-wrap">
            {domain.selfSovereignUser ? (
              <>
                <h3 className="font-medium text-slate-700 mb-2">Self-sovereign user in this domain</h3>
                <p>{domain.selfSovereignUser}</p>
              </>
            ) : (
              <p className="text-slate-500">Self-sovereign user not yet documented for this domain.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
