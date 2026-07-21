"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type SearchPageItem = {
  type: "domain" | "opportunity" | "expert" | "institution" | "blog" | "page";
  title: string;
  href: string;
  preview: string;
};

type SearchResult = {
  domains: { id: string; name: string }[];
  institutions: { id: string; name: string; type: string }[];
  contacts: { id: string; name: string }[];
  opportunities: { id: string; title: string; stage: string }[];
  experts: { id: string; name: string; affiliation: string | null }[];
  pages: SearchPageItem[];
};

const TYPE_LABEL: Record<SearchPageItem["type"], string> = {
  domain: "Domain",
  opportunity: "Opportunity",
  expert: "Expert",
  institution: "Institution",
  blog: "Blog",
  page: "Page",
};

export function GlobalSearch({ compact = false }: { compact?: boolean } = {}) {
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

  const pages = results?.pages ?? [];
  const hasResults = pages.length > 0;

  return (
    <div ref={ref} className={compact ? "relative w-full" : "relative w-72 sm:w-80"}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          placeholder={compact ? "Search..." : "Search domains, opportunities, experts..."}
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
        <div className="absolute top-full left-0 right-0 mt-2 epic-card z-50 max-h-[min(24rem,70vh)] overflow-auto py-1 shadow-epic-lg min-w-[20rem]">
          {!results ? (
            <div className="px-4 py-3 text-slate-500 text-sm">Searching...</div>
          ) : !hasResults ? (
            <div className="px-4 py-3 text-slate-500 text-sm">No results</div>
          ) : (
            <ul className="py-1" role="list">
              {pages.map((item, idx) => (
                <li key={`${item.type}-${item.href}-${idx}`}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {TYPE_LABEL[item.type]}
                    </span>
                    <p className="font-medium text-slate-800 text-sm mt-0.5">{item.title}</p>
                    <p className="text-slate-600 text-xs mt-1 line-clamp-2">{item.preview}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
