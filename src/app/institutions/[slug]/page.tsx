import { notFound } from "next/navigation";
import Link from "next/link";
import { getInstitutionBySlug } from "@/lib/content";

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const institution = await getInstitutionBySlug(slug);
  if (!institution) notFound();

  return (
    <div className="epic-section max-w-3xl">
      <nav className="mb-4 text-sm">
        <Link href="/crm" className="text-indigo-600 hover:underline">
          ← CRM
        </Link>
      </nav>
      <h1 className="epic-heading-2">{institution.name}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
          {institution.type}
        </span>
        {institution.status && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
            {institution.status}
          </span>
        )}
        {institution.country && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
            {institution.country}
          </span>
        )}
      </div>

      {institution.description && (
        <section className="mt-6">
          <p className="text-slate-600 whitespace-pre-wrap">{institution.description}</p>
        </section>
      )}

      {institution.region && (
        <p className="mt-4 text-sm text-slate-600">Region: {institution.region}</p>
      )}
    </div>
  );
}
