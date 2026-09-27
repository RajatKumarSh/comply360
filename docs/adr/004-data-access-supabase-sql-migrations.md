# ADR-004: Data Access — Supabase, SQL Migrations and Generated Types

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

Architecture v0.1 left the ORM / data-access strategy open and required that an ORM not be introduced automatically.

The schema must be reproducible from the repository, version-controlled, portable across PostgreSQL hosts, and strongly typed in the application.

## Decision

Target architecture:

```text
Next.js  →  Supabase  →  PostgreSQL
```

- Use **Supabase PostgreSQL** with the **Supabase CLI**.
- **Supabase Auth is the authentication provider; the authentication method remains subject to the application authentication design.**
- **SQL migrations** in `supabase/migrations/*.sql` are the source of truth for the database schema.
- Generate TypeScript database types with the Supabase CLI into `types/database.ts`. The generated file is **committed**.
- CI (when introduced) regenerates types and fails if they differ from the committed file.
- **No ORM at this stage. Drizzle is explicitly not introduced.**
- Data access is implemented as small, typed repository functions per domain module, using the Supabase client (`@supabase/ssr` for server-side use in Next.js).
- Multi-table writes that must be atomic (for example finalizing an audit and writing compliance baselines) are implemented as PostgreSQL functions invoked via RPC, so they execute in a single transaction.
- Seed data (`supabase/seed.sql` or equivalent) contains **synthetic data only**.
- Migrations are forward-only. Destructive schema changes require an explicit, reviewed migration.
- Undocumented changes to any shared or production database are not permitted.

## Consequences

- The schema is fully reproducible from Git.
- Types flow from the database to the application without a separate schema definition.
- Business rules remain portable PostgreSQL (constraints, triggers, functions) plus application code.
- Complex queries are written in SQL rather than through an ORM query builder.
- Local development will require the Supabase CLI and its local stack (Phase 1).

## Deferred / Open

- Authentication method (email/password, magic link, future SSO) — before Phase 2.
- Local Supabase prerequisites (Docker Desktop) — Phase 1.
- CI type-drift check — when CI is introduced.

## Related

- Architecture §10, §11, §12, §13
- ADR-005, ADR-007, ADR-010
