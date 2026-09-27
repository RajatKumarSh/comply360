# ADR-007: History Strategy — Current State vs Historical State

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

Comply360 must answer both "What is true now?" and "What was true on a specific date?".

Domain Model v0.1 described three overlapping history mechanisms — Lifecycle Event, Timeline Event and Audit Log — without defining how they relate. Architecture v0.1 described the timeline as a derived, read-oriented representation, while the domain model treated it as a stored entity.

## Decision

### Append-only domain events

Operationally significant changes are stored as append-only domain event tables. Examples:

- `lifecycle_event`
- `compliance_update`
- `workshop_requirement_event`
- `asset_event`
- `employment_event`
- `salary_period`
- `go_live_approval`

These tables are the historical source of truth. `UPDATE` and `DELETE` are not granted on them.

### Current-state projections

Current state is maintained either as:

- A projection table updated **in the same transaction** as the domain event (for example `compliance_state`, current asset status), or
- A SQL view that selects the latest event.

The choice is made per entity, preferring the simpler option.

### Audit log

A trigger-based `audit_log` records changes to configuration and master data:

- Actor
- Table
- Row ID
- Old value (JSON)
- New value (JSON)
- Timestamp
- Reason (where applicable)

### Timeline

The consolidated workshop timeline is a **SQL view** that combines domain events into one human-readable stream per workshop.

There is no separate timeline store, so the timeline cannot drift from its source records, and it cannot be silently deleted independently of them.

### No hard deletes

No hard deletes of business records. Use:

- Deactivation (status / validity dates)
- Reversing records
- Superseding records

## Consequences

- History is reconstructable from domain events.
- Current state is fast to read without rebuilding it from events.
- Timeline requires no separate write path.
- Each new module must define its domain events and current-state projection.

## Deferred / Open

- Data retention policy.
- Backup and recovery strategy (before production).

## Related

- PRD §3.2, §3.3, §29
- Domain Model §11, §35, §37, §38, §41, §43, §44
- Architecture §24, §32, §33
- ADR-001, ADR-008
