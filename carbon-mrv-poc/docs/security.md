# Security: threat model, trust assumptions, and considerations

This document describes the **threat model**, **trust assumptions**, and **security considerations** for the Carbon MRV proof of concept and its specification. It is intended for developers, auditors, and program managers who need a clear picture of what the system protects against and what it assumes.

The design aligns with the **Security** pillar of CROPS: things must do what they claim (no more, no less), governance minimization (no central authority required to verify), and the **walkaway test** (protocol and users can verify without depending on the PoC authors or a single operator). It also supports **Censorship Resistance**: verification does not depend on a central server or gatekeeper. See [Design philosophy](design-philosophy.md) for full alignment.

---

## 1. Threat model

### 1.1 Assets

| Asset | Description | Impact if compromised |
|-------|-------------|------------------------|
| **Integrity of attestations** | The binding between verifier identity, scope (project, methodology, period), commitment hash, and outcome (verified/rejected). | Programs and buyers may rely on false verification claims; verifier accountability is undermined. |
| **Integrity of commitments** | The binding between a dataset summary and its hash. | A different summary could be associated with the same hash (collision); attestations could be misassociated with data the verifier did not review. |
| **Registry record** | The append-only, unaltered history of attestation entries. | Deletion or modification of past entries weakens auditability and non-repudiation. |
| **Dataset summaries** | The full reported data (period, methodology, metrics). | Summaries may be commercially or personally sensitive. This PoC does not define confidentiality protection for summaries; they are assumed to be shared only over appropriate channels. |

### 1.2 Actors and threats

**External attacker (no keys, no registry access)**

- **Forge attestations**: Not possible without the verifier’s signing key (production: private key; PoC: shared HMAC secret). Signature verification rejects tampered or forged payloads.
- **Invert commitment**: Not feasible; SHA-256 is used as a one-way hash. An attacker cannot recover the summary from the commitment hash.
- **Collision attack**: The design assumes SHA-256 collision resistance. Finding two summaries that hash to the same value is assumed to be infeasible.
- **Replay**: Old attestations can be replayed (e.g. submitted again to a registry). Mitigation is operational: registries can deduplicate by attestation id or commitment+scope+verifier; revocation is out of scope for this PoC.
- **Registry availability**: A registry operator or network attacker could make the registry unavailable. This spec does not address availability or DDoS mitigation.

**Malicious verifier**

- Can issue attestations for any commitment they choose, including commitments whose underlying summary they did not review. The protocol does not cryptographically prove “verifier saw this summary”; it only proves “verifier signed this commitment and outcome.” Trust assumption: verifiers are accredited and follow procedure (verify that summary hashes to commitment before attesting).
- Can sign with a stolen or shared key if key management is weak. Production must use per-verifier keys and secure key storage.

**Malicious prover**

- Can create a commitment for summary A and send summary B to the verifier. If the verifier attests without checking that the summary they reviewed hashes to the commitment, the attestation binds to A while the verifier may have reviewed B. Mitigation: verifiers MUST verify that `hash(summary they reviewed) === commitment.commitmentHash` before signing.

**Registry operator**

- Can drop, reorder, or delay entries; can censor certain attestations. The spec does not mandate a trusted or decentralized registry. Multiple registries and optional onchain anchoring (future) can reduce reliance on a single operator.

### 1.3 Security goals

- **Integrity of attestations**: Only the holder of the verifier’s signing key can produce a valid attestation. Any party can verify the signature.
- **Integrity of commitments**: The same canonical summary always produces the same hash; different summaries produce different hashes (collision resistance assumed). Anyone with the summary can verify it against the commitment.
- **No requirement for central authority**: Verification of signatures and commitments does not depend on a central server or oracle. Supports Censorship Resistance and Security (walkaway test).

---

## 2. Trust assumptions

The following are **explicitly assumed**; they are not guaranteed by the protocol or the PoC.

| Assumption | Description |
|------------|-------------|
| **Verifier key security** | In production, each verifier’s signing key (e.g. EIP-712 private key) is kept secret and used only by that verifier. In the PoC, the HMAC shared secret is for demonstration only and MUST NOT be used when multiple verifiers are involved. |
| **Verifier procedure** | Verifiers only attest after reviewing the dataset summary and confirming that it hashes to the commitment they are attesting to. The protocol does not enforce this; it is a procedural and accreditation requirement. |
| **Hash function** | SHA-256 is collision-resistant and preimage-resistant (FIPS 180-4). No practical attacks are assumed. |
| **Canonical serialization** | All implementations use the same canonical form (recursively sorted keys, JSON with no extra whitespace) for the summary when computing the commitment. Otherwise the same logical data could yield different hashes. |
| **Registry behavior** | If a registry is used, it appends entries only and does not alter or delete past entries. The reference implementation uses a local file; production may need additional integrity and availability guarantees. |
| **Identity** | `verifierId` is an opaque identifier. Binding to real-world accreditation, DIDs, or onchain identities is out of scope. Trust in “who the verifier is” is established by other means (e.g. accreditation body, registry policy). |

---

## 3. Security considerations and limitations

### 3.1 Signature scheme

- **PoC**: HMAC-SHA256 with a shared secret. All parties that create or verify attestations must know the secret. Suitable only for single-verifier or demo use.
- **Production**: Implementations MUST use public-key signatures (e.g. EIP-712) so that each verifier has their own key and anyone can verify with the corresponding public key. This supports verifier accountability and avoids shared secrets.

### 3.2 No revocation

Attestations cannot be cryptographically revoked. If a verifier’s key is compromised or an attestation was issued in error, there is no in-spec mechanism to revoke it. Future versions may add revocation lists or time-bounds.

### 3.3 No identity layer

Verifier identity is an opaque string. This spec does not define how to bind `verifierId` to real-world entities or to prevent impersonation. That is left to accreditation, registries, or future identity layers.

### 3.4 Confidentiality of summaries

Dataset summaries are not encrypted or access-controlled by this spec. Provers and verifiers are responsible for sharing summaries over secure channels. Only commitments and attestations are designed for storage or publication in the shared layer (data minimization).

### 3.5 Registry backend

The reference implementation uses a local JSON file. Production deployments may use a database, an API, or an onchain contract. Security properties (availability, access control, censorship resistance) depend on the chosen backend and are outside the scope of this document.

### 3.6 Prover–verifier binding

The attestation cryptographically binds the verifier to a **commitment hash**, not to the raw summary. Verifiers MUST verify offchain that the summary they review hashes to that commitment before attesting. Otherwise a prover could swap summaries and the attestation would still verify.

---

## 4. Summary table

| Topic | PoC / spec stance |
|-------|-------------------|
| **Attestation forgery** | Prevented by signature; attacker needs verifier’s key. |
| **Commitment collision** | Assumed infeasible (SHA-256). |
| **Summary confidentiality** | Not addressed; summaries shared via appropriate channels. |
| **Verifier honesty** | Trust assumption; no cryptographic proof that verifier saw summary. |
| **Registry tampering** | Trust assumption (append-only); multiple registries and onchain anchoring can reduce single-operator trust. |
| **Revocation** | Not in scope. |
| **Identity binding** | Out of scope; verifierId is opaque. |

---

For the normative specification of data formats, protocol steps, and security requirements, see [Specification](../spec/README.md) Section 3. For requirements traceability, see [Requirements](requirements.md).
