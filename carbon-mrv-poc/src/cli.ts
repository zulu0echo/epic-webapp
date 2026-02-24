#!/usr/bin/env node
/**
 * CLI for Carbon MRV PoC: create commitment, attest, list.
 */

import { createDatasetCommitment, verifyCommitment } from "./commitment.js";
import { createAttestation, verifyAttestationSignature } from "./attestation.js";
import { Registry } from "./registry.js";

const REGISTRY_PATH = process.env["CARBON_MRV_REGISTRY"] ?? "registry-data.json";

function printUsage(): void {
  console.log(`
Carbon MRV PoC — CLI

  npm run demo              Run a full demo (commitment → attestation → list)
  npx tsx src/cli.ts commit <label> <json-summary>   Create dataset commitment
  npx tsx src/cli.ts attest <commitment-json>         Create attestation (stdin verifier details)
  npx tsx src/cli.ts list [--project <id>] [--outcome verified|rejected]  List attestations
  npx tsx src/cli.ts verify <attestation-json>       Verify attestation signature

Examples:

  npm run demo

  npx tsx src/cli.ts commit "emissions-2024-Q1" '{"period":"2024-Q1","source":"inventory","tCO2e":1200}'

  npx tsx src/cli.ts list --project proj-001 --outcome verified
`);
}

async function runDemo(): Promise<void> {
  console.log("=== Carbon MRV PoC Demo ===\n");

  const registry = new Registry(REGISTRY_PATH);

  // 1. Dataset commitment
  const summary = {
    period: "2024-Q1",
    source: "inventory",
    boundary: "Scope 1+2",
    tCO2e: 1200,
    methodology: "GHG Protocol",
  };
  const commitment = createDatasetCommitment({
    label: "emissions-2024-Q1",
    summary,
  });
  console.log("1. Dataset commitment created:");
  console.log(JSON.stringify(commitment, null, 2));
  console.log("");

  const matches = verifyCommitment(commitment.commitmentHash, summary);
  console.log("   Verify commitment:", matches ? "OK" : "FAIL");
  console.log("");

  // 2. Attestation
  const attestation = createAttestation({
    verifierId: "verifier-acme-001",
    verifierName: "ACME Verification Body",
    scope: {
      projectId: "proj-001",
      methodologyVersion: "GHG-Protocol-v1",
      reportingPeriod: "2024-Q1",
    },
    datasetCommitment: commitment,
    outcome: "verified",
  });
  console.log("2. Attestation created:");
  console.log(JSON.stringify(attestation, null, 2));
  console.log("");

  const sigOk = verifyAttestationSignature(attestation);
  console.log("   Verify signature:", sigOk ? "OK" : "FAIL");
  console.log("");

  // 3. Append to registry
  const entry = await registry.append(attestation);
  console.log("3. Recorded in registry:", registry.getPath());
  console.log("   Entry recordedAt:", entry.recordedAt);
  console.log("");

  // 4. List
  const entries = await registry.list();
  console.log("4. Registry now has", entries.length, "entry/entries.");
  console.log("");
  console.log("Done. Run 'npx tsx src/cli.ts list' to see all attestations.");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === "demo") {
    await runDemo();
    return;
  }

  if (cmd === "commit") {
    const label = args[1];
    const summaryJson = args[2];
    if (!label || !summaryJson) {
      console.error("Usage: commit <label> <json-summary>");
      process.exit(1);
    }
    let summary: Record<string, unknown>;
    try {
      summary = JSON.parse(summaryJson);
    } catch {
      console.error("Invalid JSON summary");
      process.exit(1);
    }
    const commitment = createDatasetCommitment({ label, summary });
    console.log(JSON.stringify(commitment, null, 2));
    return;
  }

  if (cmd === "attest") {
    const commitmentJson = args[1];
    if (!commitmentJson) {
      console.error("Usage: attest <commitment-json>");
      process.exit(1);
    }
    const datasetCommitment = JSON.parse(commitmentJson);
    const attestation = createAttestation({
      verifierId: process.env["VERIFIER_ID"] ?? "verifier-poc",
      verifierName: process.env["VERIFIER_NAME"] ?? "PoC Verifier",
      scope: {
        projectId: process.env["PROJECT_ID"] ?? "proj-001",
        methodologyVersion: process.env["METHODOLOGY"] ?? "GHG-Protocol-v1",
        reportingPeriod: process.env["REPORTING_PERIOD"],
      },
      datasetCommitment,
      outcome: (process.env["OUTCOME"] as "verified" | "rejected") ?? "verified",
      reason: process.env["REASON"],
    });
    const registry = new Registry(REGISTRY_PATH);
    await registry.append(attestation);
    console.log(JSON.stringify(attestation, null, 2));
    return;
  }

  if (cmd === "list") {
    const registry = new Registry(REGISTRY_PATH);
    let projectId: string | undefined;
    let outcome: "verified" | "rejected" | undefined;
    for (let i = 1; i < args.length; i++) {
      if (args[i] === "--project" && args[i + 1]) projectId = args[++i];
      if (args[i] === "--outcome" && args[i + 1]) outcome = args[++i] as "verified" | "rejected";
    }
    const entries = await registry.list({ projectId, outcome });
    console.log(JSON.stringify(entries, null, 2));
    return;
  }

  if (cmd === "verify") {
    const attestationJson = args[1];
    if (!attestationJson) {
      console.error("Usage: verify <attestation-json>");
      process.exit(1);
    }
    const attestation = JSON.parse(attestationJson);
    const ok = verifyAttestationSignature(attestation);
    console.log(ok ? "Signature valid" : "Signature invalid");
    process.exit(ok ? 0 : 1);
  }

  printUsage();
  process.exit(args.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
