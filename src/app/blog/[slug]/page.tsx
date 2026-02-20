import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostMeta, getAllPostSlugs } from "@/lib/blog";
import { getPostContent } from "@/content/blog-posts";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  const content = getPostContent(slug);

  if (!meta || content == null) notFound();

  return (
    <div className="epic-section max-w-3xl">
      <Link
        href="/blog"
        className="text-sm font-medium text-epic-navy hover:underline"
      >
        ← Blog
      </Link>
      <time
        className="mt-4 block text-sm text-slate-500"
        dateTime={meta.date}
      >
        {formatDate(meta.date)}
      </time>
      <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {meta.title}
      </h1>
      <p className="mt-3 text-lg text-slate-600">{meta.excerpt}</p>
      <div className="mt-8 border-t border-slate-200 pt-8">{content}</div>
    </div>
  );
}
