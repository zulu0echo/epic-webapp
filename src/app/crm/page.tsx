"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, User, Briefcase } from "lucide-react";

type Institution = {
  id: string;
  name: string;
  type: string;
  country: string | null;
  status: string | null;
  _count: { contacts: number; opportunities: number };
};

type Opportunity = {
  id: string;
  title: string;
  stage: string;
  priority: string | null;
  fitScore: number | null;
  nextStep: string | null;
  updatedAt: string;
};

export default function CRMPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/institutions").then((r) => r.json()), fetch("/api/opportunities").then((r) => r.json())])
      .then(([inst, opp]) => {
        setInstitutions(inst);
        setOpportunities(opp);
      })
      .finally(() => setLoading(false));
  }, []);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recent = opportunities.filter((o) => new Date(o.updatedAt) >= weekAgo);
  const stale = opportunities.filter((o) => new Date(o.updatedAt) < weekAgo);

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">CRM</h1>
      <p className="text-slate-600 mb-6">
        Institutions, contacts, and opportunities. Use the weekly review to prioritize follow-up.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/crm?view=institutions"
          className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-3"
        >
          <Building2 className="w-8 h-8 text-indigo-500" />
          <div>
            <div className="font-semibold">Institutions</div>
            <div className="text-2xl font-bold text-slate-700">{institutions.length}</div>
          </div>
        </Link>
        <Link
          href="/crm/opportunities"
          className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-3"
        >
          <Briefcase className="w-8 h-8 text-indigo-500" />
          <div>
            <div className="font-semibold">Opportunities</div>
            <div className="text-2xl font-bold text-slate-700">{opportunities.length}</div>
          </div>
        </Link>
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
          <User className="w-8 h-8 text-slate-400" />
          <div>
            <div className="font-semibold">Contacts</div>
            <div className="text-slate-500">Via institutions</div>
          </div>
        </div>
      </div>
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Weekly review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-white">
            <h3 className="font-medium text-slate-700 mb-2">Updated this week</h3>
            {loading ? (
              <p className="text-slate-500 text-sm">Loading...</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {recent.length === 0 ? (
                  <li className="text-slate-500">None</li>
                ) : (
                  recent.slice(0, 10).map((o) => (
                    <li key={o.id}>
                      <Link href={`/crm/opportunities?id=${o.id}`} className="text-indigo-600 hover:underline">
                        {o.title}
                      </Link>
                      <span className="text-slate-500 ml-1">· {o.stage}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
          <div className="p-4 rounded-lg border border-slate-200 bg-white">
            <h3 className="font-medium text-slate-700 mb-2">Stale (no update in 7+ days)</h3>
            <ul className="space-y-1 text-sm">
              {stale.length === 0 ? (
                <li className="text-slate-500">None</li>
              ) : (
                stale.slice(0, 10).map((o) => (
                  <li key={o.id}>
                    <Link href={`/crm/opportunities?id=${o.id}`} className="text-indigo-600 hover:underline">
                      {o.title}
                    </Link>
                    <span className="text-slate-500 ml-1">· {o.stage}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Institutions</h2>
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Country</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Contacts</th>
                <th className="text-left p-3 font-medium">Opportunities</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-medium">{i.name}</td>
                  <td className="p-3">{i.type}</td>
                  <td className="p-3">{i.country ?? "—"}</td>
                  <td className="p-3">{i.status ?? "—"}</td>
                  <td className="p-3">{i._count.contacts}</td>
                  <td className="p-3">{i._count.opportunities}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
