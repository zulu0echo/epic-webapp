# Carbon MRV Attestations and Dataset Commitments — Specification

---

slug: CS-01  
title: Carbon MRV Attestations and Dataset Commitments  
name: Carbon MRV Attestations and Dataset Commitments  
status: draft  
category: Standards Track  
editor: EPIC / Ethereum Foundation  
contributors: (add names or leave blank)  
tags:
  - carbon
  - mrv
  - attestation
  - commitment
  - climate

---

# Change Process

This document is governed by the [COSS](https://github.com/privacy-ethereum/zkspecs) (or project-specific governance). Changes follow the same process as other spec documents in this repository.

# Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

# Abstract

This specification defines a minimal model for **dataset commitments** and **verifier attestations** in the context of Carbon MRV (Measurement, Reporting, Verification). A **dataset commitment** is a cryptographic binding to a canonical summary of reported data (e.g. emissions, period, methodology): it consists of a hash of that summary, a label, and a timestamp. An **attestation** is a signed statement by a verifier that binds to a specific commitment and records an outcome (verified or rejected), with a defined scope (project, methodology version, reporting period). A **registry** stores attestations in an append-only manner. The goal is to support an audit-grade, tamper-evident trail of what was measured and who verified it, without requiring raw monitoring data to be published. This document is written to match the reference proof-of-concept implementation in this repository so that the spec and the code are clearly aligned.

# Motivation

Current carbon MRV systems often rely on centralized registries and manual verification. Provenance—what was measured, under which methodology, and who verified it—is not always machine-verifiable or portable across programs. This specification enables:

- **Audit-grade provenance**: Anyone can verify that an attestation refers to a specific commitment and that the attestation was signed by the claimed verifier.
- **Verifier accountability**: Attestations are bound to a commitment and outcome; signatures are falsifiable.
- **Interoperability**: A common data format for commitments and attestations allows multiple registries or programs to consume the same attestations and, in future, to reconcile (e.g. prevent double-counting) via shared commitment roots.

---

# Specification

## 1. Data formats

### 1.1 Dataset summary (input to commitment)

A **dataset summary** is the input used to create a commitment. It SHALL have the following structure:

| Field   | Type   | Description |
|--------|--------|-------------|
| label  | string | Short human-readable label for the dataset (e.g. `"emissions-2024-Q1"`). |
| summary| object | A single JSON object whose keys are summary fields (e.g. `period`, `source`, `tCO2e`, `methodology`). Values MAY be strings, numbers, booleans, or nested objects. |

The `summary` object is used only for hashing; its schema is application-specific. Implementations MUST support at least string and number values and nested objects for canonical serialization.

### 1.2 Canonical serialization of the summary

For hashing, the summary object MUST be serialized in a **canonical** form so that the same logical content always produces the same hash.

- **Rule**: Recursively sort all object keys in lexicographic (string) order. Arrays and primitive values are left as-is. The result is then serialized as JSON with no extra whitespace (no spaces or newlines between tokens).
- **Example**: `{ "b": 2, "a": 1 }` and `{ "a": 1, "b": 2 }` both serialize to `{"a":1,"b":2}`.

The reference implementation implements this in `src/commitment.ts` as `canonicalSummary` (which calls `sortKeys` recursively).

### 1.3 Hash function for the commitment

The commitment hash MUST be computed as follows:

1. Serialize the summary object in canonical form (see 1.2).
2. Compute the SHA-256 hash of the resulting UTF-8 string.
3. Encode the hash as a lowercase hexadecimal string (64 characters).

Implementations MUST use SHA-256 as specified in [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.180-4.pdf). Other schemes (e.g. Poseidon) MAY be used in extensions for compatibility with specific chains or circuits.

### 1.4 Dataset commitment (output)

A **dataset commitment** is the output of the commitment process. It SHALL contain exactly these fields:

| Field           | Type   | Description |
|-----------------|--------|-------------|
| commitmentHash  | string | Lowercase hex-encoded SHA-256 hash of the canonical summary (64 characters). |
| label           | string | The label from the dataset summary input. |
| createdAt       | string | ISO 8601 timestamp (e.g. `2024-01-15T10:30:00.000Z`) when the commitment was created. |

No additional fields are required. The reference implementation returns this structure from `createDatasetCommitment(input)`.

### 1.5 Attestation scope

An **attestation scope** binds the attestation to a project, methodology, and optional reporting period. It SHALL contain:

| Field              | Type   | Required | Description |
|--------------------|--------|----------|-------------|
| projectId          | string | Yes      | Project or program identifier (e.g. registry project ID). |
| methodologyVersion | string | Yes      | Methodology version (e.g. `"GHG-Protocol-v1"` or `"VM0001-v2022"`). |
| reportingPeriod    | string | No       | Reporting period (e.g. `"2024-Q1"`). |

### 1.6 Attestation (signed statement)

An **attestation** is a signed statement by a verifier. It SHALL contain:

| Field              | Type   | Description |
|--------------------|--------|-------------|
| id                 | string | Unique identifier (e.g. UUID v4). The reference implementation uses `randomUUID()`. |
| verifierId         | string | Verifier identifier (e.g. accredited body ID or DID). |
| verifierName       | string | Human-readable verifier name. |
| scope              | object | Attestation scope (see 1.5). |
| datasetCommitment  | object | A dataset commitment (see 1.4). |
| outcome            | string | Exactly one of `"verified"` or `"rejected"`. |
| attestedAt         | string | ISO 8601 timestamp when the attestation was created. |
| signature          | string | Signature over the signing payload (see 2.2), encoded as lowercase hex. |

An attestation MAY also include:

| Field  | Type   | Description |
|--------|--------|-------------|
| reason | string | Optional reason (e.g. for rejections). |

### 1.7 Registry entry

A **registry entry** represents one attestation stored in the registry. It SHALL contain:

| Field        | Type   | Description |
|--------------|--------|-------------|
| attestation  | object | An attestation (see 1.6). |
| recordedAt   | string | ISO 8601 timestamp when the entry was recorded. |

It MAY also contain:

| Field  | Type   | Description |
|--------|--------|-------------|
| anchor | string | Optional onchain anchor (e.g. transaction hash or root). The PoC does not set this. |

### 1.8 Registry file format (reference implementation)

The reference implementation stores the registry as a single JSON file. The file SHALL have this structure:

```json
{
  "entries": [ /* array of registry entries (1.7) */ ],
  "updatedAt": "ISO 8601 timestamp"
}
```

The file path MAY be configured (e.g. via environment variable `CARBON_MRV_REGISTRY`). The default path SHALL be `registry-data.json`.

---

## 2. Protocol flow and operations

### 2.0 End-to-end protocol flow (reference demo)

The reference implementation demonstrates the following flow:

1. **Create a dataset commitment**: From a dataset summary (label + summary object), compute the canonical summary, hash it with SHA-256, and produce a commitment (commitmentHash, label, createdAt).
2. **Create an attestation**: A verifier, given verifierId, verifierName, scope (projectId, methodologyVersion, optional reportingPeriod), the dataset commitment, and an outcome (`"verified"` or `"rejected"`), produces a signed attestation (id, all fields, signature).
3. **Append to registry**: The attestation is appended to the registry as a new entry (attestation, recordedAt, optional anchor).
4. **List (optional filters)**: Callers can list entries, optionally filtered by projectId and/or outcome.

Verification can be done at any time: recompute the commitment hash from a summary and compare to the stored commitment; recompute the attestation signature from the attestation fields and compare to the stored signature.

### 2.1 Creating a dataset commitment

**Input**: A dataset summary (label, summary object).

**Steps**:

1. Set `createdAt` to the current time in ISO 8601 format.
2. Compute `commitmentHash` = SHA-256(canonicalSummary(summary)), encoded as lowercase hex.
3. Return the dataset commitment object (commitmentHash, label, createdAt).

**Verification**: Given a commitment and a summary, verification succeeds if and only if SHA-256(canonicalSummary(summary)) equals the commitment’s `commitmentHash` (both as lowercase hex). The reference implementation exposes `createDatasetCommitment(input)` and `verifyCommitment(commitmentHash, summary)`.

### 2.2 Signing payload for attestations

The payload that is signed MUST be a deterministic serialization of the following fields so that any implementation can reproduce it:

- `verifierId` (string)
- `scope` (object with keys `projectId`, `methodologyVersion`, and optionally `reportingPeriod`)
- `commitmentHash` (string) — the `datasetCommitment.commitmentHash` value
- `outcome` (string)
- `attestedAt` (string)

**Canonical form**: The reference implementation serializes this as a single JSON object with keys in this order: `verifierId`, `scope`, `commitmentHash`, `outcome`, `attestedAt`. The `scope` object uses keys `projectId`, `methodologyVersion`, `reportingPeriod` (if present). Implementations MUST use a deterministic serialization (e.g. sorted keys or fixed key order) so that the same logical payload produces the same bytes.

**Reference**: `src/attestation.ts` function `payloadForSigning`.

### 2.3 Signature scheme (proof-of-concept)

The **reference implementation** uses HMAC-SHA256:

1. The signing key is a shared secret (e.g. from environment variable `CARBON_MRV_SIGNING_SECRET`). For the PoC only, a default secret MAY be used and MUST be clearly marked as non-production.
2. Compute HMAC-SHA256(key, payload) where payload is the UTF-8 encoding of the canonical signing payload string.
3. Encode the result as a lowercase hexadecimal string (64 characters).
4. Store this string in the attestation’s `signature` field.

**Production**: Implementations SHOULD use a public-key signature scheme (e.g. [EIP-712](https://eips.ethereum.org/EIPS/eip-712), Ed25519) so that each verifier signs with their own key and anyone can verify without shared secrets. HMAC with a shared secret MUST NOT be used for multi-party verifier production deployments.

### 2.4 Creating an attestation

**Input**: verifierId, verifierName, scope, datasetCommitment, outcome, and optionally reason.

**Steps**:

1. Set `attestedAt` to the current time in ISO 8601 format.
2. Generate a unique `id` (e.g. UUID v4).
3. Build the signing payload from verifierId, scope, datasetCommitment.commitmentHash, outcome, attestedAt (see 2.2).
4. Compute the signature over the payload (see 2.3).
5. Return the attestation object with all required and optional fields.

The reference implementation exposes `createAttestation(input)`.

### 2.5 Verifying an attestation signature

**Input**: An attestation object.

**Steps**:

1. Reconstruct the signing payload from the attestation’s verifierId, scope, datasetCommitment.commitmentHash, outcome, and attestedAt using the same canonical serialization as in 2.2.
2. Compute the expected signature using the same algorithm and key as in 2.3.
3. Compare the attestation’s `signature` field to the expected signature (constant-time comparison RECOMMENDED).
4. Verification succeeds if and only if they match.

Additionally, the implementation MUST confirm that the attestation’s `datasetCommitment` is well-formed (has commitmentHash, label, createdAt).

The reference implementation exposes `verifyAttestationSignature(attestation)`.

### 2.6 Registry operations

**Append**: Given an attestation and an optional anchor, the registry SHALL create a new registry entry with attestation, recordedAt (current time in ISO 8601), and optional anchor, and SHALL append it to the stored list of entries. The registry MUST NOT modify or remove existing entries in this operation. The reference implementation: `Registry.append(attestation, anchor?)`.

**List**: The registry MAY support listing entries with optional filters. The reference implementation supports:
- `projectId`: return only entries whose attestation.scope.projectId equals the given value.
- `outcome`: return only entries whose attestation.outcome equals the given value (`"verified"` or `"rejected"`).

The reference implementation: `Registry.list(filters?)`.

---

## 3. Security considerations

### 3.1 Threat model

**Assets**:

- **Integrity of attestations**: The binding between verifier, scope, commitment, and outcome. If an attacker can forge or alter attestations, programs and buyers may rely on false verification claims.
- **Integrity of commitments**: The binding between a dataset summary and its hash. If an attacker can find collisions or substitute a different summary for the same hash, the attestation may be associated with data the verifier did not review.
- **Registry consistency**: The append-only, unaltered history of attestations. If an attacker can delete or modify past entries, auditability and non-repudiation are weakened.
- **Confidentiality of dataset summaries** (out of scope for mitigation in this spec): Summaries may contain sensitive project or emissions data. This specification does not define encryption or access control for summaries; only commitments and attestations are assumed to be stored or published.

**Actors and threats**:

| Actor | Capability | Threat |
|-------|------------|--------|
| **External attacker** | No legitimate signing key or registry access | Cannot forge valid attestations (signature required). Cannot invert commitment hash to recover summary (hash is one-way). May attempt to replay old attestations, substitute summaries that collide on the same hash (SHA-256 collision resistance assumed), or attack registry availability. |
| **Malicious verifier** | Holds signing key (PoC: shared secret; production: private key) | Can issue attestations that bind to any commitment they choose. Cannot be prevented by this spec; trust assumption is that verifiers are accredited and accountable (see 3.2). Can attest to a commitment without having seen the underlying summary (attestation does not prove verifier saw data; it proves they signed a statement). |
| **Malicious prover** | Creates summaries and commitments | Can create a commitment to a summary and send a different summary to the verifier (commitment binding is to the hash, not to “what verifier saw”). Mitigation is procedural: verifier must confirm that the summary they review hashes to the commitment they attest to. |
| **Registry operator** (if applicable) | Controls registry backend | Can drop, reorder, or delay entries; can censor. This spec does not mandate a trusted registry; append-only and optional onchain anchoring (future) can reduce single-operator trust. |

**Security goals**:

- **Integrity**: An attacker MUST NOT be able to forge a valid attestation without the verifier’s signing key (or, in the PoC, the shared secret). Commitment hashes MUST be collision-resistant; SHA-256 is used for the PoC.
- **Verifiability**: Any party with the attestation (and, for production, the verifier’s public key) MUST be able to verify the signature without relying on a central authority. Any party with a dataset summary MUST be able to verify that it matches a given commitment.
- **Confidentiality**: This spec does not address confidentiality of the dataset summary. Summaries may be sensitive. Only commitments and attestations are assumed to be suitable for registry storage or publication in this specification.

### 3.2 Trust assumptions

The following are explicitly **assumed** by this specification and the reference implementation; they are not guaranteed by the protocol:

| Assumption | Description |
|------------|-------------|
| **Verifier key security** | In production, the verifier’s signing key (e.g. EIP-712 private key) is kept secret and used only by the accredited verifier. In the PoC, the HMAC shared secret is known to all parties that create or verify attestations; it MUST NOT be used in multi-verifier production. |
| **Verifier honesty** | The verifier is assumed to attest only after reviewing the dataset summary that hashes to the stated commitment. The protocol does not cryptographically prove that the verifier saw the summary; it only proves that they signed a statement binding them to the commitment and outcome. |
| **Hash function** | SHA-256 is assumed to be collision-resistant and preimage-resistant (per FIPS 180-4). No known practical attacks are assumed. |
| **Canonical serialization** | All parties that create or verify commitments use the same canonical serialization (sorted keys, no whitespace). Otherwise the same logical summary could produce different hashes. |
| **Registry behavior** | If a registry is used, it is assumed to append entries only and not to alter or delete past entries. The reference implementation uses a local file; production registries may need access control, availability, and integrity guarantees outside this spec. |
| **Identity binding** | `verifierId` is an opaque string. Binding to real-world accreditation, DIDs, or onchain identities is out of scope. Trust in “who is the verifier” is assumed to be established by other means. |

### 3.3 Security considerations and limitations

- **PoC signature scheme**: HMAC with a shared secret is not suitable for multi-verifier production. Implementations MUST use public-key signatures (e.g. EIP-712) in production so that each verifier signs with their own key and anyone can verify with the corresponding public key.
- **No revocation**: This spec does not define revocation of attestations. A compromised or mistaken attestation cannot be cryptographically revoked. Future versions MAY add revocation lists or time-bounds.
- **No identity layer**: Verifier identity (`verifierId`) is an opaque string; binding to real-world accreditation or DIDs is out of scope for this document.
- **Registry backend**: The spec does not mandate a specific registry backend. The reference implementation uses a local JSON file; production implementations MAY use a database or onchain contract. Availability, access control, and censorship resistance depend on the deployment.
- **Prover–verifier binding**: The attestation proves “verifier V signed commitment C with outcome O.” It does not prove “verifier V saw the underlying summary.” Verifiers MUST verify offchain that the summary they review hashes to C before attesting.

For a fuller narrative treatment of threat model, trust assumptions, and security, see [Security](../docs/security.md) in the repository documentation.

---

## 4. Implementation notes and compliance

The **reference implementation** is in this repository:

| Spec section     | Implementation |
|-------------------|----------------|
| 1.2 Canonical summary | `src/commitment.ts`: `canonicalSummary`, `sortKeys` |
| 1.3–1.4 Commitment   | `src/commitment.ts`: `hashSummary`, `createDatasetCommitment`, `verifyCommitment` |
| 1.5–1.6 Attestation  | `src/types.ts`: `AttestationScope`, `Attestation`; `src/attestation.ts`: `createAttestation`, `verifyAttestationSignature` |
| 2.2 Signing payload  | `src/attestation.ts`: `payloadForSigning` (JSON with fixed key order) |
| 2.3 Signature        | `src/attestation.ts`: HMAC-SHA256, key from `CARBON_MRV_SIGNING_SECRET` |
| 2.6 Registry         | `src/registry.ts`: `Registry` class, file path from `CARBON_MRV_REGISTRY` (default `registry-data.json`) |

**CLI**: The reference implementation provides a CLI (`src/cli.ts`) with commands: `demo` (full flow), `commit`, `attest`, `list`, `verify`. Run with `node dist/cli.js <command> ...` after `npm run build`.

**Tests**: Unit tests in `src/commitment.test.ts` verify deterministic hashing, commitment creation and verification, and attestation creation and signature verification. Run with `npm test`.

---

# References

1. [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) — Key words for use in RFCs to Indicate Requirement Levels  
2. [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.180-4.pdf) — Secure Hash Standard (SHA-256)  
3. [UNFCCC MRV technical material](https://unfccc.int/process-and-meetings/transparency-and-reporting/support-for-developing-countries/consultative-group-of-experts/measurement-reporting-and-verification-technical-material)  
4. [World Bank: MRV of carbon credits](https://www.worldbank.org/en/news/feature/2022/07/27/what-you-need-to-know-about-the-measurement-reporting-and-verification-mrv-of-carbon-credits)  
5. [EIP-712](https://eips.ethereum.org/EIPS/eip-712) — Typed structured data hashing and signing (recommended for production attestations)

---

# Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
