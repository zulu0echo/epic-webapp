/** Canonical EPIC copy passages — link to anchors on /use-case-template where noted. */

export const BLOG_BYLINE =
  "Author: EPIC team · Host: Ethereum Foundation · Status: Working note, not EF policy";

export const WHAT_EPIC_WILL_NOT_DO = `EPIC will not prescribe architectures for governments or multilaterals. We publish patterns, questions, templates, and minimal proof-of-concepts; choosing a stack, vendor, or legal framework remains with institutions and affected users.

EPIC will not lend Ethereum Foundation reputational capital to coerced enrolment. We do not treat mandatory digital ID, benefits gating without offline alternatives, or humanitarian registration without informed consent as successes to promote — regardless of whether they use Ethereum.

EPIC will not treat institutional sovereignty as user self-sovereignty. A state or agency controlling keys, revocation, and verification endpoints is not "self-sovereign" because the ledger is public. Our unit of analysis is the person who must live with the system — not the institution that procures it.`;

export const WALKAWAY_TEST_USER_SIDE =
  "a user with the public spec and their own data can verify claims, switch registries or wallets, and continue without permission from EPIC, the original operator, or the issuing institution. Operator continuity alone is not sufficient.";

export const COMMITMENTS_LIMITATIONS = `Anchoring hashes, Merkle roots, or attestations on a public ledger can improve tamper-evidence for integrity claims. It does not automatically improve privacy or user agency, and it can conflict with legal erasure and correction rights.

Linkability. On-chain anchors are often permanent and publicly observable. Commitments that share schema, timing, or issuer identifiers across programmes can be correlated to re-identify individuals or groups — especially when combined with off-chain leaks, kiosk locations, or sparse populations.

Erasure and correction. Many jurisdictions require deletion or correction of personal data. Immutable ledgers do not erase; designs that anchor personal identifiers or uniquely correlatable commitments may make lawful erasure impossible without breaking verification.

Chilling effects. Verifiable permanent records of participation — aid receipt, credential revocation — can deter legitimate use even when raw data stays off-chain.

EPIC treats on-chain commitments as optional integrity tools, not default public-sector architecture. Any proposal using them must document who bears linkability risk, how erasure requests are handled, and whether enrolment is voluntary with a credible non-digital alternative.`;

export const CROPS_SECTION = {
  title: "CROPS",
  id: "crops",
  body: `EPIC uses CROPS as non-negotiable design properties for public-interest work. They are assessed together — not traded off for adoption speed, institutional convenience, or market share.

Censorship resistance: No actor with ordinary control over the system can selectively block a user from verifying or exiting with their data and keys.

Resilience: The system survives operator, vendor, or steward failure without trapping users — technically and procedurally.

Openness: Specs, formats, and reference code needed to verify and fork are public; no hidden rules or source-available lock-in.

Privacy: Data exposure is minimised by default; privacy is not an optional overlay on a surveillance core.

Security: The system does what it claims — no more, no less — with explicit threat models and falsifiable claims.

Worked failure examples

1. Censorship resistance failure: A national credentials app verifies only against one government-hosted API; users cannot present the same credential via any other wallet. The registry may be "decentralised" on paper; the user is not.

2. Privacy failure: Hashes of daily benefit claims are anchored on a public ledger; the chain reveals timing, frequency, and correlation across programmes — re-identification risk for named individuals even without raw data onchain.`,
};

export const WALKAWAY_SECTION = {
  title: "Walkaway test (user-side exit)",
  id: "walkaway-test",
  body: `A design passes the walkaway test when a user (or independent verifier acting on public data) can, without permission from EPIC, the original operator, or the issuer:

1. Verify the claims the system makes about their data or status;
2. Export or continue using their credentials, keys, or evidence in another client or registry supported by the public spec;
3. Understand what breaks if the original operator disappears — and whether essential services remain accessible without re-enrolment under coercion.

Operator-side walkaway alone is insufficient. A file-based registry that any engineer can re-host passes operator walkaway while users remain locked to a single issuer wallet with no portable keys — that fails user-side walkaway.

Worked failure examples

1. Passes operator walkaway, fails user walkaway: An attestation registry publishes an open spec and multiple hosts run append-only mirrors. Users received credentials only through a proprietary app with no key export; when the app shuts down, users cannot prove prior status.

2. Fails both: A single hosted backend must approve every verification request; the vendor holds all signing keys; neither users nor independent verifiers can validate without that backend.`,
};

export const ETHEREUM_NEGATIVE_OUTCOME = `Section 2 must include an Ethereum relevance assessment, not only a value proposition. A complete assessment states when Ethereum or a public verifiable layer does not add unique value — and names a better primitive (legacy database with audit log, federated API, legal instrument, local-first app, etc.).

Include one paragraph titled "When Ethereum is not appropriate" with a concrete negative example.

Worked example (identity): Updating a civil registry's internal case-management workflow for name corrections does not require a blockchain. The problem is procedural latency and inter-agency workflow — solvable with existing registry law, secure APIs, and audit logging. Adding a public ledger anchor for each correction creates linkability and erasure conflicts without giving the registrant key custody or selective disclosure. Conclusion for this problem: Do not proceed to pilot on Ethereum; fix workflow and access control first.`;
