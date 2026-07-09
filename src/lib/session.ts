import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, type User } from "@/db/schema";

const COOKIE = "gs_uid";

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const uid = jar.get(COOKIE)?.value;
  if (!uid) return null;
  const rows = await db.select().from(users).where(eq(users.id, uid)).limit(1);
  return rows[0] ?? null;
}

export async function setSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
