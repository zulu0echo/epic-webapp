import React from "react";
import Link from "next/link";

/** Renders post body by slug. Returns null if slug is unknown. */
export function getPostContent(slug: string): React.ReactNode {
  switch (slug) {
    case "map-explorer":
      return <MapExplorerPost />;
    case "epic-team-and-vision":
      return <EpicTeamVisionPost />;
    case "ethereum-resilient-public-infrastructure":
      return <EthereumResilientInfrastructurePost />;
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

      <div className="mt-10 rounded-epic-lg border border-epic-border bg-epic-paper/80 p-6">
        <h3 className="font-serif text-lg font-semibold text-epic-ink">Contribute</h3>
        <p className="mt-2 text-slate-700">
          Explore the map, share it with colleagues working in public infrastructure, and send suggestions and corrections to{" "}
          <a href="mailto:epic@ethereum.org" className="font-medium text-epic-navy hover:underline">
            epic@ethereum.org
          </a>
          .
        </p>
        <p className="mt-4">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-epic bg-epic-navy px-4 py-2.5 font-medium text-white hover:bg-epic-navy-light"
          >
            Open the EPIC map
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

      <div className="mt-10 rounded-epic-lg border border-epic-border bg-epic-paper/80 p-6">
        <h3 className="font-serif text-lg font-semibold text-epic-ink">Get in touch</h3>
        <p className="mt-2 text-slate-700">
          For inquiries, opportunities, or feedback on the map and resources:{" "}
          <a href="mailto:epic@ethereum.org" className="font-medium text-epic-navy hover:underline">
            epic@ethereum.org
          </a>
          .
        </p>
        <p className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium text-epic-navy hover:underline"
          >
            Back to EPIC homepage
          </Link>
        </p>
      </div>
    </article>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-epic-navy hover:underline">
      {children}
    </a>
  );
}

function EthereumResilientInfrastructurePost() {
  return (
    <article className="epic-body space-y-6">
      <h2 className="epic-heading-3 mt-6">Executive Summary</h2>
      <p>
        Public-sector institutions require digital infrastructure that can withstand political turnover, institutional restructuring, adversarial pressure, and cross-border complexity. Unlike private-sector platforms, government and multilateral systems must operate under intense public scrutiny while remaining durable across decades. The primary challenge is not merely technological efficiency; it is <strong>institutional resilience</strong>—the capacity of systems to remain verifiable, tamper-evident, and operational regardless of changes in operators, vendors, or political leadership.
      </p>
      <p>
        Ethereum, as a decentralized proof-of-stake blockchain, provides a credible foundation for certain classes of public digital infrastructure. Its design enables independent verification of records, distributed security backed by significant economic stake, programmable settlement logic, and interoperability across institutional boundaries. This paper examines why Ethereum is structurally relevant to governments, NGOs, and international institutions, and how it can be deployed in ways that strengthen resilience rather than introduce fragility.
      </p>

      <hr className="border-epic-border my-8" />

      <h2 className="epic-heading-3 mt-8">1. Structural Requirements of Public-Sector Infrastructure</h2>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">1.1 Institutional Continuity and Operator Independence</h3>
      <p>
        Government systems must survive leadership changes, procurement cycles, vendor transitions, and geopolitical shifts. Traditional centralized systems frequently depend on a single database administrator or contracted vendor. While such systems may be efficient in steady-state operation, they create structural single points of failure. If a vendor relationship deteriorates, a ministry restructures, or an agency undergoes reform, data continuity and system integrity can be compromised.
      </p>
      <p>
        Ethereum’s architecture removes reliance on a single institutional operator. The network is maintained by a globally distributed validator set participating in consensus through proof-of-stake. As of early 2026, approximately 36 million ETH are staked securing the network, and hundreds of thousands of active validators participate in consensus. These validators are geographically and institutionally distributed (Beacon chain data: <ExtLink href="https://beaconcha.in/">beaconcha.in</ExtLink>; validator statistics: <ExtLink href="https://beaconscan.com/validators">beaconscan.com/validators</ExtLink>). This dispersion creates continuity that is independent of any individual government, corporation, or service provider.
      </p>
      <p>
        For public institutions, this independence means that core records anchored to Ethereum do not depend on a specific ministry’s server infrastructure or a vendor’s continued operation. Even if an implementing contractor ceases to exist, the verification layer remains accessible.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">1.2 Tamper-Evident Recordkeeping Under Adversarial Conditions</h3>
      <p>
        Public systems are frequently subject to litigation, audit, political pressure, and investigative scrutiny. In high-stakes contexts—public procurement, electoral processes, aid distribution—allegations of record manipulation can undermine institutional legitimacy.
      </p>
      <p>
        Ethereum provides deterministic finality through its proof-of-stake consensus mechanism. Under normal operating conditions, finality is achieved within approximately two epochs (roughly 12–13 minutes), after which reversion would require extraordinary consensus disruption (finality overview: <ExtLink href="https://docs.optimism.io/op-stack/transactions/transaction-finality">Optimism docs on transaction finality</ExtLink>). Once finalized, records become computationally and economically infeasible to alter.
      </p>
      <p>
        For governments, this enables the creation of immutable checkpoints: timestamps for procurement submissions, cryptographic commitments to policy drafts, or attestation logs for regulatory actions. The system does not eliminate disputes, but it materially strengthens the evidentiary basis for institutional decisions.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">1.3 Distributed Security and Client Diversity</h3>
      <p>
        Beyond validator count, resilience depends on reducing correlated software risk. Ethereum supports multiple independent client implementations, reducing the probability that a single software defect compromises the entire network (client diversity overview: <ExtLink href="https://ethereum.org/developers/docs/nodes-and-clients/client-diversity/">ethereum.org on client diversity</ExtLink>).
      </p>
      <p>
        In institutional risk modeling, monoculture software stacks present systemic vulnerabilities. Client diversity distributes that risk across independent codebases maintained by separate development teams. This design choice reflects an explicit prioritization of long-term network survivability.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">1.4 Transparent and Programmable Economic Primitives</h3>
      <p>
        Ethereum’s protocol includes transparent transaction fee mechanics formalized in EIP-1559, which introduced a deterministic base fee burn mechanism (EIP-1559 specification: <ExtLink href="https://eips.ethereum.org/EIPS/eip-1559">eips.ethereum.org/EIPS/eip-1559</ExtLink>). While this primarily affects network economics, it illustrates a broader principle: key economic behaviors can be embedded at the protocol level and independently audited.
      </p>
      <p>
        For public institutions, programmable settlement enables conditional disbursements, milestone-based grants, escrow logic in procurement, and transparent allocation flows. Importantly, these mechanisms are not reliant on back-office reconciliation but are verifiable directly from the ledger.
      </p>

      <h2 className="epic-heading-3 mt-8">2. Institutional Use Cases</h2>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">2.1 Humanitarian Aid Distribution and NGO Coordination</h3>
      <p>
        Humanitarian aid systems involve multiple stakeholders: donors, implementing partners, field operators, and beneficiaries. Fragmented record systems can produce inefficiencies, reconciliation delays, and fraud vulnerabilities.
      </p>
      <p>
        The United Nations World Food Programme’s “Building Blocks” initiative demonstrates the institutional application of Ethereum-based infrastructure in humanitarian contexts (<ExtLink href="https://www.wfp.org/building-blocks">wfp.org/building-blocks</ExtLink>). According to an ITU case study, the system utilized Ethereum technology in a permissioned configuration to improve coordination and transparency in refugee assistance programs (<ExtLink href="https://www.itu.int/hub/2020/04/how-the-world-food-programme-uses-blockchain-to-better-serve-refugees/">ITU: How WFP uses blockchain to better serve refugees</ExtLink>).
      </p>
      <p>
        The resilience benefit lies in shared verification. When multiple agencies rely on a common ledger, reconciliation overhead decreases and disputes can be resolved against a cryptographic record rather than disparate internal databases.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">2.2 Transparent Public Funding and Grant Disbursement</h3>
      <p>
        UNICEF’s CryptoFund accepts and disburses cryptocurrency, including ether, to support open-source and frontier technology initiatives (<ExtLink href="https://www.unicefventurefund.org/crypto-funding">UNICEF Venture Fund crypto funding</ExtLink>). Transactions are publicly verifiable, providing a degree of transparency that traditional banking systems do not inherently offer.
      </p>
      <p>
        For multilateral institutions and NGOs operating across jurisdictions, this transparency enhances donor trust and reduces cross-border settlement friction. While regulatory considerations remain critical, the auditability of transactions introduces a structural improvement in accountability.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">2.3 Cross-Border Credentials and Digital Trust Anchors</h3>
      <p>
        The European Blockchain Services Infrastructure (EBSI) seeks to establish a shared infrastructure for cross-border public services, including digital diplomas and professional credentials (<ExtLink href="https://digital-strategy.ec.europa.eu/en/policies/european-blockchain-services-infrastructure">European Blockchain Services Infrastructure</ExtLink>).
      </p>
      <p>
        Cross-jurisdictional verification of credentials is historically complex, involving bilateral agreements and centralized registries. Anchoring verifiable credentials to a shared ledger enables independent validation without continuous reliance on issuing institutions. If an institution restructures or changes digital systems, previously issued credentials remain verifiable against the ledger.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">2.4 Public Procurement Integrity</h3>
      <p>
        Public procurement processes demand fairness, deadline integrity, and defensible audit trails. Ethereum enables cryptographic commit–reveal schemes, where bid submissions are hashed and recorded before a deadline, then revealed after the submission window closes. The blockchain provides immutable evidence that submissions were not altered post-deadline.
      </p>
      <p>
        This mechanism does not replace procurement law but enhances procedural integrity. By strengthening the technical enforceability of deadlines, institutions can reduce disputes and increase public confidence.
      </p>

      <h2 className="epic-heading-3 mt-8">3. Architectural Patterns for Resilient Deployment</h2>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">3.1 Layered Design: Settlement on L1, Operations on L2</h3>
      <p>
        Ethereum Layer 1 (L1) should not be treated as a general-purpose application database for high-volume public services. Instead, it serves as a settlement and verification layer. High-throughput operations can be conducted on Layer 2 rollups, which periodically anchor their state to Ethereum (rollup overview: <ExtLink href="https://ethereum.org/developers/docs/scaling/optimistic-rollups/">ethereum.org on optimistic rollups</ExtLink>).
      </p>
      <p>
        This layered architecture allows governments to provide user-friendly services while preserving the security guarantees of the base layer. Periodic anchoring ensures that application-level data can be independently verified.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">3.2 Off-Chain Data with On-Chain Commitments</h3>
      <p>
        Public-sector systems often process sensitive personal data. Direct on-chain storage is neither appropriate nor compliant with privacy frameworks in most jurisdictions.
      </p>
      <p>
        A resilient architecture stores sensitive data in secure off-chain systems while anchoring cryptographic hashes or Merkle roots on Ethereum. Any alteration to off-chain records becomes detectable by comparing against on-chain commitments. Zero-knowledge proofs can further enable selective disclosure, allowing auditors to verify compliance without exposing confidential data.
      </p>

      <h3 className="font-serif text-lg font-semibold text-epic-ink mt-6">3.3 Multi-Party Governance Controls</h3>
      <p>
        Ethereum supports multi-signature and programmable governance frameworks that can embed institutional checks and balances directly into control logic. For example, treasury disbursements could require signatures from a ministry, an independent auditor, and a civil society observer.
      </p>
      <p>
        This multi-party design reduces unilateral control risk and aligns technical infrastructure with constitutional principles of separation of powers.
      </p>

      <h2 className="epic-heading-3 mt-8">4. Risk Considerations and Mitigation</h2>
      <p>
        Ethereum is not without challenges. Transaction fee volatility, regulatory ambiguity, and operational complexity must be addressed through careful design. Layer 2 scaling reduces cost exposure. Legal analysis ensures compliance with jurisdictional requirements. Operational training and institutional capacity building are necessary for sustainable deployment.
      </p>
      <p>
        The key principle is proportionality: Ethereum should be used where its unique properties—independent verification, decentralized settlement, tamper-evidence—directly address institutional risk.
      </p>

      <h2 className="epic-heading-3 mt-8">Conclusion</h2>
      <p>
        Ethereum’s relevance to governments, NGOs, and multilateral institutions lies not in speculative finance but in its structural properties as resilient digital infrastructure. Its decentralized validator set, economic security, client diversity, deterministic finality, and programmable settlement logic provide tools for strengthening institutional integrity.
      </p>
      <p>
        When deployed through layered architectures—anchoring proofs and commitments on Ethereum while operating applications off-chain or on rollups—public institutions can enhance transparency, reduce reconciliation friction, and improve long-term continuity.
      </p>
      <p>
        Resilience in public infrastructure is ultimately about trust under stress. Ethereum offers a mechanism for embedding verifiability into the foundation of digital governance systems, reducing reliance on institutional goodwill alone and replacing it with cryptographic assurance.
      </p>
    </article>
  );
}

