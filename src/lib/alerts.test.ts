import { describe, it, expect } from "vitest";
import { buildMatchAlerts } from "./alerts";
import type { PostWithUser, User } from "@/db/schema";

function user(id: string): User {
  return {
    id,
    name: `User ${id}`,
    emoji: "🌻",
    email: `${id}@example.com`,
    createdAt: new Date(),
  };
}

let n = 0;
function post(
  owner: User,
  kind: "give" | "need",
  title: string,
  overrides: Partial<PostWithUser> = {},
): PostWithUser {
  return {
    id: `p${++n}`,
    userId: owner.id,
    kind,
    title,
    description: "",
    category: "tools",
    tags: [],
    status: "open",
    createdAt: new Date(),
    user: owner,
    ...overrides,
  };
}

describe("buildMatchAlerts", () => {
  const alice = user("alice");
  const bob = user("bob");
  const cara = user("cara");

  it("groups alerts by matched-post owner, one entry per owner", () => {
    const newPosts = [
      post(alice, "give", "drill to lend", { tags: ["drill"] }),
      post(alice, "give", "ladder to lend", { tags: ["ladder"], category: "home-repair" }),
    ];
    const pool = [
      post(bob, "need", "borrow a drill", { tags: ["drill"] }),
      post(bob, "need", "borrow a ladder", { tags: ["ladder"], category: "home-repair" }),
      post(cara, "need", "borrow a drill please", { tags: ["drill"] }),
    ];

    const alerts = buildMatchAlerts(newPosts, pool);
    const byEmail = Object.fromEntries(alerts.map((a) => [a.user.email, a]));

    expect(alerts).toHaveLength(2);
    expect(byEmail["bob@example.com"].pairs).toHaveLength(2);
    expect(byEmail["cara@example.com"].pairs).toHaveLength(1);
    const caraPair = byEmail["cara@example.com"].pairs[0];
    expect(caraPair.yours.title).toBe("borrow a drill please");
    expect(caraPair.theirs.title).toBe("drill to lend");
  });

  it("never alerts the poster about their own posts", () => {
    const newPosts = [post(alice, "give", "drill to lend", { tags: ["drill"] })];
    const pool = [
      post(alice, "need", "borrow a drill", { tags: ["drill"] }),
      ...newPosts,
    ];
    expect(buildMatchAlerts(newPosts, pool)).toHaveLength(0);
  });

  it("returns nothing when nothing clears the match threshold", () => {
    const newPosts = [post(alice, "give", "drill to lend", { category: "tools" })];
    const pool = [post(bob, "need", "piano teacher", { category: "lessons" })];
    expect(buildMatchAlerts(newPosts, pool)).toHaveLength(0);
  });
});
