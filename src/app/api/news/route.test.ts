import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the Prisma client before importing the route, so this test never
// needs a real database — that's the point of an integration test for a
// route handler: exercise the real GET() function, fake the one external
// dependency it has.
const findMany = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: { newsItem: { findMany: (...args: unknown[]) => findMany(...args) } },
}));

describe("GET /api/news", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("returns items from the database when the query succeeds", async () => {
    findMany.mockResolvedValue([{ id: "1", title: "A Story", source: "TechCrunch AI" }]);
    const { GET } = await import("./route");

    const res = await GET();
    const body = await res.json();

    expect(body.items).toHaveLength(1);
    expect(body.items[0].title).toBe("A Story");
  });

  it("falls back to an empty list instead of a 500 when the DB isn't configured", async () => {
    findMany.mockRejectedValue(new Error("DATABASE_URL not set"));
    vi.resetModules();
    vi.doMock("@/lib/prisma", () => ({
      prisma: { newsItem: { findMany } },
    }));
    const { GET } = await import("./route");

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items).toEqual([]);
  });
});
