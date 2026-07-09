"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Stats = { neighbors: number; gives: number; needs: number; matches: number };

const BLOBS: {
  key: keyof Stats;
  label: string;
  color?: string;
  radius: string;
  bg: string;
  shadow: string;
  rotate: string;
  delay: string;
}[] = [
  {
    key: "neighbors", label: "neighbors", rotate: "-2deg", delay: "0s",
    radius: "46% 54% 52% 48% / 54% 46% 54% 46%",
    bg: "radial-gradient(circle at 38% 32%, #fffdf6, #f4ecdc)",
    shadow: "0 20px 40px -20px rgba(43,36,24,.4)",
  },
  {
    key: "gives", label: "✋ gives blooming", color: "#3d6b46", rotate: "2deg", delay: ".8s",
    radius: "54% 46% 48% 52% / 46% 54% 46% 54%",
    bg: "radial-gradient(circle at 38% 32%, #f2f9f0, #dcecd9)",
    shadow: "0 20px 40px -20px rgba(61,107,70,.5)",
  },
  {
    key: "needs", label: "🙏 needs waiting", color: "#c14a24", rotate: "-2deg", delay: "1.6s",
    radius: "48% 52% 54% 46% / 52% 48% 52% 48%",
    bg: "radial-gradient(circle at 38% 32%, #fef3ec, #fbe2d3)",
    shadow: "0 20px 40px -20px rgba(193,74,36,.45)",
  },
  {
    key: "matches", label: "★ matches ready", color: "#d98a1f", rotate: "2deg", delay: "2.4s",
    radius: "52% 48% 46% 54% / 48% 52% 48% 52%",
    bg: "radial-gradient(circle at 38% 32%, #fdf3e0, #f7e2b8)",
    shadow: "0 20px 42px -18px rgba(232,163,61,.6)",
  },
];

export function StatBlobs({ targets }: { targets: Stats }) {
  const [stats, setStats] = useState<Stats>({ neighbors: 0, gives: 0, needs: 0, matches: 0 });

  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setStats({
        neighbors: Math.round(targets.neighbors * e),
        gives: Math.round(targets.gives * e),
        needs: Math.round(targets.needs * e),
        matches: Math.round(targets.matches * e),
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targets.neighbors, targets.gives, targets.needs, targets.matches]);

  return (
    <div className="grid grid-cols-2 gap-3 mt-[30px] max-w-[320px]">
      {BLOBS.map((b) => (
        <div
          key={b.key}
          className="gs-bob h-[138px] flex flex-col items-center justify-center"
          style={{
            "--r": b.rotate,
            borderRadius: b.radius,
            background: b.bg,
            boxShadow: b.shadow,
            animationDelay: b.delay,
          } as CSSProperties}
        >
          <div
            className="font-display font-bold text-[50px] leading-none"
            style={b.color ? { color: b.color } : undefined}
          >
            {stats[b.key]}
          </div>
          <div className="text-xs text-ink-soft mt-[5px]">{b.label}</div>
        </div>
      ))}
    </div>
  );
}
