import { readFile } from "fs/promises";
import path from "path";
import { MarkdownContent } from "@/components/MarkdownContent";

export default async function CarbonMRVSpecPage() {
  const base = path.join(process.cwd(), "carbon-mrv-poc", "spec");
  let content: string;
  try {
    content = await readFile(path.join(base, "README.md"), "utf-8");
  } catch {
    content =
      "Specification not available. See [GitHub](https://github.com/zulu0echo/epic-webapp/tree/main/carbon-mrv-poc).";
  }

  return (
    <article className="epic-card overflow-hidden">
      <header className="border-b border-slate-200 bg-slate-50/50 px-6 py-5 sm:px-8 sm:py-6">
        <h1 className="epic-heading-1">Specification</h1>
      </header>
      <section aria-label="Main content" className="epic-article-body">
        <MarkdownContent content={content} demoteFirstHeading />
      </section>
    </article>
  );
}
