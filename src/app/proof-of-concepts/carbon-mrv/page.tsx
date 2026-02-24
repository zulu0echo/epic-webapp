import { readFile } from "fs/promises";
import path from "path";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Leaf, Github } from "lucide-react";
import { CarbonMRVFlowAnimation } from "./CarbonMRVFlowAnimation";

const GITHUB_POC =
  "https://github.com/zulu0echo/epic-webapp/tree/main/carbon-mrv-poc";

export default async function CarbonMRVPocOverviewPage() {
  const base = path.join(process.cwd(), "carbon-mrv-poc");
  let content: string;
  try {
    content = await readFile(path.join(base, "README.md"), "utf-8");
  } catch {
    content = "Content not available. See [GitHub](" + GITHUB_POC + ").";
  }

  return (
    <article className="epic-card overflow-hidden">
      <header className="border-b border-slate-200 bg-slate-50/50 px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="epic-heading-1 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700" aria-hidden>
              <Leaf className="h-6 w-6" />
            </span>
            Carbon MRV PoC
          </h1>
          <a
            href={GITHUB_POC}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            <Github className="h-4 w-4 shrink-0" aria-hidden />
            Source on GitHub
          </a>
        </div>
      </header>
      <section aria-label="Main content" className="epic-article-body">
        <CarbonMRVFlowAnimation />
        <div className="mt-8">
          <MarkdownContent content={content} demoteFirstHeading />
        </div>
        <footer className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Use the sidebar to open each section: Problem & research, Value
            proposition, Requirements, Architecture, User guide, Design
            philosophy, Security, and Specification.
          </p>
        </footer>
      </section>
    </article>
  );
}
