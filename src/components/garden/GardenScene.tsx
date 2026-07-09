import type { CSSProperties } from "react";

// [x, y, scale, sway class, animation-delay, petal color]
const FIELD_FLOWERS: [number, number, number, "a" | "b", number, string][] = [
  [70, 474, 0.7, "b", -0.2, "#fffdf6"],
  [140, 504, 0.82, "a", -1.3, "#fde6b0"],
  [214, 460, 0.62, "b", -2.1, "#f6c9d4"],
  [300, 508, 0.86, "a", -0.8, "#fffdf6"],
  [382, 468, 0.7, "b", -1.7, "#ffd9b0"],
  [158, 548, 0.92, "a", -2.4, "#fffdf6"],
  [262, 552, 0.82, "b", -0.5, "#f6c9d4"],
  [360, 548, 0.96, "a", -1.9, "#fdeeb4"],
  [444, 506, 0.8, "b", -1.1, "#fffdf6"],
  [430, 556, 0.88, "a", -2.7, "#ffd9b0"],
  [336, 472, 0.64, "b", -0.9, "#fbe8dd"],
  [508, 540, 0.9, "a", -1.5, "#fffdf6"],
];

// The foreground bush — the neighborhood, thriving, overflowing. The scale-5.4
// daisy is the deliberate "lead" flower.
const BUSH_FLOWERS: [number, number, number, "a" | "b", number, string][] = [
  [470, 690, 2.4, "a", -2.0, "#f6c9d4"],
  [590, 710, 5.4, "b", -0.4, "#fffdf6"],
  [520, 704, 1.9, "a", -2.6, "#fbe8dd"],
  [636, 700, 2.3, "b", -1.6, "#fffdf6"],
  [706, 690, 2.8, "b", -1.1, "#fde6b0"],
  [772, 706, 2.8, "a", -0.7, "#ffd9b0"],
];

function Daisy({
  flower: [x, y, scale, sway, delay, petal],
}: {
  flower: [number, number, number, "a" | "b", number, string];
}) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <g
        className={`fl ${sway === "a" ? "sway-a" : "sway-b"}`}
        style={{ animationDelay: `${delay}s` }}
      >
        <use
          href="#daisy"
          style={{ "--pf": petal } as CSSProperties}
        />
      </g>
    </g>
  );
}

export function GardenScene() {
  return (
    <div
      className="gs-garden"
      aria-hidden="true"
      style={{
        position: "absolute",
        right: 0,
        top: 8,
        bottom: 8,
        width: "60%",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 800 760"
        preserveAspectRatio="xMaxYMax slice"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ad2e6" />
            <stop offset="46%" stopColor="#c6e7ee" />
            <stop offset="74%" stopColor="#e9f5ea" />
            <stop offset="100%" stopColor="#f2f6df" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6db" stopOpacity="1" />
            <stop offset="42%" stopColor="#f9dd9b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f9dd9b" stopOpacity="0" />
          </radialGradient>
          <g id="daisy">
            <path
              d="M0,0 C -3,-26 3,-52 0,-74"
              stroke="#4a7c54"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              className="leaf-wind"
              d="M0,-28 C -14,-30 -23,-40 -25,-53 C -11,-51 -2,-42 0,-28 Z"
              fill="#5b8a5f"
            />
            <path
              className="leaf-wind"
              style={{ animationDelay: "-1.4s" }}
              d="M0,-46 C 14,-48 23,-58 25,-70 C 11,-68 2,-58 0,-46 Z"
              fill="#6ba368"
            />
            <g transform="translate(0,-80)">
              <g className="petals-wind">
                <g fill="var(--pf, #fffdf6)" stroke="rgba(43,36,24,.13)" strokeWidth="0.7">
                  {Array.from({ length: 12 }, (_, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-16"
                      rx="6"
                      ry="14"
                      transform={i ? `rotate(${i * 30})` : undefined}
                    />
                  ))}
                </g>
              </g>
              <circle r="9.5" fill="#e8a33d" />
              <circle r="9.5" fill="none" stroke="rgba(43,36,24,.16)" strokeWidth="1" />
              <circle r="4.6" fill="#cf7f1d" />
            </g>
          </g>
        </defs>

        <rect x="0" y="0" width="800" height="760" fill="url(#sky)" />
        <circle cx="180" cy="168" r="120" fill="url(#sunGlow)" />
        <circle cx="180" cy="168" r="50" fill="#ffe9b0" opacity="0.9" />

        <g className="cloud" opacity="0.9">
          <g transform="translate(430,110)" fill="#ffffff">
            <ellipse cx="0" cy="0" rx="46" ry="24" />
            <ellipse cx="40" cy="8" rx="38" ry="20" />
            <ellipse cx="-40" cy="10" rx="34" ry="18" />
          </g>
        </g>
        <g
          className="cloud"
          style={{ animationDelay: "-18s", animationDuration: "54s" }}
          opacity="0.8"
        >
          <g transform="translate(650,220)" fill="#ffffff">
            <ellipse cx="0" cy="0" rx="40" ry="20" />
            <ellipse cx="34" cy="6" rx="30" ry="16" />
            <ellipse cx="-32" cy="8" rx="26" ry="14" />
          </g>
        </g>

        <path d="M0,418 Q210,384 430,406 T800,410 L800,760 L0,760 Z" fill="#d4e7b7" />
        <path d="M0,472 Q260,440 520,470 T800,474 L800,760 L0,760 Z" fill="#bdd99c" />
        <path d="M0,544 Q270,516 545,550 T800,548 L800,760 L0,760 Z" fill="#a7cd86" />

        {FIELD_FLOWERS.map((f, i) => (
          <Daisy key={`f${i}`} flower={f} />
        ))}
        {BUSH_FLOWERS.map((f, i) => (
          <Daisy key={`b${i}`} flower={f} />
        ))}
      </svg>
      {/* feather blend into the page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #faf5ea 0%, rgba(250,245,234,.82) 13%, rgba(250,245,234,0) 40%), linear-gradient(to bottom, transparent 80%, rgba(250,245,234,.92) 100%)",
        }}
      />
    </div>
  );
}

export function DriftingPetals() {
  const petals: [number, number, number, string, number?][] = [
    [7, 0, 0, "#e8a33d"],
    [18, 6, 1, "#f3cd8e", 0.8],
    [30, 2.5, 0.4, "#fffdf6"],
    [44, 9, 2, "#f6c9d4", 1.05],
    [55, 4, 1.2, "#e4efe2"],
    [66, 11, 0.8, "#f3cd8e"],
    [74, 1.5, 1.6, "#fffdf6", 0.85],
    [83, 7.5, 0.2, "#ffd9b0", 1.12],
    [91, 3.2, 1.4, "#f3cd8e"],
    [97, 10, 0.6, "#e8a33d"],
  ];
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-[6]"
    >
      {petals.map(([left, d1, d2, bg, scale], i) => (
        <span
          key={i}
          className="gs-petal"
          style={{
            left: `${left}%`,
            animationDelay: `${d1}s, ${d2}s`,
            background: bg,
            ...(scale ? { transform: `scale(${scale})` } : {}),
          }}
        />
      ))}
    </div>
  );
}

export function FloatingBlooms() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      <span
        className="absolute rounded-full"
        style={{
          width: 520, height: 520, left: -140, top: "42%",
          background: "radial-gradient(circle at 35% 35%, rgba(228,239,226,.85), rgba(228,239,226,0) 68%)",
          animation: "gs-floatA 24s ease-in-out infinite",
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          width: 480, height: 480, right: -120, bottom: "4%",
          background: "radial-gradient(circle at 50% 50%, rgba(243,205,142,.5), rgba(243,205,142,0) 68%)",
          animation: "gs-floatB 28s ease-in-out infinite",
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          width: 460, height: 460, left: "26%", bottom: "20%",
          background: "radial-gradient(circle at 50% 50%, rgba(251,232,221,.6), rgba(251,232,221,0) 66%)",
          animation: "gs-floatA 30s ease-in-out infinite",
        }}
      />
    </div>
  );
}
