import { describe, it, expect } from "vitest";
import {
  createDatasetCommitment,
  verifyCommitment,
  hashSummary,
} from "./commitment.js";
import {
  createAttestation,
  verifyAttestationSignature,
} from "./attestation.js";

describe("commitment", () => {
  it("creates deterministic hash for same summary", () => {
    const summary = { a: 1, b: "x" };
    expect(hashSummary(summary)).toBe(hashSummary(summary));
    expect(hashSummary({ b: "x", a: 1 })).toBe(hashSummary(summary));
  });

  it("creates commitment and verifies", () => {
    const summary = { period: "2024-Q1", tCO2e: 100 };
    const c = createDatasetCommitment({ label: "test", summary });
    expect(c.commitmentHash).toBeDefined();
    expect(c.label).toBe("test");
    expect(verifyCommitment(c.commitmentHash, summary)).toBe(true);
    expect(verifyCommitment(c.commitmentHash, { ...summary, tCO2e: 101 })).toBe(false);
  });
});

describe("attestation", () => {
  it("creates attestation and signature verifies", () => {
    const commitment = createDatasetCommitment({
      label: "x",
      summary: { x: 1 },
    });
    const a = createAttestation({
      verifierId: "v1",
      verifierName: "Verifier One",
      scope: { projectId: "p1", methodologyVersion: "M1" },
      datasetCommitment: commitment,
      outcome: "verified",
    });
    expect(a.id).toBeDefined();
    expect(a.signature).toBeDefined();
    expect(verifyAttestationSignature(a)).toBe(true);
  });
});
