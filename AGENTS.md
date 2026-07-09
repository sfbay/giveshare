<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GiveShare — working notes

Neighborhood barter board built at a techjam (July 2026). Next.js App Router +
Tailwind 4 + Drizzle/Neon + Resend, deployed on Vercel (`giveshare.vercel.app`).

## Gotchas that will bite you

- **Resend SDK never throws.** `resend.emails.send()` returns `{ data, error }`;
  always check `error` or failures vanish silently. See `src/lib/email.ts`.
- **`pnpm db:push` needs `DOTENV_CONFIG_PATH=.env.local`** — drizzle-kit's
  dotenv reads `.env` by default, but env lives in `.env.local` (Vercel pull).
- **`src/db/index.ts` uses a placeholder DATABASE_URL at build time** so
  `next build` doesn't throw on import; every page that queries must stay
  `force-dynamic`.
- Design system is the "Thriving Garden" language (Neuton + Noto Sans, `.hl`
  highlighter, `.bloom-card`/`.cloth-*`/`.tex-*` surfaces, `gs-*` keyframes)
  defined in `src/app/globals.css`. Spec + handoff details:
  `docs/superpowers/specs/2026-07-08-giveshare-design.md`. Don't reintroduce
  hard borders / offset shadows on the front page.

## Commands

- Build (always via DevMan wrapper): `~/dev/devman/tools/devman-build.mjs pnpm build`
- Tests (matcher + alerts): `pnpm test`
- Deploy: `vercel deploy --prod` · env: `vercel env ls|add|pull`
- Seed: `pnpm db:seed` (skips if users exist; `TRUNCATE users CASCADE` to reseed)
