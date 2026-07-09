import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  posts,
  users,
  connections,
  type Category,
  type PostWithUser,
} from "@/db/schema";

function withUser(row: { posts: typeof posts.$inferSelect; users: typeof users.$inferSelect }): PostWithUser {
  return { ...row.posts, user: row.users };
}

export async function getBoardPosts(filter: {
  kind?: "give" | "need";
  category?: Category;
}): Promise<PostWithUser[]> {
  const conditions = [eq(posts.status, "open")];
  if (filter.kind) conditions.push(eq(posts.kind, filter.kind));
  if (filter.category) conditions.push(eq(posts.category, filter.category));

  const rows = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(posts.createdAt));
  return rows.map(withUser);
}

export async function getOpenPosts(): Promise<PostWithUser[]> {
  const rows = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.status, "open"));
  return rows.map(withUser);
}

export async function getMyPosts(userId: string): Promise<PostWithUser[]> {
  const rows = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(and(eq(posts.userId, userId), eq(posts.status, "open")))
    .orderBy(desc(posts.createdAt));
  return rows.map(withUser);
}

export async function getPost(id: string): Promise<PostWithUser | null> {
  const rows = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, id))
    .limit(1);
  return rows[0] ? withUser(rows[0]) : null;
}

export async function getStats() {
  const [neighbors] = await db.select({ n: count() }).from(users);
  const [gives] = await db
    .select({ n: count() })
    .from(posts)
    .where(and(eq(posts.kind, "give"), eq(posts.status, "open")));
  const [needs] = await db
    .select({ n: count() })
    .from(posts)
    .where(and(eq(posts.kind, "need"), eq(posts.status, "open")));
  const [connected] = await db.select({ n: count() }).from(connections);
  return {
    neighbors: neighbors.n,
    gives: gives.n,
    needs: needs.n,
    connections: connected.n,
  };
}
