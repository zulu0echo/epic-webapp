import { describe, it, expect, vi } from "vitest";
import { matchExpertsToDomainOrOpportunity } from "../matching";

const mockPrisma = {
  expert: {
    findMany: vi.fn(),
  },
  domain: {
    findFirst: vi.fn(),
  },
  opportunity: {
    findMany: vi.fn(),
  },
} as any;

describe("matchExpertsToDomainOrOpportunity", () => {
  it("returns empty matches when no experts", async () => {
    mockPrisma.expert.findMany.mockResolvedValue([]);
    mockPrisma.domain.findFirst.mockResolvedValue({ id: "d1", tags: "[]" });
    const result = await matchExpertsToDomainOrOpportunity(mockPrisma, { domainId: "d1" });
    expect(result.matches).toHaveLength(0);
  });

  it("scores expert with domain overlap", async () => {
    mockPrisma.expert.findMany.mockResolvedValue([
      {
        id: "e1",
        name: "Alice",
        domainTags: [{ domainId: "d1", domain: { tags: '["identity"]' } }],
        skillsTags: '["VC","identity"]',
        region: "",
        languages: "[]",
      },
    ]);
    mockPrisma.domain.findFirst.mockResolvedValue({
      id: "d1",
      tags: '["identity","credentials"]',
    });
    const result = await matchExpertsToDomainOrOpportunity(mockPrisma, { domainId: "d1" });
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].name).toBe("Alice");
    expect(result.matches[0].score).toBeGreaterThan(0);
    expect(result.matches[0].reasons.length).toBeGreaterThan(0);
  });
});
