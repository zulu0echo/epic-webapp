# Requirements gathering and listing

This document lists functional and non-functional requirements for the Carbon MRV proof of concept. **Technical requirements for CROPS and the walkaway test** are specified normatively in [Spec Section 0](../spec/README.md#0-design-principles-and-technical-requirements-crops-and-walkaway-test) and summarized below for traceability.

## Technical requirements (CROPS and walkaway test)

The following requirements ensure the PoC design and implementation reflect CROPS and the walkaway test. Conforming implementations MUST satisfy these; the spec is the authoritative source.

| CROPS pillar | Requirement summary | Spec ID(s) | Verification |
|----------------|---------------------|------------|---------------|
| **Censorship Resistance** | Verification of attestations and commitments MUST NOT require a central server or single registry. Multiple registries MUST be possible; no kill switches or single points of failure. | CR-1–CR-4 | Signature and commitment verification work offline; registry is an interface, not a single vendor. |
| **Open Source and Free** | All formats, algorithms, and protocol steps MUST be fully specified; no privileged or hidden behavior. Standard hash (SHA-256) and deterministic serialization MUST be used. | OS-1–OS-3 | Spec defines all formats and steps; reference implementation is open source. |
| **Privacy** | Raw dataset summaries MUST NOT be in the shared layer. Only commitment + attestation in registry. Data minimization by default. | PV-1–PV-3 | Registry stores only commitment and attestation; no summary in attestation payload. |
| **Security** | Attestations MUST be verifiable by anyone; commitment verification MUST be deterministic and reproducible. Registry MUST be append-only. Walkaway test: no dependency on PoC authors or single operator. Threat model MUST be documented. | SC-1–SC-5 | §2.5, §2.6, §3; multiple implementations can satisfy spec. |

These requirements are normative in the [specification](../spec/README.md); the reference implementation and tests SHALL demonstrate compliance (e.g. `verifyAttestationSignature` and `verifyCommitment` work without network or central authority; registry interface allows multiple backends).

## Functional requirements

| ID   | Requirement | Priority |
|------|-------------|----------|
| FR-1 | The system SHALL produce a **dataset commitment** as a deterministic hash of a canonical summary (period, source, methodology, and key metrics). | MUST |
| FR-2 | The system SHALL allow a **verifier** to create an **attestation** that binds: verifier identity, scope (project, methodology version, reporting period), dataset commitment, and outcome (verified/rejected). | MUST |
| FR-3 | The system SHALL **sign** each attestation so that any party can verify the signature without trusting a central server. | MUST |
| FR-4 | The system SHALL support an **append-only registry** of attestations (PoC: file-based; production: onchain or verified API). | MUST |
| FR-5 | The system SHALL allow **listing** attestations with optional filters (e.g. project id, outcome). | MUST |
| FR-6 | The system SHALL support **verification** of a commitment: given a summary, confirm it hashes to a given commitment. | MUST |
| FR-7 | The system MAY support **onchain anchoring** of commitment or attestation roots (out of scope for initial PoC). | MAY |

## Non-functional requirements

| ID    | Requirement | Priority |
|-------|-------------|----------|
| NFR-1 | **Auditability**: All attestations SHALL be verifiable offline (signature check) and SHALL reference a unique commitment. | MUST |
| NFR-2 | **Determinism**: Commitment hash SHALL be deterministic for the same canonical summary (e.g. sorted JSON). | MUST |
| NFR-3 | **Documentation**: API and data formats SHALL be documented (see [spec](../spec/README.md)). | MUST |
| NFR-4 | **Alignment**: Data elements and terminology SHOULD align with existing MRV usage (e.g. project, methodology, reporting period) where practical. | SHOULD |
| NFR-5 | **Security**: The system SHALL be designed and documented with an explicit [threat model](security.md#1-threat-model), [trust assumptions](security.md#2-trust-assumptions), and [security considerations](security.md#3-security-considerations-and-limitations) (see [Security](security.md) and [Spec Section 3](../spec/README.md#3-security-considerations)). | MUST |
| NFR-6 | **CROPS and walkaway test**: The design SHALL align with **CROPS** (Censorship Resistance, Open Source and Free, Privacy, Security) and SHALL support the **walkaway test**: verification and operation SHALL NOT require the PoC authors or a single central operator (see [Design philosophy](design-philosophy.md)). | MUST |

## Regulatory / institutional constraints (for production)

- Alignment with UNFCCC transparency and MRV guidance.
- Compatibility with voluntary carbon standards (e.g. Verra, Gold Standard) where applicable.
- Data residency and access control as required by programs or jurisdictions (not implemented in PoC).

## Verification criteria

- **FR-1**: Unit test that same summary yields same hash; different summary yields different hash.
- **FR-2**: CLI or API creates attestation with required fields; attestation verifies.
- **FR-3**: Signature verification function returns true for valid attestation, false if payload or signature is altered.
- **FR-4**: Registry append and list operations succeed; data persists (file-based PoC).
- **FR-5**: List with filters returns correct subset.
- **FR-6**: `verifyCommitment(hash, summary)` returns true iff hash = hashSummary(summary).
- **NFR-6**: Design philosophy and architecture docs describe CROPS and walkaway test; verification is possible without the PoC authors or a single central operator (multiple registries, open spec, permissionless verification).
- **Section 0 (CR/OS/PV/SC)**: Spec Section 0 requirements CR-1–CR-4, OS-1–OS-2, PV-1–PV-3, SC-1–SC-5 are satisfied by the spec and reference implementation (offline verification, no raw data in registry, append-only registry, full specification of formats and algorithms).
