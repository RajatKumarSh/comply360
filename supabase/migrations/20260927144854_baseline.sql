-- Comply360 baseline migration (Phase 1 — tooling foundation).
--
-- This migration intentionally creates no business tables. It exists to establish the
-- migration workflow (ADR-004) and to reserve a non-exposed schema for the
-- SECURITY DEFINER authorization helpers that ADR-005 introduces in Phase 2.
--
-- The `private` schema is not listed in supabase/config.toml [api].schemas, so it is not
-- exposed through the Data API.

create schema if not exists private;

comment on schema private is
  'Internal helpers (for example SECURITY DEFINER authorization functions, ADR-005). Not exposed through the Data API.';

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;
