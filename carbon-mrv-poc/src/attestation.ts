/**
 * Attestation creation and verification.
 * PoC uses HMAC-SHA256 with a secret; production would use EIP-712 or similar.
 */

import { createHmac } from "node:crypto";
import { randomUUID } from "node:crypto";
import type { Attestation, AttestationInput, DatasetCommitment } from "./types.js";

const ENCODING = "hex";
const SIGNATURE_SECRET =
  process.env["CARBON_MRV_SIGNING_SECRET"] ?? "poc-dev-secret-change-in-production";

/**
 * Canonical payload for signing (deterministic).
 */
function payloadForSigning(
  verifierId: string,
  scope: AttestationScopeSerialized,
  commitment: DatasetCommitment,
  outcome: string,
  attestedAt: string
): string {
  return JSON.stringify({
    verifierId,
    scope,
    commitmentHash: commitment.commitmentHash,
    outcome,
    attestedAt,
  });
}

interface AttestationScopeSerialized {
  projectId: string;
  methodologyVersion: string;
  reportingPeriod?: string;
}

/**
 * Create a signed attestation (PoC: HMAC).
 */
export function createAttestation(input: AttestationInput): Attestation {
  const attestedAt = new Date().toISOString();
  const id = randomUUID();
  const scopeSer: AttestationScopeSerialized = {
    projectId: input.scope.projectId,
    methodologyVersion: input.scope.methodologyVersion,
    reportingPeriod: input.scope.reportingPeriod,
  };
  const payload = payloadForSigning(
    input.verifierId,
    scopeSer,
    input.datasetCommitment,
    input.outcome,
    attestedAt
  );
  const signature = createHmac("sha256", SIGNATURE_SECRET)
    .update(payload)
    .digest(ENCODING);

  return {
    id,
    verifierId: input.verifierId,
    verifierName: input.verifierName,
    scope: input.scope,
    datasetCommitment: input.datasetCommitment,
    outcome: input.outcome,
    reason: input.reason,
    attestedAt,
    signature,
  };
}

/**
 * Verify attestation signature (PoC: HMAC check).
 */
export function verifyAttestationSignature(a: Attestation): boolean {
  const scopeSer: AttestationScopeSerialized = {
    projectId: a.scope.projectId,
    methodologyVersion: a.scope.methodologyVersion,
    reportingPeriod: a.scope.reportingPeriod,
  };
  const payload = payloadForSigning(
    a.verifierId,
    scopeSer,
    a.datasetCommitment,
    a.outcome,
    a.attestedAt
  );
  const expected = createHmac("sha256", SIGNATURE_SECRET)
    .update(payload)
    .digest(ENCODING);
  return expected === a.signature;
}
