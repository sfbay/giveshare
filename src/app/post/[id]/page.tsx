import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/session";
import { getPost, getOpenPosts } from "@/lib/queries";
import { findMatches } from "@/lib/match";
import { PostCard } from "@/components/PostCard";
import { ConnectButton } from "@/components/ConnectButton";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, user, pool] = await Promise.all([
    getPost(id).catch(() => null),
    currentUser(),
    getOpenPosts(),
  ]);
  if (!post) notFound();

  const matches = findMatches(
    post,
    pool.filter((p) => p.userId !== post.userId),
  ).slice(0, 6);

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="max-w-md">
        <PostCard post={post} />
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold mb-3">
          {matches.length > 0
            ? `${matches.length} matching ${post.kind === "give" ? "needs" : "gives"} nearby`
            : "No matches on the board yet"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {matches.map(({ post: match, score }, i) => (
            <PostCard
              key={match.id}
              post={match}
              tilt={i % 2 ? "r" : "l"}
              footer={
                <span className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-sun font-bold">★ {score}</span>
                  {user && user.id === post.userId && (
                    <ConnectButton
                      fromPostId={post.id}
                      toPostId={match.id}
                      email={match.user.email}
                      subject={`GiveShare: ${user.name} about "${match.title}"`}
                      body={`Hi ${match.user.name}!\n\nI saw your ${match.kind} "${match.title}" on the GiveShare board — it matches my ${post.kind} "${post.title}".\n\nWant to swap?\n\n— ${user.name} ${user.emoji}`}
                    />
                  )}
                </span>
              }
            />
          ))}
        </div>
      </section>

      <Link href="/" className="text-sm text-ink-soft underline">
        ← Back to the board
      </Link>
    </div>
  );
}
