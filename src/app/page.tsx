import Link from "next/link";
import { ETH_BRAND } from "@/lib/brand";
import { WHAT_EPIC_WILL_NOT_DO, WALKAWAY_TEST_USER_SIDE } from "@/lib/epicCopy";

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
            Preserving and scaling user self-sovereignty in public systems — where people hold the final say over their identities, credentials, assets, and verifiable claims.
          </p>
          <p className="mt-6 max-w-2xl epic-body">
            EPIC is a team within the Ethereum Foundation. The views on this site are EPIC&apos;s, not an official Ethereum Foundation policy position. We work with governments, multilateral organizations, and civil society so that when public institutions adopt Ethereum-based infrastructure, it strengthens — not trades away — censorship resistance, resilience, openness, privacy, and security.
          </p>
          <p className="mt-4 max-w-2xl epic-body">
            EPIC exists to serve self-sovereign users: the person who must prove a credential without handing a platform their full history; the aid recipient who needs portable identity across borders; the verifier who checks an attestation without calling a vendor API; the citizen who should retain exit paths when institutions change. Public engagement is a means to that end — not the end itself. We map where Ethereum primitives can expand what those users can do independently, and we support pilots that pass the walkaway test: {WALKAWAY_TEST_USER_SIDE}
          </p>
        </div>
      </section>

      {/* For individuals */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">For you — not only for institutions</h2>
          <p className="mt-4 epic-body">
            You do not need a ministry badge or a procurement contract to care about sovereign tools. Whether you are an individual running your own keys, a developer building in public, someone living off the beaten path with unreliable connectivity, or simply a person who refuses to rent your identity from a platform — this work is for you. EPIC publishes open maps, specs, and proof-of-concepts you can read, fork, and run without asking permission. Explore the domains where Ethereum can give you verifiable claims, portable records, and audit trails you control — not credentials issued to you and revocable at someone else&apos;s discretion.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/map" className="epic-btn-primary">
              Explore the map
            </Link>
            <Link href="/proof-of-concepts/carbon-mrv" className="epic-btn-secondary">
              Carbon MRV PoC
            </Link>
            <Link href="/use-case-template" className="epic-btn-secondary">
              PoC template
            </Link>
          </div>
        </div>
      </section>

      {/* Rationale */}
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">Why this work matters</h2>
          <p className="mt-4 epic-body">
            Public institutions manage critical systems: identity, payments, registries, service delivery, supply chains, and data governance. Many of these systems remain fragmented, opaque, or difficult to modernize — and too often they capture users inside vendor stacks with no credible exit.
          </p>
          <p className="mt-4 epic-body">
            Ethereum offers primitives for coordination and programmable trust without requiring a central gatekeeper. Meaningful adoption depends on careful design and long-term alignment with user sovereignty. EPIC supports that process — and publishes what we learn in the open.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">What we do</h2>
          <div className="mt-10 space-y-8">
            {[
              {
                title: "Institutional engagement",
                intro: "We work with values-aligned leaders in and around public institutions when their projects can expand what self-sovereign users can do — not when adoption would consolidate control.",
                list: [
                  "Education on Ethereum capabilities and CROPS-aligned design",
                  "Questions and review against CROPS and user-side exit — not prescribed architectures",
                  "Connections to open standards and ecosystem work already in flight",
                ],
                closing: "We focus where thoughtful innovation can proceed with clarity and accountability — always with the end user’s sovereignty in view.",
              },
              {
                title: "Pilot and production support",
                intro: "We help develop proof-of-concept and production projects that demonstrate Ethereum’s utility without introducing chokepoints.",
                list: [
                  "Emphasis on quality, resilience, and the walkaway test",
                  "Decentralization and open standards",
                  "Due diligence against CROPS tradeoffs (censorship resistance, resilience, openness, privacy, security)",
                ],
                closing: "We support a limited number of initiatives each year that advance understanding of public-interest infrastructure.",
              },
              {
                title: "Open knowledge",
                intro: "We publish maps, templates, specs, and briefings so that judgment and tooling diffuse beyond the Foundation.",
                list: null,
                closing: "Through open documentation and proof-of-concepts, we broaden access to sovereign tools — for institutions and for individuals alike.",
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
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">Areas of engagement</h2>
          <p className="mt-4 epic-body">
            The map organises research domains where Ethereum primitives may be relevant. Listing a domain is not a commitment to an active EPIC workstream.
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
            Our published work today concentrates on open mapping, the PoC template, and the Carbon MRV proof-of-concept. Other domains are documented for community reference unless marked otherwise on the map.
          </p>
        </div>
      </section>

      {/* How we work */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">How we work</h2>
          <p className="mt-4 epic-body">
            We follow a structured approach grounded in user sovereignty:
          </p>
          <ol className="mt-6 space-y-4">
            {[
              "Name the self-sovereign user and what they gain",
              "Assess alignment with CROPS and user-side exit",
              "Provide guidance and point to open ecosystem resources",
              "Support responsible pilot execution",
              "Publish knowledge in forms others can fork and extend",
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-4 rounded-epic border border-epic-border bg-epic-paper/30 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 font-serif text-sm font-semibold text-epic-navy">
                  {i + 1}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What EPIC will not do */}
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">What EPIC will not do</h2>
          <p className="mt-4 epic-body whitespace-pre-line">{WHAT_EPIC_WILL_NOT_DO}</p>
        </div>
      </section>

      {/* Vision */}
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">Vision</h2>
          <p className="mt-4 epic-body">
            We aim for a future where people and institutions can use Ethereum to build systems that are verifiable, interoperable, resilient, and accountable — aligned with open, global standards and with users retaining the final say.
          </p>
          <p className="mt-6 epic-body">
            EPIC&apos;s role is not to promote technology for its own sake but to ensure that when Ethereum is used in public systems, it is done thoughtfully and in service of long-term public value — and of the individuals who must live inside those systems.
          </p>
        </div>
      </section>

      {/* Trust: Partners and governance */}
      <section className="epic-divider bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">Partners and governance</h2>
          <p className="mt-4 epic-body">
            EPIC operates within the Ethereum Foundation and collaborates with public institutions, multilateral organizations, standards bodies, and NGOs. We publish briefings, map research domains, and maintain open documentation.
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
      <section className="epic-divider bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">From the blog</h2>
          <p className="mt-2 epic-body">
            Updates and resources on public infrastructure and sovereign tools.
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
            Use the map explorer, read open specs, or contact the team.
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
          </div>
        </div>
      </section>
    </div>
  );
}
