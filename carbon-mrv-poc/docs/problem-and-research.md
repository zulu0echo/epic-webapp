# Problem exploration and existing solution research

## Problem statement

**Carbon MRV** (Measurement, Reporting, Verification) focuses on quantifying greenhouse gas (GHG) reductions or removals for carbon crediting, national inventories, and results-based climate finance. Credibility depends on:

- **Measurement**: Consistent baselines, boundaries, and methodologies (e.g. GHG Protocol, IPCC).
- **Reporting**: Structured, auditable data that can be shared with registries and programs.
- **Verification**: Independent verification by accredited bodies that the reported data is complete and correct.

**Who is affected**:

- **Project developers and operators**: They report data and bear the cost of verification. When systems are fragmented or opaque, they face repeated audits and unclear provenance requirements.
- **Accredited verifiers**: They review data and issue opinions; they carry liability. They often lack full visibility into data lineage (e.g. subcontractor data, sensor calibration) and work in manual, document-heavy workflows.
- **Registry operators**: They are custodians of credits and claims. Centralized registries become single points of failure and trust; interoperability with other programs is difficult.
- **Buyers and intermediaries**: They need to trust that claims are real and not double-counted. Opaque or fragmented systems increase due diligence cost and risk.
- **Programs** (e.g. Article 6, voluntary standards): They need consistent, auditable records that can align with UNFCCC and national rules. Fragmented pipelines and incompatible formats make this hard.
- **Communities and civil society**: They are affected by project quality and integrity. Lack of transparency and accountability undermines trust in carbon markets.

**Current failures**:

- **Fragmented data pipelines**: Data is collected in many formats and systems; verifiers often lack visibility into full provenance (e.g. subcontractor data, sensor calibration). There is no shared “commitment” to what was measured that can be referenced across systems.
- **Baseline and methodology disputes**: Inconsistent or contested baselines and methodologies lead to inflated or inconsistent claims, undermining market trust (see World Bank, UNFCCC material). A tamper-evident binding between “what was measured” and “who verified it under which methodology” is missing.
- **Cost and scale**: Scaling credible verification without exploding costs is a bottleneck; manual checks and repeated audits are expensive. Machine-verifiable attestations could reduce redundant work.
- **Double-counting and integrity**: Without a shared, tamper-evident view of what was measured and verified, double-counting and misreporting remain risks. Centralized registries do not inherently interoperate; no common commitment layer exists.
- **Centralization of trust**: Trust is concentrated in a few registries and platforms. Decentralization—multiple registries, portable attestations, open verification—is not the norm.
- **Privacy vs. accountability**: Full reports are often submitted to central systems. A design that minimizes data exposure (only commitments and signed attestations in the shared layer) while preserving accountability is largely absent.

## Existing solutions and limitations

### 1. UNFCCC MRV frameworks

- **What**: International frameworks for national reporting and transparency (e.g. biennial reports, NDCs). Include guidance on MRV for mitigation.
- **Strengths**: Authoritative; align with Paris Agreement.
- **Limitations**: Focused on national/institutional reporting; not designed for real-time or project-level verification at scale; data formats and systems vary by country.

### 2. Voluntary carbon standards (e.g. Verra VCS, Gold Standard)

- **What**: Methodologies and registries for voluntary carbon credits. Define how to measure, report, and verify project-level outcomes.
- **Strengths**: Widely used; methodologies and verification procedures are public.
- **Limitations**: Centralized registries; verification is often manual and document-based; limited machine-readable, shared provenance of “what was measured and who verified it.”

### 3. National and program registries

- **What**: Government or program-specific registries (e.g. for Article 6, REDD+). Store project and credit data.
- **Strengths**: Align with compliance and program rules.
- **Limitations**: Fragmented; interoperability and cross-registry reconciliation are hard; no shared commitment layer for integrity.

### 4. Digital MRV pilots

- **What**: Various pilots (e.g. IoT sensors, digital reporting tools, blockchain-based registries) to improve data quality and auditability.
- **Strengths**: Show demand for better provenance and automation.
- **Limitations**: Often proprietary or single-program; no common attestation format or commitment scheme for cross-program use.

## Gap

A **shared, tamper-evident record** of (1) what was measured (dataset commitment), (2) who verified it (verifier attestation), and (3) under what rules (methodology version) would support:

- **Audit-grade provenance** that reviewers can reproduce or challenge without relying on a single central database.
- **Verifier accountability** and reduced reliance on opaque manual checks; signatures are falsifiable.
- **Interoperability** across registries and programs (e.g. commitment-based reconciliation and double-counting checks).
- **Decentralization**: No single party need control the attestation record; multiple registries can coexist.
- **Privacy**: Raw data stays offchain; only commitments and attestations are in the shared layer.
- **Openness and transparency**: Open formats and specs; anyone can verify attestations and commitments.

This PoC demonstrates a minimal version: dataset commitments, signed attestations, and a simple registry, with a path to onchain anchoring and alignment with CROPS design goals (see [Design philosophy](design-philosophy.md)).

## References

- [UNFCCC MRV technical material](https://unfccc.int/process-and-meetings/transparency-and-reporting/support-for-developing-countries/consultative-group-of-experts/measurement-reporting-and-verification-technical-material)
- [World Bank: What you need to know about MRV of carbon credits](https://www.worldbank.org/en/news/feature/2022/07/27/what-you-need-to-know-about-the-measurement-reporting-and-verification-mrv-of-carbon-credits)
- [Digital MRV (Springer)](https://link.springer.com/article/10.1007/s12599-025-00953-3) — research on digital MRV
