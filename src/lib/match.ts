export type Matchable = {
  id: string;
  kind: "give" | "need";
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: "open" | "fulfilled";
};

export const CATEGORY_POINTS = 10;
export const TAG_POINTS = 3;
export const KEYWORD_POINTS = 1;
export const MATCH_THRESHOLD = 3;

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "for", "nor", "so", "yet",
  "to", "of", "in", "on", "at", "by", "with", "from", "up", "out",
  "i", "im", "my", "me", "you", "your", "we", "our", "us", "it", "its",
  "is", "are", "was", "be", "been", "have", "has", "had", "do", "does",
  "will", "would", "can", "could", "need", "needs", "want", "looking",
  "some", "any", "this", "that", "someone", "anyone", "please",
]);

function keywords(post: Matchable): Set<string> {
  const words = `${post.title} ${post.description}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
}

export function scoreMatch(a: Matchable, b: Matchable): number {
  let score = 0;
  if (a.category === b.category) score += CATEGORY_POINTS;

  const bTags = new Set(b.tags.map((t) => t.toLowerCase()));
  for (const tag of new Set(a.tags.map((t) => t.toLowerCase()))) {
    if (bTags.has(tag)) score += TAG_POINTS;
  }

  const bWords = keywords(b);
  for (const word of keywords(a)) {
    if (bWords.has(word)) score += KEYWORD_POINTS;
  }
  return score;
}

export type Match<T extends Matchable> = { post: T; score: number };

export function findMatches<T extends Matchable>(
  post: Matchable,
  pool: T[],
): Match<T>[] {
  return pool
    .filter(
      (p) => p.id !== post.id && p.kind !== post.kind && p.status === "open",
    )
    .map((p) => ({ post: p, score: scoreMatch(post, p) }))
    .filter((m) => m.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}
