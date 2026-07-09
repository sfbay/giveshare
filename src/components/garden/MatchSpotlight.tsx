"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type SpotlightMatch = {
  cat: string;
  score: number;
  note: string;
  giver: { emoji: string; name: string; offer: string };
  needer: { emoji: string; name: string; ask: string };
};

export function MatchSpotlight({
  matches,
  autoplay = true,
}: {
  matches: SpotlightMatch[];
  autoplay?: boolean;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!autoplay || matches.length < 2) return;
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % matches.length),
      4600,
    );
    return () => clearInterval(timer);
  }, [autoplay, matches.length]);

  if (matches.length === 0) return null;
  const current = matches[idx % matches.length];

  return (
    <section id="matches" className="relative z-[5] max-w-[1000px] mx-auto mt-[30px] px-5">
      <div className="cloth-panel relative overflow-hidden rounded-[40px] px-[30px] pt-[34px] pb-[30px] backdrop-blur-[4px]" style={{ boxShadow: "0 34px 70px -30px rgba(43,36,24,.4)" }}>
        <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
          <h2 className="font-display font-light m-0 tracking-[-0.01em] text-[clamp(30px,4.4vw,42px)]">
            A match just <span className="hl">bloomed</span>
          </h2>
          <span className="text-[13px] text-ink-soft rounded-full px-3 py-1" style={{ background: "rgba(249,231,200,.6)" }}>
            {current.cat} · ★ {current.score}
          </span>
        </div>
        <p className="text-[14.5px] text-ink-soft mb-[26px] max-w-[60ch]">
          This is the quiet magic: two neighbors, one need, one give. {current.note}
        </p>

        <div className="relative">
          <svg
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-11 z-0"
          >
            <path
              className="gs-thread"
              d="M 70 20 C 320 -16, 680 56, 930 20"
              fill="none"
              stroke="#e8a33d"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 13"
            />
          </svg>

          <div className="grid items-center gap-3.5 relative z-[1]" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
            <div
              key={`g${idx}`}
              className="cloth-give gs-rise p-5"
              style={{
                borderRadius: "34px 28px 34px 30px",
                boxShadow: "0 22px 44px -22px rgba(61,107,70,.55)",
                transform: "rotate(-1deg)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="stamp text-give">✋ give</span>
                <span className="text-xs text-ink-soft">offers</span>
              </div>
              <div className="font-display font-bold text-lg leading-[1.3] mb-3.5">
                {current.giver.offer}
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[22px] w-[42px] h-[42px] flex items-center justify-center rounded-full"
                  style={{
                    background: "radial-gradient(circle at 40% 35%, #fffdf6, #e4efe2)",
                    boxShadow: "0 8px 18px -8px rgba(61,107,70,.5)",
                  }}
                >
                  {current.giver.emoji}
                </span>
                <span className="font-bold text-[14.5px]">{current.giver.name}</span>
              </div>
            </div>

            <div
              className="gs-medallion w-[74px] h-[74px] rounded-full flex flex-col items-center justify-center shrink-0"
              style={{
                background: "radial-gradient(circle at 40% 35%, #f7d488, #e8a33d)",
                color: "#4a3410",
              }}
            >
              <span className="text-[15px] leading-none">★</span>
              <span className="font-display font-bold text-lg leading-[1.1]">
                {current.score}
              </span>
            </div>

            <div
              key={`n${idx}`}
              className="cloth-need gs-rise p-5"
              style={{
                borderRadius: "28px 34px 30px 34px",
                boxShadow: "0 22px 44px -22px rgba(193,74,36,.5)",
                transform: "rotate(1deg)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="stamp text-need">🙏 need</span>
                <span className="text-xs text-ink-soft">is looking for</span>
              </div>
              <div className="font-display font-bold text-lg leading-[1.3] mb-3.5">
                {current.needer.ask}
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[22px] w-[42px] h-[42px] flex items-center justify-center rounded-full"
                  style={{
                    background: "radial-gradient(circle at 40% 35%, #fffdf6, #fbe8dd)",
                    boxShadow: "0 8px 18px -8px rgba(193,74,36,.45)",
                  }}
                >
                  {current.needer.emoji}
                </span>
                <span className="font-bold text-[14.5px]">{current.needer.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-[26px]">
          <button
            onClick={() => setIdx((i) => (i - 1 + matches.length) % matches.length)}
            className="cursor-pointer text-[15px] font-bold rounded-full w-[42px] h-[42px] bg-paper/90"
            style={{ boxShadow: "0 10px 22px -10px rgba(43,36,24,.45)" }}
            aria-label="previous match"
          >
            ←
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % matches.length)}
            className="cursor-pointer text-[15px] font-bold rounded-full w-[42px] h-[42px] bg-paper/90"
            style={{ boxShadow: "0 10px 22px -10px rgba(43,36,24,.45)" }}
            aria-label="next match"
          >
            →
          </button>
          <div className="flex gap-2 ml-1.5">
            {matches.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`match ${i + 1}`}
                className="w-2.5 h-2.5 p-0 rounded-full cursor-pointer"
                style={{
                  background: i === idx % matches.length ? "#3d6b46" : "rgba(43,36,24,.18)",
                }}
              />
            ))}
          </div>
          <Link
            href="/matches"
            className="ml-auto font-bold text-[14.5px] text-give hover:text-ink"
          >
            ✉️ Connect these two →
          </Link>
        </div>
      </div>
    </section>
  );
}
