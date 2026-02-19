"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseJsonArray } from "@/lib/parsers";
import Link from "next/link";

type Expert = {
  id: string;
  name: string;
  affiliation: string | null;
  skillsTags: string | null;
  expertiseDomains: string | null;
  region: string | null;
  languages: string | null;
  availability: string | null;
  domainTags: { domain: { id: string; name: string } }[];
};

type MatchResult = { expertId: string; name: string; score: number; reasons: string[] };

export default function RolodexPage() {
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId");
  const opportunityId = searchParams.get("opportunityId");
  const [experts, setExperts] = useState<Expert[]>([]);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experts")
      .then((r) => r.json())
      .then(setExperts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (domainId || opportunityId) {
      const params = new URLSearchParams();
      if (domainId) params.set("domainId", domainId);
      if (opportunityId) params.set("opportunityId", opportunityId);
      fetch(`/api/experts/match?${params}`)
        .then((r) => r.json())
        .then((d) => setMatches(d.matches ?? []));
    } else {
      setMatches(null);
    }
  }, [domainId, opportunityId]);

  const filtered = q
    ? experts.filter(
        (e) =>
          e.name.toLowerCase().includes(q.toLowerCase()) ||
          (e.affiliation ?? "").toLowerCase().includes(q.toLowerCase()) ||
          parseJsonArray(e.skillsTags).some((t) => t.toLowerCase().includes(q.toLowerCase()))
      )
    : experts;

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Rolodex</h1>
      <p className="text-slate-600 mb-4">
        Experts and teams. Filter by domain or open Match from a domain/opportunity to see scored matches.
      </p>
      <div className="flex gap-4 mb-4">
        <input
          type="search"
          placeholder="Search by name, affiliation, skills..."
          className="rounded border border-slate-200 px-3 py-2 flex-1 max-w-md"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {(domainId || opportunityId) && (
          <Link
            href="/rolodex"
            className="px-3 py-2 rounded border border-slate-200 hover:bg-slate-50"
          >
            Clear match filter
          </Link>
        )}
      </div>
      {matches != null && (
        <section className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="font-semibold text-indigo-900 mb-2">Match results</h2>
          <ul className="space-y-2">
            {matches.map((m) => (
              <li key={m.expertId} className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium">{m.name}</span>
                  <span className="text-indigo-600 ml-2">score: {m.score}</span>
                </div>
                <ul className="text-sm text-slate-600">
                  {m.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Affiliation</th>
              <th className="text-left p-3 font-medium">Skills / tags</th>
              <th className="text-left p-3 font-medium">Domains</th>
              <th className="text-left p-3 font-medium">Region</th>
              <th className="text-left p-3 font-medium">Availability</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-slate-500">Loading...</td></tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-medium">{e.name}</td>
                  <td className="p-3 text-slate-600">{e.affiliation ?? "—"}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {parseJsonArray(e.skillsTags).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-xs">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    {e.domainTags.map((d) => d.domain.name).join(", ") || "—"}
                  </td>
                  <td className="p-3">{e.region ?? "—"}</td>
                  <td className="p-3">{e.availability ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
