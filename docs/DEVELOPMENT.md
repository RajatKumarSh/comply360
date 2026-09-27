# Comply360 — Local Development

This guide explains how to set up and run Comply360 locally. Architecture decisions are in [`docs/adr/`](adr/README.md); development rules are in [`CLAUDE.md`](../CLAUDE.md).

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 24 (see `.nvmrc`) | `package.json` requires Node 24 or later. |
| npm | Bundled with Node | Use `npm ci` for a clean install. |
| Docker Desktop | Current | Required by the local Supabase stack. On Windows, use the WSL 2 backend. Docker must be running before `npm run db:start`. |
| Git | Current | Line endings are normalized to LF by `.gitattributes`. |

The Supabase CLI is installed as a pinned devDependency (`supabase`), so no global install is needed. Run it through the npm scripts below or with `npx supabase`.

---

## First-time setup

```bash
git clone https://github.com/RajatKumarSh/comply360.git
cd comply360
npm ci

# Start the local Supabase stack (PostgreSQL, Auth, Storage, Studio). Docker must be running.
npm run db:start

# Create your local environment file.
cp .env.example .env.local
# Then copy the values printed by `npm run db:status` into .env.local:
#   "API URL"         -> NEXT_PUBLIC_SUPABASE_URL
#   "Publishable key" -> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# Apply all migrations and seed data to the local database.
npm run db:reset

# Regenerate database types (should produce no diff on a fresh clone).
npm run gen:types

# Start the application.
npm run dev
```

Open <http://localhost:3000>. Without a session you are redirected to `/login`.

> **Sign-in is not available yet.** The authentication method is an open decision (ADR-004, ADR-005) and will be configured in Phase 2. Public self sign-up is disabled in `supabase/config.toml`.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Production build. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | Generate Next.js route types, then run `tsc --noEmit`. |
| `npm run format` / `format:check` | Format with Prettier / check formatting. Markdown and the `supabase/` folder are excluded. |
| `npm run test` | Unit tests (Vitest). |
| `npm run check` | Lint, type-check, format check, tests and build. Run before pushing. |
| `npm run db:start` / `db:stop` / `db:status` | Start, stop or inspect the local Supabase stack. |
| `npm run db:reset` | Recreate the local database from `supabase/migrations/` and `supabase/seed.sql`. |
| `npm run db:new -- <name>` | Create a new timestamped migration file. |
| `npm run gen:types` | Regenerate `types/database.ts` from the local database. |

---

## Database changes

SQL migrations in `supabase/migrations/` are the source of truth for the schema (ADR-004).

1. `npm run db:new -- <short_name>` to create a migration.
2. Write forward-only SQL. Destructive changes require an explicit, reviewed migration.
   - **Every table created in the `public` schema must enable Row Level Security in the same migration that creates the table** (`alter table public.<table> enable row level security;`). Supabase grants the `anon` and `authenticated` roles access to new `public` tables by default, so a table without RLS would be reachable through the Data API (ADR-005).
3. `npm run db:reset` to apply it locally.
4. `npm run gen:types` and commit the updated `types/database.ts` together with the migration.

Never change a shared or production database without a committed migration.

---

## Seed data

`supabase/seed.sql` runs after migrations on `npm run db:reset`.

- Synthetic data only. Never use real Euler, customer, dealer or employee data (CLAUDE.md §15, PRD §34).
- Configuration is data (Architecture §60). Configuration for a module is added to migrations / seed files in the phase that introduces its tables.

---

## Environment variables

- `.env.example` lists every variable, with no secret values. It is committed.
- `.env.local` holds your real local values. It is ignored by Git and must never be committed.
- Only `NEXT_PUBLIC_*` variables reach the browser. Server-only secrets must never use that prefix (Architecture §42).
- `lib/env.ts` validates the public variables and fails with a clear message if one is missing or invalid.

---

## Authentication (Phase 1 foundation)

- `proxy.ts` refreshes the Supabase session cookie and redirects visitors without a session to `/login`. This is an optimistic check only.
- `requireUser()` in `lib/auth/session.ts` is the authoritative authentication check. The protected `app/(app)` layout calls it on the server.
- Authorization (`authorize()`, permissions and scope) is introduced in Phase 2 (ADR-005).

---

## Continuous integration

`.github/workflows/ci.yml` runs lint, type-check, format check, tests and build on every push to `main` and on pull requests.

The Supabase type-drift check required by ADR-004 is deferred until migrations contain real schema. Until then, regenerate types locally after every migration.

---

## Troubleshooting

- **`npm run db:start` fails:** make sure Docker Desktop is running.
- **"Invalid or missing environment variables":** check `.env.local` against `.env.example`.
- **Type errors mentioning `.next/dev/types`:** stale generated route types. Delete `.next/` and run `npm run typecheck` again.
