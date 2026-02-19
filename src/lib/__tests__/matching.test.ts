import { describe, it, expect } from "vitest";
import { matchExpertsToDomainOrOpportunity } from "../matching";

describe("matchExpertsToDomainOrOpportunity", () => {
  it("returns empty matches when no experts", async () => {
    const result = await matchExpertsToDomainOrOpportunity(
      { domainId: "digital-identity-and-credentials" },
      {
        experts: [],
        domains: [
          {
            slug: "digital-identity-and-credentials",
            name: "Digital Identity & Credentials",
            tags: ["identity", "credentials"],
          } as any,
        ],
        opportunities: [],
      }
    );
    expect(result.matches).toHaveLength(0);
  });

  it("scores expert with domain overlap", async () => {
    const result = await matchExpertsToDomainOrOpportunity(
      { domainId: "digital-identity-and-credentials" },
      {
        experts: [
          {
            slug: "alice",
            name: "Alice",
            domainSlugs: ["digital-identity-and-credentials"],
            skillsTags: ["VC", "identity"],
            region: "",
            languages: [],
          } as any,
        ],
        domains: [
          {
            slug: "digital-identity-and-credentials",
            name: "Digital Identity & Credentials",
            tags: ["identity", "credentials"],
          } as any,
        ],
        opportunities: [],
      }
    );
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].name).toBe("Alice");
    expect(result.matches[0].score).toBeGreaterThan(0);
    expect(result.matches[0].reasons.length).toBeGreaterThan(0);
  });

  it("handles undefined experts/domains/opportunities", async () => {
    const result = await matchExpertsToDomainOrOpportunity(
      { domainId: "some-slug" },
      { experts: [], domains: [], opportunities: [] }
    );
    expect(result.matches).toHaveLength(0);
  });
});
