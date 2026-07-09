import type { Metadata } from "next";
import { Neuton, Noto_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const neuton = Neuton({
  variable: "--font-neuton",
  subsets: ["latin"],
  weight: ["200", "300", "400", "700", "800"],
  style: ["normal", "italic"],
});

const noto = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GiveShare — neighborhood barter board",
  description:
    "Post what you can give, share what you need, and get matched with neighbors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${neuton.variable} ${noto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-20 print:hidden bg-cream/72 backdrop-blur-[14px]">
          <div className="mx-auto max-w-[1180px] px-[22px] py-3.5 flex items-center gap-5">
            <Link
              href="/"
              className="font-display font-bold text-[23px] tracking-[-0.01em] whitespace-nowrap"
            >
              🌻 Give<span className="text-give">Share</span>
            </Link>
            <nav className="flex items-center gap-1.5 ml-1.5 text-sm">
              <Link
                href="/"
                className="font-bold bg-paper/75 px-3.5 py-1.5 rounded-full"
              >
                Board
              </Link>
              <Link
                href="/matches"
                className="text-ink-soft px-3.5 py-1.5 rounded-full hover:text-ink"
              >
                My matches
              </Link>
              <Link
                href="/#neighbors"
                className="text-ink-soft px-3.5 py-1.5 rounded-full hover:text-ink"
              >
                Neighbors
              </Link>
            </nav>
            <Link
              href="/new"
              className="btn-grad ml-auto text-sm px-5 py-2.5"
            >
              + Post a give or need
            </Link>
          </div>
        </header>
        <main className="flex-1 w-full">{children}</main>
        <footer className="relative z-[5] print:hidden">
          <div className="mx-auto max-w-[1040px] px-5 pt-6 pb-10 text-[13px] text-ink-soft text-center">
            Built for the block · one demo neighborhood · be kind, barter often 🌻
          </div>
        </footer>
      </body>
    </html>
  );
}
