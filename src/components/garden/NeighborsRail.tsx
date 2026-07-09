export type NeighborCard = {
  emoji: string;
  name: string;
  gives: string;
  needs: string;
};

export function NeighborsRail({ neighbors }: { neighbors: NeighborCard[] }) {
  if (neighbors.length === 0) return null;
  return (
    <section id="neighbors" className="relative z-[5] max-w-[1040px] mx-auto mt-[62px] px-5">
      <div className="flex items-baseline gap-3 flex-wrap mb-2">
        <h2 className="font-display font-light m-0 tracking-[-0.01em] text-[clamp(30px,4.4vw,42px)]">
          Our Neighbors
        </h2>
        <span className="text-sm text-ink-soft">
          a patchwork of real people — every porch flag a different thread
        </span>
      </div>
      <div
        className="flex gap-[18px] overflow-x-auto pt-[18px] px-1 pb-[26px]"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {neighbors.map((n) => (
          <div
            key={n.name}
            className="bloom-card shrink-0 w-[196px] rounded-[32px] p-5"
            style={{
              scrollSnapAlign: "start",
              background: "radial-gradient(130% 100% at 50% 0%, #fffdf6, #f6efe0)",
            }}
          >
            <span aria-hidden="true" className="tex-overlay tex-paper" />
            <div className="relative flex flex-col items-center text-center mb-3.5">
              <span
                className="text-[34px] leading-none w-[68px] h-[68px] flex items-center justify-center rounded-full mb-2.5"
                style={{
                  background: "radial-gradient(circle at 40% 35%, #fdf3e0, #f7e2b8)",
                  boxShadow: "0 12px 24px -12px rgba(232,163,61,.6)",
                }}
              >
                {n.emoji}
              </span>
              <span className="font-display font-bold text-[15.5px] leading-[1.2]">
                {n.name}
              </span>
            </div>
            <div
              className="relative flex items-start gap-[7px] text-[12.5px] leading-[1.45] mb-2 rounded-[14px] px-2.5 py-2"
              style={{ background: "rgba(228,239,226,.6)" }}
            >
              <span className="shrink-0">✋</span>
              <span className="text-ink">{n.gives}</span>
            </div>
            <div
              className="relative flex items-start gap-[7px] text-[12.5px] leading-[1.45] rounded-[14px] px-2.5 py-2"
              style={{ background: "rgba(251,232,221,.6)" }}
            >
              <span className="shrink-0">🙏</span>
              <span className="text-ink-soft">{n.needs}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
