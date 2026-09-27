# ADR-002: Pre-COB Milestones and Go Live Gate

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

Pre-COB is the readiness process for a new workshop before Go Live. It must be milestone-based, configurable, and track requirements, validation, evidence, status, ownership and readiness.

PRD v0.1 listed six milestones (M0–M5). The approved structure has four milestones, and "Ready for Go Live" is a gate rather than a milestone.

## Decision

### Milestone configuration

- `milestone_definition`: code, name, description, sequence, active flag.
- Milestone definitions are grouped into a versioned `milestone_plan`.
- A milestone plan may be scoped by workshop type, so different workshop types can use different milestone sets in future without code changes.

Initial seed plan (v1):

| Code | Milestone | Notes |
|---|---|---|
| M0 | Site Finalization | |
| M1 | Infrastructure / CI | CI = Corporate Identity / branding requirements |
| M2 | Tools & Safety Equipment | |
| M3 | Manpower / Training | Includes the training tracking previously described as M4 |

There is no M5. "Ready for Go Live" is the Go Live gate described below.

### Workshop milestones

- When a workshop enters `PRE_COB` (ADR-001), `workshop_milestone` rows are created from the applicable active milestone plan.
- The workshop **pins the milestone plan version** used. Later plan changes do not alter an in-progress or completed workshop's milestones.
- Each workshop milestone has: status, owner, target date, start date, completion date, remarks.

### Workshop requirements

- Each applicable requirement from the Requirement Catalogue (ADR-003) for each milestone becomes a `workshop_requirement` row: status, owner, due date, completion date, evidence, remarks.
- Workshop requirement status changes are append-only events (ADR-007).

### Target date

- The operational target date is `expected_go_live_date`, stored independently on the workshop.
- It is required for `NEW` workshops.
- On creation it defaults to LOI date + `default_go_live_days`, an organization setting (initial value: 90).
- It may be edited by users with the relevant `edit` permission. Every change records previous value, new value, reason (mandatory) and actor in the audit log (ADR-007).

### Readiness calculation

The readiness method is an organization setting. V1 supports one method, `MANDATORY_COUNT`:

```text
readiness % = completed applicable mandatory requirements
              ÷ total applicable mandatory requirements
              × 100
```

- If there are no applicable mandatory requirements, readiness is shown as **N/A**, not 100%.
- The setting allows a future weighted method to be added without changing historical results.
- Readiness is calculated at milestone level and overall.

### Critical blockers

- Any applicable requirement with **Critical** criticality that is not completed is a **critical blocker**.
- Critical blockers are reported separately from the readiness percentage. They are not treated as additional points.
- Critical blockers are surfaced at the Go Live gate.
- Default documented behaviour: Go Live approval is blocked while critical blockers remain open. Whether an authorized approver may override a blocker is an **open decision** (see below).

### Timeline

The system calculates:

- Days elapsed since LOI.
- Days remaining to the Expected Go Live Date.
- Delay days after the Expected Go Live Date.
- At-risk status.

At-risk thresholds are a configuration placeholder. **No threshold value is defined yet.**

### Go Live gate

- A `go_live_approval` record is append-only. It records: workshop, decision, user, the user's role at the time of the decision, timestamp, comments, evidence.
- A later decision never overwrites an earlier decision.
- Approving requires the `go_live.approve` permission within the workshop's scope (ADR-005).
- **Which roles hold `go_live.approve` is deliberately not assigned** until the permission matrix is finalized. It is not hard-coded to any role.
- An approval decision triggers the `PRE_COB → OPERATIONAL` lifecycle transition (ADR-001).

### Delivery scope

Pre-COB is designed now but implemented **after** the Post-COB pilot. Milestone plans are delivered through seed data; no milestone administration UI is built in Phase 0 or Phase 1.

## Consequences

- Milestones and their requirements can change through configuration without affecting historical workshops.
- Readiness is always calculated from requirement data and never typed in manually.
- Go Live approval rules can be finalized later without schema changes.

## Deferred / Open

- At-risk thresholds (before Pre-COB implementation).
- Go Live approver rule and role assignment of `go_live.approve` (before Pre-COB implementation).
- Whether a Go Live approval may override an open critical blocker (before Pre-COB implementation).
- Whether evidence must be complete before a requirement can be marked completed (before Pre-COB implementation).
- Complete Pre-COB requirement list per milestone (before Pre-COB implementation).

## Related

- PRD §6, §8, §9, §10, §11, §13a
- Domain Model §12, §13, §49 (Requirement Catalogue), §50 (Go Live Approval), §52 (Organization Settings)
- ADR-001 (lifecycle transition), ADR-003 (requirements), ADR-005 (approval permission), ADR-007 (append-only events, audit log), ADR-010 (business time zone)
