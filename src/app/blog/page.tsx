import Link from "next/link";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  href?: string;
};

// Seed list; replace with API or CMS when ready.
const POSTS: BlogPost[] = [
  {
    slug: "introducing-epic",
    title: "Introducing EPIC",
    excerpt: "Ethereum Public Infrastructure and Commons (EPIC) connects Ethereum’s capabilities with real institutional needs — without compromising decentralization, openness, or long-term resilience.",
    date: "2025-01-15",
    href: "/",
  },
  {
    slug: "map-explorer",
    title: "Exploring the EPIC Map",
    excerpt: "The EPIC map organizes engagement domains — from civic processes and digital identity to payments, registries, and supply chain — and how they relate to Ethereum primitives.",
    date: "2025-01-10",
    href: "/map",
  },
  { slug: "public-infrastructure-2025", title: "Public infrastructure in 2025", excerpt: "", date: "2025-02-01" },
  { slug: "institutional-adoption-patterns", title: "Institutional adoption patterns", excerpt: "", date: "2025-01-28" },
  { slug: "digital-identity-and-registries", title: "Digital identity and registries", excerpt: "", date: "2025-01-20" },
  { slug: "transparency-and-procurement", title: "Transparency and procurement", excerpt: "", date: "2025-01-12" },
  { slug: "g2p-and-payments-rails", title: "G2P and payments rails", excerpt: "", date: "2025-01-05" },
];

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
        {POSTS.map((post) => (
          <li key={post.slug} className="epic-card p-5 sm:p-6">
            <time className="text-sm text-slate-500" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            <h2 className="mt-1 font-serif text-xl font-bold text-slate-900">
              {post.href ? (
                <Link href={post.href} className="text-indigo-600 hover:underline">
                  {post.title}
                </Link>
              ) : (
                post.title
              )}
            </h2>
            {post.excerpt ? <p className="mt-2 epic-body text-slate-600">{post.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
