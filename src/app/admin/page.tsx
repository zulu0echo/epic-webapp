"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";

type Domain = {
  id: string;
  name: string;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  definition: string | null;
  summary: string | null;
  challenges: string | null;
  opportunities: string | null;
  maturityLevel: string | null;
  _count?: { children: number };
};

const MATURITY_LEVELS = ["idea", "pilot", "production", "research"] as const;
const EDGE_TYPES = ["depends_on", "enables", "adjacent_to"] as const;

function parseList(value: string): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminPage() {
  const [tab, setTab] = useState<"dashboard" | "taxonomy" | "export" | "opportunities">("dashboard");
  const [exportStatus, setExportStatus] = useState("");
  const [admin, setAdmin] = useState<boolean | null>(null);

  // Dashboard: domains list
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [dashboardMessage, setDashboardMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Add domain form
  const [newDomain, setNewDomain] = useState({
    name: "",
    parentId: "",
    definition: "",
    summary: "",
    challenges: "",
    opportunities: "",
    tags: "",
    ethereumPrimitives: "",
    maturityLevel: "idea",
    valueProposition: "",
    relatedLinks: "",
  });

  // Add edge form
  const [newEdge, setNewEdge] = useState({ fromId: "", toId: "", edgeType: "depends_on" });

  // Edit domain
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const loadDomains = () => {
    setDomainsLoading(true);
    fetch("/api/domains")
      .then((r) => r.json())
      .then((data) => setDomains(Array.isArray(data) ? data : []))
      .catch(() => setDomains([]))
      .finally(() => setDomainsLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((d) => setAdmin(!!d?.admin)).catch(() => setAdmin(false));
  }, []);

  useEffect(() => {
    if (admin && tab === "dashboard") loadDomains();
  }, [admin, tab]);

  const handleExportDomains = async () => {
    setExportStatus("Exporting...");
    try {
      const res = await fetch("/api/domains");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "epic-domains.json";
      a.click();
      URL.revokeObjectURL(a.href);
      setExportStatus("Downloaded epic-domains.json");
    } catch {
      setExportStatus("Export failed");
    }
  };

  const handleExportCRM = async () => {
    setExportStatus("Exporting CRM...");
    try {
      const [inst, opp] = await Promise.all([
        fetch("/api/institutions").then((r) => r.json()),
        fetch("/api/opportunities").then((r) => r.json()),
      ]);
      const csv = [
        "Institutions",
        "id,name,type,country,status",
        ...inst.map((i: { id: string; name: string; type: string; country: string; status: string }) =>
          [i.id, i.name, i.type, i.country ?? "", i.status ?? ""].join(",")
        ),
        "",
        "Opportunities",
        "id,title,stage,priority",
        ...opp.map((o: { id: string; title: string; stage: string; priority: string }) =>
          [o.id, o.title, o.stage, o.priority ?? ""].join(",")
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "epic-crm-export.csv";
      a.click();
      URL.revokeObjectURL(a.href);
      setExportStatus("Downloaded epic-crm-export.csv");
    } catch {
      setExportStatus("Export failed");
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setDashboardMessage(null);
    const tags = parseList(newDomain.tags);
    const primitives = parseList(newDomain.ethereumPrimitives);
    let relatedLinks: { label: string; url: string }[] = [];
    try {
      if (newDomain.relatedLinks.trim()) relatedLinks = JSON.parse(newDomain.relatedLinks) as { label: string; url: string }[];
    } catch {
      setDashboardMessage({ type: "err", text: "relatedLinks must be valid JSON array of { label, url }" });
      return;
    }
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDomain.name.trim(),
          parentId: newDomain.parentId || null,
          definition: newDomain.definition || undefined,
          summary: newDomain.summary || undefined,
          challenges: newDomain.challenges || undefined,
          opportunities: newDomain.opportunities || undefined,
          tags,
          ethereumPrimitives: primitives,
          maturityLevel: newDomain.maturityLevel,
          valueProposition: newDomain.valueProposition || undefined,
          relatedLinks: relatedLinks.length ? relatedLinks : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create domain");
      }
      setDashboardMessage({ type: "ok", text: "Domain added. View it on the Map Explorer." });
      setNewDomain({
        name: "",
        parentId: "",
        definition: "",
        summary: "",
        challenges: "",
        opportunities: "",
        tags: "",
        ethereumPrimitives: "",
        maturityLevel: "idea",
        valueProposition: "",
        relatedLinks: "",
      });
      loadDomains();
    } catch (err) {
      setDashboardMessage({ type: "err", text: err instanceof Error ? err.message : "Failed to add domain" });
    }
  };

  const handleAddEdge = async (e: React.FormEvent) => {
    e.preventDefault();
    setDashboardMessage(null);
    if (!newEdge.fromId || !newEdge.toId) {
      setDashboardMessage({ type: "err", text: "Select both From and To domains." });
      return;
    }
    if (newEdge.fromId === newEdge.toId) {
      setDashboardMessage({ type: "err", text: "From and To must be different domains." });
      return;
    }
    try {
      const res = await fetch("/api/domains/edges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromId: newEdge.fromId,
          toId: newEdge.toId,
          edgeType: newEdge.edgeType,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create edge");
      }
      setDashboardMessage({ type: "ok", text: "Edge added." });
      setNewEdge({ fromId: "", toId: "", edgeType: "depends_on" });
    } catch (err) {
      setDashboardMessage({ type: "err", text: err instanceof Error ? err.message : "Failed to add edge" });
    }
  };

  const startEdit = (d: Domain) => {
    setEditingId(d.id);
    setEditForm({
      name: d.name,
      definition: d.definition ?? "",
      summary: d.summary ?? "",
      challenges: d.challenges ?? "",
      opportunities: d.opportunities ?? "",
      maturityLevel: d.maturityLevel ?? "idea",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdateDomain = async (id: string) => {
    setDashboardMessage(null);
    try {
      const res = await fetch(`/api/domains/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Update failed");
      setDashboardMessage({ type: "ok", text: "Domain updated." });
      cancelEdit();
      loadDomains();
    } catch {
      setDashboardMessage({ type: "err", text: "Failed to update domain" });
    }
  };

  const handleDeleteDomain = async (id: string) => {
    if (!confirm("Soft-delete this domain? It will be hidden from the map.")) return;
    setDashboardMessage(null);
    try {
      const res = await fetch(`/api/domains/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setDashboardMessage({ type: "ok", text: "Domain removed from map." });
      cancelEdit();
      loadDomains();
    } catch {
      setDashboardMessage({ type: "err", text: "Failed to delete domain" });
    }
  };

  if (admin === null) return <div className="epic-section max-w-4xl"><div className="epic-card p-6"><p className="text-slate-500">Loading...</p></div></div>;

  const tabs = ["dashboard", "taxonomy", "export", "opportunities"] as const;

  return (
    <div className="epic-section max-w-5xl">
      <h1 className="epic-heading-2">Admin</h1>
      {!admin ? (
        <div className="mt-4 epic-card p-4 border-amber-200 bg-amber-50/80">
          <p className="text-amber-800 mb-2">Rolodex and CRM are only visible to logged-in system admins.</p>
          <Link href="/admin/login" className="text-indigo-600 font-medium hover:underline">
            Log in as admin →
          </Link>
        </div>
      ) : (
        <div className="mt-4 epic-card p-4 bg-slate-50/80 border-slate-200 text-sm text-slate-700">
          <span className="font-medium">Admin access.</span>{" "}
          <Link href="/map" className="text-indigo-600 hover:underline">Map Explorer</Link>
          {" · "}
          <Link href="/rolodex" className="text-indigo-600 hover:underline">Rolodex</Link>
          {" · "}
          <Link href="/crm" className="text-indigo-600 hover:underline">CRM</Link>
        </div>
      )}
      <div className="mt-6 flex gap-0 border-b border-slate-200 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6 epic-card p-6">
        {tab === "dashboard" && admin && (
          <div className="space-y-8">
            {dashboardMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  dashboardMessage.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                }`}
              >
                {dashboardMessage.text}
              </div>
            )}

            <section>
              <h2 className="epic-heading-3 text-lg mb-3">Add domain to Map Explorer</h2>
              <p className="text-sm text-slate-600 mb-4">
                New domains appear in the Map Explorer taxonomy and graph. Set a parent to create a subdomain.
              </p>
              <form onSubmit={handleAddDomain} className="space-y-3 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    className="epic-input"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Digital Identity & Credentials"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Parent domain</label>
                  <select
                    className="epic-input"
                    value={newDomain.parentId}
                    onChange={(e) => setNewDomain((p) => ({ ...p, parentId: e.target.value }))}
                  >
                    <option value="">— None (top-level) —</option>
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Definition</label>
                  <textarea
                    className="epic-input min-h-[80px]"
                    value={newDomain.definition}
                    onChange={(e) => setNewDomain((p) => ({ ...p, definition: e.target.value }))}
                    placeholder="Short definition of this domain"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
                  <input
                    type="text"
                    className="epic-input"
                    value={newDomain.summary}
                    onChange={(e) => setNewDomain((p) => ({ ...p, summary: e.target.value }))}
                    placeholder="One-line summary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Challenges (paragraph)</label>
                  <textarea
                    className="epic-input min-h-[80px]"
                    value={newDomain.challenges}
                    onChange={(e) => setNewDomain((p) => ({ ...p, challenges: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Opportunities (paragraph)</label>
                  <textarea
                    className="epic-input min-h-[80px]"
                    value={newDomain.opportunities}
                    onChange={(e) => setNewDomain((p) => ({ ...p, opportunities: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="epic-input"
                      value={newDomain.tags}
                      onChange={(e) => setNewDomain((p) => ({ ...p, tags: e.target.value }))}
                      placeholder="identity, credentials, VC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ethereum primitives (comma-separated)</label>
                    <input
                      type="text"
                      className="epic-input"
                      value={newDomain.ethereumPrimitives}
                      onChange={(e) => setNewDomain((p) => ({ ...p, ethereumPrimitives: e.target.value }))}
                      placeholder="attestation, verifiable credentials"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Maturity</label>
                  <select
                    className="epic-input w-auto"
                    value={newDomain.maturityLevel}
                    onChange={(e) => setNewDomain((p) => ({ ...p, maturityLevel: e.target.value }))}
                  >
                    {MATURITY_LEVELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Value proposition (how Ethereum could be used)</label>
                  <textarea
                    className="epic-input min-h-[60px]"
                    value={newDomain.valueProposition}
                    onChange={(e) => setNewDomain((p) => ({ ...p, valueProposition: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Related links (optional JSON)</label>
                  <input
                    type="text"
                    className="epic-input font-mono text-xs"
                    value={newDomain.relatedLinks}
                    onChange={(e) => setNewDomain((p) => ({ ...p, relatedLinks: e.target.value }))}
                    placeholder='[{"label":"Example","url":"https://..."}]'
                  />
                </div>
                <button type="submit" className="epic-btn-primary">Add domain</button>
              </form>
            </section>

            <section>
              <h2 className="epic-heading-3 text-lg mb-3">Add edge between domains</h2>
              <p className="text-sm text-slate-600 mb-4">
                Edges define relationships in the map graph (e.g. “Payments depends on Identity”).
              </p>
              <form onSubmit={handleAddEdge} className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                  <select
                    className="epic-input w-56"
                    value={newEdge.fromId}
                    onChange={(e) => setNewEdge((p) => ({ ...p, fromId: e.target.value }))}
                  >
                    <option value="">Select domain</option>
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                  <select
                    className="epic-input w-56"
                    value={newEdge.toId}
                    onChange={(e) => setNewEdge((p) => ({ ...p, toId: e.target.value }))}
                  >
                    <option value="">Select domain</option>
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                  <select
                    className="epic-input w-40"
                    value={newEdge.edgeType}
                    onChange={(e) => setNewEdge((p) => ({ ...p, edgeType: e.target.value }))}
                  >
                    {EDGE_TYPES.map((t) => (
                      <option key={t} value={t}>{t.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="epic-btn-primary">Add edge</button>
              </form>
            </section>

            <section>
              <h2 className="epic-heading-3 text-lg mb-3">Domains on the map</h2>
              <p className="text-sm text-slate-600 mb-4">
                Edit or remove domains. Changes appear in Map Explorer after refresh.
              </p>
              {domainsLoading ? (
                <p className="text-slate-500">Loading...</p>
              ) : domains.length === 0 ? (
                <p className="text-slate-500">No domains yet. Add one above.</p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-3 font-medium text-slate-700">Name</th>
                        <th className="text-left p-3 font-medium text-slate-700">Parent</th>
                        <th className="text-left p-3 font-medium text-slate-700">Maturity</th>
                        <th className="text-right p-3 font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((d) => (
                        <Fragment key={d.id}>
                          <tr className="border-b border-slate-100 last:border-0">
                            <td className="p-3">
                              {editingId === d.id ? (
                                <input
                                  className="epic-input py-1.5 text-sm"
                                  value={editForm.name ?? ""}
                                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                                />
                              ) : (
                                <Link href={`/map?domainId=${d.id}`} className="text-indigo-600 hover:underline font-medium">
                                  {d.name}
                                </Link>
                              )}
                            </td>
                            <td className="p-3 text-slate-600">{d.parent?.name ?? "—"}</td>
                            <td className="p-3 text-slate-600">
                              {editingId === d.id ? (
                                <select
                                  className="epic-input py-1.5 text-sm w-28"
                                  value={editForm.maturityLevel ?? ""}
                                  onChange={(e) => setEditForm((f) => ({ ...f, maturityLevel: e.target.value }))}
                                >
                                  {MATURITY_LEVELS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                              ) : (
                                d.maturityLevel ?? "—"
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {editingId === d.id ? (
                                <span className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDomain(d.id)}
                                    className="epic-btn-primary py-1.5 text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="epic-btn-secondary py-1.5 text-xs"
                                  >
                                    Cancel
                                  </button>
                                </span>
                              ) : (
                                <span className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => startEdit(d)}
                                    className="text-indigo-600 hover:underline text-xs font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDomain(d.id)}
                                    className="text-red-600 hover:underline text-xs font-medium"
                                  >
                                    Remove
                                  </button>
                                </span>
                              )}
                            </td>
                          </tr>
                          {editingId === d.id && (
                            <tr className="bg-slate-50/80">
                              <td colSpan={4} className="p-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Definition</label>
                                    <textarea
                                      className="epic-input py-1.5 text-sm min-h-[60px]"
                                      value={editForm.definition ?? ""}
                                      onChange={(e) => setEditForm((f) => ({ ...f, definition: e.target.value }))}
                                    />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Summary</label>
                                    <input
                                      type="text"
                                      className="epic-input py-1.5 text-sm"
                                      value={editForm.summary ?? ""}
                                      onChange={(e) => setEditForm((f) => ({ ...f, summary: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Challenges</label>
                                    <textarea
                                      className="epic-input py-1.5 text-sm min-h-[60px]"
                                      value={editForm.challenges ?? ""}
                                      onChange={(e) => setEditForm((f) => ({ ...f, challenges: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Opportunities</label>
                                    <textarea
                                      className="epic-input py-1.5 text-sm min-h-[60px]"
                                      value={editForm.opportunities ?? ""}
                                      onChange={(e) => setEditForm((f) => ({ ...f, opportunities: e.target.value }))}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "taxonomy" && (
          <div>
            <p className="epic-body mb-4">
              Edit the taxonomy in the database. Use the <strong>Dashboard</strong> tab to add or edit domains and edges from the UI. Use Map Explorer to view the map.
            </p>
            <ul className="list-disc list-inside text-sm epic-body space-y-2">
              <li><strong>Add domain:</strong> POST /api/domains with name, parentId (optional), definition, summary, challenges, opportunities, tags (JSON array), ethereumPrimitives (JSON array), maturityLevel.</li>
              <li><strong>Add edge:</strong> POST /api/domains/edges with fromId, toId, edgeType (depends_on | enables | adjacent_to).</li>
              <li><strong>Edit domain:</strong> PATCH /api/domains/[id] with the fields to update.</li>
            </ul>
            <p className="mt-4 text-sm text-slate-500">
              Run <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">npm run db:studio</code> to open Prisma Studio for visual editing.
            </p>
          </div>
        )}
        {tab === "export" && (
          <div>
            <p className="epic-body mb-4">Export domains (JSON) or CRM data (CSV).</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleExportDomains} className="epic-btn-primary">
                Export domains (JSON)
              </button>
              <button onClick={handleExportCRM} className="epic-btn-secondary">
                Export CRM (CSV)
              </button>
            </div>
            {exportStatus && <p className="mt-3 text-sm text-slate-600">{exportStatus}</p>}
          </div>
        )}
        {tab === "opportunities" && (
          <div>
            <p className="epic-body mb-4">Add opportunities via API or CRM.</p>
            <Link href="/crm/opportunities" className="text-indigo-600 font-medium hover:underline">
              View opportunities →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
