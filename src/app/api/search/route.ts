import { NextResponse } from "next/server";
import { getDomains, getInstitutions, getOpportunities, getExperts } from "@/lib/content";
import { BLOG_POSTS } from "@/lib/blog";

const PREVIEW_MAX = 120;

function preview(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= PREVIEW_MAX) return t;
  return t.slice(0, PREVIEW_MAX).trim() + "…";
}

function matchesQuery(q: string, ...parts: (string | undefined | null)[]): boolean {
  const lower = q.toLowerCase();
  return parts.some((p) => p && String(p).toLowerCase().includes(lower));
}

export type SearchPageItem = {
  type: "domain" | "opportunity" | "expert" | "institution" | "blog" | "page";
  title: string;
  href: string;
  preview: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q || q.length < 2) {
    return NextResponse.json({
      domains: [],
      institutions: [],
      contacts: [],
      opportunities: [],
      experts: [],
      pages: [],
    });
  }

  const [domains, institutions, opportunities, experts] = await Promise.all([
    getDomains(),
    getInstitutions(),
    getOpportunities(),
    getExperts(),
  ]);

  const match = (s: string) => s.toLowerCase().includes(q);
  const pages: SearchPageItem[] = [];

  // Domains: match name, definition, summary
  for (const d of domains) {
    if (!matchesQuery(q, d.name, d.definition, d.summary, d.valueProposition)) continue;
    const snippet = d.definition || d.summary || d.valueProposition || "";
    pages.push({
      type: "domain",
      title: d.name,
      href: `/map?domainId=${d.slug}`,
      preview: snippet ? preview(snippet) : `Domain: ${d.name}`,
    });
  }

  // Opportunities: match title, description
  for (const o of opportunities) {
    if (!matchesQuery(q, o.title, o.description)) continue;
    const snippet = o.description || o.title;
    pages.push({
      type: "opportunity",
      title: o.title,
      href: `/opportunities/${o.slug}`,
      preview: snippet ? preview(snippet) : (o.stage ? `Stage: ${o.stage}` : o.title),
    });
  }

  // Experts: match name, affiliation
  for (const e of experts) {
    if (!matchesQuery(q, e.name, e.affiliation)) continue;
    const snippet = e.affiliation ? `${e.name} — ${e.affiliation}` : e.name;
    pages.push({
      type: "expert",
      title: e.name,
      href: `/experts/${e.slug}`,
      preview: preview(snippet),
    });
  }

  // Institutions: match name, description
  for (const i of institutions) {
    if (!matchesQuery(q, i.name, i.description)) continue;
    const snippet = i.description || i.name;
    pages.push({
      type: "institution",
      title: i.name,
      href: `/institutions/${i.slug}`,
      preview: snippet ? preview(snippet) : (i.type ? `Type: ${i.type}` : i.name),
    });
  }

  // Blog: match title, excerpt
  for (const p of BLOG_POSTS) {
    if (!matchesQuery(q, p.title, p.excerpt)) continue;
    pages.push({
      type: "blog",
      title: p.title,
      href: `/blog/${p.slug}`,
      preview: preview(p.excerpt || p.title),
    });
  }

  // Static pages: add a few known pages that might be relevant for broad queries
  const staticPages: { title: string; href: string; preview: string; keywords: string[] }[] = [
    { title: "Map Explorer", href: "/map", preview: "Explore the EPIC map: domains, primitives, and how they connect.", keywords: ["map", "explorer", "domain", "taxonomy", "graph"] },
    { title: "Proof of Concept Template", href: "/use-case-template", preview: "Template for govtech domain proof of concepts: research, value prop, requirements, architecture.", keywords: ["template", "poc", "proof of concept", "use case"] },
    { title: "Carbon MRV PoC", href: "/proof-of-concepts/carbon-mrv", preview: "Carbon MRV proof of concept: dataset commitments, verifier attestations, registry.", keywords: ["carbon", "mrv", "climate", "attestation", "registry"] },
    { title: "Contact", href: "/contact", preview: "Get in touch with the EPIC team.", keywords: ["contact", "email", "touch"] },
    { title: "Vendor / Ecosystem", href: "/vendor", preview: "Vendor and ecosystem resources.", keywords: ["vendor", "ecosystem", "partners"] },
  ];
  for (const s of staticPages) {
    if (s.keywords.some((k) => k.includes(q) || q.includes(k))) {
      pages.push({ type: "page", title: s.title, href: s.href, preview: s.preview });
    }
  }

  const seen = new Set<string>();
  const deduped: SearchPageItem[] = [];
  for (const p of pages) {
    if (seen.has(p.href)) continue;
    seen.add(p.href);
    deduped.push(p);
  }

  return NextResponse.json({
    domains: domains.filter((d) => match(d.name)).slice(0, 20).map((d) => ({ id: d.slug, name: d.name })),
    institutions: institutions.filter((i) => match(i.name)).slice(0, 20).map((i) => ({ id: i.slug, name: i.name, type: i.type })),
    contacts: [],
    opportunities: opportunities.filter((o) => match(o.title)).slice(0, 20).map((o) => ({ id: o.slug, title: o.title, stage: o.stage ?? "long_list" })),
    experts: experts.filter((e) => match(e.name)).slice(0, 20).map((e) => ({ id: e.slug, name: e.name, affiliation: e.affiliation ?? null })),
    pages: deduped,
  });
}
