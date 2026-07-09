import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const CATEGORIES = [
  "tools",
  "garden-food",
  "childcare",
  "pet-care",
  "tech-help",
  "rides",
  "lessons",
  "home-repair",
  "arts-crafts",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const kindEnum = pgEnum("post_kind", ["give", "need"]);
export const statusEnum = pgEnum("post_status", ["open", "fulfilled"]);
export const categoryEnum = pgEnum("post_category", CATEGORIES);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull().default("🙂"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: kindEnum("kind").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: categoryEnum("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  status: statusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const connections = pgTable("connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromPostId: uuid("from_post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  toPostId: uuid("to_post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type PostWithUser = Post & { user: User };
