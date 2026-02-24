"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Github, Leaf } from "lucide-react";

const GITHUB_POC =
  "https://github.com/zulu0echo/epic-webapp/tree/main/carbon-mrv-poc";

const DOC_SECTIONS = [
  { slug: "problem-and-research", label: "Problem & research" },
  { slug: "value-proposition", label: "Value proposition" },
  { slug: "requirements", label: "Requirements" },
  { slug: "architecture", label: "Architecture" },
  { slug: "user-guide", label: "User guide" },
  { slug: "design-philosophy", label: "Design philosophy" },
  { slug: "security", label: "Security" },
] as const;

export function CarbonMRVSidebar() {
  const pathname = usePathname();
  const base = "/proof-of-concepts/carbon-mrv";

  const isOverview = pathname === base;
  const isSpec = pathname === `${base}/spec`;
  const docSlug = pathname.startsWith(`${base}/docs/`)
    ? pathname.slice(`${base}/docs/`.length)
    : null;

  const linkClass = (active: boolean) =>
    `block rounded-lg px-3 py-2 text-sm transition-colors ${
      active
        ? "bg-emerald-50 font-medium text-emerald-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav className="sticky top-6 space-y-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <Link
        href={base}
        className={`flex items-center gap-2 ${linkClass(isOverview)}`}
      >
        <Leaf className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
        Overview
      </Link>
      <div className="border-t border-slate-100 pt-3 mt-3">
        <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Docs
        </p>
        {DOC_SECTIONS.map(({ slug, label }) => (
          <Link
            key={slug}
            href={`${base}/docs/${slug}`}
            className={linkClass(docSlug === slug)}
          >
            {label}
          </Link>
        ))}
      </div>
      <Link
        href={`${base}/spec`}
        className={linkClass(isSpec)}
      >
        Specification
      </Link>
      <div className="border-t border-slate-100 pt-3 mt-3">
        <a
          href={GITHUB_POC}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        >
          <Github className="h-4 w-4 shrink-0" aria-hidden />
          View on GitHub
        </a>
      </div>
    </nav>
  );
}
