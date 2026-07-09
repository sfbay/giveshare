import Link from "next/link";
import { CATEGORIES, type Category } from "@/db/schema";
import { CATEGORY_META } from "@/lib/categories";
import { getBoardPosts, getStats } from "@/lib/queries";
import { currentUser } from "@/lib/session";
import { signOut } from "@/lib/actions";
import { PostCard } from "@/components/PostCard";

export const dynamic = "force-dynamic";

function filterHref(kind?: string, category?: string) {
  const params = new URLSearchParams();
  if (kind) params.set("kind", kind);
  if (category) params.set("cat", category);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; cat?: string }>;
}) {
  const sp = await searchParams;
  const kind = sp.kind === "give" || sp.kind === "need" ? sp.kind : undefined;
  const category = CATEGORIES.includes(sp.cat as Category)
    ? (sp.cat as Category)
    : undefined;

  const [user, stats, board] = await Promise.all([
    currentUser(),
    getStats(),
    getBoardPosts({ kind, category }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-wrap items-start gap-8">
        <div className="flex-1 min-w-64">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            The neighborhood <span className="squiggle">barter board</span>
          </h1>
          <p className="mt-2 text-ink-soft max-w-prose">
            Post what you can <strong className="text-give">give</strong> and
            what you <strong className="text-need">need</strong> — we&apos;ll
            match you with neighbors, and email does the rest.
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            {stats.neighbors} neighbors · {stats.gives} gives · {stats.needs}{" "}
            needs · {stats.connections} connections made
          </p>
          {user ? (
            <form action={signOut} className="mt-2 text-sm">
              <span>
                {user.emoji} Hi, <strong>{user.name}</strong>!{" "}
              </span>
              <button className="underline text-ink-soft hover:text-ink">
                sign out
              </button>
            </form>
          ) : (
            <Link
              href="/join"
              className="card-pin tilt-l inline-block mt-5 px-5 py-2.5 font-bold rounded-sm"
            >
              🌻 Join the neighborhood →
            </Link>
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-2 mb-5 text-sm">
          {[
            { label: "Everything", href: filterHref(undefined, category), active: !kind },
            { label: "✋ Gives", href: filterHref("give", category), active: kind === "give" },
            { label: "🙏 Needs", href: filterHref("need", category), active: kind === "need" },
          ].map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className={`px-3 py-1 rounded-full border ${
                f.active
                  ? "bg-ink text-paper border-ink"
                  : "border-ink/40 hover:border-ink"
              }`}
            >
              {f.label}
            </Link>
          ))}
          <span className="w-px bg-line mx-1" aria-hidden />
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={filterHref(kind, category === c ? undefined : c)}
              className={`px-3 py-1 rounded-full border ${
                category === c
                  ? "bg-sun/30 border-ink"
                  : "border-line hover:border-ink"
              }`}
            >
              {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
            </Link>
          ))}
        </div>

        {board.length === 0 ? (
          <p className="text-ink-soft py-12 text-center">
            Nothing pinned here yet — be the first!{" "}
            <Link href="/join" className="underline">
              Join and post a give or need
            </Link>
            .
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
            {board.map((post, i) => (
              <PostCard key={post.id} post={post} tilt={i % 2 ? "r" : "l"} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
