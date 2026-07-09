import type { PostWithUser, User } from "@/db/schema";
import { findMatches } from "./match";

export type AlertPair = {
  /** The recipient's own post that matched */
  yours: PostWithUser;
  /** The newly created post that triggered the alert */
  theirs: PostWithUser;
  score: number;
};

export type MatchAlert = { user: User; pairs: AlertPair[] };

/**
 * For each newly created post, find existing open posts it matches and group
 * the results by the owner of the matched post — one alert per neighbor.
 */
export function buildMatchAlerts(
  newPosts: PostWithUser[],
  pool: PostWithUser[],
): MatchAlert[] {
  const byOwner = new Map<string, MatchAlert>();

  for (const newPost of newPosts) {
    const candidates = pool.filter((p) => p.userId !== newPost.userId);
    for (const { post: matched, score } of findMatches(newPost, candidates)) {
      let alert = byOwner.get(matched.userId);
      if (!alert) {
        alert = { user: matched.user, pairs: [] };
        byOwner.set(matched.userId, alert);
      }
      alert.pairs.push({ yours: matched, theirs: newPost, score });
    }
  }

  return [...byOwner.values()];
}
