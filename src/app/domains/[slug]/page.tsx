import { notFound } from "next/navigation";
import Link from "next/link";
import { getDomainBySlug, getDomains, getExperts, getOpportunities } from "@/lib/content";
import { parseJsonArray } from "@/lib/parsers";
import { getSectorTheme } from "@/lib/sectorColors";

type RelatedLink = { label: string; url: string };

function getRootName(slug: string, allDomains: { slug: string; name: string; parentSlug?: string | null }[]): string {
  const d = allDomains.find((x) => x.slug === slug);
  if (!d || !d.parentSlug) return d?.name ?? "";
  return getRootName(d.parentSlug, allDomains);
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [domain, allDomains, experts, opportunities] = await Promise.all([
    getDomainBySlug(slug),
    getDomains(),
    getExperts(),
    getOpportunities(),
  ]);
  if (!domain) notFound();

  const rootName = getRootName(domain.slug, allDomains);
  const theme = getSectorTheme(slug);

  const parent = domain.parentSlug
    ? allDomains.find((d) => d.slug === domain.parentSlug)
    : null;
  const children = allDomains.filter((d) => d.parentSlug === domain.slug);
  const outEdges = (domain.edges ?? []).map((e) => {
    const to = allDomains.find((d) => d.slug === e.toSlug);
    return { ...e, toName: to?.name ?? e.toSlug };
  });
  const linkedExperts = experts.filter((e) => (e.domainSlugs ?? []).includes(domain.slug));
  const linkedOpportunities = opportunities.filter((o) =>
    (o.domainSlugs ?? []).includes(domain.slug)
  );

  const tags = Array.isArray(domain.tags) ? domain.tags : parseJsonArray(domain.tags as string);
  const primitives = Array.isArray(domain.ethereumPrimitives)
    ? domain.ethereumPrimitives
    : parseJsonArray(domain.ethereumPrimitives as string);
  const relatedLinks: RelatedLink[] = Array.isArray(domain.relatedLinks)
    ? domain.relatedLinks
    : domain.relatedLinks
      ? (() => {
          try {
            return JSON.parse(domain.relatedLinks as string) as RelatedLink[];
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <div className="epic-section max-w-3xl">
      <nav className="mb-4 text-sm">
        <Link href="/map" className={`${theme.accent} ${theme.accentHover} hover:underline`}>
          ← Map
        </Link>
      </nav>
      <h1 className={`epic-heading-2 ${theme.text}`}>{domain.name}</h1>
      {parent && (
        <p className="text-sm text-slate-500 mt-1">
          Parent: <Link href={`/domains/${parent.slug}`} className={`${theme.accent} ${theme.accentHover} hover:underline`}>{parent.name}</Link>
        </p>
      )}

      {domain.definition && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Description</h2>
          <p className="text-slate-600 whitespace-pre-wrap">{domain.definition}</p>
        </section>
      )}
      {domain.summary && domain.summary !== domain.definition && (
        <section className="mt-4">
          <h2 className="font-semibold text-slate-800 mb-2">Summary</h2>
          <p className="text-slate-600 whitespace-pre-wrap">{domain.summary}</p>
        </section>
      )}

      {(domain.challenges || domain.opportunities) && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {domain.challenges && (
            <div>
              <h2 className="font-semibold text-slate-800 mb-2">Challenges</h2>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{domain.challenges}</p>
            </div>
          )}
          {domain.opportunities && (
            <div>
              <h2 className="font-semibold text-slate-800 mb-2">Opportunities</h2>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{domain.opportunities}</p>
            </div>
          )}
        </section>
      )}

      {domain.valueProposition && (
        <section className={`mt-6 p-4 rounded-xl border ${theme.lightBg} ${theme.lightBorder}`}>
          <h2 className={`font-semibold mb-2 ${theme.text}`}>How Ethereum could be used</h2>
          <p className={`${theme.text} text-sm whitespace-pre-wrap opacity-90`}>{domain.valueProposition}</p>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {domain.maturityLevel && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
            {domain.maturityLevel}
          </span>
        )}
        {tags.map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
            {t}
          </span>
        ))}
        {primitives.map((p) => (
          <span key={p} className={`px-2 py-0.5 rounded-md text-xs ${theme.lightBg} ${theme.accent}`}>
            {p}
          </span>
        ))}
      </div>

      {outEdges.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Relations</h2>
          <ul className="space-y-1">
            {outEdges.map((e) => (
              <li key={`${e.toSlug}-${e.edgeType}`}>
                <Link href={`/domains/${e.toSlug}`} className={`${theme.accent} ${theme.accentHover} hover:underline`}>
                  {e.toName}
                </Link>
                <span className="text-slate-500 ml-1 text-sm">· {e.edgeType.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {children.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Subdomains</h2>
          <ul className="space-y-1">
            {children.map((c) => (
              <li key={c.slug}>
                <Link href={`/domains/${c.slug}`} className={`${theme.accent} ${theme.accentHover} hover:underline`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(domain.experiments ?? []).length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Experiments</h2>
          <ul className="space-y-2">
            {domain.experiments!.map((ex, i) => (
              <li key={i} className="p-3 rounded-lg border border-slate-200 bg-white">
                {ex.url ? (
                  <a href={ex.url} target="_blank" rel="noopener noreferrer" className={`font-medium ${theme.accent} ${theme.accentHover} hover:underline`}>
                    {ex.title}
                  </a>
                ) : (
                  <span className="font-medium">{ex.title}</span>
                )}
                {ex.year != null && <span className="text-slate-500 ml-1">({ex.year})</span>}
                {ex.blockchainUsed && <span className="text-slate-500 ml-1">· {ex.blockchainUsed}</span>}
                {ex.description && <p className="text-slate-600 mt-1 text-sm">{ex.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {linkedExperts.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Experts</h2>
          <ul className="space-y-1">
            {linkedExperts.map((e) => (
              <li key={e.slug}>
                <Link href={`/experts/${e.slug}`} className={`${theme.accent} ${theme.accentHover} hover:underline`}>
                  {e.name}
                </Link>
                {e.affiliation && <span className="text-slate-500 ml-1">· {e.affiliation}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {linkedOpportunities.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Opportunities</h2>
          <ul className="space-y-1">
            {linkedOpportunities.map((o) => (
              <li key={o.slug}>
                <Link href={`/opportunities/${o.slug}`} className={`${theme.accent} ${theme.accentHover} hover:underline`}>
                  {o.title}
                </Link>
                <span className="text-slate-500 ml-1">· {o.stage ?? "long_list"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(domain.references?.length ?? 0) > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">References & experiments</h2>
          <ul className="space-y-1">
            {domain.references!.map((ref, i) => (
              <li key={i}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className={`${theme.accent} ${theme.accentHover} hover:underline`}>
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(domain.featuredExperts?.length ?? 0) > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Featured experts</h2>
          <ul className="space-y-1.5">
            {domain.featuredExperts!.map((ex, i) => (
              <li key={i}>
                <a href={ex.linkedInUrl} target="_blank" rel="noopener noreferrer" className={`font-medium ${theme.accent} ${theme.accentHover} hover:underline`}>
                  {ex.name}
                </a>
                {ex.affiliation && <span className="text-slate-500 ml-1">· {ex.affiliation}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedLinks.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Further reading</h2>
          <ul className="space-y-1">
            {relatedLinks.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${theme.accent} ${theme.accentHover} hover:underline`}>
                  {link.label || link.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
