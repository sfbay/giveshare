import Link from "next/link";
import { getOpenPosts, getStats } from "@/lib/queries";
import { currentUser } from "@/lib/session";
import { signOut } from "@/lib/actions";
import { findMatches } from "@/lib/match";
import { CATEGORY_META } from "@/lib/categories";
import type { PostWithUser } from "@/db/schema";
import {
  GardenScene,
  DriftingPetals,
  FloatingBlooms,
} from "@/components/garden/GardenScene";
import { StatBlobs } from "@/components/garden/StatBlobs";
import {
  MatchSpotlight,
  type SpotlightMatch,
} from "@/components/garden/MatchSpotlight";
import {
  NeighborsRail,
  type NeighborCard,
} from "@/components/garden/NeighborsRail";
import { BoardBloom, type BoardPost } from "@/components/garden/BoardBloom";

export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const SPOTLIGHT_NOTES = [
  "The board noticed before either of them did.",
  "Two porches, one block, zero money changing hands.",
  "Posted separately, matched quietly, settled over email.",
  "A true two-way swap, stitched by the block.",
];

function buildSpotlight(posts: PostWithUser[]): {
  spotlight: SpotlightMatch[];
  pairCount: number;
} {
  const gives = posts.filter((p) => p.kind === "give");
  const pairs: { give: PostWithUser; need: PostWithUser; score: number }[] = [];
  for (const give of gives) {
    for (const m of findMatches(give, posts.filter((p) => p.userId !== give.userId))) {
      pairs.push({ give, need: m.post, score: m.score });
    }
  }
  pairs.sort((a, b) => b.score - a.score);

  // Top pairs with distinct posts, so the spotlight rotates through variety.
  const used = new Set<string>();
  const top = pairs.filter(({ give, need }) => {
    if (used.has(give.id) || used.has(need.id)) return false;
    used.add(give.id);
    used.add(need.id);
    return true;
  });

  const spotlight = top.slice(0, 4).map(({ give, need, score }, i) => {
    const gc = CATEGORY_META[give.category];
    const nc = CATEGORY_META[need.category];
    const cat =
      give.category === need.category
        ? `${gc.emoji} ${gc.label}`
        : `${gc.emoji} ${gc.label} ↔ ${nc.emoji} ${nc.label}`;
    return {
      cat,
      score,
      note: SPOTLIGHT_NOTES[i % SPOTLIGHT_NOTES.length],
      giver: { emoji: give.user.emoji, name: give.user.name, offer: give.title },
      needer: { emoji: need.user.emoji, name: need.user.name, ask: need.title },
    };
  });

  return { spotlight, pairCount: pairs.length };
}

function buildNeighbors(posts: PostWithUser[]): NeighborCard[] {
  const byUser = new Map<string, { emoji: string; name: string; give?: string; need?: string }>();
  for (const p of posts) {
    let n = byUser.get(p.userId);
    if (!n) {
      n = { emoji: p.user.emoji, name: p.user.name };
      byUser.set(p.userId, n);
    }
    if (p.kind === "give" && !n.give) n.give = p.title;
    if (p.kind === "need" && !n.need) n.need = p.title;
  }
  return [...byUser.values()].map((n) => ({
    emoji: n.emoji,
    name: n.name,
    gives: n.give ?? "Ask them — they're new!",
    needs: n.need ?? "Nothing yet — lucky them",
  }));
}

export default async function FrontPage() {
  const [user, stats, posts] = await Promise.all([
    currentUser(),
    getStats(),
    getOpenPosts(),
  ]);

  const { spotlight, pairCount } = buildSpotlight(posts);
  const neighbors = buildNeighbors(posts);

  const boardPosts: BoardPost[] = posts
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((p) => ({
      id: p.id,
      kind: p.kind,
      title: p.title,
      description: p.description,
      category: p.category,
      tags: p.tags,
      name: p.user.name,
      emoji: p.user.emoji,
      email: p.user.email,
      timeAgo: timeAgo(p.createdAt),
      score:
        p.kind === "give"
          ? (findMatches(p, posts.filter((o) => o.userId !== p.userId))[0]?.score ?? 0)
          : 0,
    }));

  return (
    <div className="relative">
      <FloatingBlooms />
      <DriftingPetals />

      {/* ============ HERO ============ */}
      <section className="gs-hero relative max-w-[1180px] mx-auto px-[22px] pt-[46px] pb-[34px] min-h-[660px] flex flex-wrap items-center">
        <GardenScene />

        <div className="gs-herotext relative z-[5] max-w-[570px]">
          <div
            className="inline-flex items-center gap-[9px] text-[12.5px] text-ink-soft rounded-full px-[18px] py-[7px] mb-6 bg-paper/80"
            style={{ boxShadow: "0 10px 26px -14px rgba(43,36,24,.35)" }}
          >
            <span
              className="w-2 h-2 rounded-full bg-give"
              style={{ boxShadow: "0 0 0 4px rgba(61,107,70,.16)" }}
            />
            one demo neighborhood · in full bloom
          </div>
          <h1
            className="font-display font-extralight m-0 max-w-[12ch] text-[clamp(50px,6.7vw,88px)] leading-[0.94] tracking-[-0.035em]"
            style={{ textWrap: "balance" }}
          >
            Give what you can. Get what you{" "}
            <span className="hl hl-hero italic font-normal">need</span>.
          </h1>
          <p
            className="text-[clamp(16px,1.7vw,19px)] leading-[1.62] text-ink-soft max-w-[42ch] mt-[22px] mb-0"
            style={{ textWrap: "pretty" }}
          >
            A whole neighborhood, blooming together. Post a skill, a tool, an
            afternoon, or the extra zucchini — we quietly match you with a
            neighbor, and email does the rest.
          </p>

          <StatBlobs
            targets={{
              neighbors: stats.neighbors,
              gives: stats.gives,
              needs: stats.needs,
              matches: pairCount,
            }}
          />

          <div className="flex flex-wrap gap-3 mt-8">
            {user ? (
              <Link href="/matches" className="btn-grad text-base px-[26px] py-3.5">
                🌻 See my matches →
              </Link>
            ) : (
              <Link href="/join" className="btn-grad text-base px-[26px] py-3.5">
                🌻 Join the neighborhood →
              </Link>
            )}
            <a href="#board" className="btn-paper text-base px-[26px] py-3.5">
              Browse the board
            </a>
          </div>
          {user && (
            <form action={signOut} className="mt-4 text-sm text-ink-soft">
              {user.emoji} Signed in as <strong>{user.name}</strong> ·{" "}
              <button className="underline hover:text-ink cursor-pointer">
                sign out
              </button>
            </form>
          )}
        </div>
      </section>

      <MatchSpotlight matches={spotlight} />
      <NeighborsRail neighbors={neighbors} />
      <BoardBloom posts={boardPosts} />
    </div>
  );
}
