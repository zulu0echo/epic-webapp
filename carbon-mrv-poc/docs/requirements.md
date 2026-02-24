# Requirements gathering and listing

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
