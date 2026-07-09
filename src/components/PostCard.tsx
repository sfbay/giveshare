import Link from "next/link";
import type { PostWithUser } from "@/db/schema";
import { CATEGORY_META } from "@/lib/categories";

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PostCard({
  post,
  tilt,
  footer,
}: {
  post: PostWithUser;
  tilt?: "l" | "r";
  footer?: React.ReactNode;
}) {
  const isGive = post.kind === "give";
  const cat = CATEGORY_META[post.category];
  return (
    <article
      className={`card-pin rounded-sm p-4 flex flex-col gap-2 ${
        tilt === "l" ? "tilt-l" : tilt === "r" ? "tilt-r" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`stamp ${isGive ? "text-give" : "text-need"}`}>
          {isGive ? "Give" : "Need"}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${
            isGive
              ? "bg-give-soft border-give/40"
              : "bg-need-soft border-need/40"
          }`}
        >
          {cat.emoji} {cat.label}
        </span>
        <span className="ml-auto text-xs text-ink-soft">
          {timeAgo(post.createdAt)}
        </span>
      </div>

      <Link href={`/post/${post.id}`}>
        <h3 className="font-display text-lg font-semibold leading-snug hover:squiggle">
          {post.title}
        </h3>
      </Link>

      {post.description && (
        <p className="text-sm text-ink-soft leading-relaxed line-clamp-3">
          {post.description}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-ink-soft border border-line rounded-sm px-1.5 py-0.5 bg-cream"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-2 border-t border-dashed border-line flex items-center gap-2 text-sm">
        <span aria-hidden>{post.user.emoji}</span>
        <span className="font-bold">{post.user.name}</span>
        {footer}
      </div>
    </article>
  );
}
