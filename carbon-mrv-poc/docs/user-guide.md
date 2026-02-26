# User guide (non-technical)

## What this PoC does

This proof of concept shows how **carbon MRV** (measurement, reporting, verification) can use **commitments** and **attestations** to create a clear, tamper-evident record of:

1. **What was measured** — a short “fingerprint” (hash) of the reported data, without publishing the full data.
2. **Who verified it** — a signed statement from an accredited verifier that they checked the data and either verified or rejected it.
3. **Where it’s recorded** — a registry that stores these attestations so programs and buyers can look them up and verify them without relying on a single central authority.

The design aligns with **CROPS**: **C**ensorship Resistance (no single gatekeeper; permissionless verification), **O**pen Source and Free (open formats and spec), **P**rivacy (raw data stays offchain), and **S**ecurity (anyone can verify signatures and commitments; walkaway test). See [Design philosophy](design-philosophy.md) for more.

---

## Parties involved

| Party | Role | Responsibility |
|-------|------|-----------------|
| **Prover** (project / operator) | Reports data | Prepares a dataset summary (period, methodology, key metrics). Creates a **commitment** (hash) from it. Shares the summary with the verifier over a secure channel; the commitment can be shared with the registry. |
| **Verifier** (accredited body) | Verifies data | Receives the full dataset summary from the prover. Reviews it offchain. If satisfied (or not), creates an **attestation** (verified/rejected) bound to the commitment and signs it. Submits the attestation to the registry. |
| **Registry** (operator) | Stores attestations | Maintains an append-only list of attestations. Does not need to see raw data. Can be run by a program, a standard body, or a third party; the protocol allows multiple registries. |
| **Program / buyer** | Consumes attestations | Queries the registry (e.g. “all verified attestations for project X”). Verifies attestation signatures and, if needed, that a commitment matches a known summary. Does not depend on a central authority to “bless” the data. |
| **Community / civil society** | Oversight | Can, in principle, inspect public registries or anchored roots and verify that attestations are consistent and signed by claimed verifiers. |

---

## Personas (who uses the system)

- **Maria (project developer)**  
  Runs a REDD+ or emissions-reduction project. She collects monitoring data, prepares a report under a given methodology, and wants to get it verified so she can access results-based finance or sell credits. She needs a simple way to produce a commitment from her report and to send the report (and commitment) to a verifier without exposing everything to the whole world.

- **James (verifier)**  
  Works for an accredited verification body. He receives reports from project developers, checks them against methodologies and evidence, and issues a formal opinion (verified/rejected). He wants his opinion to be bound cryptographically to the exact data he reviewed (the commitment) and to be verifiable by anyone, without his organization having to operate a central system.

- **Sam (registry operator)**  
  Operates a registry (e.g. for a voluntary standard or a program). They receive attestations from verifiers and store them. They want a simple, append-only store and the ability to let programs and buyers query attestations without being the single point of trust for “what is true.”

- **Alex (program manager / buyer)**  
  Manages a climate program or buys credits. They need to see which projects have been verified, by whom, and for which period and methodology. They want to verify attestations themselves (signature + commitment) rather than trusting a single registry’s word.

---

## User flows (step by step)

### Flow 1: Prover — create and share a commitment

1. **Prepare** a dataset summary (e.g. reporting period, methodology version, key metrics such as tCO2e). This is the full report content; it stays private except where shared with the verifier.
2. **Create a commitment**: Run the PoC (or call the API) with the summary. You receive a **commitment hash** and a **label** (e.g. `emissions-2024-Q1`). The hash is a fingerprint of the summary; the summary itself is not stored in the registry.
3. **Share with verifier**: Send the full summary to the verifier through a secure channel. Share the commitment (hash + label) with the verifier and, if needed, with the registry so they can later store the attestation that refers to this commitment.

**Outcome**: The prover has a commitment that uniquely binds to their report. No raw data has been published to the registry.

### Flow 2: Verifier — review and attest

1. **Receive** the dataset summary and the commitment (hash + label) from the prover.
2. **Review** the summary offchain (methodology, evidence, calculations). Decide: verified or rejected.
3. **Create an attestation**: Using the PoC (or API), create an attestation with: your verifier id and name, scope (project id, methodology version, reporting period), the prover’s dataset commitment, outcome (verified/rejected), and optionally a reason.
4. **Sign**: The system signs the attestation (PoC: HMAC; production: EIP-712 or similar with your key). The signature binds you to that exact commitment and outcome.
5. **Submit to registry**: Send the signed attestation to the registry. The registry appends it; it does not need to see the raw summary.

**Outcome**: The verifier has issued a falsifiable, signed statement. Anyone can later verify that the signature matches the attestation and that the commitment in the attestation matches a given summary.

### Flow 3: Program / buyer — list and verify

1. **List** attestations from the registry. Optionally filter by project id or outcome (e.g. only “verified”).
2. **Inspect** each attestation: verifier, scope, commitment hash, outcome, timestamps.
3. **Verify** (optional but recommended):  
   - Check that the attestation’s signature is valid (using the verifier’s public key in production, or the shared secret in the PoC).  
   - If you have the dataset summary, recompute the commitment hash and confirm it matches the attestation’s commitment.

**Outcome**: The program or buyer has a clear, verifiable view of what was attested and by whom, without relying on a central authority to “validate” the data.

---

## Running the demo

On a machine with Node.js installed:

```bash
git clone <repo-url>
cd carbon-mrv-poc
npm install
npm run build
node dist/cli.js demo
```

The demo will:

- Create an example dataset commitment (fingerprint of a small emissions summary).
- Create a verifier attestation and sign it.
- Save the attestation to a local registry file (`registry-data.json`).
- Print a short summary.

No account or server is required; everything runs locally. You can inspect `registry-data.json` to see the stored attestation.

### CLI commands (after build)

- **Create commitment**:  
  `node dist/cli.js commit "label" '{"period":"2024-Q1","tCO2e":1200,"methodology":"GHG Protocol"}'`
- **List attestations**:  
  `node dist/cli.js list`  
  Optional filters: `--project proj-001` and/or `--outcome verified`.
- **Verify an attestation**:  
  `node dist/cli.js verify '<attestation-json>'`

---

## What is *not* in this PoC

- Real verifier accreditation or identity binding (verifier id is an opaque string).
- Connection to existing carbon registries (Verra, Gold Standard, etc.).
- Onchain anchoring (planned as an extension).
- Compliance or legal advice — this is a technical demo only.

---

## Who this guide is for

- **Program and registry staff**: To see how commitments and attestations fit into MRV workflows and how they support decentralization and transparency.
- **Verifiers**: To understand what “signing an attestation” means and how it supports accountability.
- **Developers**: To extend the code (e.g. add onchain anchoring or align with a specific methodology).

For design principles (CROPS: Censorship Resistance, Open Source and Free, Privacy, Security), see [Design philosophy](design-philosophy.md). For technical details, see [README](../README.md), [Architecture](architecture.md), and [Specification](../spec/README.md).
