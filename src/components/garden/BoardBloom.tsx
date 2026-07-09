"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, type Category } from "@/db/schema";
import { CATEGORY_META } from "@/lib/categories";

export type BoardPost = {
  id: string;
  kind: "give" | "need";
  title: string;
  description: string;
  category: Category;
  tags: string[];
  name: string;
  emoji: string;
  email: string;
  timeAgo: string;
  score: number;
};

type Kind = "all" | "give" | "need";
type Cat = "all" | Category;

function FilterPill({
  label,
  active,
  tone,
  onClick,
  bold,
}: {
  label: string;
  active: boolean;
  tone: "green" | "sun";
  onClick: () => void;
  bold?: boolean;
}) {
  const activeStyle =
    tone === "green"
      ? {
          background: "linear-gradient(150deg, #d6e8d6, #c6e0c8)",
          color: "#2b5233",
          boxShadow: "0 12px 24px -12px rgba(61,107,70,.55)",
        }
      : {
          background: "linear-gradient(150deg, #fbe6bf, #f6d79a)",
          color: "#7a5320",
          boxShadow: "0 12px 24px -12px rgba(232,163,61,.6)",
        };
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-full border-none ${
        bold ? "text-[13.5px] font-bold px-[18px] py-2" : "text-[13px] font-medium px-[15px] py-[7px]"
      }`}
      style={
        active
          ? activeStyle
          : {
              background: "rgba(255,253,246,.7)",
              color: "#6b5f4b",
              boxShadow: "0 8px 18px -12px rgba(43,36,24,.3)",
            }
      }
    >
      {label}
    </button>
  );
}

export function BoardBloom({ posts }: { posts: BoardPost[] }) {
  const [kind, setKind] = useState<Kind>("all");
  const [cat, setCat] = useState<Cat>("all");

  const filtered = posts.filter(
    (p) => (kind === "all" || p.kind === kind) && (cat === "all" || p.category === cat),
  );

  return (
    <section id="board" className="relative z-[5] max-w-[1040px] mx-auto mt-12 px-5 pb-[90px]">
      <div className="flex items-baseline gap-3 flex-wrap mb-5">
        <h2 className="font-display font-light m-0 tracking-[-0.01em] whitespace-nowrap shrink-0 text-[clamp(30px,4.4vw,42px)]">
          Our <span className="hl">Board</span>
        </h2>
        <span className="text-sm text-ink-soft">
          {filtered.length} showing · a quilt of gives and needs, stitched by the block
        </span>
      </div>

      <div className="flex flex-wrap gap-[9px] mb-[11px]">
        {(
          [
            ["all", "Everything"],
            ["give", "✋ Gives"],
            ["need", "🙏 Needs"],
          ] as const
        ).map(([key, label]) => (
          <FilterPill
            key={key}
            label={label}
            active={kind === key}
            tone="green"
            bold
            onClick={() => setKind(key)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-[9px] mb-7">
        <FilterPill
          label="All categories"
          active={cat === "all"}
          tone="sun"
          onClick={() => setCat("all")}
        />
        {CATEGORIES.map((c) => (
          <FilterPill
            key={c}
            label={`${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label}`}
            active={cat === c}
            tone="sun"
            onClick={() => setCat(cat === c ? "all" : c)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-ink-soft px-4 py-[70px]">
          <div className="text-[44px] mb-3">🌱</div>
          <p className="text-base m-0">
            Nothing blooming here yet — try another filter, or be the first to post.
          </p>
        </div>
      ) : (
        <div className="gap-5 columns-1 sm:columns-2 lg:columns-3">
          {filtered.map((p, i) => {
            const isGive = p.kind === "give";
            const c = CATEGORY_META[p.category];
            const tex = ["tex-paper", "tex-felt", "tex-linen"][i % 3];
            const mailto = `mailto:${p.email}?subject=${encodeURIComponent(
              `GiveShare: about your ${p.kind} "${p.title}"`,
            )}&body=${encodeURIComponent(
              `Hi ${p.name}!\n\nI saw your ${p.kind} "${p.title}" on the GiveShare board.\n\nWant to swap?`,
            )}`;
            return (
              <article
                key={p.id}
                className={`bloom-card ${i % 2 === 0 ? "tilt-l" : "tilt-r"} mb-5 p-5 flex flex-col gap-[9px]`}
                style={{
                  breakInside: "avoid",
                  borderRadius: "30px 26px 30px 28px",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    top: -50, right: -50, width: 150, height: 150,
                    background: isGive
                      ? "radial-gradient(circle at 50% 50%, rgba(61,107,70,.16), rgba(61,107,70,0) 70%)"
                      : "radial-gradient(circle at 50% 50%, rgba(193,74,36,.15), rgba(193,74,36,0) 70%)",
                  }}
                />
                <span aria-hidden="true" className={`tex-overlay ${tex}`} />

                <div className="flex items-center gap-2 relative">
                  <span className={`stamp ${isGive ? "text-give" : "text-need"}`}>
                    {isGive ? "✋ give" : "🙏 need"}
                  </span>
                  <span
                    className="text-xs px-[11px] py-[3px] rounded-full whitespace-nowrap"
                    style={
                      isGive
                        ? { background: "rgba(228,239,226,.8)", color: "#2b5233" }
                        : { background: "rgba(251,232,221,.85)", color: "#a03d1d" }
                    }
                  >
                    {c.emoji} {c.label}
                  </span>
                  <span className="ml-auto text-xs text-ink-soft">{p.timeAgo}</span>
                </div>

                <Link href={`/post/${p.id}`} className="relative">
                  <h3 className="font-display font-bold text-[18.5px] leading-[1.3] m-0 hover:text-give">
                    {p.title}
                  </h3>
                </Link>
                {p.description && (
                  <p className="m-0 text-sm leading-relaxed text-ink-soft relative">
                    {p.description}
                  </p>
                )}

                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 relative">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] text-ink-soft rounded-full px-2.5 py-0.5"
                        style={{ background: "rgba(249,231,200,.5)" }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-3 flex items-center gap-[9px] text-sm relative">
                  <span
                    className="text-lg w-[34px] h-[34px] flex items-center justify-center rounded-full"
                    style={{ background: "radial-gradient(circle at 40% 35%, #fffdf6, #f2ead9)" }}
                  >
                    {p.emoji}
                  </span>
                  <span className="font-bold">{p.name}</span>
                  <span className="ml-auto flex items-center gap-2.5">
                    {isGive && p.score > 0 && (
                      <span className="text-sun-deep font-bold text-xs">★ {p.score}</span>
                    )}
                    <a href={mailto} className="btn-grad text-[12.5px] px-3.5 py-1.5">
                      ✉️ Connect
                    </a>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
