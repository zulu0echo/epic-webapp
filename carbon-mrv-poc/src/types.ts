/**
 * Carbon MRV PoC — shared types for attestations and commitments.
 */

/** Scope of an attestation (e.g. project id, methodology). */
export interface AttestationScope {
  /** Project or program identifier (e.g. registry project ID). */
  projectId: string;
  /** Methodology version (e.g. "VM0001-v2022"). */
  methodologyVersion: string;
  /** Optional reporting period (e.g. "2024-Q1"). */
  reportingPeriod?: string;
}

/** Dataset commitment: hash of the reported data summary (what was measured). */
export interface DatasetCommitment {
  /** Hex-encoded SHA-256 hash of the canonical dataset summary. */
  commitmentHash: string;
  /** Short label for the dataset (e.g. "emissions-2024-Q1"). */
  label: string;
  /** ISO 8601 timestamp when the commitment was created. */
  createdAt: string;
}

/** Verifier attestation: signed statement that a dataset was verified. */
export interface Attestation {
  /** Unique attestation id (e.g. UUID or content-addressed). */
  id: string;
  /** Verifier identifier (e.g. accredited body ID or DID). */
  verifierId: string;
  /** Human-readable verifier name. */
  verifierName: string;
  /** Scope of the attestation. */
  scope: AttestationScope;
  /** Dataset commitment this attestation refers to. */
  datasetCommitment: DatasetCommitment;
  /** Outcome: verified | rejected. */
  outcome: "verified" | "rejected";
  /** Optional short reason (e.g. for rejections). */
  reason?: string;
  /** ISO 8601 timestamp when the attestation was created. */
  attestedAt: string;
  /** Signature or proof (PoC: hex of HMAC or placeholder). In production: EIP-712 or similar. */
  signature: string;
}

/** Registry entry: attestation plus optional metadata. */
export interface RegistryEntry {
  attestation: Attestation;
  /** Optional onchain anchor (tx hash or log index). PoC may leave blank. */
  anchor?: string;
  /** When the entry was recorded in this registry. */
  recordedAt: string;
}

/** Input to create a dataset commitment (summary of what is being committed). */
export interface DatasetSummary {
  label: string;
  /** Canonical representation for hashing (e.g. sorted JSON of key fields). */
  summary: Record<string, unknown>;
}

/** Input to create an attestation (before signing). */
export interface AttestationInput {
  verifierId: string;
  verifierName: string;
  scope: AttestationScope;
  datasetCommitment: DatasetCommitment;
  outcome: "verified" | "rejected";
  reason?: string;
}
