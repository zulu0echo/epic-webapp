import Link from "next/link";
import { ETH_BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-white to-epic-paper">
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
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            EPIC
          </h1>
          <p className="mt-2 font-serif text-xl text-slate-600 sm:text-2xl">
            Ethereum Public Infrastructure and Commons
          </p>
          <p className="mt-6 text-lg font-medium text-slate-800">
            Strengthening Public Systems with Ethereum
          </p>
          <p className="mt-4 max-w-2xl epic-body">
            EPIC (formerly the Institutional Secretariat) is a team within the Ethereum Foundation dedicated to helping governments, multilateral organizations, and large NGOs responsibly explore and adopt Ethereum-based solutions to improve public systems.
          </p>
          <p className="mt-4 max-w-2xl epic-body">
            We work at the intersection of technology, public institutions, and values-driven innovation. Our mission is simple:{" "}
            <strong className="font-semibold text-slate-800">
              connect Ethereum’s capabilities with real institutional needs — without compromising decentralization, openness, or long-term resilience.
            </strong>
          </p>
        </div>
      </section>

      {/* Why EPIC Exists */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">Why EPIC Exists</h2>
          <p className="mt-4 epic-body">
            Public institutions manage some of society’s most critical systems: identity, payments, registries, service delivery, supply chains, and data governance. Many of these systems are fragmented, opaque, or difficult to modernize.
          </p>
          <p className="mt-4 epic-body">
            Ethereum offers new primitives for coordination, transparency, programmable trust, and digital ownership. But meaningful institutional adoption requires more than technology — it requires trusted relationships, careful design, and long-term alignment.
          </p>
          <p className="mt-6 text-lg font-semibold text-slate-800">
            EPIC exists to bridge that gap.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="border-b border-slate-200/80 bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">What We Do</h2>
          <div className="mt-10 space-y-8">
            {[
              {
                title: "1. Cultivate Institutional Champions",
                intro: "We identify and support values-aligned leaders inside and around public institutions who are willing and capable of driving meaningful change.",
                list: [
                  "Education and strategic guidance on Ethereum’s capabilities",
                  "Introductions to trusted ecosystem builders",
                  "Support navigating design, policy, and implementation questions",
                  "Access to a curated network of domain experts",
                ],
                closing: "We focus intentionally on smaller governments and specific departments within larger institutions — environments where thoughtful innovation can move forward with agility and integrity.",
              },
              {
                title: "2. Support High-Integrity Pilot Projects",
                intro: "We help identify and nurture proof-of-concept and live production projects that demonstrate Ethereum’s tangible usefulness in public systems.",
                list: ["Quality over volume", "Long-term resilience over short-term wins", "Decentralization and open standards", "Careful due diligence and risk assessment"],
                closing: "Each year, we support a limited number of flagship and exploratory initiatives that meaningfully advance institutional understanding of Ethereum.",
              },
              {
                title: "3. Build Global Coalitions",
                intro: "Institutional adoption does not happen in isolation. We collaborate with respected organizations — both inside and outside crypto — that share Ethereum’s values of openness, neutrality, and credible transparency.",
                list: null,
                closing: "Through alliances, events, research collaborations, and joint initiatives, we expand the institutional conversation around public-interest blockchain infrastructure.",
              },
            ].map((block, idx) => (
              <div key={idx} className="epic-card p-6">
                <h3 className="epic-heading-3">{block.title}</h3>
                <p className="mt-3 epic-body">{block.intro}</p>
                {block.list && (
                  <>
                    <p className="mt-3 text-sm font-medium text-slate-700">We provide:</p>
                    <ul className="mt-2 space-y-1.5 epic-body text-sm">
                      {block.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
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

      {/* Areas of Engagement */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">Areas of Engagement</h2>
          <p className="mt-4 epic-body">
            EPIC works across a broad landscape of Digital Public Infrastructure and GovTech domains, including:
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
              <li key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-2.5 text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 epic-body">
            Our work spans exploratory research, pilot design, strategic advisory, and ecosystem coordination.
          </p>
        </div>
      </section>

      {/* How We Work */}
      <section className="border-b border-slate-200/80 bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">How We Work</h2>
          <p className="mt-4 epic-body">
            We take a structured approach to institutional engagement:
          </p>
          <ol className="mt-6 space-y-4">
            {[
              "Identify opportunities and champions",
              "Assess alignment and feasibility",
              "Provide guidance and ecosystem connections",
              "Support responsible pilot execution",
              "Share knowledge and strengthen long-term relationships",
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-4 rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-serif text-sm font-bold text-indigo-700">
                  {i + 1}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 epic-body">
            We maintain a consolidated database of institutional opportunities, an active engagement pipeline, and a curated Rolodex of Ethereum-aligned experts capable of delivering high-quality institutional projects.
          </p>
        </div>
      </section>

      {/* Our Vision */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="epic-section">
          <h2 className="epic-heading-2">Our Vision</h2>
          <p className="mt-4 epic-body">
            We envision a future where governments and public institutions leverage Ethereum to build systems that are:
          </p>
          <ul className="mt-5 space-y-3">
            {["More transparent", "More interoperable", "More resilient", "More accountable", "And aligned with open, global standards"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 epic-body">
            EPIC’s role is not to push technology for its own sake — but to ensure that when Ethereum is used in public systems, it is done thoughtfully, responsibly, and in service of long-term public value.
          </p>
        </div>
      </section>

      {/* Blog */}
      <section className="border-b border-slate-200/80 bg-epic-paper/50">
        <div className="epic-section">
          <h2 className="epic-heading-2">From the Blog</h2>
          <p className="mt-2 epic-body text-slate-600">
            Updates and resources on public infrastructure and institutional adoption.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/blog"
              className="epic-card p-5 text-left transition-shadow hover:shadow-md"
            >
              <span className="text-sm font-medium text-indigo-600">Blog</span>
              <h3 className="mt-1 font-serif text-lg font-bold text-slate-900">
                Latest posts
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Read updates, reflections, and resources from the EPIC team.
              </p>
            </Link>
            <Link
              href="/map"
              className="epic-card p-5 text-left transition-shadow hover:shadow-md"
            >
              <span className="text-sm font-medium text-indigo-600">Map</span>
              <h3 className="mt-1 font-serif text-lg font-bold text-slate-900">
                Exploring the EPIC Map
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Domains, relationships, and how Ethereum primitives connect to public systems.
              </p>
            </Link>
          </div>
          <p className="mt-4">
            <Link href="/blog" className="text-indigo-600 font-medium hover:underline">
              View all posts →
            </Link>
          </p>
        </div>
      </section>

      {/* CTA / Resources */}
      <section className="bg-slate-900 text-white">
        <div className="epic-section">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Explore & Get in Touch</h2>
          <p className="mt-3 text-slate-300">
            Map our engagement domains, submit ecosystem tools, or contact the team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/map" className="epic-btn-primary bg-indigo-600 hover:bg-indigo-500 ring-offset-slate-900">
              Map Explorer
            </Link>
            <Link
              href="/blog"
              className="epic-btn-secondary border-slate-600 bg-transparent text-white hover:bg-slate-800 ring-offset-slate-900"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="epic-btn-secondary border-slate-600 bg-transparent text-white hover:bg-slate-800 ring-offset-slate-900"
            >
              Contact
            </Link>
            <Link
              href="/vendor"
              className="epic-btn-secondary border-slate-600 bg-transparent text-white hover:bg-slate-800 ring-offset-slate-900"
            >
              Vendor / Ecosystem
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
