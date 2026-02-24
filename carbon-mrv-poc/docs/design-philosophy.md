# Design philosophy: decentralization, privacy, openness, transparency

This proof of concept is designed in line with **CROPS** values: systems that reduce reliance on central gatekeepers, protect privacy, embrace open protocols and data, and enable public verification. The following principles guide the Carbon MRV PoC and its specification.

---

## Decentralization

**Idea**: No single party should control the attestation record or the ability to verify. Trust should be distributed and portable.

**In this PoC**:

- **Registries are not singular**: The protocol defines an append-only registry *interface* (append, list, optional filters). Multiple independent registries can coexist; attestations and commitments are defined by open formats, not by one database.
- **Verification is permissionless**: Anyone with the attestation and (if needed) the dataset summary can verify that the commitment matches and that the attestation signature is valid. No central service need be queried to “validate” an attestation.
- **Portability**: Commitments and attestations are data structures that can be stored in a file, a database, or an onchain contract. Programs and buyers can choose which registry or registries to trust or query; the format does not lock them into one operator.
- **Future**: Onchain anchoring (e.g. commitment or attestation roots) can provide a neutral, shared layer that many registries and programs use, without any one entity owning the source of truth.

**Contrast with status quo**: Today, voluntary and compliance carbon systems often depend on a single registry or program operator. This PoC shows that attestations can be issued and verified without a central gatekeeper controlling access or interpretation.

---

## Privacy

**Idea**: Minimize exposure of sensitive data. Only what is necessary for verification and accountability should be shared or published.

**In this PoC**:

- **Raw data offchain**: Dataset summaries (emissions, project details, methodology parameters) never need to leave the prover or verifier. Only a **commitment** (cryptographic hash) and a **signed attestation** are stored in the registry or published.
- **Data minimization**: The attestation contains: verifier identity, scope (project id, methodology version, optional period), commitment hash, outcome (verified/rejected), and timestamps. It does not contain the underlying monitoring data or full report.
- **Verifier–prover channel**: The prover shares the full summary with the verifier over a separate (e.g. secure) channel. The registry and any public layer see only the commitment and attestation.
- **Future**: Privacy-preserving extensions (e.g. zero-knowledge proofs or secure aggregation) could allow proofs over aggregated or sensitive data without revealing the raw inputs.

**Contrast with status quo**: Many MRV systems require submitting full reports to a central registry or platform. Here, the shared layer is minimal by design: hashes and signed statements, not raw data.

---

## Openness

**Idea**: Protocols, formats, and implementations should be open. No proprietary lock-in; anyone can implement, inspect, or extend.

**In this PoC**:

- **Open specification**: The [formal spec](../spec/README.md) defines data formats, protocol steps, and verification rules in normative language (MUST/SHOULD/MAY). The spec is implementation-neutral where possible so that multiple implementations can interoperate.
- **Open source**: The reference implementation (TypeScript, CLI, tests) is open source. Registries, verifiers, and programs can adopt the same formats and algorithms without depending on a single vendor.
- **Open formats**: Commitments are defined by a canonical serialization (e.g. sorted JSON) and a standard hash (SHA-256). Attestations have a defined payload and signature scheme. No proprietary encoding or “secret sauce” is required to verify.
- **Open participation**: Any accredited verifier (or in a future design, any identity layer) can issue attestations; any registry can store them; any program or buyer can verify them, using the same public rules.

**Contrast with status quo**: Carbon MRV today often relies on closed platforms, proprietary APIs, or single-registry ecosystems. This PoC demonstrates that an open, spec-driven design is feasible for commitments and attestations.

---

## Transparency

**Idea**: Actions that affect trust (e.g. “this dataset was verified”) should be auditable and falsifiable. Anyone can check that claims match the underlying data and that attestations were issued by the claimed verifier.

**In this PoC**:

- **Falsifiable attestations**: An attestation is a signed statement. The signature binds the verifier to a specific commitment, scope, and outcome. If the verifier later disputes what they attested to, the signed payload can be reproduced and compared.
- **Reproducible verification**: Given a dataset summary, anyone can recompute the commitment hash (canonical form + SHA-256) and compare it to the commitment in the attestation. Given the attestation, anyone can verify the signature (in production, with the verifier’s public key).
- **Append-only registry**: The registry does not support deletion or modification of past entries. The history of attestations is preserved; no one can silently alter the record.
- **Future**: Onchain anchoring (e.g. Merkle root of attestations or commitments) can provide a public, timestamped record that anyone can audit without permission.

**Contrast with status quo**: In many systems, “verification” is a database flag or an opaque approval. Here, verification is a cryptographic object (signature + commitment) that can be checked independently.

---

## Summary table

| Principle       | PoC manifestation |
|-----------------|--------------------|
| **Decentralization** | Multiple registries possible; verification does not depend on one operator; format is portable. |
| **Privacy**         | Raw data offchain; only commitment + attestation in shared layer; data minimization. |
| **Openness**        | Open spec, open source, open formats; anyone can implement or verify. |
| **Transparency**    | Signed, falsifiable attestations; reproducible commitment verification; append-only registry. |

---

## Audience

- **Technical readers**: Use this doc to see how the PoC’s design choices map to CROPS goals (e.g. why canonical hashing, why no raw data in registry).
- **Policy and program readers**: Use this doc to understand how “blockchain” or “verifiable data” in Carbon MRV can align with decentralization, privacy, openness, and transparency, rather than with a single centralized ledger.

For protocol details, see [Specification](../spec/README.md) and [Architecture](architecture.md). For user flows and personas, see [User guide](user-guide.md).
