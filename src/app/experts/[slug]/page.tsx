import { notFound } from "next/navigation";
import Link from "next/link";
import { getExpertBySlug, getDomains } from "@/lib/content";
import { parseJsonArray } from "@/lib/parsers";

export default async function ExpertPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [expert, domains] = await Promise.all([getExpertBySlug(slug), getDomains()]);
  if (!expert) notFound();

  const domainBySlug = new Map(domains.map((d) => [d.slug, d]));
  const linkedDomains = (expert.domainSlugs ?? [])
    .map((s) => domainBySlug.get(s))
    .filter(Boolean);
  const skills = Array.isArray(expert.skillsTags) ? expert.skillsTags : parseJsonArray(expert.skillsTags as string);
  const languages = Array.isArray(expert.languages) ? expert.languages : parseJsonArray(expert.languages as string);
  let refLinks: { label: string; url: string }[] = [];
  if (Array.isArray(expert.referencesLinks)) refLinks = expert.referencesLinks;
  else if (typeof expert.referencesLinks === "string" && expert.referencesLinks.trim()) {
    try {
      refLinks = JSON.parse(expert.referencesLinks);
    } catch {
      refLinks = [];
    }
  }

  return (
    <div className="epic-section max-w-3xl">
      <nav className="mb-4 text-sm">
        <Link href="/rolodex" className="text-indigo-600 hover:underline">
          ← Rolodex
        </Link>
      </nav>
      <h1 className="epic-heading-2">{expert.name}</h1>
      {expert.affiliation && (
        <p className="text-slate-600 mt-1">{expert.affiliation}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {expert.region && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
            {expert.region}
          </span>
        )}
        {skills.map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
            {s}
          </span>
        ))}
        {languages.map((l) => (
          <span key={l} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs">
            {l}
          </span>
        ))}
      </div>

      {expert.ethereumAlignmentNotes && (
        <section className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-2">Notes</h2>
          <p className="text-slate-600 text-sm whitespace-pre-wrap">{expert.ethereumAlignmentNotes}</p>
        </section>
      )}

      {expert.availability && (
        <p className="mt-4 text-sm text-slate-600">Availability: {expert.availability}</p>
      )}

      {linkedDomains.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Domains</h2>
          <ul className="space-y-1">
            {linkedDomains.map((d) => (
              <li key={d!.slug}>
                <Link href={`/domains/${d!.slug}`} className="text-indigo-600 hover:underline">
                  {d!.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(expert.contactPath || refLinks.length > 0) && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Links</h2>
          <ul className="space-y-1">
            {expert.contactPath && (
              <li>
                <a href={expert.contactPath} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Contact / LinkedIn
                </a>
              </li>
            )}
            {refLinks.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
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
