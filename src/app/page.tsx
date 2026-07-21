import Link from "next/link";

const stats = [
  {
    num: "100%",
    label:
      "Continuous operation since launch in 2015. Every other network assessed recorded between one and seven outages in the same period.",
    src: "openzeppelin · 2026",
  },
  {
    num: "~$76B",
    label:
      "In staked ETH securing consensus. Finalizing a fraudulent transaction is estimated to cost approximately $50.7B, with automatic on-chain penalties in addition.",
    src: "openzeppelin · mar 2026",
  },
  {
    num: "5+",
    label:
      "Independent client implementations, developed by separate teams in different programming languages. No single software defect can halt the network.",
    src: "openzeppelin · 2026",
  },
  {
    num: "Global",
    label:
      "Validator distribution across continents and legal jurisdictions, with no single country hosting a dominant share. Participation requires only consumer-grade hardware.",
    src: "openzeppelin · 2026",
  },
  {
    num: "11,000+",
    label:
      "Active developers across the EVM ecosystem — the deepest base of tooling, audit firms, and compliance providers of any blockchain platform.",
    src: "openzeppelin · 2026",
  },
  {
    num: "0",
    label:
      "Operating entities. Network integrity does not depend on the solvency or conduct of any company. On one comparable network, a single corporation controls roughly 42% of token supply.",
    src: "openzeppelin · 2026",
  },
];

const crops = [
  {
    letter: "C",
    title: "Censorship resistant",
    body: "No operator, vendor, or external actor can selectively exclude participants or transactions. Access is a property of the protocol, not a policy of a provider.",
  },
  {
    letter: "O",
    title: "Open source",
    body: "Every layer is publicly inspectable and reusable without licence fees. Procurement is not bound to any vendor, and exit paths remain credible throughout the system's life.",
  },
  {
    letter: "P",
    title: "Private",
    body: "Confidentiality for institutions and individuals, with selective disclosure to regulators — consistent with internationally recognized privacy and data-protection standards.",
  },
  {
    letter: "S",
    title: "Secure",
    body: "A decade of continuous operation, economic security in the tens of billions of dollars, and a post-quantum migration roadmap within the core protocol.",
  },
];

const deployments = [
  {
    tag: "dpi · digital identity",
    title: "Kingdom of Bhutan — national digital identity",
    body: "Bhutan is the first country to anchor a nationwide identity framework on a public blockchain. Verifiable credentials are anchored to Ethereum for tamper-evident verification, while personal data remains off-chain under citizen control — a self-sovereign design consistent with data-protection safeguards.",
    evidence: "Status: migration completed early 2026",
    href: "https://decrypt.co/344166/bhutan-national-digital-id-ethereum-early-2026",
  },
  {
    tag: "dpi · digital identity",
    title: "City of Buenos Aires — QuarkID",
    body: "Buenos Aires issues self-sovereign digital credentials to residents through QuarkID, applying zero-knowledge cryptography anchored to Ethereum. Residents determine what information they disclose, and verification does not depend on the availability of a government API.",
    evidence: "Scale: available to approximately 3.6 million residents",
    href: "https://www.biometricupdate.com/202410/buenos-aires-moves-from-centralized-to-decentralized-digital-identity-with-quarkid",
  },
  {
    tag: "dpi · public records",
    title: "India — land registries",
    body: "Authorities in India are piloting Ethereum-anchored land registries to strengthen the integrity of property records, reduce fraud, and simplify transfers. Registries are a natural application of tamper-evident public infrastructure, where record integrity underpins both markets and citizens' rights.",
    evidence: "Status: active pilots, cited in the Ethereum Foundation institutional report (2026)",
    href: "https://blog.ethereum.org/2026/07/01/ethereum-for-institutions",
  },
  {
    tag: "dpi · payments",
    title: "Stablecoin settlement",
    body: "Ethereum mainnet is the primary settlement layer for fiat-referenced stablecoins, used for cross-border payments, corporate treasury operations, and humanitarian disbursement where conventional banking rails are slow, costly, or unavailable.",
    evidence: "Scale: approximately $180B on mainnet — about 60% of global stablecoin supply (mid-2026)",
    href: "https://www.coindesk.com/tech/2026/07/01/ethereum-gets-a-new-nonprofit-focused-on-institutional-adoption",
  },
  {
    tag: "regulated finance · asset issuance",
    title: "Tokenized funds and government securities",
    body: "BlackRock (BUIDL, over $2.5B under management), Franklin Templeton (BENJI, approximately $2B), and Fidelity operate tokenized money-market and treasury funds on Ethereum infrastructure. Tokenized U.S. Treasuries grew from roughly $2B to $9B in eighteen months; Ethereum accounts for about two-thirds of all tokenized real-world assets.",
    evidence: "Trend: the tokenized asset market grew from ~$5.5B (early 2025) to ~$30B (mid-2026) across all networks",
    href: "https://intellectia.ai/blog/tokenized-treasuries-2026-blackrock-buidl",
  },
  {
    tag: "regulated finance · market infrastructure",
    title: "JPMorgan — Kinexys",
    body: "JPMorgan's Kinexys platform has processed more than $1.5 trillion in cumulative transaction volume. The bank launched its first tokenized fund on Ethereum in December 2025 and filed for a second in 2026 — regulated banking products settling on public infrastructure under existing supervisory frameworks.",
    evidence: "Context: Ethereum Institutional, an independent non-profit, launched in July 2026 as a neutral point of contact for banks and asset managers",
    href: "https://news.bitcoin.com/jpm-second-eth-fund/",
  },
  {
    tag: "development finance · transparency",
    title: "UNICEF CryptoFund",
    body: "UNICEF operates a pooled fund of ether and bitcoin that receives, holds, and disburses cryptocurrency directly — the first such vehicle among major international organizations. It provides equity-free investments of up to US$100,000 in ETH, BTC, or USDC to open-source startups in developing and emerging economies, with disbursements traceable on-chain from donor to recipient.",
    evidence: "Track record: investments across dozens of startups in low- and middle-income countries since 2019; new blockchain cohorts continuing in 2026",
    href: "https://www.unicef.org/innovation/stories/unicef-cryptofund",
  },
  {
    tag: "development · sustainable financing",
    title: "Giga — school connectivity",
    body: "Giga, the UNICEF–ITU initiative working to connect every school to the internet, uses Ethereum in two ways: schools report connectivity measurements to a public chain for transparent, verifiable monitoring, and an impact-staking model lets donors direct Ethereum staking rewards to connectivity financing while retaining their principal — demonstrated with the Government of Rwanda.",
    evidence: "Scale: engaged in 39 countries; Rwanda proof of concept financed school connectivity through staking rewards",
    href: "https://giga.global/giga-finances-school-connectivity-in-rwanda-through-ethereum-staking/",
  },
  {
    tag: "humanitarian · aid distribution",
    title: "Xcapit AidLink — humanitarian cash transfers",
    body: "AidLink, built by UNICEF Venture Fund portfolio company Xcapit with partners in Nepal and Kenya, delivers humanitarian cash transfers over blockchain rails — including an SMS-based wallet that operates on basic phones without internet access. A pilot in Cusco, Peru reached 270 beneficiaries; a second in Nairobi (December 2025) delivered USDC to recipients who converted it to local currency through M-Pesa.",
    evidence: "Design: open source, multichain including Ethereum; built for low-connectivity environments and local-language support",
    href: "https://www.xcapit.com/en/case-studies/shelter-aidlink",
  },
];

const capabilities = [
  {
    mechanism: "ERC-7573",
    provides: "Conditional, atomic delivery-versus-payment settlement (DvP/PvP)",
    requirement: "Settlement between cash and assets without counterparty risk",
  },
  {
    mechanism: "Viewing keys",
    provides: "Read-only access to encrypted records, with access logging",
    requirement: "Scoped supervisory and audit visibility over otherwise confidential transactions",
  },
  {
    mechanism: "Attestations",
    provides: "Cryptographic claims verifiable without recourse to the issuer's systems",
    requirement: "Credential and compliance verification that survives vendor failure",
  },
  {
    mechanism: "Zero-knowledge proofs",
    provides: "Proof of a fact — age, solvency, eligibility — without disclosure of underlying data",
    requirement: "Privacy-preserving identity, eligibility, and reporting; no personal data on-chain",
  },
  {
    mechanism: "Stealth addresses",
    provides: "Single-use addresses that prevent linkage of a party's transactions",
    requirement: "Payment confidentiality toward non-participants",
  },
];

const pathways = [
  {
    title: "Confidential institutional settlement.",
    body: "Bonds, repurchase agreements, foreign exchange, and money-market instruments settling atomically on public infrastructure with visibility restricted to stakeholders and supervisors.",
  },
  {
    title: "Sovereign digital currency infrastructure.",
    body: "The confidentiality mechanisms developed for stablecoins apply equally to central bank digital currencies and tokenized deposits, in jurisdictions pursuing those instruments.",
  },
  {
    title: "Resilient service delivery.",
    body: "Disbursement systems, identity continuity, and civic records designed to remain operational through conflict, natural disaster, or infrastructure failure — a core concern for any state investing in digital public infrastructure.",
  },
  {
    title: "Registries, procurement, and supply chains.",
    body: "Provenance, attestation, and record-integrity systems for processes in which multiple parties must coordinate without a single trusted intermediary.",
  },
  {
    title: "Post-quantum security.",
    body: "A migration roadmap within the core protocol, supported by a dedicated research programme — relevant to any infrastructure intended to operate for decades.",
  },
];

const resources = [
  {
    title: "Ethereum Basics for Governments and Institutions",
    body: "The Ethereum Foundation's non-technical primer for public-sector and institutional leaders: how Ethereum works, how it is governed, how it compares with alternatives, and where it is deployed. Published July 2026.",
    href: "/docs/ethereum-basics-for-governments-and-institutions.pdf",
    cta: "Read the report",
    primary: true,
    internal: false,
  },
  {
    title: "The Ethereum Foundation Mandate",
    body: "The Foundation's constitutional document: its role as one steward among many, the four protocol properties, and its commitment to reducing its own influence over time. Published March 2026.",
    href: "https://ethereum.foundation/ef-mandate.pdf",
    cta: "Read the Mandate",
    primary: true,
    internal: false,
  },
  {
    title: "Why neutral infrastructure matters now",
    body: "The Ethereum Foundation's introduction to the institutional report, including the comparative technical assessment of layer 1 networks.",
    href: "https://blog.ethereum.org/2026/07/01/ethereum-for-institutions",
    cta: "Read the article",
    primary: false,
    internal: false,
  },
  {
    title: "Map explorer",
    body: "An interactive map of GovTech and digital public infrastructure domains where Ethereum can be applied — taxonomy, relationships, prior experiments, and opportunities.",
    href: "/map",
    cta: "Explore the map",
    primary: true,
    internal: true,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 block font-mono text-xs uppercase tracking-[0.14em] text-epic-slate-muted">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero — report cover treatment */}
      <section className="relative overflow-hidden bg-epic-navy bg-epic-grid-dark bg-grid" id="overview">
        <div
          aria-hidden
          className="absolute -bottom-28 -right-24 h-[22rem] w-[24rem] rounded-[3rem] bg-epic-yellow"
        />
        <div className="epic-section relative z-10 py-20">
          <span className="font-mono text-sm font-medium tracking-[0.14em] text-epic-yellow">
            real-world ethereum · digital public infrastructure
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-epic-yellow sm:text-display">
            Ethereum as digital public infrastructure
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-slate-300">
            A briefing for governments, public agencies, international organizations, and regulated
            institutions evaluating shared infrastructure for digital identity, payments, and data
            exchange.
          </p>
          <p className="mt-4 max-w-2xl text-slate-400">
            Digital identity, payments, and data exchange are increasingly recognized as foundational
            public infrastructure, and international frameworks for digital public infrastructure call
            for systems that are inclusive, transparent, accountable, and rights-respecting. This
            briefing sets out where Ethereum already performs these functions in production, the
            independent evidence for its reliability, and the technical mechanisms that reconcile
            public-network deployment with regulatory obligations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/docs/ethereum-basics-for-governments-and-institutions.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-epic-yellow px-5 py-2.5 text-sm font-semibold text-epic-navy transition-opacity hover:opacity-90"
            >
              Read the full report (PDF)
            </a>
            <a
              href="#engage"
              className="inline-flex items-center rounded-full border border-epic-navy-muted px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-epic-yellow hover:text-epic-yellow"
            >
              Contact the institutional team
            </a>
          </div>
        </div>
      </section>

      {/* 01 Context */}
      <section className="bg-epic-surface bg-epic-grid bg-grid" id="context">
        <div className="epic-section">
          <SectionLabel>01 · context</SectionLabel>
          <h2 className="epic-heading-2">Digital public infrastructure requires credible neutrality</h2>
          <p className="mt-4 epic-body">
            Governments worldwide are investing in digital public infrastructure. International
            safeguards guidance for DPI identifies the risks that accompany this investment: privacy
            vulnerabilities, digital exclusion, cybersecurity threats, institutional weakness, and
            erosion of public trust.
          </p>
          <p className="mt-4 epic-body">
            Many of these risks share a common structural cause. Where infrastructure depends on a
            single operator — a vendor, a platform, or a foreign service provider — that operator
            becomes a single point of failure and a single point of control. Recent years have seen
            cloud outages interrupt government services, payment systems restricted across borders, and
            identity providers breached at national scale. An operator under commercial or geopolitical
            pressure can alter terms, restrict access, or withdraw service, regardless of the
            agreements in place.
          </p>
          <p className="mt-4 epic-body">
            Credibly neutral infrastructure addresses this cause directly: the rules are enforced by
            the protocol itself rather than by the discretion of any party. Deploying on Ethereum
            introduces no new counterparty. No entity — including the Ethereum Foundation — can
            restrict access to the network, reorder its priorities for commercial advantage, or
            discontinue it. For a government, this preserves sovereignty over its own systems while
            enabling interoperability with others.
          </p>
        </div>
      </section>

      {/* 02 Evidence */}
      <section className="bg-epic-paper bg-epic-grid bg-grid" id="evidence">
        <div className="epic-section-wide">
          <SectionLabel>02 · evidence</SectionLabel>
          <h2 className="epic-heading-2">Independent assessment</h2>
          <p className="mt-4 max-w-3xl epic-body">
            Blockchain networks differ fundamentally in architecture and governance. Some operate as
            open public infrastructure; others are, in effect, corporate products whose insiders set
            the rules. The distinction determines whether a network can serve as public infrastructure
            for decades. The figures below are drawn from OpenZeppelin&apos;s comparative technical
            risk assessment of layer 1 networks, cited in the Ethereum Foundation&apos;s institutional
            report; data as of March 2026 unless stated otherwise.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <div key={s.num + s.src} className="rounded-epic-lg bg-white p-6">
                <div className="font-mono text-3xl font-semibold text-epic-ink">{s.num}</div>
                <p className="mt-2 text-sm text-slate-600">{s.label}</p>
                <div className="mt-3 font-mono text-[0.68rem] uppercase tracking-wider text-epic-slate-subtle">
                  {s.src}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 Design principles */}
      <section className="bg-epic-surface bg-epic-grid bg-grid" id="foundations">
        <div className="epic-section">
          <SectionLabel>03 · design principles</SectionLabel>
          <h2 className="epic-heading-2">Alignment with DPI safeguards</h2>
          <p className="mt-4 epic-body">
            The central question for any public infrastructure is whether it protects the people who
            depend on it: their privacy, their access, and their recourse. Ethereum&apos;s development
            is anchored in four properties, published in the{" "}
            <a href="https://ethereum.foundation/ef-mandate.pdf" className="underline">
              Ethereum Foundation Mandate
            </a>{" "}
            (March 2026), that address these questions at the protocol level.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {crops.map((c) => (
              <div key={c.letter} className="rounded-epic-lg bg-white p-6">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-epic-yellow font-mono text-xl font-semibold text-epic-navy">
                  {c.letter}
                </span>
                <h3 className="epic-heading-3 text-base">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 epic-body">Two further principles guide institutional deployment design:</p>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3 epic-body">
              <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 rounded-sm border border-epic-slate-subtle bg-epic-yellow" />
              <span>
                <strong className="text-epic-ink">Continuity independent of any single party.</strong>{" "}
                A well-designed deployment continues to function if the original vendor, integrator, or
                the Ethereum Foundation itself ceases to participate. Institutions and citizens retain
                their records, assets, and verification capabilities.
              </span>
            </li>
            <li className="flex gap-3 epic-body">
              <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 rounded-sm border border-epic-slate-subtle bg-epic-yellow" />
              <span>
                <strong className="text-epic-ink">Protection calibrated to the relationship.</strong>{" "}
                Institution-to-institution systems, such as interbank settlement, involve counterparties
                of comparable standing. Institution-to-citizen systems do not, and are therefore
                designed so that the architecture itself protects the individual — consistent with
                established principles of accountability and redress.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 04 Deployments */}
      <section className="bg-epic-paper bg-epic-grid bg-grid" id="deployments">
        <div className="epic-section-wide">
          <SectionLabel>04 · deployments</SectionLabel>
          <h2 className="epic-heading-2">In production today</h2>
          <p className="mt-4 max-w-3xl epic-body">
            Across the three core DPI functions — identity, payments, and data exchange — and in
            regulated financial markets, Ethereum is in production use by national governments, city
            administrations, international development organizations, and globally systemic financial
            institutions.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {deployments.map((d) => (
              <div key={d.title} className="rounded-epic-lg bg-white p-6">
                <span className="mb-3 inline-block rounded-full bg-slate-200 px-3 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-epic-ink">
                  {d.tag}
                </span>
                <h3 className="epic-heading-3 text-base">{d.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{d.body}</p>
                <p className="mt-4 border-t border-epic-border-subtle pt-3 text-xs text-epic-slate-muted">
                  {d.evidence} ·{" "}
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-epic-ink underline"
                  >
                    source ↗
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 Capabilities */}
      <section className="bg-epic-surface bg-epic-grid bg-grid" id="capabilities">
        <div className="epic-section-wide">
          <SectionLabel>05 · capabilities</SectionLabel>
          <h2 className="epic-heading-2">Meeting institutional requirements on public infrastructure</h2>
          <p className="mt-4 max-w-3xl epic-body">
            Institutional deployment carries specific requirements: confidentiality with scoped
            regulatory access, atomic settlement, verifiable credentials, and freedom from vendor
            dependency. Each maps to established, openly documented Ethereum standards and techniques.
          </p>
          <div className="mt-8 overflow-x-auto rounded-epic-lg bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-epic-navy">
                  <th className="px-4 py-3 font-mono text-[0.68rem] font-medium uppercase tracking-wider text-epic-yellow">
                    Mechanism
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.68rem] font-medium uppercase tracking-wider text-epic-yellow">
                    What it provides
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.68rem] font-medium uppercase tracking-wider text-epic-yellow">
                    Requirement addressed
                  </th>
                </tr>
              </thead>
              <tbody>
                {capabilities.map((c) => (
                  <tr key={c.mechanism} className="border-b border-epic-border-subtle last:border-b-0 align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-epic-ink">
                      {c.mechanism}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.provides}</td>
                    <td className="px-4 py-3 text-slate-600">{c.requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 rounded-epic bg-epic-yellow-soft p-4 text-sm text-epic-ink">
            The prevailing design principle: transaction amounts, counterparties, and workflow metadata
            are concealed from non-participants; the existence of transactions, contract code, and
            credential schemas remain public and auditable; regulators receive scoped access through
            viewing keys and attestations. These mechanisms are designed to satisfy KYC, AML,
            sanctions, and record-keeping obligations on public infrastructure — not to circumvent
            them.
          </p>
        </div>
      </section>

      {/* 06 Pathways */}
      <section className="bg-epic-paper bg-epic-grid bg-grid" id="pathways">
        <div className="epic-section">
          <SectionLabel>06 · pathways</SectionLabel>
          <h2 className="epic-heading-2">Areas under active development</h2>
          <p className="mt-4 epic-body">
            The deployments above rest on foundations that extend to a broader set of public-sector and
            institutional applications now moving from design to pilot:
          </p>
          <ul className="mt-4 space-y-3">
            {pathways.map((p) => (
              <li key={p.title} className="flex gap-3 epic-body">
                <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 rounded-sm border border-epic-slate-subtle bg-epic-yellow" />
                <span>
                  <strong className="text-epic-ink">{p.title}</strong> {p.body}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 epic-body">
            Institutions evaluating this field face two related decisions: which neutral infrastructure
            to adopt for coordination with other parties while preserving their own sovereignty, and
            how to regulate a category of infrastructure that has no controlling entity. The evidence
            and resources assembled here are intended to inform both.
          </p>
        </div>
      </section>

      {/* 07 Engage */}
      <section className="bg-epic-navy bg-epic-grid-dark bg-grid" id="engage">
        <div className="epic-section">
          <span className="mb-3 block font-mono text-xs uppercase tracking-[0.14em] text-epic-slate-muted">
            07 · engagement
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-epic-yellow sm:text-3xl">
            Exploring Ethereum for your institution
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            The Ethereum Foundation works with governments, public agencies, international
            organizations, and regulated institutions evaluating Ethereum as digital public
            infrastructure — from initial technical briefings through architecture review and pilot
            design. Engagement is advisory and vendor-neutral: the Foundation sells nothing and holds
            no commercial stake in deployment decisions.
          </p>
          <p className="mt-4 max-w-2xl text-slate-400">
            To arrange a briefing or discuss a specific use case, contact the institutional team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:info@ethereum.org?subject=Institutional%20enquiry%20—%20Ethereum%20as%20DPI"
              className="inline-flex items-center rounded-full bg-epic-yellow px-5 py-2.5 text-sm font-semibold text-epic-navy transition-opacity hover:opacity-90"
            >
              Contact the institutional team
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-epic-navy-muted px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-epic-yellow hover:text-epic-yellow"
            >
              Contact form
            </Link>
          </div>
        </div>
      </section>

      {/* 08 Resources */}
      <section className="bg-epic-surface bg-epic-grid bg-grid" id="resources">
        <div className="epic-section">
          <SectionLabel>08 · resources</SectionLabel>
          <h2 className="epic-heading-2">Primary resources</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {resources.map((r) => (
              <div key={r.title} className="flex flex-col rounded-epic-lg bg-white p-6">
                <h3 className="epic-heading-3 text-base">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{r.body}</p>
                <div className="mt-4">
                  {r.internal ? (
                    <Link
                      href={r.href}
                      className="inline-flex items-center rounded-full bg-epic-navy px-4 py-2 text-sm font-semibold text-epic-yellow transition-opacity hover:opacity-90"
                    >
                      {r.cta}
                    </Link>
                  ) : (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        r.primary
                          ? "inline-flex items-center rounded-full bg-epic-navy px-4 py-2 text-sm font-semibold text-epic-yellow transition-opacity hover:opacity-90"
                          : "inline-flex items-center rounded-full border border-epic-slate-subtle px-4 py-2 text-sm font-semibold text-epic-ink transition-colors hover:border-epic-ink"
                      }
                    >
                      {r.cta}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
