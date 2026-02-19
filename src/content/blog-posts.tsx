import Link from "next/link";

/** Renders post body by slug. Returns null if slug is unknown. */
export function getPostContent(slug: string): React.ReactNode {
  switch (slug) {
    case "map-explorer":
      return <MapExplorerPost />;
    case "epic-team-and-vision":
      return <EpicTeamVisionPost />;
    default:
      return null;
  }
}

function MapExplorerPost() {
  return (
    <article className="epic-body space-y-6">
      <p>
        The <strong>EPIC map</strong> is a living taxonomy of where Ethereum can add value in public systems. It organizes engagement domains — from digital identity and verifiable credentials to payments, registries, supply chain, civic participation, and climate MRV — and connects them to the Ethereum primitives that make those use cases possible.
      </p>

      <h2 className="epic-heading-3 mt-8">What you’ll find on the map</h2>
      <p>
        The map has three main ways to explore: a <strong>tree view</strong> of domains and subdomains, a <strong>graph view</strong> showing how domains relate to each other (depends on, enables, adjacent to), and a <strong>detail panel</strong> for each node with definitions, challenges, opportunities, experiments, references, and featured experts.
      </p>
      <p>
        Each domain is tagged with <strong>Ethereum primitives</strong> (e.g. attestation, verifiable credentials, registries, ZK proofs) and a <strong>maturity level</strong> (idea, pilot, production) so you can see both the problem space and how far real-world adoption has come.
      </p>

      <h2 className="epic-heading-3 mt-8">Why it matters</h2>
      <p>
        Governments and multilaterals are exploring blockchain and digital public infrastructure at different speeds and in different sectors. The map gives a single place to see the full landscape: what domains exist, how they connect, what’s been tried, and who the subject-matter experts are. That makes it easier to scope pilots, find partners, and avoid reinventing the wheel.
      </p>

      <h2 className="epic-heading-3 mt-8">How you can contribute</h2>
      <p>
        The map is only as good as the input it gets from the community. We invite you to help keep it accurate and useful:
      </p>
      <ul className="list-disc space-y-2 pl-6 text-slate-700">
        <li>
          <strong>Suggest new domains or subdomains</strong> — If you work in a sector we haven’t yet captured (e.g. a specific type of registry or a new application of attestations), we’d love to hear how you’d structure it.
        </li>
        <li>
          <strong>Add or correct experiments and references</strong> — Know of a pilot, PoC, or report that should be linked from a domain? Send us the link and the domain it belongs to.
        </li>
        <li>
          <strong>Nominate experts</strong> — We list 2–3 featured experts per domain. If you’re a subject-matter expert or know one who should be featured (with their consent), get in touch.
        </li>
        <li>
          <strong>Improve definitions and opportunities</strong> — Definitions, challenges, and opportunities are written to be concise and practical. If you see something outdated or missing, suggest an edit.
        </li>
      </ul>
      <p>
        The easiest way to start is to use the map yourself — open domains, follow the links to experiments and experts — and then tell us what’s missing or wrong. We’ll use that feedback to refine the taxonomy and the content.
      </p>

      <div className="mt-10 rounded-xl border-2 border-indigo-200 bg-indigo-50/80 p-6">
        <h3 className="font-serif text-lg font-bold text-slate-900">Call to action</h3>
        <p className="mt-2 text-slate-700">
          Explore the map, share it with colleagues working in public infrastructure, and send your suggestions and corrections to{" "}
          <a href="mailto:epic@ethereum.org" className="font-medium text-indigo-600 hover:underline">
            epic@ethereum.org
          </a>
          . Your contributions help make this resource more useful for everyone.
        </p>
        <p className="mt-4">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            Open the EPIC Map →
          </Link>
        </p>
      </div>
    </article>
  );
}

function EpicTeamVisionPost() {
  return (
    <article className="epic-body space-y-6">
      <p>
        <strong>EPIC</strong> (Ethereum Public Infrastructure and Commons) is a team within the Ethereum Foundation. We focus on helping governments, multilateral organizations, and large NGOs explore and adopt Ethereum-based solutions in ways that strengthen public systems — without compromising decentralization, openness, or long-term resilience.
      </p>

      <h2 className="epic-heading-3 mt-8">Who we are</h2>
      <p>
        We are a small, mission-driven team with backgrounds in public policy, institutional engagement, and Ethereum ecosystem building. We sit inside the Ethereum Foundation so we can speak with credibility about the technology and the community, while staying focused on public-interest outcomes rather than commercial or speculative use cases.
      </p>
      <p>
        We work closely with the rest of the Foundation and with a wide network of researchers, implementers, and domain experts who share our values. Our role is to connect institutions with the right people and the right information so that pilots and programs are designed and executed well.
      </p>

      <h2 className="epic-heading-3 mt-8">Our vision</h2>
      <p>
        We envision a future where public institutions use Ethereum where it clearly adds value: as a neutral coordination layer for attestations and credentials, as a transparent backbone for registries and payments, and as infrastructure that can evolve without vendor lock-in or single points of failure.
      </p>
      <p>
        That future is not automatic. It requires institutions that understand both the technology and the governance implications; implementers who can deliver robust, maintainable systems; and a global conversation that treats public infrastructure as a long-term commitment. EPIC exists to advance that vision by cultivating champions, supporting high-integrity pilots, and building coalitions that share Ethereum’s values of openness and credible transparency.
      </p>

      <h2 className="epic-heading-3 mt-8">How we work</h2>
      <p>
        We don’t push technology for its own sake. We identify and support values-aligned leaders inside and around public institutions; we help scope and advise on pilots that demonstrate real utility; and we connect institutions with trusted experts and ecosystem partners. We maintain the EPIC map, a Rolodex of experts, and a pipeline of institutional opportunities so that our engagement is structured and repeatable.
      </p>
      <p>
        If you’re inside a government, multilateral, or large NGO and are exploring where Ethereum might fit — or if you’re a builder or researcher who wants to work on public-interest applications — we’d like to hear from you.
      </p>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50/80 p-6">
        <h3 className="font-serif text-lg font-bold text-slate-900">Get in touch</h3>
        <p className="mt-2 text-slate-700">
          For general inquiries, opportunities, or to share feedback on the map and our resources:{" "}
          <a href="mailto:epic@ethereum.org" className="font-medium text-indigo-600 hover:underline">
            epic@ethereum.org
          </a>
          .
        </p>
        <p className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium text-indigo-600 hover:underline"
          >
            ← Back to EPIC homepage
          </Link>
        </p>
      </div>
    </article>
  );
}
