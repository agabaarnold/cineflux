<div align="center">

<img src="public/logo.svg" alt="CineFlux logo" width="96" height="96" />

# CineFlux

**Discover trending movies, TV shows, and the people behind them — and keep a personal watchlist.**

[![CI](https://github.com/agabaarnold/cineflux/actions/workflows/ci.yml/badge.svg)](https://github.com/agabaarnold/cineflux/actions/workflows/ci.yml)
![TanStack Start](https://img.shields.io/badge/TanStack_Start-React_19-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)

</div>

<!-- Add a screenshot or short GIF here, e.g. ![CineFlux home](docs/home.png) -->

## Features

- **Browse** trending, popular, top-rated, now-playing, and upcoming movies; popular, airing, and top-rated TV shows; and trending people, with a Day/Week toggle for trending rows.
- **Hero carousel** of trending titles with autoplay, pause control, and `prefers-reduced-motion` support.
- **Search** across movies, TV, and people with type and release-year filters, debounced input, and recent searches.
- **Detail pages** with cast, crew, trailers, reviews, similar titles, franchise collections, and "Where to watch" providers based on your locale.
- **TV drill-down**: series → seasons → episodes, with previous/next episode navigation.
- **Watchlist** (movies, shows, people) with optimistic updates, rollback on error, and sorting by recently added, title, rating, or year.
- **Auth** with email/password and optional Google sign-in via Better Auth; breached passwords are rejected (Have I Been Pwned).
- **Dark/light theme** (dark by default) applied before first paint to avoid flashes.
- **SEO**: per-page titles, descriptions, Open Graph/Twitter cards, and optional canonical URLs.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start), TanStack Router, React 19 + React Compiler, Nitro |
| Data fetching | TanStack Query with tiered cache lifetimes, server functions, [Zod](https://zod.dev) response validation |
| Database & auth | PostgreSQL, [Drizzle ORM](https://orm.drizzle.team), [Better Auth](https://www.better-auth.com) |
| UI | Tailwind CSS v4, shadcn/ui on Base UI, Tabler icons, Embla Carousel |
| Forms | TanStack Form |
| Quality | TypeScript, [Ultracite](https://github.com/haydenbleasel/ultracite) (Oxlint + Oxfmt), Vitest, GitHub Actions |
| Data source | [The Movie Database (TMDB)](https://www.themoviedb.org/) API |

## Getting started

### Prerequisites

- Node.js 22.12+ (CI runs on 22)
- [pnpm](https://pnpm.io) 10
- A PostgreSQL database
- A free [TMDB API account](https://www.themoviedb.org/settings/api) (API key and read access token)

### Setup

```bash
git clone https://github.com/agabaarnold/cineflux.git
cd cineflux
pnpm install
cp .env.example .env.local
```

Fill in `.env.local` (see [Environment variables](#environment-variables)), then create the tables and start the dev server:

```bash
pnpm db:migrate
pnpm dev
```

The app runs at <http://localhost:3000>.

### Environment variables

| Variable | Required | Description |
| --- | :---: | --- |
| `BETTER_AUTH_URL` | ✅ | Base URL of the app, e.g. `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | ✅ | Auth signing secret. Generate with `pnpm dlx @better-auth/cli secret` |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `TMDB_API_KEY` | ✅ | TMDB API key |
| `TMDB_READ_ACCESS_TOKEN` | ✅ | TMDB v4 read access token (server-only; never shipped to the client) |
| `TMDB_BASE_URL` | ✅ | `https://api.themoviedb.org/3` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | ❌ | Enable Google sign-in. Set **both** or neither |
| `VITE_SITE_URL` | ❌ | Public origin (no path) used for canonical links and social cards |

Variables are validated at startup with `@t3-oss/env-core`, so a missing value fails fast with a clear error.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3000 |
| `pnpm build` | Production build (self-contained Node server in `dist/`) |
| `pnpm preview` | Preview the production build |
| `pnpm test` | Run the Vitest suite |
| `pnpm check` | Lint and format check (Ultracite) |
| `pnpm fix` | Auto-fix lint and format issues |
| `pnpm db:generate` | Generate a Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push the schema directly (handy for prototyping) |
| `pnpm db:studio` | Open Drizzle Studio |

## Testing

```bash
pnpm test
```

Unit and hook tests run with no extra setup. The watchlist database integration tests are skipped unless `TEST_DATABASE_URL` is set. It must equal `DATABASE_URL` and point at an **empty, disposable** database, because the tests create and delete rows:

```bash
TEST_DATABASE_URL=postgresql://postgres@localhost:5432/cineflux_test \
DATABASE_URL=postgresql://postgres@localhost:5432/cineflux_test \
pnpm test
```

CI spins up Postgres 17, runs migrations, then type-checks (`tsc --noEmit`), lints, and tests on every push and pull request.

## Project structure

```
src/
├── components/     # ui/ (shadcn primitives), media/ (cards, rows, hero), layout/, auth/
├── db/             # Drizzle client, schema, relations, watchlist queries
├── env/            # Typed server and client environment variables
├── hooks/          # useWatchlistItem, useTheme, ...
├── lib/            # auth, SEO helpers, TMDB query-cache tiers, theme
├── queries/        # TanStack Query options per TMDB domain
├── routes/         # File-based routes (_app, _auth, api/auth)
├── schemas/        # Zod schemas for TMDB responses
└── server/         # Server functions and the server-only TMDB client
drizzle/            # Generated SQL migrations
```

### How data flows

1. A route **loader** warms the TanStack Query cache; components read it with `useSuspenseQuery`.
2. Query options call **server functions**, which call TMDB through `tmdbFetchValidated`.
3. Responses are **validated with Zod**. Unexpected shapes surface as a clear 502 error page instead of silent breakage.
4. The TMDB token lives only on the server. The client never sees it.
5. Cache lifetimes are tiered (`volatile`, `default`, `lists`, `slow`, `static`) in `src/lib/tmdb-query-cache.ts`.

## Deployment

Nitro builds a self-contained Node server:

```bash
pnpm build
node dist/server/index.mjs
```

Provide the environment variables above on your host (Render, Fly.io, a VPS, etc.) and run `pnpm db:migrate` against the production database. Nitro also supports host-specific presets; see the [Nitro deploy docs](https://v3.nitro.build/deploy).

## Contributing

1. Create a branch and make your change.
2. Run `pnpm fix`, `pnpm exec tsc --noEmit`, and `pnpm test`.
3. Open a pull request. CI must pass.

A lint-staged hook runs Ultracite on staged files at commit time.

## Acknowledgements

This product uses the TMDB API but is not endorsed or certified by TMDB.

<!-- Add a LICENSE file and reference it here, e.g. "Released under the MIT License." -->
