/**
 * Simple file-based registry for attestations (PoC).
 * In production this would be replaced by onchain registry or verified API.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { Attestation, RegistryEntry } from "./types.js";

const DEFAULT_PATH = "registry-data.json";

/**
 * Load entries from JSON file; create file if missing.
 */
async function load(path: string): Promise<RegistryEntry[]> {
  try {
    const raw = await readFile(path, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data.entries) ? data.entries : [];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

/**
 * Save entries to JSON file.
 */
async function save(path: string, entries: RegistryEntry[]): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(
    path,
    JSON.stringify({ entries, updatedAt: new Date().toISOString() }, null, 2),
    "utf-8"
  );
}

/**
 * Registry interface: append and list attestations.
 */
export class Registry {
  constructor(private readonly path: string = DEFAULT_PATH) {}

  /** Append an attestation and return the new entry. */
  async append(attestation: Attestation, anchor?: string): Promise<RegistryEntry> {
    const entry: RegistryEntry = {
      attestation,
      anchor,
      recordedAt: new Date().toISOString(),
    };
    const entries = await load(this.path);
    entries.push(entry);
    await save(this.path, entries);
    return entry;
  }

  /** List all entries, optionally filtered by project or outcome. */
  async list(filters?: {
    projectId?: string;
    outcome?: "verified" | "rejected";
  }): Promise<RegistryEntry[]> {
    let entries = await load(this.path);
    if (filters?.projectId) {
      entries = entries.filter(
        (e) => e.attestation.scope.projectId === filters.projectId
      );
    }
    if (filters?.outcome) {
      entries = entries.filter((e) => e.attestation.outcome === filters.outcome);
    }
    return entries;
  }

  /** Get registry file path. */
  getPath(): string {
    return this.path;
  }
}
