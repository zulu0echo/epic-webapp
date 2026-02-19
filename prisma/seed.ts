import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAGS = (arr: string[]) => JSON.stringify(arr);
const PRIMITIVES = (arr: string[]) => JSON.stringify(arr);

type DomainSpec = {
  name: string;
  definition: string;
  summary: string;
  challenges: string;
  opportunities: string;
  tags: string[];
  primitives: string[];
  maturityLevel: string;
  valueProposition?: string;
  relatedLinks?: { label: string; url: string }[];
  keyActors: { name: string; type: string; country?: string }[];
  experiments: { title: string; year?: number; blockchain?: string; description?: string }[];
  children?: DomainSpec[];
};

const LINKS = (arr: { label: string; url: string }[]) => JSON.stringify(arr);

const REFS = {
  OGP: "https://www.opengovpartnership.org/wp-content/uploads/2025/04/OGP-National-Handbook-Foundations-for-Open-Government-2025.pdf",
  W3C_VC: "https://www.w3.org/TR/vc-data-model-2.0/",
  OECD_DPI: "https://www.oecd.org/en/publications/digital-public-infrastructure-for-digital-governments_ff525dc8-en.html",
  EBSI: "https://digital-strategy.ec.europa.eu/en/policies/european-blockchain-services-infrastructure",
  OCDS: "https://standard.open-contracting.org/latest/en/",
  WorldBank_DPI: "https://documents1.worldbank.org/curated/en/099031025172027713/pdf/P505739-84c5073b-9d40-4b83-a211-98b2263e87dd.pdf",
  EBSI_VC: "https://ec.europa.eu/digital-building-blocks/sites/spaces/EBSI/pages/600343491/EBSI%2BVerifiable%2BCredentials",
  UNFCCC_MRV: "https://unfccc.int/process-and-meetings/transparency-and-reporting/support-for-developing-countries/consultative-group-of-experts/measurement-reporting-and-verification-technical-material",
  WorldBank_MRV: "https://documents1.worldbank.org/curated/en/099053403062552943/pdf/IDU-10439aa5-07c9-47ad-8e86-ecd92bfaba75.pdf",
  WorldBank_MRV_Explainer: "https://www.worldbank.org/en/news/feature/2022/07/27/what-you-need-to-know-about-the-measurement-reporting-and-verification-mrv-of-carbon-credits",
  Springer_dMRV: "https://link.springer.com/article/10.1007/s12599-025-00953-3",
  UNICEF_CryptoFund: "https://www.unicef.org/innovation/stories/unicef-cryptofund",
  WFP_BuildingBlocks: "https://www.wfp.org/building-blocks",
  UNESCO_Credentials: "https://unesdoc.unesco.org/ark%3A/48223/pf0000264428.pdf",
  HL7_FHIR: "https://fhir.hl7.org/fhir/overview.html",
  GS1_Healthcare: "https://www.gs1.org/industries/healthcare/traceability",
  WorldBank_G2Px: "https://www.worldbank.org/en/programs/g2px",
  WorldBank_G2Px_Brief: "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099053025155641027",
  WorldBank_Registries: "https://openknowledge.worldbank.org/bitstreams/98ae95ed-e494-4ed7-a417-db01e662af68/download",
  Georgia_Land: "https://bitfury.com/content/downloads/the_bitfury_group_republic_of_georgia_expand_blockchain_pilot_2_7_16.pdf",
  WorldBank_Property: "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099321504142526631",
  WorldBank_Delivery: "https://www.worldbank.org/en/topic/socialprotection/brief/digital-delivery-systems",
  GS1_Traceability: "https://www.gs1.org/standards/gs1-global-traceability-standard/current-standard",
  WCO_DataModel: "https://www.wcoomd.org/datamodel",
};

const TAXONOMY: DomainSpec[] = [
  {
    name: "Digital Identity & Credentials",
    definition: "Digital identity and credentials provide ways to prove attributes (identity, qualifications, eligibility) to access services and participate in regulated processes. Modern systems increasingly emphasize privacy, interoperability, and minimizing data disclosure, rather than building single centralized identity databases. Verifiable credentials offer a standards-based model for issuing and verifying cryptographically secured claims with explicit security and privacy considerations. (W3C Verifiable Credentials)",
    summary: "Foundational layer for access to services, benefits, and rights; includes civil registry, verifiable credentials, and humanitarian ID.",
    challenges: "Identity systems can become surveillance infrastructure if they centralize data or encourage over-collection across services. Interoperability across agencies and borders is difficult, especially for revocation, assurance levels, and governance frameworks. Humanitarian contexts add extra constraints around safety, offline access, and minimizing harm to displaced or vulnerable populations. (OECD)",
    opportunities: "Ethereum can act as a neutral layer for attestation registries, credential status, and interoperability anchors, enabling multiple issuers/verifiers without one institution owning the entire trust system. Selective disclosure and ZK-based proofs can support KYC/KYB-like requirements while reducing personal data exposure. This approach aligns with DPI framing: reusable digital identity and data-sharing building blocks that can unlock many services. (World Bank)",
    tags: ["identity", "credentials", "VC", "KYC", "privacy", "interoperability", "humanitarian", "inclusion"],
    primitives: ["attestation", "verifiable credentials", "selective disclosure", "ZK proofs", "account abstraction"],
    maturityLevel: "pilot",
    keyActors: [
      { name: "Civil registries / national ID authorities", type: "gov", country: "Various" },
      { name: "Sector agencies (health, education, finance)", type: "gov" },
      { name: "Regulated institutions (banks, telecoms)", type: "agency" },
      { name: "Standards bodies / wallet providers", type: "coalition" },
      { name: "UNHCR / humanitarian ID initiatives", type: "NGO" },
    ],
    experiments: [
      { title: "EBSI verifiable credentials", year: 2024, blockchain: "Ethereum", description: "Notable public-sector initiative exploring shared infrastructure for credentials and public services." },
      { title: "Humanitarian and development identity/credentialing", year: 2023, blockchain: "mixed", description: "Reducing leakage and improving accountability while protecting beneficiary privacy; identity/eligibility checks with auditable records; common pattern: PII offchain, onchain registries/proofs for verification and auditability." },
    ],
    valueProposition: "Ethereum provides a neutral, decentralized anchor for attestations and verifiable credentials. Governments can issue and revoke credentials without vendor lock-in; citizens get portable identity that works across borders. Selective disclosure (e.g. ZK proofs) preserves privacy while enabling verification. Experts: identity governance, VC architects, wallet UX, cryptographers (ZK/selective disclosure), security auditors, policy counsel, operational experts for constrained environments.",
    relatedLinks: [
      { label: "W3C Verifiable Credentials Data Model v2.0", url: REFS.W3C_VC },
      { label: "OECD DPI components", url: REFS.OECD_DPI },
      { label: "World Bank DPI approach", url: REFS.WorldBank_DPI },
      { label: "EBSI Verifiable Credentials", url: REFS.EBSI_VC },
      { label: "Ethereum Attestation Service (EAS)", url: "https://attest.sh" },
      { label: "Bhutan NDI / digital identity", url: "https://ethereum.org/en/use-cases/digital-identity/" },
    ],
    children: [
      { name: "Civil registry", definition: "Official record of births, deaths, citizenship.", summary: "Source of truth for legal identity.", challenges: "Civil registries are often legacy, paper-based or in closed systems with limited APIs; modernisation is costly and politically sensitive. Single points of failure create availability and security risks. Inter-country verification (e.g. for migration or marriage) is cumbersome and often manual.", opportunities: "Tamper-evident registries and attestations can anchor issuance and updates so that other countries or agencies can verify records without full data sharing. Merkle proofs and selective disclosure support privacy while enabling verification. Neutral infrastructure can reduce vendor lock-in.", tags: ["registry", "identity"], primitives: ["attestation", "registries"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Verifiable credentials", definition: "Cryptographically verifiable claims (W3C VC, EAS).", summary: "Portable, privacy-preserving credentials.", challenges: "Adoption requires issuers, verifiers, and wallet or app providers to align on standards and UX. Revocation and key lifecycle management (loss, rotation) need clear governance. Performance and usability for non-technical users remain barriers at scale.", opportunities: "Sovereign issuance with open standards gives governments control without lock-in. Selective disclosure and ZK proofs enable verify-without-reveal. Interoperability across sectors and borders is possible with W3C VC and ecosystem tools (e.g. EAS).", tags: ["VC", "credentials", "privacy"], primitives: ["verifiable credentials", "attestation", "ZK proofs"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Selective disclosure", definition: "Prove a claim without revealing full credential.", summary: "Privacy-preserving verification.", challenges: "UX for selective disclosure—explaining to users what is being shared—is non-trivial. Performance of ZK proofs and key management for many attributes can be demanding. Legal and regulatory acceptance of ZK-based verification is still evolving.", opportunities: "Minimal disclosure reduces privacy risk and supports compliance (e.g. data minimization). ZK-based proofs can prove range, membership, or relations without revealing underlying data. Attestation and commitment schemes offer lighter-weight options where full ZK is not needed.", tags: ["privacy", "ZK", "credentials"], primitives: ["ZK proofs", "selective disclosure"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "KYC/KYB", definition: "Know-your-customer / business verification.", summary: "Compliance and onboarding.", challenges: "Regulation (AML/KYC) varies by jurisdiction and sector; reuse of KYC across institutions is often not permitted or is contractually restricted. Duplicate onboarding is costly for firms and burdensome for users. Storing or sharing KYC data raises privacy and security concerns.", opportunities: "Reusable KYC via attestations or verifiable credentials—e.g. 'accredited KYC provider attests that this entity was verified'—can reduce duplication while preserving regulatory responsibility. Attestation-based flows allow relying parties to verify without holding raw documents. Interoperability with identity frameworks (eIDAS, national ID) is emerging.", tags: ["KYC", "compliance", "identity"], primitives: ["attestation", "verifiable credentials"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Humanitarian IDs", definition: "Identity for refugees and displaced populations.", summary: "Portable, durable identity in crises.", challenges: "In crises, stable infrastructure (power, connectivity, government systems) is often absent. Inclusion of the most vulnerable—elderly, disabled, without documents—is hard. Cross-border recognition by host countries and aid agencies is inconsistent. Durability of identity across displacement and time is critical.", opportunities: "Self-sovereign or agency-issued portable credentials can persist across borders and organisations. Attestations from trusted humanitarian actors can be verified by others without centralised databases. Neutral infrastructure avoids dependence on any single government or vendor. Pilots (e.g. UNHCR, ICRC) show feasibility in field conditions.", tags: ["humanitarian", "identity", "inclusion"], primitives: ["verifiable credentials", "attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
    ],
  },
  {
    name: "Payments & Public Finance",
    definition: "Payments and public finance covers government-to-person disbursements, procurement spending, invoicing, treasury reporting, and fiscal transparency. The World Bank's G2Px initiative highlights the importance of modern G2P payments architectures and their connection to core DPI capabilities. Blockchain intersects where auditability, programmability, and integrity matter—especially across multiple implementing partners. (World Bank G2Px)",
    summary: "Movement of public funds with transparency and accountability.",
    challenges: "G2P programs face leakage, fraud, and high administrative costs, especially when identity, eligibility, and payments rails are fragmented. Procurement systems are complex and vulnerable to opacity, weak disclosure, and vendor collusion, which reduces public trust and increases waste. Treasury transparency initiatives often struggle with data timeliness and standardization, making it hard for auditors and citizens to follow the money. (World Bank)",
    opportunities: "Ethereum can provide auditable commitments and attestations across disbursement workflows—e.g., \"this payment batch was authorized,\" \"this milestone was verified,\" \"this invoice was approved\"—without exposing beneficiary data. Open contracting standards can be paired with integrity proofs so published procurement datasets are verifiably complete and unchanged after publication. In constrained contexts, programmable escrow and milestone-based disbursements can reduce coordination overhead among donors, implementers, and oversight bodies. (Open Contracting Data Standard)",
    tags: ["payments", "G2P", "treasury", "aid", "public finance", "transparency"],
    primitives: ["account abstraction", "L2s", "stablecoins", "programmable payments", "attestation"],
    maturityLevel: "pilot",
    keyActors: [
      { name: "Finance ministries / treasuries", type: "gov" },
      { name: "Social protection agencies / procurement authorities", type: "gov" },
      { name: "Supreme audit institutions / payment service providers", type: "agency" },
      { name: "Multilaterals / donors / civil society monitors", type: "NGO" },
    ],
    experiments: [
      { title: "WFP Building Blocks", year: 2023, blockchain: "Ethereum", description: "Humanitarian cash-transfer oriented blockchain approach; coordination among organizations and adapted program designs." },
      { title: "UNICEF CryptoFund", year: 2023, blockchain: "Ethereum", description: "UN entity receiving/holding/disbursing crypto assets with transparency narrative around onchain transfer records." },
      { title: "Procurement transparency (OCDS + integrity)", year: 2023, blockchain: "Ethereum", description: "Standardized publication (e.g., OCDS) evolving toward verifiable integrity layers for disclosure pipelines." },
    ],
    valueProposition: "Ethereum and L2s offer transparent, programmable rails for public payments. Conditional disbursement (e.g. release on attestation), aid traceability, and lower-cost settlement can reduce leakage and build trust. No single operator controls the network. Experts: public financial management, payments architects, procurement specialists, auditors, fraud/risk analysts, cryptography/security engineers, legal counsel.",
    relatedLinks: [
      { label: "World Bank G2Px", url: REFS.WorldBank_G2Px },
      { label: "G2Px Evidence Brief", url: REFS.WorldBank_G2Px_Brief },
      { label: "Open Contracting Data Standard", url: REFS.OCDS },
      { label: "WFP Building Blocks", url: REFS.WFP_BuildingBlocks },
      { label: "UNICEF CryptoFund", url: REFS.UNICEF_CryptoFund },
    ],
    children: [
      { name: "G2P payments", definition: "Government-to-person transfers (benefits, subsidies).", summary: "Direct disbursement to citizens.", challenges: "Leakage—funds diverted or lost—and identity issues (wrong recipient, duplicate claims) are common where verification is weak. Last-mile delivery in rural or low-connectivity areas is difficult. Conditional payments (e.g. release when a child is enrolled in school) are hard to enforce transparently with current systems.", opportunities: "Conditional release tied to attested eligibility or milestones (e.g. attestation from school) can improve targeting and accountability. Transparent rails give auditors and citizens visibility. Lower-cost settlement (e.g. L2s, stablecoins where permitted) can extend reach and reduce fees. Account abstraction can simplify UX and support sponsored transactions.", tags: ["G2P", "payments", "benefits"], primitives: ["programmable payments", "attestation", "L2s"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Procurement & invoicing", definition: "Public procurement and payment to suppliers.", summary: "Transparent procurement and settlement.", challenges: "Fraud and collusion in procurement are significant; opacity in contract award and execution makes detection hard. Invoicing and payment are often manual and delayed. Disputes and reconciliation are costly.", opportunities: "Audit trail of commitments, milestones, and payments can improve transparency and deter fraud. Smart contracts or programmable logic can release payment when attested milestones are met. Attestations from auditors or inspectors can feed into payment conditions. Shared, verifiable records can streamline reconciliation.", tags: ["procurement", "public finance"], primitives: ["attestation", "smart contracts"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Aid disbursement", definition: "Humanitarian and development aid flows.", summary: "End-to-end traceability of aid.", challenges: "Fragmentation across many donors and implementers makes it hard to see who gave what, to whom, and with what outcome. Reporting burden on implementers is high; data is often inconsistent or late. Beneficiary verification and avoidance of duplication are difficult in crises.", opportunities: "Donor visibility: commitments and disbursements can be recorded on shared, verifiable rails. Beneficiary verification via attestations or credentials can support targeting and reduce duplication. Outcome attestations (e.g. delivery confirmed) can close the loop. Pilots show that traceability is achievable without centralising sensitive data.", tags: ["aid", "humanitarian", "transparency"], primitives: ["attestation", "registries", "L2s"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Treasury transparency", definition: "Public visibility into treasury operations.", summary: "Auditable public finance.", challenges: "Treasury operations are politically and commercially sensitive; full real-time transparency may be undesirable. Legacy systems and accounting conventions make it hard to expose commitments and execution in a standard way. Citizens and oversight bodies often lack tools to interpret raw data.", opportunities: "Commitment and execution can be recorded in a tamper-evident way (e.g. hashes or attestations) to support ex-post audit and accountability. Selective disclosure can balance transparency with sensitivity. Open standards can enable third-party tools for analysis and visualization.", tags: ["treasury", "transparency", "public finance"], primitives: ["registries", "attestation"], maturityLevel: "idea", keyActors: [], experiments: [] },
    ],
  },
  {
    name: "Registries & Records",
    definition: "Registries and records are core state infrastructure: land, business, licensing, certificates, and other authoritative datasets. DPI framing frequently includes core government registries as foundational components for digital services. Blockchain intersects where registries require durable integrity, traceable change history, and multi-agency verification workflows. (OECD)",
    summary: "Immutable or tamper-evident records of ownership and entitlements.",
    challenges: "Registries face disputes, fraud, and administrative corruption risks when processes are opaque or records are alterable without accountability. Interoperability and identity are recurring blockers: inconsistent identifiers and paper-heavy workflows slow digitization and verification. Many countries also struggle with digitization coverage, cybersecurity risks, and governance capacity for long-lived record systems. (World Bank Open Knowledge Repository)",
    opportunities: "Ethereum can anchor integrity proofs and change logs for registry events while keeping full records in government-controlled systems. Multi-party attestations (e.g., notary + registry + tax authority) can provide stronger assurance for transfers and updates without creating a single point of failure. Over time, this can support interoperable registry services that other public systems reuse—aligned with DPI approaches focused on shared building blocks. (World Bank)",
    tags: ["registries", "land", "business", "licensing", "certificates"],
    primitives: ["registries", "attestation", "merkle proofs"],
    maturityLevel: "pilot",
    keyActors: [
      { name: "Land and cadastre agencies", type: "gov" },
      { name: "Business registrars", type: "gov" },
      { name: "Licensing authorities / courts / notaries / tax agencies", type: "gov" },
      { name: "Digital government teams", type: "gov" },
      { name: "Banks, insurers, real estate (private sector stakeholders)", type: "agency" },
    ],
    experiments: [
      { title: "Georgia land registry pilot", year: 2016, blockchain: "mixed", description: "Widely cited early government blockchain experiment for land title integrity and registry modernization; coverage, interoperability, and governance are critical success factors. Mature pattern: authoritative data offchain, verifiable commitments and attestations for audits and dispute resolution." },
    ],
    valueProposition: "Registries on Ethereum provide a tamper-evident, shared source of truth. Ownership and entitlements can be anchored on-chain with attestations for updates; Merkle proofs enable efficient verification without storing full data on-chain. Experts: land administration and property institutions, registry modernization, legal workflow design (notaries/courts), public sector cybersecurity, cryptography for integrity proofs and multi-party attestations, data interoperability architects.",
    relatedLinks: [
      { label: "OECD DPI (registries as key components)", url: REFS.OECD_DPI },
      { label: "World Bank DPI approach", url: REFS.WorldBank_DPI },
      { label: "World Bank property registries / digitalization", url: REFS.WorldBank_Property },
      { label: "Georgia blockchain land registry", url: REFS.Georgia_Land },
      { label: "Land registry case studies", url: "https://ethereum.org/en/use-cases/#government" },
    ],
    children: [
      { name: "Land registry", definition: "Official record of land ownership and transactions.", summary: "Title and cadastre.", challenges: "Land is politically sensitive; reforms can be contested. Legacy systems are often paper or siloed digital systems. Disputes over boundaries, inheritance, and transfers are common; dispute-resolution mechanisms must be credible. Fraud (fake titles, duplicate sales) persists where verification is weak.", opportunities: "Tamper-evident history of transactions and updates can reduce fraud and support dispute resolution. Merkle proofs and attestations allow verification without centralising all title data. Fractional or shared ownership can be represented and transferred with clear audit trails. Interoperability with other registries (e.g. identity) can support verification of parties.", tags: ["land", "registry"], primitives: ["registries", "attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Business registry", definition: "Official register of companies and entities.", summary: "Legal entity identification.", challenges: "Interoperability across countries and sectors is limited; updates (e.g. directors, address) are often slow to propagate. Verification of legal existence and good standing is manual in many contexts. Fraud (shell companies, misrepresentation) is a concern.", opportunities: "Global identifiers and verified attributes (e.g. attestations from registry or tax authority) can streamline KYC/KYB and trade. Open, standardised schemas support cross-border recognition. Real-time or near-real-time updates with an audit trail can improve accuracy and trust.", tags: ["business", "registry"], primitives: ["attestation", "registries"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Licensing", definition: "Licenses and permits (professional, trade).", summary: "Proof of authorization.", challenges: "Renewal and continuing education or compliance are hard to track across many license types. Portability—using a license in another jurisdiction—is limited. Verification by employers or clients is often manual. Revocation (e.g. disciplinary action) must be visible to relying parties.", opportunities: "Verifiable credentials for licenses enable instant, portable verification without centralised lookups. Attestations can link license to identity and to continuing compliance. Revocation registries or status lists can be anchored on-chain. Interoperability supports labour mobility and cross-border recognition.", tags: ["licensing", "credentials"], primitives: ["verifiable credentials", "attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Certificates", definition: "Official certificates (birth, marriage, education).", summary: "Verifiable official documents.", challenges: "Forgery and fake certificates are common where verification is weak. Portability—using a certificate abroad—often requires apostille or manual verification. Issuance and revocation are not always visible to relying parties. Citizens may lack easy access to their own records.", opportunities: "VC-based certificates issued by recognised authorities enable instant verification by any relying party. Tamper-evident issuance and optional revocation lists support integrity. Portable credentials reduce the need for physical documents and in-person verification. Interoperability with identity and other registries supports once-only and cross-border use.", tags: ["certificates", "credentials"], primitives: ["verifiable credentials", "attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
    ],
  },
  {
    name: "Service Delivery & Case Management",
    definition: "Service delivery and case management includes the systems used to determine eligibility, manage benefits, coordinate referrals, and track outcomes across agencies. The World Bank describes digital delivery systems as combining secure IDs, registries, and digital payments to improve efficiency and reduce fraud in social protection and related programs. Blockchain intersects where multiple parties need shared, auditable coordination without centralizing all data. (World Bank)",
    summary: "Coordinated delivery of government services and benefits.",
    challenges: "Programs often struggle with inaccurate registries, duplication, and weak eligibility controls—leading to exclusion errors and leakage. Inter-agency coordination is hard because agencies operate different systems and have different mandates, data standards, and incentives. Privacy and safety constraints are substantial because case files can contain sensitive information about health, income, migration status, or vulnerabilities. (World Bank)",
    opportunities: "Ethereum can support shared attestations around eligibility decisions, referrals, and program milestones (e.g., \"verified by agency X\") while keeping case details in protected systems. Identity and credential primitives can reduce repeated document submission and enable selective disclosure for program qualification. Used carefully, integrity proofs can make audits cheaper and more credible without exposing beneficiary data. (World Bank)",
    tags: ["benefits", "eligibility", "case management", "interoperability"],
    primitives: ["attestation", "verifiable credentials", "privacy tech"],
    maturityLevel: "idea",
    keyActors: [
      { name: "Social protection agencies", type: "gov" },
      { name: "Local government offices", type: "gov" },
      { name: "Health / education ministries (integrated services)", type: "gov" },
      { name: "Finance / payments teams", type: "gov" },
      { name: "Delivery partners (NGOs, multilaterals)", type: "NGO" },
    ],
    experiments: [
      { title: "WFP Building Blocks", year: 2023, blockchain: "Ethereum", description: "Humanitarian and social assistance blockchain-based coordination and cash transfer approach; illustrates both promise and implementation complexity. Success pattern: avoid putting personal case data onchain, use onchain proofs + offchain protected systems." },
      { title: "Auditability for disbursements and claims", year: 2023, blockchain: "Ethereum", description: "Tamper-evident logs of program events; auditability for disbursements and claims." },
    ],
    valueProposition: "Ethereum can anchor eligibility attestations and consent receipts so that agencies share verified data once, with an audit trail. Reduces duplicate forms and fraud while preserving privacy. Experts: social protection and service delivery system experts, case management product specialists, fraud/program integrity analysts, privacy engineers, applied cryptographers, identity/credential architects, change-management leaders across agencies and implementers.",
    relatedLinks: [
      { label: "World Bank digital delivery systems", url: REFS.WorldBank_Delivery },
      { label: "World Bank DPI approach", url: REFS.WorldBank_DPI },
      { label: "WFP Building Blocks", url: REFS.WFP_BuildingBlocks },
      { label: "W3C Verifiable Credentials", url: REFS.W3C_VC },
    ],
    children: [
      { name: "Benefits eligibility", definition: "Determining and proving eligibility for benefits.", summary: "Eligibility verification.", challenges: "Eligibility rules and data are fragmented across agencies and programmes; citizens often re-submit the same information. Fraud (identity misuse, inflated claims) and administrative error are significant. Proving income, residency, or family status repeatedly is burdensome, especially for vulnerable or mobile populations. Cross-programme consistency is hard to achieve.", opportunities: "Reusable eligibility credentials—attestations from tax, social security, or registry—allow agencies to verify entitlement without holding raw data. ZK proofs can prove eligibility (e.g. income below threshold, residency) without revealing sensitive details. Once-only proof of entitlement with consent reduces duplication and improves accuracy. Pilots in the EU and elsewhere demonstrate feasibility.", tags: ["benefits", "eligibility"], primitives: ["verifiable credentials", "ZK proofs"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Program integrity", definition: "Preventing fraud and error in programs.", summary: "Integrity and audit.", challenges: "Detection of fraud and error often relies on siloed data and manual review; real-time or cross-programme checks are limited. Data sharing for integrity purposes must comply with privacy and legal constraints. Audit trails of who accessed or used data are seldom standardised or independently verifiable. Accountability for overpayments or misuse is hard to establish.", opportunities: "On-chain or anchored audit trail of eligibility checks, payments, and data access supports programme integrity and ex-post review. Attestations from authorised sources (e.g. employer, registry) can be verified without centralising data. Consent receipts and usage attestations support compliance and dispute resolution. Transparent, tamper-evident records strengthen public trust and deterrence.", tags: ["integrity", "fraud"], primitives: ["attestation", "registries"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Inter-agency coordination", definition: "Sharing verified data across agencies.", summary: "Once-only, consent-based sharing.", challenges: "Trust between agencies and legal basis for sharing vary by jurisdiction. Consent must be informed, specific, and revocable; enforcement across systems is hard. Technical and semantic standards for data exchange are often missing or inconsistent. Citizens may not know which data is shared with whom.", opportunities: "Consent receipts and verifiable data-sharing agreements anchored on neutral infrastructure give users and agencies a tamper-evident record of what was shared and when. Attestations allow one agency to prove a claim to another without passing raw data. Standardised schemas and registries support interoperability. Once-only and cross-agency flows are piloted in several jurisdictions.", tags: ["interoperability", "data sharing"], primitives: ["attestation", "privacy tech"], maturityLevel: "idea", keyActors: [], experiments: [] },
    ],
  },
  {
    name: "Supply Chain & Logistics",
    definition: "Supply chain and logistics includes end-to-end visibility and control across procurement, warehousing, distribution, and delivery—often involving public-sector goods like medicines and food aid. Global standards such as GS1 emphasize interoperable identifiers and traceability events as the foundation for cross-organization visibility. Blockchain intersects when multiple parties need shared provenance and non-repudiable handoffs, especially across borders or among competing vendors. (GS1)",
    summary: "Provenance and integrity across supply chains.",
    challenges: "Supply chains are fragmented, and data quality is inconsistent across actors, making end-to-end traceability difficult. Counterfeit or diverted goods (especially pharmaceuticals) create safety and trust crises, while humanitarian logistics face infrastructure constraints and complex partner coordination. Interoperability and governance—agreeing on identifiers, event schemas, and data-sharing rules—are usually the biggest blockers. (GS1)",
    opportunities: "Ethereum can complement standards-based traceability by adding shared attestations (e.g., custody transfers, inspection results, compliance proofs) and immutable audit trails. A strong approach uses GS1-style identifiers/events offchain while anchoring critical checkpoints and proofs onchain for verifiability. For customs and cross-border flows, interoperable data exchange standards can be paired with integrity proofs to reduce disputes and improve transparency. (GS1)",
    tags: ["supply chain", "logistics", "provenance", "pharma", "food aid", "customs"],
    primitives: ["attestation", "registries", "privacy tech"],
    maturityLevel: "pilot",
    keyActors: [
      { name: "Procurement authorities", type: "gov" },
      { name: "Health ministries (medicines)", type: "gov" },
      { name: "Agriculture / food agencies / customs", type: "gov" },
      { name: "Logistics providers / manufacturers / wholesalers", type: "agency" },
      { name: "Standards organizations (GS1, WCO)", type: "coalition" },
      { name: "Humanitarian organizations / multilaterals", type: "NGO" },
    ],
    experiments: [
      { title: "WFP Building Blocks", year: 2023, blockchain: "Ethereum", description: "Blockchain adaptation in humanitarian contexts touching distribution and coordinated assistance across organizations." },
      { title: "Provenance proofs and handoff events", year: 2023, blockchain: "Ethereum", description: "Outcomes depend heavily on adoption of identifiers and process discipline; where GS1 traceability is in place, verifiable attestations can strengthen accountability and reduce reconciliation costs." },
    ],
    valueProposition: "Attestations at each step of the supply chain create an auditable provenance trail. Counterfeiting is harder; donors and regulators can verify authenticity and conditions. Experts: supply chain traceability architects, GS1/standards practitioners, customs data interoperability, procurement/logistics operators, security engineers and cryptographers for anti-tamper and attestation designs, governance experts for who can attest and how disputes are handled.",
    relatedLinks: [
      { label: "GS1 Global Traceability Standard", url: REFS.GS1_Traceability },
      { label: "GS1 healthcare traceability", url: REFS.GS1_Healthcare },
      { label: "WCO Data Model / Single Window", url: REFS.WCO_DataModel },
      { label: "WFP Building Blocks", url: REFS.WFP_BuildingBlocks },
      { label: "Supply chain & provenance", url: "https://ethereum.org/en/use-cases/supply-chain/" },
    ],
    children: [
      { name: "Pharmaceuticals", definition: "Provenance and anti-counterfeiting for medicines.", summary: "Supply chain integrity for health.", challenges: "Scale—integrating many manufacturers, distributors, and dispensers—and regulatory alignment (e.g. serialisation, DSCSA, FMD) are demanding. Verification at the point of use must work in low-connectivity or offline scenarios. Cold chain and handling conditions need to be documented and verifiable. Counterfeiting remains a serious risk in many markets.", opportunities: "Batch and unit-level attestations at each step (manufacturer, distributor, customs, pharmacy) create an auditable provenance trail; verification at point of use can confirm authenticity without a single central database. Regulatory initiatives (e.g. DSCSA, international standards) are driving adoption. Pilots demonstrate feasibility; interoperability and integration with existing ERP and serialisation systems are improving.", tags: ["pharma", "supply chain"], primitives: ["attestation", "registries"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Food aid", definition: "Traceability for food aid and relief.", summary: "From donor to beneficiary.", challenges: "Last-mile delivery in insecure or remote areas is hard to track; many actors (donors, UN, NGOs, local government) use different systems. Reporting to donors is burdensome and often delayed. Theft or diversion is a risk; verifying that aid reached intended beneficiaries is difficult. Conditionality (e.g. tied to need or outcome) is hard to enforce transparently.", opportunities: "Transparent pipeline: commitments, shipments, and handoffs can be recorded with attestations so donors and implementers see end-to-end flow. Delivery or beneficiary attestations at distribution points close the loop. Condition attestations (e.g. need verified) can support targeting. Pilots in humanitarian logistics show that lightweight attestation is feasible in field conditions.", tags: ["food aid", "humanitarian", "supply chain"], primitives: ["attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Public goods logistics", definition: "Logistics for public sector goods.", summary: "Audit trail for public procurement logistics.", challenges: "Fragmentation across procurement, warehousing, and delivery systems makes end-to-end visibility rare. Milestone and acceptance are often documented on paper or in siloed systems. Disputes over delivery or quality are costly. Accountability for delays or losses is unclear.", opportunities: "Milestone attestations (e.g. order placed, shipped, received, inspected) can trigger payment or next steps and provide an audit trail. Visibility for procurers and auditors supports accountability. Shared, verifiable records can streamline reconciliation and dispute resolution. Integration with procurement and finance systems can close the loop.", tags: ["logistics", "public finance"], primitives: ["attestation"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Customs", definition: "Customs declarations and clearance.", summary: "Cross-border trade facilitation.", challenges: "Paper and legacy systems cause delays, errors, and fraud; cross-border coordination is complex. Multiple agencies (customs, health, agriculture) may need to verify the same shipment. Trust in declarations and supporting documents (e.g. certificates of origin) is often established through manual checks. Real-time visibility for traders and authorities is limited.", opportunities: "Verifiable declarations and supporting attestations (e.g. origin, compliance) can streamline clearance and reduce paperwork. Shared state or registries can support single-window and multi-agency coordination. Tamper-evident records support audit and fraud detection. WTO and regional initiatives are advancing digital trade and customs interoperability.", tags: ["customs", "trade"], primitives: ["attestation", "registries"], maturityLevel: "idea", keyActors: [], experiments: [] },
    ],
  },
  {
    name: "Data Governance & Interoperability",
    definition: "Data governance and interoperability are the \"connective tissue\" of GovTech: the rules, technical standards, and institutional arrangements that allow data to be shared safely across agencies and partners. DPI frameworks increasingly highlight identity, payments, and trusted data sharing as core reusable building blocks for digital government. The blockchain intersection is strongest when it provides shared integrity and authorization primitives across institutions, rather than moving all data onchain. (World Bank)",
    summary: "Governance layer for data use across institutions.",
    challenges: "Cross-agency data sharing is constrained by legal mandates, consent requirements, privacy risks, and inconsistent standards. Even when rules permit sharing, mismatched identifiers, data models, and operational incentives cause fragmentation. Security and resilience are high-stakes: a single breach or misuse scandal can freeze progress for years. (OECD)",
    opportunities: "Ethereum can provide neutral infrastructure for authorization logs, attestations, and audit trails (\"who accessed/attested to what and when\") while the data itself remains in agency-controlled stores. Verifiable credentials can standardize claims and reduce repeated data collection, supporting privacy-preserving interoperability. This aligns with DPI guidance emphasizing reusable identity and trusted data-sharing capabilities that multiple services can build on. (W3C)",
    tags: ["data governance", "consent", "privacy", "interoperability", "standards"],
    primitives: ["privacy tech", "ZK proofs", "attestation", "registries"],
    maturityLevel: "idea",
    keyActors: [
      { name: "Digital government authorities", type: "gov" },
      { name: "Data protection regulators", type: "agency" },
      { name: "Standards bodies / chief data officers", type: "coalition" },
      { name: "Sector ministries (health, education, finance)", type: "gov" },
    ],
    experiments: [
      { title: "EBSI shared trust services", year: 2024, blockchain: "Ethereum", description: "Public-sector blockchain initiatives exploring shared trust services and frameworks for cross-border/cross-agency interoperability." },
      { title: "W3C verifiable credentials in government", year: 2023, blockchain: "mixed", description: "Standardizing claims and enabling machine-verifiable proofs across heterogeneous systems; governance, standards alignment, and operational incentives determine success more than the ledger itself." },
    ],
    valueProposition: "Consent receipts and verifiable data-sharing agreements can be anchored on Ethereum. ZK and privacy tech enable minimal disclosure for analytics and compliance. Experts: data governance leaders, enterprise interoperability architects, privacy engineers, VC/cryptography specialists, policy experts.",
    relatedLinks: [
      { label: "World Bank DPI approach", url: REFS.WorldBank_DPI },
      { label: "OECD DPI for digital governments", url: REFS.OECD_DPI },
      { label: "W3C Verifiable Credentials", url: REFS.W3C_VC },
      { label: "EBSI overview", url: REFS.EBSI },
    ],
    children: [
      { name: "Consent", definition: "User consent for data use.", summary: "Consent capture and proof.", challenges: "Revocation is hard to enforce when data has already been copied or shared. Granularity—what exactly was consented to, for how long, for what purpose—is often unclear. Demonstrating lawful basis and consent to regulators or data subjects is difficult at scale. Consent is frequently buried in long terms or obtained without meaningful choice.", opportunities: "Consent receipts—tamper-evident records of what was consented to, when, and by whom—can be anchored on-chain and presented to processors and auditors. Selective disclosure and ZK can support minimal data use in line with consent. Revocation or withdrawal can be recorded and verified. GDPR Art. 7 and W3C work on consent receipts align with these patterns.", tags: ["consent", "privacy"], primitives: ["attestation", "privacy tech"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Data sharing", definition: "Secure, governed data sharing between orgs.", summary: "Data sharing agreements and audit.", challenges: "Trust between organisations and legal basis for sharing (contract, consent, public interest) vary. Compliance with data protection law across jurisdictions is complex. Proving that data was used only for agreed purposes is difficult. Dispute resolution and accountability are often weak.", opportunities: "Verifiable data-sharing agreements and usage attestations can be anchored on neutral infrastructure; parties can prove what was agreed and how data was used. Audit trail of access and use supports accountability and compliance. ZK and privacy-preserving tech enable minimal disclosure—analytics or matching without exposing raw data. Open schemas and attestation standards support interoperability.", tags: ["data sharing", "privacy"], primitives: ["ZK proofs", "attestation"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Audit trails", definition: "Immutable audit log of data access/use.", summary: "Accountability and compliance.", challenges: "Volume of access events can be huge; storing full logs raises storage and PII concerns. Logs are often held by the same organisation that is being audited, reducing independence. Standards for what to record and how to verify are lacking. Cross-system correlation of access and use is difficult.", opportunities: "Hashed commitments or attestations of access events can provide tamper-evident, compact audit trails that can be independently verified. Selective disclosure can prove compliance (e.g. no unauthorised access) without exposing full logs. Registries can anchor periodic attestations or Merkle roots. Regulators and data subjects can verify accountability without centralising raw logs.", tags: ["audit", "compliance"], primitives: ["registries", "attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Standards", definition: "Technical and semantic standards for interoperability.", summary: "Common schemas and protocols.", challenges: "Adoption of standards across sectors and borders is slow; legacy systems are hard to adapt. Evolution—versioning, deprecation, backward compatibility—is complex. Multiple competing or overlapping standards exist in many domains. Governance of who sets and maintains standards is often unclear.", opportunities: "On-chain or anchored schema registries enable discoverability, versioning, and attestation of conformance (e.g. 'data conforms to schema X'). Attestation schemas (e.g. EAS, W3C VC) can be shared and extended. Open, neutral governance can support multi-stakeholder alignment. Interoperability pilots in health, public services, and trade demonstrate the value of shared standards.", tags: ["standards", "interoperability"], primitives: ["attestation"], maturityLevel: "idea", keyActors: [], experiments: [] },
    ],
  },
  {
    name: "Civic & Democratic Processes",
    definition: "Civic and democratic processes include the ways governments gather public input, ensure procedural legitimacy, and enable accountable participation in public life. In GovTech contexts, this often means digital participation tools, participatory budgeting, petition systems, and verifiable public records of engagement. The goal is not \"blockchain voting by default,\" but credible, privacy-preserving verification and auditability around participation and public decision workflows. (Open Government Partnership)",
    summary: "Civic engagement and democratic infrastructure with caution around voting.",
    challenges: "Many civic systems struggle with low trust, perceived manipulation, and limited transparency about how input is collected and acted upon. Privacy and safety are major constraints—people may not participate if doing so exposes identity, political preference, or sensitive affiliations. Digital exclusion (connectivity, disability access, literacy) and institutional capacity constraints frequently determine whether participation tools help or harm legitimacy. (Open Government Partnership)",
    opportunities: "Ethereum can support credentialed participation and tamper-evident audit trails without forcing identities or opinions into public view (e.g., ZK proofs for eligibility, offchain ballots with onchain commitments). Public consultations can publish signed attestations of \"what was submitted when,\" plus integrity proofs that datasets used in policy analysis weren't silently altered. Where appropriate, shared registries can also coordinate multi-stakeholder governance (civil society + agencies) with transparent change logs and dispute resolution. (Open Government Partnership)",
    tags: ["civic", "democracy", "transparency", "consultation"],
    primitives: ["attestation", "registries", "privacy tech"],
    maturityLevel: "idea",
    keyActors: [
      { name: "Election management bodies", type: "gov" },
      { name: "Digital government teams", type: "gov" },
      { name: "Civic participation offices", type: "gov" },
      { name: "Public records agencies", type: "gov" },
      { name: "Civil society organizations (transparency & civic space)", type: "NGO" },
      { name: "Multilateral civic initiatives & standards bodies", type: "coalition" },
    ],
    experiments: [
      { title: "Cryptographic commitments to consultation submissions", year: 2023, blockchain: "Ethereum", description: "Publishing hashes of submissions or results to enable independent verification without revealing content." },
      { title: "Participation credentials (eligibility / membership)", year: 2023, blockchain: "mixed", description: "Verifiable credentials for \"right to participate\" with selective disclosure to minimize personal data leakage; aligned with VC standards." },
      { title: "EBSI public-sector trust layer", year: 2024, blockchain: "Ethereum", description: "Governments exploring shared trust layers for public services and credentials; governance models vary." },
    ],
    valueProposition: "Ethereum can anchor commitments and timestamps for transparent processes. Credentialed participation (e.g. eligibility attestations) supports legitimacy without storing votes on-chain. Useful experts: privacy engineers (ZK/selective disclosure), civic participation and deliberation specialists, accessibility-focused UX, election-law/civic integrity counsel, public-sector procurement and change-management.",
    relatedLinks: [
      { label: "OGP National Handbook - Foundations for Open Government (2025)", url: REFS.OGP },
      { label: "OECD DPI governance and safeguards", url: REFS.OECD_DPI },
      { label: "EBSI public-sector blockchain infrastructure", url: REFS.EBSI },
    ],
    children: [
      { name: "Transparency", definition: "Transparency in GovTech means making government actions legible: budgets, contracts, service performance, and decision records that can be inspected and audited. It is a foundational principle of open government and is often operationalized via open data, disclosure requirements, and public accountability mechanisms. Blockchain is relevant when transparency requires integrity guarantees and non-repudiation, not just publishing a PDF. (Open Government Partnership)", summary: "Open data and process transparency.", challenges: "Transparency initiatives fail when data is partial, late, inconsistently structured, or easy to alter without trace. Over-disclosure can also harm privacy (e.g., publishing personal or sensitive operational details), so safeguards and redaction policies are critical. Capacity constraints—data pipelines, standards adoption, and sustained operations—often matter more than the technology choice. (Open Government Partnership)", opportunities: "Ethereum can add verifiable integrity layers: anchoring hashes of datasets, signed attestations of disclosures, and immutable change logs for policy-critical records. Standards-based publishing (like contracting data standards) becomes more valuable when integrity proofs enable independent verification that published records are complete and untampered. A practical approach is \"offchain data + onchain proofs,\" minimizing costs and privacy risk while strengthening accountability. (Open Contracting Data Standard)", tags: ["transparency", "open government"], primitives: ["registries", "attestation"], maturityLevel: "idea", keyActors: [{ name: "Transparency & anti-corruption agencies", type: "gov" }, { name: "Supreme audit institutions", type: "gov" }, { name: "Procurement authorities / finance ministries", type: "gov" }, { name: "Open data teams", type: "gov" }], experiments: [{ title: "OCDS + integrity proofs", year: 2023, blockchain: "Ethereum", description: "Structured contracting disclosures with verifiable logs or attestations for auditability." }] },
      { name: "Public consultations", definition: "Public consultations are structured processes where governments solicit feedback on proposed laws, regulations, or programs. Digitizing consultations improves reach and traceability but also introduces new risks around manipulation, duplication, and selective publication. The main blockchain intersection is verifying the integrity of inputs and the process—without exposing participants. (Open Government Partnership)", summary: "Consultation and feedback.", challenges: "Consultations often face legitimacy issues: stakeholders worry submissions are ignored, deleted, or misrepresented. Identity and duplication controls can conflict with anonymity and safety, especially for vulnerable communities. Operationally, consultation platforms struggle with spam, misinformation, accessibility needs, and inconsistent archival practices. (Open Government Partnership)", opportunities: "Ethereum can support tamper-evident submission receipts (signed attestations + timestamps) and verifiable publication of final datasets (hash commitments) so observers can detect post-hoc edits. Eligibility can be proven with selective disclosure credentials or ZK proofs (e.g., \"resident of jurisdiction,\" \"member of stakeholder group\") while preserving privacy. Done well, this can increase trust without forcing every submission onto a public chain. (W3C Verifiable Credentials)", tags: ["consultation", "participation"], primitives: ["attestation", "privacy tech"], maturityLevel: "pilot", keyActors: [{ name: "Policy units / regulators", type: "gov" }, { name: "Digital government teams", type: "gov" }, { name: "Records management / ombuds", type: "gov" }], experiments: [{ title: "Anchored submissions + integrity proofs", year: 2023, blockchain: "Ethereum", description: "Submissions offchain with periodic integrity proofs onchain for independent auditing." }, { title: "Verifiable participation badges / credentials", year: 2023, blockchain: "mixed", description: "Stakeholder categories confirmed without doxxing individuals; aligned with VC architectures." }] },
      { name: "Credentialed participation", definition: "Credentialed participation uses credentials to prove eligibility to take part in a process—without necessarily revealing full identity. This shows up in consultations, service access, program governance, membership systems, and regulated workflows. Verifiable credentials provide a standardized model for issuing, holding, and verifying claims with privacy considerations baked into the ecosystem design. (W3C Verifiable Credentials)", summary: "Privacy-preserving participation.", challenges: "Eligibility verification often leads to excess data collection, creating surveillance and breach risks. Interoperability is hard: multiple agencies and partners may use incompatible standards, and revocation/status checking becomes complex. If the credential system is not well governed, it can enable exclusion, discrimination, or fraud at scale. (OECD)", opportunities: "Ethereum can serve as a neutral trust layer for credential status registries, revocation registries, or attestation anchors—supporting cross-organization verification without centralized control. Selective disclosure and ZK approaches can prove \"I'm eligible\" (age bracket, residency, membership) without revealing identity or additional attributes. Public-sector ecosystems like EBSI show how governments explore verifiable credential infrastructures for public services. (W3C; European Commission EBSI)", tags: ["participation", "privacy"], primitives: ["ZK proofs", "attestation"], maturityLevel: "idea", keyActors: [{ name: "Civil registries / identity authorities", type: "gov" }, { name: "Service delivery agencies / regulators", type: "gov" }, { name: "Credential issuers (schools, licensing, professional boards)", type: "agency" }, { name: "Wallet providers & standards bodies", type: "coalition" }], experiments: [{ title: "EBSI verifiable credentials", year: 2024, blockchain: "Ethereum", description: "Public-sector verifiable credentials for cross-border public services and trust frameworks." }, { title: "Humanitarian / development digital identity & credentialing", year: 2023, blockchain: "mixed", description: "Privacy controls with auditability; credentials offchain + registry/proofs onchain." }] },
    ],
  },
  {
    name: "Climate & MRV",
    definition: "Climate MRV (Measurement, Reporting, Verification) underpins credible climate action by ensuring emissions reductions and mitigation outcomes are measured and verified against accepted baselines. MRV is central to carbon markets and to broader reporting under international climate frameworks. Digital MRV aims to standardize data flows, reduce manual verification overhead, and improve integrity across the MRV lifecycle. (UNFCCC)",
    summary: "Climate and environmental data and finance.",
    challenges: "MRV systems are complex and expensive: data quality varies, methodologies differ, and verification bottlenecks can slow projects and increase costs. Incentives to misreport exist when credits or funding depend on reported outcomes, so governance and independent verification matter. Digital systems add cybersecurity, privacy, and interoperability challenges—especially where data comes from many sensors, agencies, and suppliers. (World Bank)",
    opportunities: "Ethereum can provide auditable provenance for MRV datasets (what data existed when), plus tamper-evident logs of methodology versions, verifier attestations, and registry events. A practical architecture is to keep raw data offchain while posting commitments and verifier signatures onchain, enabling later audits without exposing sensitive operational data. This can also help link grants or results-based finance to verifiable milestones in a way that's transparent to funders and oversight bodies. (World Bank)",
    tags: ["climate", "MRV", "carbon", "environmental", "grants"],
    primitives: ["attestation", "registries", "privacy tech"],
    maturityLevel: "pilot",
    keyActors: [
      { name: "Environment ministries / national inventory teams", type: "gov" },
      { name: "Standards setters / carbon registries", type: "coalition" },
      { name: "Auditors / verifiers / project developers", type: "agency" },
      { name: "Multilateral climate bodies / development banks", type: "NGO" },
    ],
    experiments: [
      { title: "Blockchain issuance/retirement & MRV anchoring", year: 2024, blockchain: "Ethereum", description: "Recording issuance/retirement events or anchoring MRV documents to reduce double counting and improve auditability; World Bank guidance emphasizes robust verification augmented by integrity proofs." },
    ],
    valueProposition: "Carbon and environmental registries on Ethereum provide transparent MRV and prevent double counting. Grant disbursement can be tied to milestone attestations. Experts: MRV methodologists, climate data engineers, registry/market infrastructure experts, auditors, applied cryptography and privacy engineers, governance experts.",
    relatedLinks: [
      { label: "UNFCCC MRV Technical Material", url: REFS.UNFCCC_MRV },
      { label: "World Bank MRV explainer and guidance", url: REFS.WorldBank_MRV_Explainer },
      { label: "Digital MRV research (Springer)", url: REFS.Springer_dMRV },
      { label: "Climate & sustainability", url: "https://ethereum.org/en/use-cases/sustainability/" },
    ],
    children: [
      { name: "Carbon MRV", definition: "Carbon MRV focuses specifically on quantifying greenhouse gas reductions or removals for carbon crediting, inventories, and results-based climate finance. It is a multi-step process: measure against a baseline, report to a framework, and verify via accredited third parties. Because carbon outcomes are monetized, carbon MRV requires unusually strong auditability and controls against manipulation. (World Bank)", summary: "Credible carbon accounting.", challenges: "Baseline selection and methodology disputes can lead to inconsistent or inflated claims, undermining market trust. Data pipelines are fragmented, and verifiers face limited visibility into provenance—especially when data is manually collected or comes from many subcontractors. Scaling credible verification without exploding costs is a persistent bottleneck for markets and programs. (World Bank)", opportunities: "Ethereum can anchor dataset commitments, verifier attestations, and methodology versions so later reviewers can reproduce or challenge claims with a clear integrity trail. Tokenization is less important than audit-grade provenance: a structured, tamper-evident record of what was measured, who verified it, and under what rules. Where carbon finance disburses funds, smart contracts can tie payments to verified milestones while keeping raw monitoring data offchain. (World Bank)", tags: ["carbon", "MRV", "climate"], primitives: ["attestation", "registries"], maturityLevel: "pilot", keyActors: [{ name: "Carbon registries / standard-setting bodies", type: "coalition" }, { name: "Project developers / verification firms", type: "agency" }, { name: "Environmental agencies / funders", type: "gov" }], experiments: [{ title: "Offchain MRV + onchain issuance/retirement or audit proofs", year: 2024, blockchain: "Ethereum", description: "Pilots combining offchain MRV platforms with onchain records to enhance transparency and reduce double counting; World Bank underscores independent verification as central." }] },
      { name: "Grants tracking", definition: "Grants tracking covers the end-to-end lifecycle of public or philanthropic funds: allocation, disbursement, milestones, reporting, and audits. It intersects with anti-corruption, public financial management, and donor accountability, particularly in humanitarian and development settings. The blockchain intersection typically focuses on traceable disbursements and transparent reporting without exposing beneficiary identities. (UNICEF)", summary: "Transparency for climate finance.", challenges: "Grant programs often rely on fragmented reporting and inconsistent documentation, making audits slow and costly. Fraud risks include duplicate beneficiaries, inflated invoices, and opaque subcontracting chains. Privacy is critical: publishing too much can endanger recipients or reveal sensitive operational details. (Open Government Partnership)", opportunities: "Ethereum can provide shared, tamper-evident ledgers for commitments to grant agreements, milestone attestations, and audit trails while keeping sensitive details offchain. Smart contracts can enforce basic controls (e.g., disbursement only after verifier attestations) and generate real-time transparency dashboards for funders. Used carefully, this supports \"credible transparency\" rather than surveillance, aligning with open government principles and safeguards. (OECD)", tags: ["grants", "climate", "transparency"], primitives: ["attestation"], maturityLevel: "idea", keyActors: [{ name: "Finance ministries / donor agencies", type: "gov" }, { name: "International organizations / implementers", type: "NGO" }, { name: "Auditors / civil society monitors", type: "agency" }], experiments: [{ title: "UNICEF CryptoFund", year: 2023, blockchain: "Ethereum", description: "UN entity receiving and disbursing crypto assets with visibility of transfers and transparent accounting." }, { title: "WFP Building Blocks", year: 2023, blockchain: "Ethereum", description: "Humanitarian organizations adapting blockchain for coordinated assistance programs; offchain case management + onchain audit proofs for disbursements and milestones." }] },
      { name: "Environmental registries", definition: "Environmental registries record assets, permissions, and outcomes related to environmental governance: permits, protected areas, emissions sources, project registries, and climate program records. They must remain consistent over time and across agencies, which makes data integrity and interoperability central. Blockchain is relevant when a registry needs durable, verifiable history and multi-party coordination. (UNFCCC)", summary: "Environmental compliance and rights.", challenges: "Registries often suffer from fragmented ownership, inconsistent identifiers, and weak change control, leading to disputes about \"what is the authoritative record.\" Some environmental data is sensitive (e.g., location of endangered species, critical infrastructure), requiring careful access controls. Long timelines and shifting regulations make versioning and provenance a hard, ongoing problem. (OECD)", opportunities: "Ethereum can anchor registry events (issuance, updates, retirements, permits) and attestations by authorized bodies, creating verifiable lineage and a shared audit surface. With offchain storage + onchain proofs, systems can support public transparency where appropriate while enabling restricted access for sensitive data. This approach pairs naturally with DPI thinking: reusable identity, data-sharing, and registry primitives. (World Bank)", tags: ["environmental", "registry"], primitives: ["registries", "attestation"], maturityLevel: "idea", keyActors: [{ name: "Environment ministries / regulators", type: "gov" }, { name: "Registry operators / verification bodies", type: "agency" }, { name: "Scientific institutions / NGOs", type: "NGO" }], experiments: [{ title: "Onchain registry events + offchain documentation", year: 2023, blockchain: "Ethereum", description: "Environmental pilots mirror carbon registry experiments: onchain records of critical events, offchain data for documentation and evidence; governance (who can write/attest, dispute resolution) is key." }] },
    ],
  },
  {
    name: "Education & Workforce",
    definition: "Education and workforce systems manage learning records, qualifications, and skills signals across institutions and borders. Digital credentials aim to improve portability and verification of learning outcomes—especially for non-traditional learning and micro-credentials. UNESCO has emphasized the complexity of the digital credentials ecosystem and the need for clear roles, standards, and recognition pathways. (UNESCO)",
    summary: "Lifelong learning and employment verification.",
    challenges: "Credential fraud, slow verification processes, and fragmented records undermine mobility for learners and employers. Interoperability issues arise when universities, training providers, and ministries use incompatible formats and policies. Privacy is also central: education records can reveal sensitive personal data and must be protected while still being verifiable. (UNESCO)",
    opportunities: "Ethereum can support credential status registries and integrity proofs so recipients can present verifiable qualifications without institutions repeatedly re-issuing paperwork. W3C verifiable credentials provide a standards base for machine-verifiable education credentials, enabling selective disclosure (e.g., prove \"degree earned\" without sharing full transcript). With thoughtful design, this can improve cross-border recognition and reduce administrative friction in hiring and admissions. (W3C)",
    tags: ["education", "credentials", "workforce", "skills"],
    primitives: ["verifiable credentials", "attestation"],
    maturityLevel: "pilot",
    keyActors: [
      { name: "Ministries of education / labor", type: "gov" },
      { name: "Universities and TVET providers", type: "agency" },
      { name: "Accreditation bodies / employers", type: "agency" },
      { name: "Credential evaluation networks", type: "coalition" },
    ],
    experiments: [
      { title: "Verifiable credentials for diplomas and micro-credentials", year: 2023, blockchain: "Ethereum", description: "Education pilots issue VCs for diplomas, certificates, micro-credentials; registries manage revocation or status; Ethereum as integrity and coordination layer, student data offchain, minimal disclosure." },
      { title: "EBSI and education credentials", year: 2024, blockchain: "Ethereum", description: "Public-sector blockchain infrastructure intersecting with education credentials in broader digital identity strategies." },
    ],
    valueProposition: "Credentials and skills can be issued as verifiable credentials anchored on Ethereum. Learners and workers get portable, instantly verifiable records; employers can trust attestations. Experts: credentialing standards, registrar operations, admissions/hiring verification workflows, privacy-preserving identity, cryptography/VC engineers, wallet UX, policy experts for recognition and cross-border legal interoperability.",
    relatedLinks: [
      { label: "UNESCO digital credentialing report", url: REFS.UNESCO_Credentials },
      { label: "W3C Verifiable Credentials", url: REFS.W3C_VC },
      { label: "EBSI overview", url: REFS.EBSI },
      { label: "Digital credentials", url: "https://ethereum.org/en/use-cases/digital-identity/" },
    ],
    children: [
      { name: "Credentials", definition: "Degrees, diplomas, certificates.", summary: "Academic credentials.", challenges: "Cross-border recognition of qualifications is complex due to different frameworks and verification processes. Revocation (e.g. degree rescinded) must be visible to relying parties. Issuer adoption—schools and universities issuing in verifiable form—is still growing. Fraud and diploma mills persist; employers cannot always verify authenticity easily.", opportunities: "Portable verifiable credentials enable instant verification by any relying party without contacting the issuer. Tamper-evident issuance and optional revocation lists support integrity. EU Digital Credentials, Open Badges, and national pilots demonstrate feasibility. Interoperability with identity and employment systems supports lifelong learning and labour mobility.", tags: ["credentials", "education"], primitives: ["verifiable credentials", "attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Portable records", definition: "Lifelong learning and employment records.", summary: "Portable record of achievements.", challenges: "Ownership and control of learning and employment records are often unclear; data is siloed by institution or employer. Interoperability across systems and countries is limited. Aggregating credentials from multiple sources into a single, verifiable record is non-trivial. Employers and institutions may not trust or accept portable records.", opportunities: "Self-sovereign or user-controlled record aggregating attestations from education providers, employers, and assessors can support portability. Verifiable credentials for each achievement enable employer and institutional verification without centralised access. Standards (e.g. W3C VC, Open Badges) support interoperability. Pilots in lifelong learning and employment are advancing.", tags: ["portable", "records"], primitives: ["verifiable credentials", "attestation"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Skills verification", definition: "Verification of skills and competencies.", summary: "Skills attestations.", challenges: "Standardisation of skills frameworks and taxonomies is fragmented across sectors and countries. Proof of competency (from training, assessment, or experience) is often informal or not portable. Labour market matching (job ↔ skills) is limited by data quality and standards. Micro-credentials and non-formal learning are hard to evidence in a standard way.", opportunities: "Micro-credentials and skills attestations from training providers, employers, or assessors can be combined into a portable, verifiable record. ZK can support minimal disclosure (e.g. prove competency level without revealing full transcript). Alignment with frameworks (e.g. ESCO, national standards) can be represented in schemas. Employers and platforms can consume attested skills for matching and hiring.", tags: ["skills", "workforce"], primitives: ["attestation", "verifiable credentials"], maturityLevel: "pilot", keyActors: [], experiments: [] },
    ],
  },
  {
    name: "Health",
    definition: "Health GovTech includes patient records, provider credentialing, health supply chains, and interoperability across clinics, labs, insurers, and public health authorities. HL7 FHIR is a widely used standard for exchanging healthcare information electronically, reflecting the sector's focus on interoperable data flows. Blockchain intersections typically emphasize integrity, consent, and verifiable credentials—not putting clinical records on a public chain. (HL7 FHIR)",
    summary: "Health data and supply chain with privacy.",
    challenges: "Health data is highly sensitive, heavily regulated, and frequently siloed across incompatible systems. Consent and access control are complex, especially when patients receive care across many providers or jurisdictions. Operational failures—downtime, breaches, unusable UX—can have direct safety consequences, so reliability and governance are non-negotiable. (HL7 FHIR)",
    opportunities: "Ethereum can provide audit-grade logs of consent and data access events, and can anchor integrity proofs for clinical documents stored offchain. Verifiable credentials can improve provider credentialing (proof of licensure, specialization) and reduce fraud, while enabling selective disclosure. In supply integrity use cases (medicines/devices), blockchain can complement global traceability standards by adding shared attestations and immutable handoff records. (HL7 FHIR)",
    tags: ["health", "patient records", "credentialing", "supply chain"],
    primitives: ["attestation", "privacy tech", "verifiable credentials"],
    maturityLevel: "idea",
    keyActors: [
      { name: "Health ministries", type: "gov" },
      { name: "Hospitals / clinics / national health information exchanges", type: "agency" },
      { name: "Professional licensing boards / regulators / payers", type: "agency" },
      { name: "Suppliers / distributors (supply integrity)", type: "agency" },
    ],
    experiments: [
      { title: "Provider credentialing and document integrity", year: 2023, blockchain: "mixed", description: "Anchoring hashes of records; interoperability standards like FHIR as data layer, additional trust layers for audit and verification." },
      { title: "Supply integrity and traceability", year: 2023, blockchain: "Ethereum", description: "Traceability programs building on GS1 standards augmented by shared attestation mechanisms for provenance." },
    ],
    valueProposition: "Ethereum can host pointer registries and attestations for health data access; provider credentials as VCs enable fast verification. Supply chain attestations support medicine integrity. Experts: digital health interoperability (FHIR), security/privacy engineers, clinical informatics, compliance counsel, credentialing and health supply chain traceability, product leaders who have shipped health systems at scale.",
    relatedLinks: [
      { label: "HL7 FHIR overview", url: REFS.HL7_FHIR },
      { label: "OECD DPI safeguards", url: REFS.OECD_DPI },
      { label: "GS1 healthcare traceability", url: REFS.GS1_Healthcare },
      { label: "W3C Verifiable Credentials", url: REFS.W3C_VC },
    ],
    children: [
      { name: "Patient records pointers", definition: "Pointers to health data (not data itself).", summary: "Consent-based access to records.", challenges: "Privacy and consent are strictly regulated (e.g. GDPR, HIPAA); storing or processing health data on public infrastructure raises legal and ethical questions. Consent must be informed, specific, and revocable; enforcement across many systems is hard. Proving who accessed what and when is often lacking. Patients may not know where their data lives or who has access.", opportunities: "Pointer registry—recording where data lives and who has been given access, with tamper-evident timestamps—supports access control and audit without storing health data on-chain. Attestation of access and usage can support accountability and compliance. Consent receipts and usage policies can be anchored for verification. GDPR-compliant designs are being piloted in health data spaces and EHDS-style initiatives.", tags: ["health", "patient data", "privacy"], primitives: ["attestation", "privacy tech"], maturityLevel: "idea", keyActors: [], experiments: [] },
      { name: "Provider credentialing", definition: "Verification of clinician and facility credentials.", summary: "Credentials for health providers.", challenges: "Cross-border recognition of qualifications and good standing is complex; verification by employers, insurers, and patients is often manual. Revocation (e.g. disciplinary action) must propagate to relying parties. Different jurisdictions and professional bodies use different systems. Fraud (fake credentials) is a concern in some markets.", opportunities: "VC-based credentials for licences, specialisations, and good standing enable real-time verification by any relying party without centralised lookups. Attestations can link credential to identity and to continuing compliance (e.g. CPD). Revocation registries or status lists can be anchored on-chain. WHO, professional bodies, and pilots are advancing portable provider credentials.", tags: ["health", "credentials"], primitives: ["verifiable credentials", "attestation"], maturityLevel: "pilot", keyActors: [], experiments: [] },
      { name: "Supply integrity", definition: "Integrity of medicines and equipment in health supply chain.", summary: "Provenance for health supplies.", challenges: "Counterfeiting and substandard medicines are widespread in some regions; verification at the point of use is difficult when supply chains are long and opaque. Cold chain and handling conditions must be documented. Serialisation and traceability regulations (e.g. EU FMD, DSCSA) require interoperable systems. Recall and investigation need fast, accurate tracing.", opportunities: "Attestations at each step (manufacturer, distributor, customs, pharmacy) create an auditable provenance trail; verification at point of use can confirm authenticity. Temperature and handling logs can be attested. Serialisation and event data can be anchored in registries. WHO, regulators, and pharma pilots are advancing supply chain integrity.", tags: ["health", "supply chain"], primitives: ["attestation", "registries"], maturityLevel: "pilot", keyActors: [], experiments: [] },
    ],
  },
];

async function seedDomains(
  specs: DomainSpec[],
  parentId: string | null
): Promise<Map<string, string>> {
  const idMap = new Map<string, string>();
  for (const spec of specs) {
    const domain = await prisma.domain.create({
      data: {
        name: spec.name,
        parentId,
        definition: spec.definition,
        summary: spec.summary,
        challenges: spec.challenges,
        opportunities: spec.opportunities,
        ethereumPrimitives: PRIMITIVES(spec.primitives),
        maturityLevel: spec.maturityLevel,
        tags: TAGS(spec.tags),
        valueProposition: spec.valueProposition ?? "",
        relatedLinks: spec.relatedLinks ? LINKS(spec.relatedLinks) : "",
      },
    });
    idMap.set(spec.name, domain.id);
    if (spec.children?.length) {
      const childMap = await seedDomains(spec.children, domain.id);
      childMap.forEach((id, name) => idMap.set(name, id));
    }
  }
  return idMap;
}

async function main() {
  await prisma.activityNote.deleteMany();
  await prisma.expertDomain.deleteMany();
  await prisma.opportunityDomain.deleteMany();
  await prisma.opportunityInstitution.deleteMany();
  await prisma.experimentDomain.deleteMany();
  await prisma.domainEdge.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.expert.deleteMany();
  await prisma.domain.deleteMany();

  const domainIdMap = await seedDomains(TAXONOMY, null);

  const rootIds = await prisma.domain.findMany({
    where: { parentId: null },
    select: { id: true, name: true },
  });
  const allDomainIds = new Map(rootIds.map((d) => [d.name, d.id]));
  const children = await prisma.domain.findMany({ select: { id: true, name: true, parentId: true } });
  children.forEach((d) => allDomainIds.set(d.name, d.id));

  for (const spec of TAXONOMY) {
    const fromId = allDomainIds.get(spec.name);
    if (!fromId) continue;
    for (const child of spec.children || []) {
      const toId = allDomainIds.get(child.name);
      if (toId) await prisma.domainEdge.create({ data: { fromId, toId, edgeType: "depends_on" } });
    }
  }
  const identityId = allDomainIds.get("Digital Identity & Credentials");
  const paymentsId = allDomainIds.get("Payments & Public Finance");
  if (identityId && paymentsId)
    await prisma.domainEdge.create({ data: { fromId: paymentsId, toId: identityId, edgeType: "depends_on" } });
  const registryId = allDomainIds.get("Registries & Records");
  if (identityId && registryId)
    await prisma.domainEdge.create({ data: { fromId: identityId, toId: registryId, edgeType: "enables" } });

  for (const spec of TAXONOMY) {
    const domainId = allDomainIds.get(spec.name);
    if (!domainId) continue;
    for (const exp of spec.experiments) {
      const ex = await prisma.experiment.create({
        data: {
          title: exp.title,
          year: exp.year,
          description: exp.description ?? "",
          blockchainUsed: exp.blockchain ?? "Ethereum",
        },
      });
      await prisma.experimentDomain.create({ data: { domainId, experimentId: ex.id } });
    }
    for (const actor of spec.keyActors) {
      const inst = await prisma.institution.create({
        data: {
          name: actor.name,
          type: actor.type,
          country: actor.country ?? "",
          status: "prospect",
        },
      });
    }
  }

  const inst1 = await prisma.institution.findFirst({ where: { name: "National Digital Identity Authority" } });
  const inst2 = await prisma.institution.findFirst({ where: { name: "Ministry of Finance / Treasury" } });
  if (inst1) {
    await prisma.contact.create({
      data: {
        institutionId: inst1.id,
        name: "Sample Champion",
        role: "Director",
        championFlag: true,
        championNotes: "Values-aligned; interested in VC pilot.",
      },
    });
  }

  const opp = await prisma.opportunity.create({
    data: {
      title: "National digital ID pilot",
      description: "Exploration for verifiable credentials pilot.",
      stage: "exploration",
      priority: "high",
      fitScore: 78,
      budgetBand: "500k-1m",
      nextStep: "Scoping call",
      pocFlagshipFlag: true,
    },
  });
  if (identityId && opp) {
    await prisma.opportunityDomain.create({ data: { opportunityId: opp.id, domainId: identityId } });
  }
  if (inst1 && opp) {
    await prisma.opportunityInstitution.create({ data: { opportunityId: opp.id, institutionId: inst1.id } });
  }

  // Rolodex: public-sector / govtech + blockchain-adjacent experts (by domain)
  type RolodexEntry = {
    name: string;
    affiliation: string;
    linkedIn: string;
    sourceUrl?: string;
    skillsTags: string[];
    domainNames: string[];
    notes?: string;
    region?: string;
  };
  const ROLODEX_ENTRIES: RolodexEntry[] = [
    { name: "Audrey Tang", affiliation: "former Taiwan Digital Minister / g0v", linkedIn: "http://www.linkedin.com/in/tangaudrey", sourceUrl: "https://github.com/audreyt", skillsTags: ["civic tech", "participatory democracy", "DPI", "digital government"], domainNames: ["Civic & Democratic Processes", "Service Delivery & Case Management"], notes: "Strong practical track record on participatory democracy + digital public infrastructure.", region: "Taiwan" },
    { name: "Beth Simone Noveck", affiliation: "GovLab director", linkedIn: "https://www.linkedin.com/in/bethnoveck", sourceUrl: "https://muckrack.com/beth-simone-noveck/bio", skillsTags: ["open government", "civic participation", "institutional innovation"], domainNames: ["Civic & Democratic Processes", "Service Delivery & Case Management"], notes: "Long-running work on open government, civic participation, government-facing programs.", region: "Global" },
    { name: "Pia Mancini", affiliation: "DemocracyOS / Democracy.Earth", linkedIn: "https://es.linkedin.com/in/piamancini", sourceUrl: "https://clay.earth/profile/pia-mancini", skillsTags: ["democracy tech", "governance tooling", "credentialed participation", "voting"], domainNames: ["Civic & Democratic Processes"], notes: "Democracy tech builder; relevant for credentialed participation and voting/consultation primitives.", region: "Global" },
    { name: "Gavin Hayman", affiliation: "Open Contracting Partnership (Executive Director)", linkedIn: "https://www.linkedin.com/in/gavin-hayman-40024210/", sourceUrl: "https://www.oecd-events.org/e/global-public-procurement-forum/en/speakers", skillsTags: ["procurement transparency", "open contracting", "public integrity"], domainNames: ["Transparency", "Payments & Public Finance", "Supply Chain & Logistics"], notes: "Deep expertise in procurement transparency ecosystems and adoption.", region: "Global" },
    { name: "François Adam", affiliation: "Belgium Federal Procurement Service", linkedIn: "https://www.linkedin.com/in/francois-adam-16398861/", sourceUrl: "https://www.oecd-events.org/e/global-public-procurement-forum/en/speakers", skillsTags: ["public procurement", "policy", "government operations"], domainNames: ["Transparency", "Payments & Public Finance"], notes: "Policy + practice perspective on public procurement.", region: "Belgium" },
    { name: "Liesbeth Casier", affiliation: "Public procurement & integrity modernization", linkedIn: "https://www.linkedin.com/in/liesbethcasier/", sourceUrl: "https://www.oecd-events.org/e/global-public-procurement-forum/en/speakers", skillsTags: ["procurement", "integrity", "EU procurement modernization"], domainNames: ["Transparency", "Payments & Public Finance"], notes: "Belgium context; useful for EU-style procurement modernization.", region: "Belgium" },
    { name: "David Roff", affiliation: "UN/CEFACT expert", linkedIn: "https://www.linkedin.com/in/davidroff/", sourceUrl: "https://unttc.org/sites/unttc/files/2022-04/How%20to%20develop%20transport%20e-docs%20using%20UNCEFACT%20standards%20and%20MMT%20RDM.pdf", skillsTags: ["digital trade", "e-docs", "standards", "interoperability"], domainNames: ["Data Governance & Interoperability", "Supply Chain & Logistics"], notes: "Work on digital trade / e-doc equivalents + standards mapping; very relevant to interoperability-heavy govtech.", region: "Global" },
    { name: "Drummond Reed", affiliation: "Decentralized identity / trust frameworks", linkedIn: "https://www.linkedin.com/in/drummondreed/", sourceUrl: "https://www.slideshare.net/slideshow/fhir-basics-session-1-introduction-to-interoperabilty-principles-of-fhir/248465754", skillsTags: ["decentralized identity", "trust frameworks", "governance", "interoperability"], domainNames: ["Data Governance & Interoperability", "Education & Workforce", "Registries & Records"], notes: "Long-time decentralized identity / trust frameworks leader; cross-ecosystem interoperability and governance models.", region: "Global" },
    { name: "Markus Sabadello", affiliation: "Decentralized identity / verifiable data ecosystems", linkedIn: "https://www.linkedin.com/in/markus-sabadello-35302a/", sourceUrl: "https://ngiatlantic.eu/sites/default/files/2023-04/D3_Transatlantic%20SS_final.pdf", skillsTags: ["decentralized identity", "verifiable credentials", "registry architecture", "interoperability"], domainNames: ["Data Governance & Interoperability", "Digital Identity & Credentials", "Registries & Records"], notes: "Relevant to interoperable credential + registry architectures.", region: "Global" },
    { name: "Manu Sporny", affiliation: "W3C Verifiable Credentials co-editor", linkedIn: "https://www.linkedin.com/in/manusporny/", sourceUrl: "https://lists.w3.org/Archives/Public/public-credentials/2026Feb/0002.html", skillsTags: ["VC", "W3C", "standards", "identity", "provenance"], domainNames: ["Digital Identity & Credentials", "Education & Workforce", "Registries & Records", "Supply Chain & Logistics"], notes: "Core standards, ecosystem coordination; VC primitives for certificates/licenses and provenance attestations.", region: "Global" },
    { name: "Kim Hamilton Duffy", affiliation: "Verifiable credentials / identity standards & ecosystem", linkedIn: "https://www.linkedin.com/in/kimdhamilton/", sourceUrl: "https://did-map-resources.s3.amazonaws.com/USA/Learner%2BCredential%2BWallet/KimHamiltonDuffy.pdf", skillsTags: ["verifiable credentials", "identity", "standards", "education credentials", "selective disclosure"], domainNames: ["Digital Identity & Credentials", "Education & Workforce", "Health", "Service Delivery & Case Management"], notes: "Standards + ecosystem leadership in VC/identity; frequent institutional engagement; provider credentials and selective disclosure in regulated contexts.", region: "Global" },
    { name: "Grahame Grieve", affiliation: "HL7 FHIR leader", linkedIn: "https://au.linkedin.com/in/grahame-grieve-952637", sourceUrl: "https://contactout.com/company/Open-Contracting-Partnership-6755", skillsTags: ["FHIR", "health interoperability", "HL7", "health IT"], domainNames: ["Health"], notes: "Key HL7 FHIR leader; relevant for pointers/attestations not raw data on-chain.", region: "Australia" },
    { name: "Lloyd McKenzie", affiliation: "Health IT / interoperability", linkedIn: "https://www.linkedin.com/in/lloyd-mckenzie-6b6681/", sourceUrl: "https://www.uvic.ca/health/hinf/assets/docs/lloydmackenzie_fhir_poster_2025.pdf", skillsTags: ["FHIR", "health interoperability", "standards"], domainNames: ["Health"], notes: "FHIR/standards ecosystem practitioner.", region: "Global" },
  ];

  const expertByName = new Map<string, { id: string }>();
  for (const entry of ROLODEX_ENTRIES) {
    let expert = expertByName.get(entry.name);
    if (!expert) {
      const created = await prisma.expert.create({
        data: {
          name: entry.name,
          affiliation: entry.affiliation,
          skillsTags: TAGS(entry.skillsTags),
          expertiseDomains: TAGS(entry.domainNames),
          contactPath: entry.linkedIn,
          referencesLinks: entry.sourceUrl ? JSON.stringify([{ label: "Source", url: entry.sourceUrl }]) : "",
          ethereumAlignmentNotes: entry.notes ?? "",
          region: entry.region ?? "Global",
          availability: "",
        },
      });
      expert = { id: created.id };
      expertByName.set(entry.name, expert);
    }
    for (const domainName of entry.domainNames) {
      const domainId = allDomainIds.get(domainName);
      if (domainId) {
        await prisma.expertDomain.upsert({
          where: { expertId_domainId: { expertId: expert!.id, domainId } },
          create: { expertId: expert!.id, domainId },
          update: {},
        });
      }
    }
  }

  // Add sample experts for demo (optional; Rolodex above is the main set)
  const alex = await prisma.expert.create({
    data: {
      name: "Alex Verifier",
      affiliation: "Ethereum Foundation",
      skillsTags: TAGS(["identity", "VC", "ZK", "privacy"]),
      expertiseDomains: TAGS(["Digital Identity & Credentials", "Data Governance & Interoperability"]),
      region: "Global",
      languages: TAGS(["en"]),
      ethereumAlignmentNotes: "Core contributor to attestation standards.",
      availability: "Available for short engagements",
    },
  });
  if (alex && identityId)
    await prisma.expertDomain.upsert({ where: { expertId_domainId: { expertId: alex.id, domainId: identityId } }, create: { expertId: alex.id, domainId: identityId }, update: {} });

  const sam = await prisma.expert.create({
    data: {
      name: "Sam Payments",
      affiliation: "Indie",
      skillsTags: TAGS(["payments", "G2P", "L2s", "public finance"]),
      expertiseDomains: TAGS(["Payments & Public Finance"]),
      region: "LATAM",
      languages: TAGS(["es", "en"]),
      availability: "Q2 2025",
    },
  });
  if (sam && paymentsId)
    await prisma.expertDomain.upsert({ where: { expertId_domainId: { expertId: sam.id, domainId: paymentsId } }, create: { expertId: sam.id, domainId: paymentsId }, update: {} });

  console.log("Seed complete: domains, edges, experiments, institutions, contacts, opportunities, experts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
