# Ethereum relevance and value proposition

## Value proposition (short)

Ethereum (or a public verifiable data layer) can **anchor dataset commitments and verifier attestations** so that what was measured, who verified it, and under what rules form a **tamper-evident, reproducible audit trail**. The design aligns with **CROPS** values: **decentralization** (no single registry gatekeeper), **privacy** (raw data offchain; only commitments and attestations shared), **openness** (open protocols and formats), and **transparency** (anyone can verify signatures and reproduce proofs). See [Design philosophy](design-philosophy.md) for a full treatment.

## Solution required

The solution must provide:

1. **Dataset commitments**: A canonical, reproducible binding (e.g. hash) to a dataset summary so that “what was measured” is fixed without publishing the full data. This enables privacy and allows any party to check later that a given summary matches the commitment.
2. **Verifier attestations**: A signed statement by an accredited verifier binding them to a specific commitment, scope (project, methodology version, period), and outcome (verified/rejected). Signatures must be verifiable by anyone (open verification) without relying on a central authority.
3. **Registry interface**: An append-only store for attestations (and optional anchors). The protocol should allow multiple registries; attestations and commitments are portable. No single operator need control who can verify or query.
4. **Data minimization**: Raw monitoring data, project details, and PII stay offchain. Only commitments and attestations (and optionally onchain roots) are in the shared layer.
5. **Open specification and formats**: So that different implementations and registries can interoperate; no proprietary lock-in.

This PoC implements (1)–(3) with a file-based registry and demonstrates (4)–(5) via the spec and open source.

## Why Ethereum / verifiable data is relevant

Carbon MRV depends on **trust in the integrity of reported and verified data**. Today that trust is achieved mainly through centralized registries, manual audits, and bilateral agreements. Challenges include:

- **Provenance**: Verifiers and reviewers often cannot easily trace data back to source and methodology in a machine-verifiable way.
- **Accountability**: It is hard to hold verifiers to a single, falsifiable record of what they attested to; signatures are not standard.
- **Interoperability**: Different registries and programs use different systems; reconciling “same project, same period” is difficult and prone to double-counting.
- **Centralization**: A few registries and platforms hold the “source of truth”; decentralization and portability are limited.
- **Privacy**: Submitting full reports to central systems increases exposure; a design that minimizes shared data while preserving verification is needed.

Ethereum (and compatible chains/L2s) and **verifiable data** more broadly offer:

1. **Commitments**: A hash (or other commitment) of the dataset can be published or anchored. Later, anyone can check that a given summary matches the commitment without re-publishing raw data (**privacy**).
2. **Attestations**: Verifiers can sign a structured statement (e.g. EIP-712) binding them to a specific commitment, methodology, and outcome. Signatures are verifiable by anyone (**transparency**, **openness**).
3. **Registry / anchor**: A registry (onchain or offchain with onchain anchors) can store attestations or their roots. Multiple registries can coexist; the format is open (**decentralization**).

## Primitives used in this PoC

| Primitive        | Role in PoC                                                                 |
|------------------|-------------------------------------------------------------------------------|
| **Commitment**   | SHA-256 hash of canonical dataset summary; proves “this summary was committed” without revealing full dataset. |
| **Attestation**  | Signed statement (verifier, scope, commitment, outcome). PoC uses HMAC; production would use EIP-712 or similar. |
| **Registry**     | Append-only list of attestations. PoC: file-based; production: onchain or verified API with optional onchain anchor. |

## Trade-offs and constraints

- **Raw data offchain**: Sensor data, full inventories, and PII stay offchain. Only commitments and attestations (and optional anchors) need to touch a chain (**privacy**).
- **Scalability**: Onchain storage can be minimized (e.g. roots or batch commitments); heavy data and logic stay offchain.
- **Regulatory**: Real deployment must align with UNFCCC, voluntary standards, and national rules; this PoC does not implement compliance logic.
- **Privacy**: This PoC does not address privacy-preserving aggregation (e.g. ZK aggregation); that is listed as a potential future feature. Data minimization (only commitment + attestation in shared layer) is already applied.

## Audience

- **Technical**: Developers and architects who want to see how commitments and attestations can be composed and how they support decentralization, privacy, openness, and transparency.
- **Policy / programs**: Stakeholders who want to understand “what goes onchain” (or in the shared layer) and how it supports MRV without replacing existing methodologies, and how CROPS-style design (decentralization, privacy, openness, transparency) applies to Carbon MRV.
