"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  stage: string;
  priority: string | null;
  fitScore: number | null;
  budgetBand: string | null;
  nextStep: string | null;
  dueDate: string | null;
  pocFlagshipFlag: boolean;
  institutions: { institution: { id: string; name: string } }[];
  domains: { domain: { id: string; name: string } }[];
};

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stageFilter, setStageFilter] = useState("");

  useEffect(() => {
    const url = stageFilter ? `/api/opportunities?stage=${stageFilter}` : "/api/opportunities";
    fetch(url).then((r) => r.json()).then(setOpportunities);
  }, [stageFilter]);

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Opportunities</h1>
      <div className="flex gap-2 mb-4">
        <select
          className="rounded border border-slate-200 px-3 py-2 text-sm"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="">All stages</option>
          <option value="long_list">Long list</option>
          <option value="screening">Screening</option>
          <option value="exploration">Exploration</option>
          <option value="evaluation">Evaluation</option>
          <option value="engagement">Engagement</option>
          <option value="post_engagement">Post-engagement</option>
        </select>
        <Link
          href="/admin?tab=opportunities"
          className="px-3 py-2 rounded border border-slate-200 bg-white hover:bg-slate-50 text-sm"
        >
          Add opportunity
        </Link>
      </div>
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Stage</th>
              <th className="text-left p-3 font-medium">Priority</th>
              <th className="text-left p-3 font-medium">Fit</th>
              <th className="text-left p-3 font-medium">Institutions</th>
              <th className="text-left p-3 font-medium">Domains</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((o) => (
              <tr
                key={o.id}
                className={`border-b border-slate-100 hover:bg-slate-50 ${
                  highlightId === o.id ? "bg-indigo-50" : ""
                }`}
              >
                <td className="p-3">
                  <Link href={`/crm/opportunities?id=${o.id}`} className="font-medium text-indigo-600 hover:underline">
                    {o.title}
                  </Link>
                  {o.pocFlagshipFlag && (
                    <span className="ml-1 text-xs bg-amber-100 text-amber-800 px-1 rounded">Flagship</span>
                  )}
                </td>
                <td className="p-3">{o.stage}</td>
                <td className="p-3">{o.priority ?? "—"}</td>
                <td className="p-3">{o.fitScore != null ? o.fitScore : "—"}</td>
                <td className="p-3">
                  {o.institutions.map((i) => i.institution.name).join(", ") || "—"}
                </td>
                <td className="p-3">
                  {o.domains.map((d) => d.domain.name).join(", ") || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-6xl"><p className="text-slate-500">Loading...</p></div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
