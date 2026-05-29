// File-based content types. Each entity is stored as a JSON file; slug = filename without .json.

export type DomainEdgeSpec = { toSlug: string; edgeType: "depends_on" | "enables" | "adjacent_to" };
export type RelatedLink = { label: string; url: string };
export type ExperimentSpec = { title: string; year?: number; blockchainUsed?: string; description?: string; url?: string };

/** 2–3 experiments, PoCs, or articles (GitHub, reports, academic) per domain. */
export type DomainReference = { label: string; url: string };

/** 2–3 subject-matter experts with LinkedIn profile URL. */
export type FeaturedExpert = { name: string; linkedInUrl: string; affiliation?: string };

export interface DomainContent {
  slug: string;
  name: string;
  parentSlug?: string | null;
  definition?: string;
  summary?: string;
  challenges?: string;
  opportunities?: string;
  ethereumPrimitives?: string[] | string;
  valueProposition?: string;
  relatedLinks?: RelatedLink[] | string;
  maturityLevel?: string;
  tags?: string[] | string;
  edges?: DomainEdgeSpec[];
  experiments?: ExperimentSpec[];
  /** References: experiments, PoCs, GitHub, reputable articles or academic writing. */
  references?: DomainReference[];
  /** Featured experts: 2–3 LinkedIn profiles of subject-matter experts. */
  featuredExperts?: FeaturedExpert[];
  /** Who holds sovereignty in this domain and what they must be able to do independently. */
  selfSovereignUser?: string;
}

export interface ExpertContent {
  slug: string;
  name: string;
  affiliation?: string;
  skillsTags?: string[] | string;
  expertiseDomains?: string[] | string;
  region?: string;
  languages?: string[] | string;
  availability?: string;
  contactPath?: string;
  referencesLinks?: RelatedLink[] | string;
  ethereumAlignmentNotes?: string;
  domainSlugs?: string[];
}

export interface OpportunityContent {
  slug: string;
  title: string;
  description?: string;
  stage?: string;
  priority?: string;
  fitScore?: number | null;
  budgetBand?: string;
  nextStep?: string;
  dueDate?: string | null;
  pocFlagshipFlag?: boolean;
  links?: string[] | string;
  institutionSlugs?: string[];
  domainSlugs?: string[];
}

export interface InstitutionContent {
  slug: string;
  name: string;
  type: string;
  country?: string;
  region?: string;
  description?: string;
  status?: string;
  tags?: string[] | string;
}

export interface ContactContent {
  name: string;
  role?: string;
  email?: string;
  championFlag?: boolean;
  championNotes?: string;
}
