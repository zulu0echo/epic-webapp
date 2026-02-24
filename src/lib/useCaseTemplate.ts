/**
 * Proof of Concept Template: structure and content for govtech domain/subdomain proof of concepts.
 * Sections align with EPIC deliverables: problem research, value prop, requirements,
 * architecture, code, docs, demo, CTA, roadmap, and specification (zkspecs-style).
 */

export type TemplateSection = {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
};

export const USE_CASE_TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    id: "problem-research",
    title: "Problem exploration and existing solution research",
    description: `Describe the public-sector or institutional problem in concrete terms: who is affected, what fails today, and why it matters. Summarise existing solutions (policy, legacy systems, pilots, standards) and their limitations. Include citations to official sources, standards bodies, or multilateral guidance (e.g. UNFCCC, World Bank, OECD) where relevant. The goal is to establish a shared understanding of the problem space and the gap that an Ethereum-based approach could address.`,
    acceptanceCriteria: [
      "Problem statement is specific and cites affected stakeholders (e.g. verifiers, registries, beneficiaries).",
      "At least two existing solutions or frameworks are described with strengths and limitations.",
      "Sources are linked (URLs or references) and authoritative where possible.",
      "The gap or limitation that motivates an Ethereum-based solution is clearly stated.",
    ],
  },
  {
    id: "ethereum-value-prop",
    title: "Ethereum relevance and value proposition",
    description: `Explain why Ethereum (or public blockchain / verifiable data) is relevant to this use case. Describe the value proposition in terms of coordination, transparency, auditability, or programmable trust. Call out which Ethereum primitives apply (e.g. attestations, commitments, registries, smart contracts) and how they map to the problem. Avoid generic blockchain claims; focus on concrete benefits (e.g. tamper-evident audit trail, verifier attestations, milestone-based disbursement) and any trade-offs or constraints (e.g. data offchain, privacy).`,
    acceptanceCriteria: [
      "Value proposition is stated in one or two clear sentences.",
      "At least one Ethereum primitive (e.g. attestations, registries, commitments) is named and linked to a problem or requirement.",
      "Trade-offs or constraints (e.g. scalability, privacy, regulatory) are acknowledged where relevant.",
      "Language is accessible to both technical and policy readers.",
    ],
  },
  {
    id: "requirements",
    title: "Requirements gathering and listing",
    description: `Provide a structured list of functional and non-functional requirements for a proof of concept or pilot. Group by category (e.g. functional, security, compliance, operational). Requirements should be testable (e.g. \"The system SHALL record verifier attestations with a timestamp and verifier identity\"). Use MUST/SHOULD/MAY (RFC 2119) or equivalent if appropriate. Include any regulatory, interoperability, or institutional constraints (e.g. data residency, access control, alignment with UNFCCC or national MRV frameworks).`,
    acceptanceCriteria: [
      "Requirements are listed in a structured way (e.g. numbered list or table).",
      "At least five functional requirements and at least two non-functional (e.g. security, auditability) are included.",
      "Each requirement is specific and verifiable.",
      "Regulatory or institutional constraints are explicitly called out where they exist.",
    ],
  },
  {
    id: "architecture-diagram",
    title: "Architecture diagram for a proof of concept",
    description: `Provide a diagram (or link to a diagram) that shows the main components of the proof of concept: data sources, processing steps, blockchain/verifiable layer, and any external systems or users. Describe the flow in short captions or bullet points. The diagram should make it clear what runs onchain vs offchain, who submits data, who verifies, and how integrity is maintained. Use standard notation (e.g. boxes for components, arrows for data/control flow) and keep it readable for both technical and non-technical stakeholders.`,
    acceptanceCriteria: [
      "A diagram or link to a diagram (e.g. Mermaid, draw.io, image) is provided.",
      "Onchain vs offchain components are clearly distinguished.",
      "Data flow (inputs, processing, outputs) and main actors (e.g. prover, verifier, registry) are indicated.",
      "A short narrative (paragraph or bullet list) explains the flow and design choices.",
    ],
  },
  {
    id: "sample-code",
    title: "Sample code of the proof of concept and GitHub repository",
    description: `Include or link to sample code that demonstrates the core logic of the proof of concept (e.g. attestation format, commitment scheme, smart contract interface, or verifier workflow). Provide a link to a public GitHub (or equivalent) repository with a README that explains how to build, run, and test the code. The code should be minimal but runnable and aligned with the architecture diagram. Document dependencies, environment setup, and any test or demo scripts.`,
    acceptanceCriteria: [
      "At least one code snippet or module is shown that illustrates a key part of the PoC.",
      "A public GitHub (or equivalent) repository URL is provided.",
      "Repository README includes: purpose, setup instructions, and how to run tests or a demo.",
      "License and contribution guidelines are stated or linked.",
    ],
  },
  {
    id: "documentation",
    title: "Associated documentation (technical and non-technical)",
    description: `List and link all documentation that supports the use case: technical docs (API, contracts, data formats), user or operator guides, policy briefs, and any non-technical explainers for decision-makers. For each document, give a one-line summary and the audience (e.g. developers, verifiers, policy). Technical documentation should cover interfaces, data schemas, and deployment; non-technical documentation should explain the problem, solution, and benefits without assuming protocol expertise.`,
    acceptanceCriteria: [
      "At least one technical document (e.g. API spec, schema, contract doc) is linked or summarized.",
      "At least one non-technical document (e.g. overview, policy brief, user guide) is linked or summarized.",
      "Each linked document has a short description and target audience.",
      "Links are valid and publicly accessible where possible.",
    ],
  },
  {
    id: "visual-demo",
    title: "Visual demo and video explanation of user flow",
    description: `Provide a visual demo (screens, wireframes, or recording) that shows the main user flow: e.g. how a prover submits data, how a verifier attests, how a registry or dashboard displays results. Include a short video (or link to a video) that walks through the flow and explains each step in plain language. The goal is to make the proof of concept tangible for stakeholders who will not read code or specs. Captions or narration should highlight where Ethereum or verifiable data adds value.`,
    acceptanceCriteria: [
      "A demo (link, embed, or downloadable asset) is provided—e.g. video, interactive prototype, or screenshot walkthrough.",
      "The main user flow (e.g. submit → verify → record) is clearly shown.",
      "A video or narrated walkthrough explains the flow in under ~5 minutes, with plain-language description.",
      "Where relevant, the moment(s) where blockchain/verifiable data is used are pointed out.",
    ],
  },
  {
    id: "call-to-action",
    title: "Call to action to develop this further",
    description: `State clearly what you are asking from the reader or community: e.g. pilot partners, feedback on the spec, contributions to the repo, or funding. Specify contact points (email, forum, GitHub issues), timelines if relevant, and what kind of input or commitment you need. Make it easy for interested parties to take the next step (e.g. \"Open an issue with the label pilot-interest\" or \"Contact [email] with subject line Use Case PoC\").`,
    acceptanceCriteria: [
      "A single, clear call to action is stated (e.g. join pilot, contribute code, review spec).",
      "At least one concrete contact or channel is provided (email, GitHub, Discord, etc.).",
      "Next steps or timeline are indicated where appropriate.",
      "The ask is realistic and scoped (e.g. \"feedback on Section 3\" rather than \"adopt the system\").",
    ],
  },
  {
    id: "potential-features",
    title: "List of potential features that can be added",
    description: `List potential features or extensions that are out of scope for the current proof of concept but could be added in a later phase. For each, give a short description and why it would add value (e.g. \"Multi-registry reconciliation to prevent double-counting\"). Prioritisation (e.g. high/medium/low) or dependency order is optional but helpful. This section helps roadmap discussions and sets expectations about what is not in v1.`,
    acceptanceCriteria: [
      "At least three potential features are listed.",
      "Each feature has a one- or two-sentence description and rationale.",
      "Features are clearly marked as future or out-of-scope for the current PoC.",
      "Where relevant, dependencies between features or phases are noted.",
    ],
  },
  {
    id: "specification-document",
    title: "Specification document (technical spec, zkspecs-style)",
    description: `Provide a formal specification document that follows a structure similar to [Ethereum improvement specs or COSS-style specs](https://github.com/privacy-ethereum/zkspecs/blob/main/specs/2/README.md): frontmatter (slug, title, name, status, category, editor, contributors, tags), Abstract, Motivation, Specification (with subsections for data formats, protocol flow, security considerations), Implementation notes, References, and optional appendices. Use normative language (MUST, SHOULD, MAY per RFC 2119) for requirements. The spec should be implementation-neutral where possible but precise enough for interoperability.`,
    acceptanceCriteria: [
      "Document includes frontmatter or header with: title, status, category, editor/contributors, tags.",
      "Sections include: Abstract, Motivation, and at least one Specification subsection (e.g. data format, protocol flow).",
      "Normative keywords (MUST, SHOULD, MAY) are used consistently for requirements.",
      "Security considerations and references (standards, prior art) are included.",
      "Link to the full spec (e.g. GitHub, HackMD) is provided if the spec lives elsewhere.",
    ],
  },
];
