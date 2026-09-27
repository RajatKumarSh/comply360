# Architecture Decision Records

This directory contains the Architecture Decision Records (ADRs) for Comply360.

An ADR records a significant architectural or domain-modelling decision, the context in which it was made, and its consequences.

Accepted ADRs are binding for implementation. If an implementation needs to deviate from an accepted ADR, write a new ADR that supersedes it rather than silently diverging.

Business requirements remain in [`../PRD.md`](../PRD.md). The domain model remains in [`../DOMAIN-MODEL.md`](../DOMAIN-MODEL.md). The architecture baseline remains in [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

---

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [001](001-workshop-lifecycle.md) | Workshop Lifecycle and Entry Paths | Accepted | 2026-09-27 |
| [002](002-pre-cob-milestones-and-go-live-gate.md) | Pre-COB Milestones and Go Live Gate | Accepted | 2026-09-27 |
| [003](003-requirement-catalogue.md) | Requirement Catalogue | Accepted | 2026-09-27 |
| [004](004-data-access-supabase-sql-migrations.md) | Data Access: Supabase, SQL Migrations and Generated Types | Accepted | 2026-09-27 |
| [005](005-authorization-rbac-with-scope.md) | Authorization: RBAC with Data Scope | Accepted | 2026-09-27 |
| [006](006-audit-immutability-and-template-versioning.md) | Audit Immutability and Template Versioning | Accepted | 2026-09-27 |
| [007](007-history-strategy.md) | History Strategy: Current State vs Historical State | Accepted | 2026-09-27 |
| [008](008-compliance-state-and-assets.md) | Compliance State and Assets | Accepted | 2026-09-27 |
| [009](009-documents-and-evidence.md) | Documents and Evidence | Accepted | 2026-09-27 |
| [010](010-identifiers-tenancy-time.md) | Identifiers, Tenancy and Time | Accepted | 2026-09-27 |

---

## Cross-Cutting Scope Rule

Configuration is represented as **data from day one** (tables, not code constants).

In V1, configuration is delivered through **SQL migrations and seed files**. Administration UIs for configuration are built only when a delivery phase explicitly requires them.

This keeps the architecture configurable without building the complete configuration/admin engine up front.

---

## Status Values

| Status | Meaning |
|---|---|
| Proposed | Drafted, awaiting project-owner approval. Not binding. |
| Accepted | Approved by the project owner. Binding for implementation. |
| Superseded | Replaced by a later ADR. Kept for history; links to its replacement. |

ADRs are never deleted. A superseded ADR remains in this directory.

---

## Template

```markdown
# ADR-NNN: Title

| | |
|---|---|
| **Status** | Proposed / Accepted / Superseded by ADR-XXX |
| **Date** | YYYY-MM-DD |

## Context

Why a decision is needed. Relevant requirements and constraints.

## Decision

What was decided.

## Consequences

What becomes easier or harder. What follows from the decision.

## Deferred / Open

Items intentionally left open, and the phase in which they must be resolved.

## Related

Links to PRD sections, domain model sections and other ADRs.
```
