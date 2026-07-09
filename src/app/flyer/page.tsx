import { headers } from "next/headers";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export default async function FlyerPage() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const joinUrl = `${proto}://${host}/join`;

  const svg = await QRCode.toString(joinUrl, {
    type: "svg",
    margin: 1,
    color: { dark: "#2b2418", light: "#fffdf6" },
  });

  return (
    <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6 px-4 py-8 print:py-0">
      <h1 className="font-display text-5xl font-semibold leading-tight">
        🌻 Give<span className="text-give">Share</span>
      </h1>
      <p className="text-lg text-ink-soft max-w-xs">
        Swap skills and stuff with your neighbors. Post your{" "}
        <strong className="text-give">gives</strong>, your{" "}
        <strong className="text-need">needs</strong>, and get matched.
      </p>
      <div
        className="card-pin tilt-r rounded-sm p-4 w-64"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="font-display text-xl">
        Scan → gives → needs → email.
        <br />
        <span className="text-ink-soft text-base">That&apos;s it. 60 seconds.</span>
      </p>
      <p className="text-xs text-ink-soft print:hidden">
        (Print this page for the demo table — the QR points at {joinUrl})
      </p>
    </div>
  );
}
