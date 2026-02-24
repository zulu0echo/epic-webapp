import { readFile } from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";

const ALLOWED_SLUGS = new Set([
  "problem-and-research",
  "value-proposition",
  "requirements",
  "architecture",
  "user-guide",
  "design-philosophy",
  "security",
]);

const TITLES: Record<string, string> = {
  "problem-and-research": "Problem & research",
  "value-proposition": "Value proposition",
  requirements: "Requirements",
  architecture: "Architecture",
  "user-guide": "User guide",
  "design-philosophy": "Design philosophy",
  security: "Security",
};

export default async function CarbonMRVDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!ALLOWED_SLUGS.has(slug)) notFound();

  const base = path.join(process.cwd(), "carbon-mrv-poc", "docs");
  let content: string;
  try {
    content = await readFile(path.join(base, `${slug}.md`), "utf-8");
  } catch {
    notFound();
  }

  const title = TITLES[slug] ?? slug;

  return (
    <article className="epic-card overflow-hidden">
      <header className="border-b border-slate-200 bg-slate-50/50 px-6 py-5 sm:px-8 sm:py-6">
        <h1 className="epic-heading-1">{title}</h1>
      </header>
      <section aria-label="Main content" className="epic-article-body">
        <MarkdownContent content={content} demoteFirstHeading />
      </section>
    </article>
  );
}

export function generateStaticParams() {
  return Array.from(ALLOWED_SLUGS).map((slug) => ({ slug }));
}
