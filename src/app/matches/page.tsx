import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { getMyPosts, getOpenPosts } from "@/lib/queries";
import { findMatches } from "@/lib/match";
import { PostCard } from "@/components/PostCard";
import { ConnectButton } from "@/components/ConnectButton";

export const dynamic = "force-dynamic";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/join");
  const { welcome } = await searchParams;

  const [mine, pool] = await Promise.all([
    getMyPosts(user.id),
    getOpenPosts(),
  ]);
  const others = pool.filter((p) => p.userId !== user.id);

  const sections = mine.map((post) => ({
    post,
    matches: findMatches(post, others).slice(0, 5),
  }));
  const total = sections.reduce((n, s) => n + s.matches.length, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 flex flex-col gap-8">
      <div>
        {welcome && (
          <p className="mb-4 inline-block card-pin tilt-r rounded-sm px-4 py-2 text-sm bg-give-soft">
            🎉 Welcome to the neighborhood, {user.name}! We&apos;ll keep your
            matches fresh — check back or watch your email.
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold">
          Your <span className="squiggle">matches</span>
        </h1>
        <p className="text-ink-soft text-sm mt-1">
          {total > 0
            ? `${total} neighbor ${total === 1 ? "match" : "matches"} for your ${mine.length} open ${mine.length === 1 ? "post" : "posts"}. Tap Connect to say hi by email.`
            : "No matches yet — the board refills all the time."}
        </p>
      </div>

      {mine.length === 0 && (
        <p className="text-ink-soft">
          You haven&apos;t pinned anything yet.{" "}
          <Link href="/new" className="underline">
            Post a give or need
          </Link>{" "}
          to start matching.
        </p>
      )}

      {sections.map(({ post, matches }) => (
        <section key={post.id} className="flex flex-col gap-3">
          <h2 className="text-sm text-ink-soft">
            For your{" "}
            <span className={post.kind === "give" ? "text-give" : "text-need"}>
              {post.kind}
            </span>{" "}
            <Link href={`/post/${post.id}`} className="font-bold text-ink underline decoration-line">
              {post.title}
            </Link>
            :
          </h2>
          {matches.length === 0 ? (
            <p className="text-sm text-ink-soft italic">
              Nothing yet — try adding tags to widen the net.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map(({ post: match, score }, i) => (
                <PostCard
                  key={match.id}
                  post={match}
                  tilt={i % 2 ? "l" : "r"}
                  footer={
                    <span className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-sun font-bold" title="match score">
                        ★ {score}
                      </span>
                      <ConnectButton
                        fromPostId={post.id}
                        toPostId={match.id}
                        email={match.user.email}
                        subject={`GiveShare: ${user.name} about "${match.title}"`}
                        body={`Hi ${match.user.name}!\n\nI saw your ${match.kind} "${match.title}" on the GiveShare board — it matches my ${post.kind} "${post.title}".\n\nWant to swap?\n\n— ${user.name} ${user.emoji}`}
                      />
                    </span>
                  }
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
