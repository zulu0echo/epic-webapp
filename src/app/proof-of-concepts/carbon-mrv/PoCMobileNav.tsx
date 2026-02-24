"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, Github, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

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

const base = "/proof-of-concepts/carbon-mrv";

export function PoCMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobileDevice(768);

  const isOverview = pathname === base;
  const isSpec = pathname === `${base}/spec`;
  const docSlug = pathname.startsWith(`${base}/docs/`)
    ? pathname.slice(`${base}/docs/`.length)
    : null;

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-lg px-3 py-3 text-sm min-h-[44px]",
      active ? "bg-emerald-50 font-medium text-emerald-800" : "text-slate-600 hover:bg-slate-100"
    );

  if (!isMobile) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <label htmlFor="poc-section-select" className="sr-only">
          Jump to section
        </label>
        <select
          id="poc-section-select"
          value={
            isOverview
              ? base
              : isSpec
                ? `${base}/spec`
                : docSlug
                  ? `${base}/docs/${docSlug}`
                  : base
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v) {
              router.push(v);
              setOpen(false);
            }
          }}
          className="flex-1 epic-input py-2.5 text-sm font-medium"
          aria-label="Current section"
        >
          <option value={base}>Overview</option>
          <optgroup label="Docs">
            {DOC_SECTIONS.map(({ slug, label }) => (
              <option key={slug} value={`${base}/docs/${slug}`}>
                {label}
              </option>
            ))}
          </optgroup>
          <option value={`${base}/spec`}>Specification</option>
        </select>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label={open ? "Close sections" : "Open sections menu"}
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav
            className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] flex flex-col gap-1 border-l border-slate-200 bg-white p-4 shadow-xl overflow-y-auto"
            aria-label="PoC sections"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Sections</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <Link href={base} className={linkClass(isOverview)} onClick={() => setOpen(false)}>
              <Leaf className="h-4 w-4 shrink-0 text-emerald-600" />
              Overview
            </Link>
            <div className="border-t border-slate-100 pt-3 mt-1">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Docs</p>
              {DOC_SECTIONS.map(({ slug, label }) => (
                <Link
                  key={slug}
                  href={`${base}/docs/${slug}`}
                  className={linkClass(docSlug === slug)}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link href={`${base}/spec`} className={linkClass(isSpec)} onClick={() => setOpen(false)}>
              Specification
            </Link>
            <div className="border-t border-slate-100 pt-3 mt-1">
              <a
                href={GITHUB_POC}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 min-h-[44px] items-center"
              >
                <Github className="h-4 w-4 shrink-0" />
                View on GitHub
              </a>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
