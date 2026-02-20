"use client";

import { Suspense, useEffect, useState } from "react";
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

type ExpertFormState = {
  name: string;
  affiliation: string;
  skillsTags: string;
  domainSlugs: string;
  region: string;
  contactPath: string;
};

const emptyForm: ExpertFormState = {
  name: "",
  affiliation: "",
  skillsTags: "",
  domainSlugs: "",
  region: "",
  contactPath: "",
};

function RolodexContent() {
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId");
  const opportunityId = searchParams.get("opportunityId");
  const [experts, setExperts] = useState<Expert[]>([]);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExpertFormState>(emptyForm);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const loadExperts = () => {
    fetch("/api/experts")
      .then((r) => r.json())
      .then((data) => setExperts(Array.isArray(data) ? data : []))
      .catch(() => setExperts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadExperts();
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setAdmin(!!d?.admin))
      .catch(() => setAdmin(false));
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

  useEffect(() => {
    if (editingId) {
      fetch(`/api/experts/${editingId}`)
        .then((r) => r.json())
        .then((ex) => {
          setForm({
            name: ex.name ?? "",
            affiliation: ex.affiliation ?? "",
            skillsTags: Array.isArray(ex.skillsTags) ? ex.skillsTags.join(", ") : (ex.skillsTags ?? ""),
            domainSlugs: (ex.domainSlugs ?? []).join(", "),
            region: ex.region ?? "",
            contactPath: ex.contactPath ?? "",
          });
        })
        .catch(() => setForm(emptyForm));
    } else {
      setForm(emptyForm);
    }
  }, [editingId]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPanelOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setSubmitStatus("idle");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("saving");
    const payload = {
      name: form.name.trim(),
      affiliation: form.affiliation.trim() || undefined,
      skillsTags: form.skillsTags.trim() ? form.skillsTags.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      domainSlugs: form.domainSlugs.trim() ? form.domainSlugs.split(",").map((s) => s.trim()).filter(Boolean) : [],
      region: form.region.trim() || undefined,
      contactPath: form.contactPath.trim() || undefined,
    };

    if (editingId) {
      fetch(`/api/experts/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to update"))))
        .then(() => {
          setSubmitStatus("done");
          loadExperts();
          setTimeout(closePanel, 800);
        })
        .catch(() => setSubmitStatus("error"));
    } else {
      fetch("/api/experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to add"))))
        .then(() => {
          setSubmitStatus("done");
          loadExperts();
          setTimeout(closePanel, 800);
        })
        .catch(() => setSubmitStatus("error"));
    }
  };

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

      {admin && (
        <div className="mb-4 epic-card p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-800">Manage experts</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={openAdd}
                className="px-3 py-1.5 text-sm rounded-epic border border-epic-border bg-white hover:bg-slate-50"
              >
                Add expert
              </button>
              {panelOpen && (
                <button type="button" onClick={closePanel} className="px-3 py-1.5 text-sm rounded-epic border border-epic-border bg-white hover:bg-slate-50">
                  Close
                </button>
              )}
            </div>
          </div>
          {panelOpen && (
            <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Affiliation</label>
                <input
                  type="text"
                  value={form.affiliation}
                  onChange={(e) => setForm((f) => ({ ...f, affiliation: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="Organization or role"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Skills / tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.skillsTags}
                  onChange={(e) => setForm((f) => ({ ...f, skillsTags: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="VC, W3C, identity"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Domain slugs (comma-separated)</label>
                <input
                  type="text"
                  value={form.domainSlugs}
                  onChange={(e) => setForm((f) => ({ ...f, domainSlugs: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="digital-identity-and-credentials, registries-and-records"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Region</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="e.g. Global, Taiwan"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Contact (URL)</label>
                <input
                  type="url"
                  value={form.contactPath}
                  onChange={(e) => setForm((f) => ({ ...f, contactPath: e.target.value }))}
                  className="epic-input py-1.5 text-sm"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={submitStatus === "saving"}
                  className="epic-btn-primary text-sm py-1.5 px-3"
                >
                  {submitStatus === "saving" ? "Saving…" : editingId ? "Save changes" : "Add expert"}
                </button>
                {submitStatus === "done" && <span className="text-sm text-green-600">Saved.</span>}
                {submitStatus === "error" && <span className="text-sm text-red-600">Failed to save.</span>}
              </div>
            </form>
          )}
        </div>
      )}

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
        <section className="mb-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-2">Match results</h2>
          <ul className="space-y-2">
            {matches.map((m) => (
              <li key={m.expertId} className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium">{m.name}</span>
                  <span className="text-slate-600 ml-2">score: {m.score}</span>
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
              {admin && <th className="text-left p-3 font-medium w-20">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={admin ? 7 : 6} className="p-4 text-slate-500">Loading...</td></tr>
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
                  {admin && (
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => openEdit(e.id)}
                        className="text-sm text-epic-navy hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RolodexPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-6xl"><p className="text-slate-500">Loading...</p></div>}>
      <RolodexContent />
    </Suspense>
  );
}
