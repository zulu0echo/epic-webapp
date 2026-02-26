# Design philosophy: CROPS and the walkaway test

This proof of concept is designed and architected around a set of properties held as an indivisible whole—**CROPS**: **C**ensorship Resistance, **O**pen Source and Free (as in Freedom), **P**rivacy, and **S**ecurity—as the *sine qua non* of all development priorities. It also emphasizes the **walkaway test**: the protocol and core layers should remain robust and trustless enough to function and evolve even if today’s stewards disappeared. This document describes how the Carbon MRV PoC reflects those criteria.

---

## Design principles

- **CROPS-native**: The PoC’s design choices are derived from Censorship Resistance, Open Source and Free, Privacy, and Security. Adoption can be earned over time; principled ground once ceded is far harder to regain.
- **Walkaway test**: Verification of commitments and attestations does not depend on the PoC authors, a central server, or a single registry. Anyone with the spec and the data can verify; multiple implementations and registries can coexist.
- **Subtraction for resilience**: The specification and formats are open so that responsibility can diffuse to aligned actors; the system is more resilient when it does not depend on one operator or vendor.
- **No chokepoints**: The design avoids privileged intermediaries, hidden specifications, and dependency-heavy integration. Default path: remove leverage.

The following sections map each CROPS property to concrete design choices in this PoC.

---

## Censorship Resistance

**Principle**: No actor can selectively exclude valid use or break functionality. No centralized intermediaries or kill switches. No fragile reliance on political context.

**In this PoC**:

- **No single gatekeeper**: The protocol defines an append-only registry *interface* (append, list, optional filters). Multiple independent registries can coexist; attestations and commitments are defined by open formats, not by one database or operator.
- **Permissionless verification**: Anyone with the attestation and (if needed) the dataset summary can verify that the commitment matches and that the attestation signature is valid. No central service need be queried to “validate” an attestation.
- **Portability**: Commitments and attestations are data structures that can be stored in a file, a database, or an onchain contract. Programs and buyers can choose which registry or registries to trust or query; the format does not lock them into one operator.
- **Future**: Onchain anchoring (e.g. commitment or attestation roots) can provide a neutral, shared layer that many registries and programs use, without any one entity owning the source of truth.

**Contrast with status quo**: Today, voluntary and compliance carbon systems often depend on a single registry or program operator. This PoC shows that attestations can be issued and verified without a central gatekeeper controlling access or interpretation.

---

## Open Source and Free (as in Freedom)

**Principle**: No privileged code or hidden specifications. All work public, auditable, forkable. No merely source-available licenses.

**In this PoC**:

- **Open specification**: The [formal spec](../spec/README.md) defines data formats, protocol steps, and verification rules in normative language (MUST/SHOULD/MAY). The spec is implementation-neutral where possible so that multiple implementations can interoperate.
- **Open source**: The reference implementation (TypeScript, CLI, tests) is open source. Registries, verifiers, and programs can adopt the same formats and algorithms without depending on a single vendor.
- **Open formats**: Commitments are defined by a canonical serialization (e.g. sorted JSON) and a standard hash (SHA-256). Attestations have a defined payload and signature scheme. No proprietary encoding or “secret sauce” is required to verify.
- **Open participation**: Any accredited verifier (or in a future design, any identity layer) can issue attestations; any registry can store them; any program or buyer can verify them, using the same public rules.

**Contrast with status quo**: Carbon MRV today often relies on closed platforms, proprietary APIs, or single-registry ecosystems. This PoC demonstrates that an open, spec-driven design is feasible for commitments and attestations.

---

## Privacy

**Principle**: User data not exposed beyond necessity. Maximal privacy as default. Protocol-level viability required.

**In this PoC**:

- **Raw data offchain**: Dataset summaries (emissions, project details, methodology parameters) never need to leave the prover or verifier. Only a **commitment** (cryptographic hash) and a **signed attestation** are stored in the registry or published.
- **Data minimization**: The attestation contains: verifier identity, scope (project id, methodology version, optional period), commitment hash, outcome (verified/rejected), and timestamps. It does not contain the underlying monitoring data or full report.
- **Verifier–prover channel**: The prover shares the full summary with the verifier over a separate (e.g. secure) channel. The registry and any public layer see only the commitment and attestation.
- **Future**: Privacy-preserving extensions (e.g. zero-knowledge proofs or secure aggregation) could allow proofs over aggregated or sensitive data without revealing the raw inputs.

**Contrast with status quo**: Many MRV systems require submitting full reports to a central registry or platform. Here, the shared layer is minimal by design: hashes and signed statements, not raw data.

---

## Security

**Principle**: Things must do what they claim—no more, no less. Governance minimization. Pass the walkaway test for both protocol and users.

**In this PoC**:

- **Falsifiable attestations**: An attestation is a signed statement. The signature binds the verifier to a specific commitment, scope, and outcome. If the verifier later disputes what they attested to, the signed payload can be reproduced and compared. The system does what it claims: it attests to a binding between verifier, commitment, and outcome.
- **Reproducible verification**: Given a dataset summary, anyone can recompute the commitment hash (canonical form + SHA-256) and compare it to the commitment in the attestation. Given the attestation, anyone can verify the signature (in production, with the verifier’s public key). No governance or central authority is required to “bless” the result.
- **Append-only registry**: The registry does not support deletion or modification of past entries. The history of attestations is preserved; no one can silently alter the record. This supports the walkaway test: the record remains verifiable even if the original operator disappears.
- **Explicit threat model and trust assumptions**: The [Security](security.md) document and [Spec Section 3](../spec/README.md#3-security-considerations) describe what the system guarantees and what it assumes, so that users and implementers can judge whether the design does what it claims.
- **Future**: Onchain anchoring (e.g. Merkle root of attestations or commitments) can provide a public, timestamped record that anyone can audit without permission.

**Contrast with status quo**: In many systems, “verification” is a database flag or an opaque approval. Here, verification is a cryptographic object (signature + commitment) that can be checked independently.

---

## Summary table

| CROPS property | PoC manifestation |
|-----------------------------|-------------------|
| **Censorship Resistance**   | Multiple registries possible; verification does not depend on one operator; no kill switches; format is portable. |
| **Open Source and Free**   | Open spec, open source, open formats; no privileged code; anyone can implement or verify. |
| **Privacy**                 | Raw data offchain; only commitment + attestation in shared layer; data minimization; maximal privacy as default for the shared layer. |
| **Security**               | Signed, falsifiable attestations; reproducible commitment verification; append-only registry; explicit threat model; walkaway test (verify without PoC authors or single operator). |

---

## Audience

- **Technical readers**: Use this doc to see how the PoC’s design choices map to CROPS and the walkaway test (e.g. why canonical hashing, why no raw data in registry, why permissionless verification).
- **Policy and program readers**: Use this doc to understand how the Carbon MRV PoC aligns with CROPS (Censorship Resistance, Open Source and Free, Privacy, and Security) and why that matters for resilient, long-lived public-interest infrastructure.

For protocol details and normative technical requirements (Section 0), see [Specification](../spec/README.md) and [Architecture](architecture.md). For user flows and personas, see [User guide](user-guide.md). For threat model and trust assumptions, see [Security](security.md).
