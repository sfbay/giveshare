# 🌻 GiveShare

A neighborhood skill-sharing barter board, built at a techjam. Post what you
can **give** (skills, tools, time, extra zucchini) and what you **need** — get
auto-matched with neighbors, and connect over email.

**The pathway:** scan the QR (`/flyer`) → enter your gives → enter your needs →
drop your email → see your matches.

## How it works

- **Matching** is a pure TypeScript scoring function computed at read time:
  same category +10, each shared tag +3, each shared keyword +1. Matches with
  score ≥ 3 surface on `/matches` and post pages. No jobs, no embeddings —
  see [`src/lib/match.ts`](src/lib/match.ts) (unit-tested).
- **Connections happen over email.** "Connect" logs a row (for the community
  stats) and opens a prefilled `mailto:` — no in-app inbox to build or check.
- **Auth** is a name + emoji + email cookie session. It's a demo; be kind.

## Stack

Next.js (App Router + Server Actions) · Tailwind CSS 4 · Drizzle ORM ·
Neon Postgres · Vitest · deployed on Vercel.

## Running locally

```bash
pnpm install
echo 'DATABASE_URL=postgres://…' > .env.local   # any Postgres works
pnpm db:push     # create tables
pnpm db:seed     # 10 fictional neighbors with overlapping gives/needs
pnpm dev
```

`pnpm test` runs the matcher tests.

## Pages

| Route | What |
|---|---|
| `/` | The board — browse gives & needs, filter by kind/category |
| `/join` | QR-landing wizard: gives → needs → email |
| `/matches` | Your posts and their matches, with email Connect |
| `/post/[id]` | Post detail + its matches |
| `/new` | Pin a single give or need |
| `/flyer` | Printable poster with the QR code |
