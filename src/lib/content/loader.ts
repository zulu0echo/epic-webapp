import { readdir, readFile } from "fs/promises";
import path from "path";
import type { DomainContent, ExpertContent, OpportunityContent, InstitutionContent } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function safeJsonParse<T>(buf: Buffer, fallback: T): T {
  try {
    return JSON.parse(buf.toString("utf-8")) as T;
  } catch {
    return fallback;
  }
}

export async function getDomainSlugs(): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, "domains");
  try {
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export async function getDomains(): Promise<DomainContent[]> {
  const slugs = await getDomainSlugs();
  const out: DomainContent[] = [];
  for (const slug of slugs) {
    const file = path.join(CONTENT_DIR, "domains", `${slug}.json`);
    try {
      const buf = await readFile(file);
      const data = safeJsonParse<DomainContent>(buf, { slug, name: slug });
      out.push({ ...data, slug });
    } catch {
      // skip missing/corrupt
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getDomainBySlug(slug: string): Promise<DomainContent | null> {
  const file = path.join(CONTENT_DIR, "domains", `${slug}.json`);
  try {
    const buf = await readFile(file);
    const data = safeJsonParse<DomainContent>(buf, { slug, name: slug });
    return { ...data, slug };
  } catch {
    return null;
  }
}

export async function getExpertSlugs(): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, "experts");
  try {
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export async function getExperts(): Promise<ExpertContent[]> {
  const slugs = await getExpertSlugs();
  const out: ExpertContent[] = [];
  for (const slug of slugs) {
    const file = path.join(CONTENT_DIR, "experts", `${slug}.json`);
    try {
      const buf = await readFile(file);
      const data = safeJsonParse<ExpertContent>(buf, { slug, name: slug });
      out.push({ ...data, slug });
    } catch {
      // skip
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getExpertBySlug(slug: string): Promise<ExpertContent | null> {
  const file = path.join(CONTENT_DIR, "experts", `${slug}.json`);
  try {
    const buf = await readFile(file);
    const data = safeJsonParse<ExpertContent>(buf, { slug, name: slug });
    return { ...data, slug };
  } catch {
    return null;
  }
}

export async function getOpportunitySlugs(): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, "opportunities");
  try {
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export async function getOpportunities(): Promise<OpportunityContent[]> {
  const slugs = await getOpportunitySlugs();
  const out: OpportunityContent[] = [];
  for (const slug of slugs) {
    const file = path.join(CONTENT_DIR, "opportunities", `${slug}.json`);
    try {
      const buf = await readFile(file);
      const data = safeJsonParse<OpportunityContent>(buf, { slug, title: slug });
      out.push({ ...data, slug });
    } catch {
      // skip
    }
  }
  return out.sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""));
}

export async function getOpportunityBySlug(slug: string): Promise<OpportunityContent | null> {
  const file = path.join(CONTENT_DIR, "opportunities", `${slug}.json`);
  try {
    const buf = await readFile(file);
    const data = safeJsonParse<OpportunityContent>(buf, { slug, title: slug });
    return { ...data, slug };
  } catch {
    return null;
  }
}

export async function getInstitutionSlugs(): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, "institutions");
  try {
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export async function getInstitutions(): Promise<InstitutionContent[]> {
  const slugs = await getInstitutionSlugs();
  const out: InstitutionContent[] = [];
  for (const slug of slugs) {
    const file = path.join(CONTENT_DIR, "institutions", `${slug}.json`);
    try {
      const buf = await readFile(file);
      const data = safeJsonParse<InstitutionContent>(buf, { slug, name: slug, type: "other" });
      out.push({ ...data, slug });
    } catch {
      // skip
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getInstitutionBySlug(slug: string): Promise<InstitutionContent | null> {
  const file = path.join(CONTENT_DIR, "institutions", `${slug}.json`);
  try {
    const buf = await readFile(file);
    const data = safeJsonParse<InstitutionContent>(buf, { slug, name: slug, type: "other" });
    return { ...data, slug };
  } catch {
    return null;
  }
}
