# GiveShare — Design Spec (2026-07-08)

A neighborhood skill-sharing barter board, built at a techjam. Neighbors post
**Gives** (abilities and things they offer) and **Needs** (things they're looking
for). The system auto-matches needs against gives and connects people over email.

## Scope decisions (approved)

- **Matching**: auto-match needs ↔ offers at read time; also a browseable board.
- **Community**: one seeded demo neighborhood — no geo, no multi-community.
- **Auth**: name + avatar emoji + email → cookie session. No passwords/OAuth.
- **Persistence**: Neon Postgres (Vercel Marketplace) via Drizzle ORM.
- **Connections**: handled by email. "Connect" logs a `connections` row, then
  opens a prefilled `mailto:` to the matched neighbor. No in-app messaging or
  inbox. The board shows an aggregate "N connections made" community stat.
- **Onboarding pathway** (per Jesse): scan QR code → enter gives → enter
  needs/shares → enter email → get updates. Implemented as a mobile-first
  `/join` wizard; `/flyer` renders a printable QR that points at `/join`.
- **Repo/deploy**: public GitHub repo `giveshare` under Jesse's account,
  deployed on Vercel.

## Stack

Next.js (App Router, Server Actions, TypeScript), Tailwind CSS, Drizzle ORM,
Neon Postgres. Single deploy on Vercel. Unit tests via Vitest for the matcher.

## Data model

- `users` — id (uuid), name, emoji, email, created_at
- `posts` — id (uuid), user_id → users, kind (`give` | `need`), title,
  description, category, tags (text[]), status (`open` | `fulfilled`),
  created_at
- `connections` — id, from_post_id → posts, to_post_id → posts, created_at

Categories (fixed list): tools, garden-food, childcare, pet-care, tech-help,
rides, lessons, home-repair, arts-crafts, other.

## Matching

Pure TypeScript function, computed at read time (no jobs, no embeddings). For a
given post, score every open post of the opposite kind:

- same category: **+10**
- each shared tag: **+3**
- each shared keyword between title+description (lowercased, stopwords
  stripped): **+1**

Return matches with score ≥ 3, sorted descending. Unit-tested; thresholds are
constants so they're demo-tunable.

## Pages

- `/` — community board: feed of gives + needs, filter chips (kind, category),
  join CTA when no session, community stats strip.
- `/join` — the QR pathway: 3-step wizard (gives → needs → name/emoji/email),
  then straight to matches.
- `/new` — post a single give or need (for signed-in users).
- `/matches` — for each of your open posts, its top matches with a Connect
  button (logs connection + opens mailto with prefilled subject/body).
- `/post/[id]` — post detail plus its computed matches.
- `/flyer` — printable poster with a QR code pointing at `/join`.

## Seed data

`pnpm db:seed` inserts ~10 fictional neighbors with deliberately overlapping
gives/needs (e.g., a "need: guitar lessons" that matches a "give: guitar
lessons") so the board and matches pages demo well immediately.

## Error handling / testing

- Server Actions validate inputs (zod) and redirect with simple error states.
- The matcher is the only real logic: covered by Vitest unit tests.
- Everything else verified by driving the app locally and on the deploy.

## Out of scope (YAGNI for the jam)

Real auth, outbound email digests (mailto only; Resend later if wanted),
in-app chat, reputation/karma, geo/multi-community, moderation, image uploads.
