import { notFound } from "next/navigation";
import Link from "next/link";
import { getOpportunityBySlug, getDomains, getInstitutions } from "@/lib/content";

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [opportunity, domains, institutions] = await Promise.all([
    getOpportunityBySlug(slug),
    getDomains(),
    getInstitutions(),
  ]);
  if (!opportunity) notFound();

  const domainBySlug = new Map(domains.map((d) => [d.slug, d]));
  const instBySlug = new Map(institutions.map((i) => [i.slug, i]));
  const linkedDomains = (opportunity.domainSlugs ?? []).map((s) => domainBySlug.get(s)).filter(Boolean);
  const linkedInstitutions = (opportunity.institutionSlugs ?? []).map((s) => instBySlug.get(s)).filter(Boolean);

  return (
    <div className="epic-section max-w-3xl">
      <nav className="mb-4 text-sm">
        <Link href="/crm/opportunities" className="text-indigo-600 hover:underline">
          ← Opportunities
        </Link>
      </nav>
      <h1 className="epic-heading-2">{opportunity.title}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
          {opportunity.stage ?? "long_list"}
        </span>
        {opportunity.priority && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
            {opportunity.priority}
          </span>
        )}
        {opportunity.pocFlagshipFlag && (
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">Flagship</span>
        )}
      </div>

      {opportunity.description && (
        <section className="mt-6">
          <p className="text-slate-600 whitespace-pre-wrap">{opportunity.description}</p>
        </section>
      )}

      <dl className="mt-6 grid gap-2 sm:grid-cols-2">
        {opportunity.fitScore != null && (
          <>
            <dt className="text-slate-500 text-sm">Fit score</dt>
            <dd>{opportunity.fitScore}</dd>
          </>
        )}
        {opportunity.budgetBand && (
          <>
            <dt className="text-slate-500 text-sm">Budget band</dt>
            <dd>{opportunity.budgetBand}</dd>
          </>
        )}
        {opportunity.nextStep && (
          <>
            <dt className="text-slate-500 text-sm">Next step</dt>
            <dd>{opportunity.nextStep}</dd>
          </>
        )}
        {opportunity.dueDate && (
          <>
            <dt className="text-slate-500 text-sm">Due date</dt>
            <dd>{opportunity.dueDate}</dd>
          </>
        )}
      </dl>

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

      {linkedInstitutions.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-2">Institutions</h2>
          <ul className="space-y-1">
            {linkedInstitutions.map((i) => (
              <li key={i!.slug}>
                <Link href={`/institutions/${i!.slug}`} className="text-indigo-600 hover:underline">
                  {i!.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
