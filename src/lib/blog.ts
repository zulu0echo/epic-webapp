export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

/** All blog posts with full content. Used by blog index and [slug] page. */
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "map-explorer",
    title: "Explore the EPIC Map: Domains, Primitives & How to Contribute",
    excerpt:
      "The EPIC map is your entry point to how Ethereum can strengthen public systems — from digital identity and payments to registries, supply chain, and climate. See how it works and how you can contribute.",
    date: "2025-02-19",
  },
  {
    slug: "epic-team-and-vision",
    title: "The EPIC Team and Our Vision",
    excerpt:
      "Who we are, why we exist, and how we work to connect Ethereum’s capabilities with real institutional needs — without compromising decentralization or long-term resilience.",
    date: "2025-02-19",
  },
];

export function getPostMeta(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
