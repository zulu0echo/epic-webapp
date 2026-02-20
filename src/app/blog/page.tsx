import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";

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

export default function BlogPage() {
  return (
    <div className="epic-section max-w-3xl">
      <h1 className="epic-heading-2">Blog</h1>
      <p className="mt-2 epic-body text-slate-600">
        Updates, reflections, and resources from the EPIC team on public infrastructure and institutional adoption of Ethereum.
      </p>
      <ul className="mt-10 space-y-6">
        {Array.isArray(BLOG_POSTS) && BLOG_POSTS.length > 0 ? (
          BLOG_POSTS.map((post) => (
            <li key={post.slug} className="epic-card p-5 sm:p-6">
              <time className="text-sm text-slate-500" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
              <h2 className="mt-1 font-serif text-xl font-bold text-slate-900">
                <Link href={`/blog/${post.slug}`} className="text-epic-navy font-medium hover:underline">
                  {post.title}
                </Link>
              </h2>
              {post.excerpt ? <p className="mt-2 epic-body text-slate-600">{post.excerpt}</p> : null}
            </li>
          ))
        ) : (
          <li className="text-slate-500">No posts yet.</li>
        )}
      </ul>
    </div>
  );
}
