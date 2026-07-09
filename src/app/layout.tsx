import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
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
      className={`${fraunces.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-ink/70 bg-paper/80 backdrop-blur-sm sticky top-0 z-10 print:hidden">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-6">
            <Link
              href="/"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              🌻 Give<span className="text-give">Share</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-ink-soft">
              <Link href="/" className="hover:text-ink">
                Board
              </Link>
              <Link href="/matches" className="hover:text-ink">
                My matches
              </Link>
            </nav>
            <div className="ml-auto">
              <Link
                href="/new"
                className="card-pin inline-block px-4 py-1.5 text-sm font-bold"
              >
                + Post a give or need
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 flex-1">
          {children}
        </main>
        <footer className="border-t border-line py-6 text-center text-xs text-ink-soft print:hidden">
          Built at a techjam · one demo neighborhood · be kind, barter often 🌻
        </footer>
      </body>
    </html>
  );
}
