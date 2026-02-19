"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type SearchResult = {
  domains: { id: string; name: string }[];
  institutions: { id: string; name: string; type: string }[];
  contacts: { id: string; name: string }[];
  opportunities: { id: string; title: string; stage: string }[];
  experts: { id: string; name: string; affiliation: string | null }[];
};

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.length < 2) {
      setResults(null);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then(setResults);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results && (
    results.domains.length +
    results.institutions.length +
    results.contacts.length +
    results.opportunities.length +
    results.experts.length
  ) > 0;

  return (
    <div ref={ref} className="relative w-72">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search domains, opportunities, experts..."
          className="epic-input w-full pl-9 pr-3 py-2"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && q.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 epic-card z-50 max-h-80 overflow-auto py-1 shadow-epic-lg">
          {!results ? (
            <div className="px-4 py-3 text-slate-500 text-sm">Searching...</div>
          ) : !hasResults ? (
            <div className="px-4 py-3 text-slate-500 text-sm">No results</div>
          ) : (
            <div className="py-1">
              {results.domains.length > 0 && (
                <div className="mb-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">Domains</div>
                  {results.domains.slice(0, 5).map((d) => (
                    <Link
                      key={d.id}
                      href={`/map?domainId=${d.id}`}
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}
              {results.opportunities.length > 0 && (
                <div className="mb-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">Opportunities</div>
                  {results.opportunities.slice(0, 5).map((o) => (
                    <Link
                      key={o.id}
                      href={`/crm/opportunities?id=${o.id}`}
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {o.title}
                    </Link>
                  ))}
                </div>
              )}
              {results.experts.length > 0 && (
                <div className="mb-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">Experts</div>
                  {results.experts.slice(0, 5).map((e) => (
                    <Link
                      key={e.id}
                      href="/rolodex"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {e.name} {e.affiliation ? <span className="text-slate-500">· {e.affiliation}</span> : ""}
                    </Link>
                  ))}
                </div>
              )}
              {results.institutions.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">Institutions</div>
                  {results.institutions.slice(0, 5).map((i) => (
                    <Link
                      key={i.id}
                      href="/crm"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {i.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
