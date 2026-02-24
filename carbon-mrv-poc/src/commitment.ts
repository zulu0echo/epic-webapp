/**
 * Dataset commitment: hash of a canonical summary for audit trail.
 * Uses SHA-256; in production could use Poseidon or another commitment scheme.
 */

import { createHash } from "node:crypto";
import type { DatasetSummary } from "./types.js";

const ENCODING = "hex";

/**
 * Canonical serialization of the summary (deterministic JSON).
 */
function canonicalSummary(summary: Record<string, unknown>): string {
  return JSON.stringify(sortKeys(summary));
}

function sortKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj).sort()) {
    const v = obj[k];
    out[k] =
      v !== null && typeof v === "object" && !Array.isArray(v)
        ? sortKeys(v as Record<string, unknown>)
        : v;
  }
  return out;
}

/**
 * Create SHA-256 hash of the dataset summary.
 */
export function hashSummary(summary: Record<string, unknown>): string {
  return createHash("sha256")
    .update(canonicalSummary(summary))
    .digest(ENCODING);
}

/**
 * Create a dataset commitment from a summary and label.
 */
export function createDatasetCommitment(input: DatasetSummary): {
  commitmentHash: string;
  label: string;
  createdAt: string;
} {
  const createdAt = new Date().toISOString();
  const commitmentHash = hashSummary(input.summary);
  return {
    commitmentHash,
    label: input.label,
    createdAt,
  };
}

/**
 * Verify that a given summary matches a commitment hash.
 */
export function verifyCommitment(
  commitmentHash: string,
  summary: Record<string, unknown>
): boolean {
  return hashSummary(summary) === commitmentHash;
}
