import Link from "next/link";
import { USE_CASE_TEMPLATE_SECTIONS } from "@/lib/useCaseTemplate";
import { CROPS_SECTION, WALKAWAY_SECTION } from "@/lib/epicCopy";
import { FileText, CheckCircle2, ArrowRight, Leaf } from "lucide-react";

export const metadata = {
  title: "Proof of Concept Template — EPIC",
  description:
    "Template for govtech domain and subdomain proof of concepts: problem research, value prop, requirements, architecture, code, docs, demo, CTA, roadmap, and specification.",
};

function SectionBlock({
  section,
  index,
}: {
  section: (typeof USE_CASE_TEMPLATE_SECTIONS)[number];
  index: number;
}) {
  return (
    <section
      id={section.id}
      className="epic-card p-6 sm:p-8 mb-6 scroll-mt-6"
    >
      <h2 className="epic-heading-3 flex items-center gap-2">
        <span className="text-slate-400 font-mono text-lg">{index + 1}</span>
        {section.title}
      </h2>
      <div className="mt-4 epic-body prose prose-slate max-w-none">
        <p className="whitespace-pre-wrap">{section.description}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
          Acceptance criteria
        </h3>
        <ul className="space-y-2">
          {section.acceptanceCriteria.map((criterion, i) => (
            <li key={i} className="flex gap-2 text-slate-600 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden />
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function UseCaseTemplatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="epic-section-wide">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="epic-heading-1 flex items-center gap-2">
              <FileText className="w-8 h-8 text-epic-navy-muted" aria-hidden />
              Proof of Concept Template
            </h1>
            <p className="mt-2 epic-body max-w-2xl">
              Use this template to document a proof-of-concept before any institutional pilot. Assess against{" "}
              <a href="#crops" className="text-epic-navy font-medium hover:underline">CROPS</a>
              {" "}and the{" "}
              <a href="#walkaway-test" className="text-epic-navy font-medium hover:underline">walkaway test</a>
              . EPIC publishes the template; filling it does not imply EF endorsement of a deployment.
            </p>
          </div>
          <Link
            href="/proof-of-concepts/carbon-mrv"
            className="epic-btn-secondary inline-flex items-center gap-2"
          >
            <Leaf className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden />
            See example: Carbon MRV PoC
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          <p className="font-medium text-slate-800">Reference</p>
          <p className="mt-1">
            Specification format is inspired by{" "}
            <a
              href="https://github.com/privacy-ethereum/zkspecs/blob/main/specs/2/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-epic-navy underline hover:no-underline"
            >
              COSS/zkspecs (e.g. Anon-Aadhaar spec)
            </a>
            . Use RFC 2119 keywords (MUST, SHOULD, MAY) in normative sections.
          </p>
        </div>

        <section id={CROPS_SECTION.id} className="epic-card p-6 sm:p-8 mb-6 scroll-mt-6">
          <h2 className="epic-heading-2">{CROPS_SECTION.title}</h2>
          <p className="mt-4 epic-body whitespace-pre-wrap">{CROPS_SECTION.body}</p>
        </section>

        <section id={WALKAWAY_SECTION.id} className="epic-card p-6 sm:p-8 mb-6 scroll-mt-6">
          <h2 className="epic-heading-2">{WALKAWAY_SECTION.title}</h2>
          <p className="mt-4 epic-body whitespace-pre-wrap">{WALKAWAY_SECTION.body}</p>
        </section>

        {USE_CASE_TEMPLATE_SECTIONS.map((section, index) => (
          <SectionBlock key={section.id} section={section} index={index} />
        ))}

        <div className="epic-card p-6 sm:p-8 mb-8 border-dashed border-2 border-slate-200 bg-slate-50/50">
          <h2 className="epic-heading-3">Next step</h2>
          <p className="mt-2 epic-body">
            Use this template to create a new use case page for a domain or subdomain from the{" "}
            <Link href="/map" className="text-epic-navy underline hover:no-underline">
              Map Explorer
            </Link>
            . Fill in each section with extended descriptions and meet the acceptance criteria for proof of concepts.
          </p>
          <p className="mt-4 epic-body">
            <strong>Example:</strong> Explore{" "}
            <Link href="/domains/climate-and-mrv" className="text-epic-navy underline hover:no-underline">
              Climate & MRV
            </Link>
            {" "}on the map (or view the domain page), then open the Carbon MRV proof of concept from the Proof of concepts tab, or go directly to{" "}
            <Link href="/proof-of-concepts/carbon-mrv" className="text-epic-navy underline hover:no-underline">
              Carbon MRV PoC
            </Link>
            {" "}for the full documentation and spec.
          </p>
        </div>
      </div>
    </div>
  );
}
