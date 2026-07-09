import { describe, it, expect } from "vitest";
import { scoreMatch, findMatches, type Matchable } from "./match";

const base = {
  description: "",
  tags: [] as string[],
  status: "open" as const,
};

function give(overrides: Partial<Matchable>): Matchable {
  return { id: "g1", kind: "give", title: "", category: "other", ...base, ...overrides };
}
function need(overrides: Partial<Matchable>): Matchable {
  return { id: "n1", kind: "need", title: "", category: "other", ...base, ...overrides };
}

describe("scoreMatch", () => {
  it("gives +10 for a shared category", () => {
    const a = need({ category: "tools", title: "xyz" });
    const b = give({ category: "tools", title: "abc" });
    expect(scoreMatch(a, b)).toBe(10);
  });

  it("gives +3 per shared tag", () => {
    const a = need({ category: "tools", tags: ["drill", "ladder"] });
    const b = give({ category: "garden-food", tags: ["ladder", "drill", "saw"] });
    expect(scoreMatch(a, b)).toBe(6);
  });

  it("gives +1 per shared keyword across title and description", () => {
    const a = need({ category: "lessons", title: "guitar lessons for beginners" });
    const b = give({ category: "other", title: "I teach guitar", description: "beginners welcome" });
    // shared keywords: guitar, beginners
    expect(scoreMatch(a, b)).toBe(2);
  });

  it("ignores stopwords and case", () => {
    const a = need({ category: "rides", title: "The and for with help" });
    const b = give({ title: "THE AND FOR WITH help" });
    expect(scoreMatch(a, b)).toBe(1); // only "help" counts
  });

  it("counts each shared keyword once, not per occurrence", () => {
    const a = need({ category: "rides", title: "bike bike bike" });
    const b = give({ title: "bike repair bike" });
    expect(scoreMatch(a, b)).toBe(1);
  });

  it("stacks category, tags, and keywords", () => {
    const a = need({ category: "tools", tags: ["drill"], title: "borrow a power drill" });
    const b = give({ category: "tools", tags: ["drill"], title: "power tools to lend, drill included" });
    // 10 (category) + 3 (tag: drill) + keywords: drill, power = 2 → 15
    expect(scoreMatch(a, b)).toBe(15);
  });
});

describe("findMatches", () => {
  const mine = need({ id: "mine", category: "tools", title: "need a drill", tags: ["drill"] });
  const pool: Matchable[] = [
    give({ id: "great", category: "tools", tags: ["drill"], title: "lending my drill" }),
    give({ id: "ok", category: "tools", title: "hammer to share" }),
    give({ id: "weak", category: "lessons", title: "piano lessons" }),
    give({ id: "closed", category: "tools", tags: ["drill"], status: "fulfilled" }),
    need({ id: "same-kind", category: "tools", tags: ["drill"] }),
    { ...mine },
  ];

  it("returns only opposite-kind, open posts above threshold, sorted by score", () => {
    const results = findMatches(mine, pool);
    expect(results.map((r) => r.post.id)).toEqual(["great", "ok"]);
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it("excludes the post itself and low scorers", () => {
    const ids = findMatches(mine, pool).map((r) => r.post.id);
    expect(ids).not.toContain("mine");
    expect(ids).not.toContain("weak");
    expect(ids).not.toContain("closed");
    expect(ids).not.toContain("same-kind");
  });
});
