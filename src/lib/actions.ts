"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { users, posts, connections, CATEGORIES } from "@/db/schema";
import { currentUser, setSession, clearSession } from "./session";

const wizardPostSchema = z.object({
  title: z.string().trim().min(3).max(80),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
});

const joinSchema = z.object({
  name: z.string().trim().min(1).max(40),
  emoji: z.string().trim().min(1).max(8),
  email: z.string().trim().email().max(120),
  gives: z.array(wizardPostSchema).max(10).default([]),
  needs: z.array(wizardPostSchema).max(10).default([]),
});
export type JoinPayload = z.input<typeof joinSchema>;

export async function joinNeighborhood(
  payload: JoinPayload,
): Promise<{ error: string } | void> {
  const parsed = joinSchema.safeParse(payload);
  if (!parsed.success) return { error: "Check your name and email." };

  const { name, emoji, email, gives, needs } = parsed.data;
  const [user] = await db.insert(users).values({ name, emoji, email }).returning();
  const rows = [
    ...gives.map((g) => ({ ...g, kind: "give" as const, userId: user.id })),
    ...needs.map((n) => ({ ...n, kind: "need" as const, userId: user.id })),
  ];
  if (rows.length > 0) await db.insert(posts).values(rows);

  await setSession(user.id);
  revalidatePath("/");
  redirect("/matches?welcome=1");
}

export async function signOut() {
  await clearSession();
  revalidatePath("/");
  redirect("/");
}

const postSchema = z.object({
  kind: z.enum(["give", "need"]),
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().max(500).default(""),
  category: z.enum(CATEGORIES),
  tags: z
    .string()
    .default("")
    .transform((s) =>
      s
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8),
    ),
});

export async function createPost(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/join");

  const parsed = postSchema.safeParse({
    kind: formData.get("kind"),
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    tags: formData.get("tags"),
  });
  if (!parsed.success) redirect("/new?error=invalid");

  const [post] = await db
    .insert(posts)
    .values({ ...parsed.data, userId: user.id })
    .returning();
  revalidatePath("/");
  redirect(`/post/${post.id}`);
}

export async function logConnection(fromPostId: string, toPostId: string) {
  const user = await currentUser();
  if (!user) return;
  await db.insert(connections).values({ fromPostId, toPostId });
  revalidatePath("/");
}
