# Domain Modules

Comply360 is a modular monolith (Architecture §35). Business logic for each domain lives in its own module under `modules/`.

A module folder is created only when the phase that introduces it begins. Do not create empty module folders in advance (CLAUDE.md §18).

## Structure

```text
modules/<domain>/
  schema.ts    # Zod input schemas (Architecture §20)
  service.ts   # Domain / business logic (Architecture §19)
  repo.ts      # Typed Supabase queries; import "server-only" (ADR-004)
  actions.ts   # Server Actions: validate → authenticate/authorize → service
  *.test.ts    # Unit tests next to the code they test
```

## Rules

- Request flow: UI → Server Action / Route Handler → validation → authorization → domain logic → data access → PostgreSQL (Architecture §19).
- Server Actions and Route Handlers must check the user themselves. `proxy.ts` is only an optimistic redirect.
- Check permissions, never role names (ADR-005). Until `authorize()` exists (Phase 2), protected code uses `requireUser()` from `lib/auth/session.ts`.
- Data access uses the generated types in `types/database.ts`. No ORM (ADR-004).
- Every table created in the `public` schema must enable Row Level Security in the same migration that creates the table (ADR-005). See `docs/DEVELOPMENT.md` → Database changes.
- Multi-table writes that must be atomic go into PostgreSQL functions called via RPC (ADR-004).
- History is append-only; never hard-delete business records (ADR-007).
- Business rules belong in configuration data, not in UI components (CLAUDE.md §3–4).
