import Link from "next/link";
import { ETH_BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <div className="flex flex-wrap items-center gap-3">
            <img
              src={ETH_BRAND.diamondPurple}
              alt=""
              className="h-8 w-8 shrink-0"
              width={32}
              height={32}
            />
            <img
              src={ETH_BRAND.wordmarkBlack}
              alt="Ethereum Foundation"
              className="h-5 w-auto"
              width={160}
              height={24}
            />
          </div>
          <h1 className="mt-8 font-serif text-display font-semibold tracking-tight text-epic-ink sm:text-4xl">
            Ethereum Public Infrastructure and Commons
          </h1>
          <p className="mt-4 text-xl text-slate-600 sm:text-2xl font-serif">
            Supporting governments and public institutions in the responsible exploration and adoption of Ethereum-based solutions for public systems.
          </p>
          <p className="mt-6 max-w-2xl epic-body">
            EPIC is an initiative of the Ethereum Foundation. We work with governments, multilateral organizations, and civil society to connect Ethereum’s capabilities with institutional needs while preserving decentralization, openness, and long-term resilience.
          </p>
        </div>
      </section>

      {/* Rationale */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">Why this work matters</h2>
          <p className="mt-4 epic-body">
            Public institutions manage critical systems: identity, payments, registries, service delivery, supply chains, and data governance. Many of these systems remain fragmented, opaque, or difficult to modernize.
          </p>
          <p className="mt-4 epic-body">
            Ethereum offers primitives for coordination, transparency, and programmable trust. Meaningful institutional adoption depends on trusted relationships, careful design, and long-term alignment. EPIC exists to support that process.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">What we do</h2>
          <div className="mt-10 space-y-8">
            {[
              {
                title: "Institutional engagement",
                intro: "We identify and support values-aligned leaders within and around public institutions who are positioned to advance responsible adoption.",
                list: [
                  "Education and guidance on Ethereum’s capabilities",
                  "Introductions to vetted ecosystem partners",
                  "Support on design, policy, and implementation",
                  "Access to a curated network of domain experts",
                ],
                closing: "We focus on smaller governments and specific departments where thoughtful innovation can proceed with clarity and accountability.",
              },
              {
                title: "Pilot and production support",
                intro: "We help identify and support proof-of-concept and production projects that demonstrate Ethereum’s utility in public systems.",
                list: [
                  "Emphasis on quality and long-term resilience",
                  "Decentralization and open standards",
                  "Due diligence and risk assessment",
                ],
                closing: "We support a limited number of initiatives each year that advance institutional understanding of Ethereum.",
              },
              {
                title: "Coalition building",
                intro: "Institutional adoption does not happen in isolation. We collaborate with organizations inside and outside the ecosystem that share a commitment to openness, neutrality, and transparency.",
                list: null,
                closing: "Through partnerships, events, research, and joint initiatives, we broaden the institutional conversation around public-interest infrastructure.",
              },
            ].map((block, idx) => (
              <div key={idx} className="epic-card p-6 sm:p-8">
                <h3 className="epic-heading-3">{block.title}</h3>
                <p className="mt-3 epic-body">{block.intro}</p>
                {block.list && (
                  <>
                    <p className="mt-4 text-sm font-medium text-slate-700">We provide:</p>
                    <ul className="mt-2 space-y-2 epic-body text-sm">
                      {block.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-epic-navy-muted" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-4 epic-body text-sm">{block.closing}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of engagement */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">Areas of engagement</h2>
          <p className="mt-4 epic-body">
            EPIC works across Digital Public Infrastructure and GovTech domains, including:
          </p>
          <ul className="mt-6 grid gap-3 text-slate-600 sm:grid-cols-2">
            {[
              "Digital identity and credentials",
              "Public finance and payments",
              "Registries and records",
              "Supply chain transparency",
              "Humanitarian coordination",
              "Data governance and privacy",
              "Climate reporting and MRV",
              "Education and workforce credentials",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 rounded-epic border border-epic-border bg-white px-4 py-3 text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-epic-navy-muted" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 epic-body">
            Our work spans research, pilot design, strategic advisory, and ecosystem coordination.
          </p>
        </div>
      </section>

      {/* How we work */}
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">How we work</h2>
          <p className="mt-4 epic-body">
            We follow a structured approach to institutional engagement:
          </p>
          <ol className="mt-6 space-y-4">
            {[
              "Identify opportunities and institutional champions",
              "Assess alignment and feasibility",
              "Provide guidance and ecosystem connections",
              "Support responsible pilot execution",
              "Share knowledge and maintain long-term relationships",
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-4 rounded-epic border border-epic-border bg-epic-paper/30 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 font-serif text-sm font-semibold text-epic-navy">
                  {i + 1}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 epic-body">
            We maintain a database of institutional opportunities, an engagement pipeline, and a curated network of experts for institutional projects.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">Vision</h2>
          <p className="mt-4 epic-body">
            We aim for a future where governments and public institutions can use Ethereum to build systems that are more transparent, interoperable, resilient, and accountable, and aligned with open, global standards.
          </p>
          <p className="mt-6 epic-body">
            EPIC’s role is not to promote technology for its own sake but to ensure that when Ethereum is used in public systems, it is done thoughtfully and in service of long-term public value.
          </p>
        </div>
      </section>

      {/* Trust: Partners and governance (placeholder structure) */}
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">Partners and governance</h2>
          <p className="mt-4 epic-body">
            EPIC operates within the Ethereum Foundation and collaborates with public institutions, multilateral organizations, standards bodies, and NGOs. We publish briefings, map engagement domains, and maintain transparent processes for institutional outreach.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="epic-card p-6">
              <h3 className="font-serif text-lg font-semibold text-epic-ink">Publications and resources</h3>
              <p className="mt-2 text-sm text-slate-600">
                Briefings, domain maps, and policy-oriented resources are available through the blog and map explorer.
              </p>
              <Link href="/blog" className="mt-3 inline-block text-sm font-medium text-epic-navy hover:underline">
                View blog and resources
              </Link>
            </div>
            <div className="epic-card p-6">
              <h3 className="font-serif text-lg font-semibold text-epic-ink">Engagement domains</h3>
              <p className="mt-2 text-sm text-slate-600">
                Our map of domains and relationships shows how Ethereum primitives connect to public systems.
              </p>
              <Link href="/map" className="mt-3 inline-block text-sm font-medium text-epic-navy hover:underline">
                Open map explorer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog and map cards */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">From the blog</h2>
          <p className="mt-2 epic-body">
            Updates and resources on public infrastructure and institutional adoption.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/blog"
              className="epic-card block p-6 text-left transition-shadow hover:shadow-epic-md"
            >
              <span className="text-sm font-medium text-epic-navy-muted">Blog</span>
              <h3 className="mt-1 font-serif text-lg font-semibold text-epic-ink">
                Latest posts
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Updates and resources from the EPIC team.
              </p>
            </Link>
            <Link
              href="/map"
              className="epic-card block p-6 text-left transition-shadow hover:shadow-epic-md"
            >
              <span className="text-sm font-medium text-epic-navy-muted">Map</span>
              <h3 className="mt-1 font-serif text-lg font-semibold text-epic-ink">
                Map explorer
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Domains, relationships, and how Ethereum primitives connect to public systems.
              </p>
            </Link>
          </div>
          <p className="mt-6">
            <Link href="/blog" className="text-epic-navy font-medium hover:underline">
              View all posts
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="epic-divider bg-epic-navy text-white">
        <div className="epic-section">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Explore and get in touch</h2>
          <p className="mt-3 text-slate-300">
            Use the map explorer, submit ecosystem tools, or contact the team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/map" className="epic-btn-primary bg-white text-epic-navy hover:bg-slate-100 focus-visible:ring-white">
              Map explorer
            </Link>
            <Link
              href="/blog"
              className="epic-btn-secondary border-slate-500 bg-transparent text-white hover:bg-slate-800/50 focus-visible:ring-slate-400"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="epic-btn-secondary border-slate-500 bg-transparent text-white hover:bg-slate-800/50 focus-visible:ring-slate-400"
            >
              Contact
            </Link>
            <Link
              href="/vendor"
              className="epic-btn-secondary border-slate-500 bg-transparent text-white hover:bg-slate-800/50 focus-visible:ring-slate-400"
            >
              Vendor and ecosystem
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
