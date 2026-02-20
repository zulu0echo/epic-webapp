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

const STAGES = ["long_list", "screening", "exploration", "evaluation", "engagement", "post_engagement"] as const;

function parseCommaList(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function CRMPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [addStatus, setAddStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    stage: "long_list",
    priority: "",
    domainSlugs: "",
    institutionSlugs: "",
    nextStep: "",
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([fetch("/api/institutions").then((r) => r.json()), fetch("/api/opportunities").then((r) => r.json())])
      .then(([inst, opp]) => {
        setInstitutions(Array.isArray(inst) ? inst : []);
        setOpportunities(Array.isArray(opp) ? opp : []);
      })
      .catch(() => {
        setInstitutions([]);
        setOpportunities([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setAdmin(!!d?.admin))
      .catch(() => setAdmin(false));
  }, []);

  const handleAddOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatus("saving");
    fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: addForm.title.trim(),
        description: addForm.description.trim() || undefined,
        stage: addForm.stage,
        priority: addForm.priority.trim() || undefined,
        domainSlugs: parseCommaList(addForm.domainSlugs),
        institutionSlugs: parseCommaList(addForm.institutionSlugs),
        nextStep: addForm.nextStep.trim() || undefined,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed"))))
      .then(() => {
        setAddStatus("done");
        setAddForm({ title: "", description: "", stage: "long_list", priority: "", domainSlugs: "", institutionSlugs: "", nextStep: "" });
        loadData();
        setTimeout(() => setAddPanelOpen(false), 600);
      })
      .catch(() => setAddStatus("error"));
  };

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

      {admin && (
        <div className="mb-6 epic-card p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-800">Add opportunity</span>
            <button
              type="button"
              onClick={() => setAddPanelOpen((v) => !v)}
              className="px-3 py-1.5 text-sm rounded-epic border border-epic-border bg-white hover:bg-slate-50"
            >
              {addPanelOpen ? "Close" : "Add opportunity"}
            </button>
          </div>
          {addPanelOpen && (
            <form onSubmit={handleAddOpportunity} className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Title *</label>
                <input
                  type="text"
                  required
                  value={addForm.title}
                  onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="e.g. National digital ID pilot"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Description</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                  className="epic-input py-1.5 text-sm min-h-[80px]"
                  placeholder="Brief description of the opportunity"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Stage</label>
                <select
                  value={addForm.stage}
                  onChange={(e) => setAddForm((f) => ({ ...f, stage: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Priority</label>
                <input
                  type="text"
                  value={addForm.priority}
                  onChange={(e) => setAddForm((f) => ({ ...f, priority: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="e.g. high, medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Domain slugs (comma-separated)</label>
                <input
                  type="text"
                  value={addForm.domainSlugs}
                  onChange={(e) => setAddForm((f) => ({ ...f, domainSlugs: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="digital-identity-and-credentials, registries-and-records"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Institution slugs (comma-separated)</label>
                <input
                  type="text"
                  value={addForm.institutionSlugs}
                  onChange={(e) => setAddForm((f) => ({ ...f, institutionSlugs: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="national-digital-identity-authority"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Next step</label>
                <input
                  type="text"
                  value={addForm.nextStep}
                  onChange={(e) => setAddForm((f) => ({ ...f, nextStep: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="e.g. Scoping call"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <button type="submit" disabled={addStatus === "saving"} className="epic-btn-primary text-sm py-1.5 px-3">
                  {addStatus === "saving" ? "Saving…" : "Add opportunity"}
                </button>
                {addStatus === "done" && <span className="text-sm text-green-600">Added.</span>}
                {addStatus === "error" && <span className="text-sm text-red-600">Failed to add.</span>}
              </div>
            </form>
          )}
        </div>
      )}

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
