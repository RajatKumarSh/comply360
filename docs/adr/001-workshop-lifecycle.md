# ADR-001: Workshop Lifecycle and Entry Paths

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

PRD v0.1 described the workshop lifecycle as a single chain that mixed coarse operational states (Operational, Suspended, Closed) with fine-grained readiness steps (Infrastructure, Branding, Tools & Safety, Manpower, Training).

Tracking readiness steps both as lifecycle states and as milestones would create two sources of truth for "where is this workshop?".

The existing workshop estate is already operational and has little or no Pre-COB history. The pilot starts with Post-COB for these workshops, while new workshops must follow the full lifecycle.

## Decision

### Coarse lifecycle

The workshop lifecycle is a small, coarse state machine:

```text
PRE_COB ──► OPERATIONAL (Post-COB) ──► SUSPENDED ──► OPERATIONAL ──► ... ──► CLOSED
   │                                                                         ▲
   └──────────────── (withdrawn / cancelled before Go Live) ─────────────────┘
```

Conceptually: **Workshop → Pre-COB → Go Live / COB → Post-COB**.

- `PRE_COB`: the workshop is progressing through readiness milestones (ADR-002).
- `OPERATIONAL`: the workshop is live and subject to Post-COB audits and compliance.
- `SUSPENDED`: COB has been withdrawn/suspended.
- `CLOSED`: the workshop is closed.

Readiness detail (site, infrastructure/CI, tools & safety, manpower/training) is represented as **milestone progress** (ADR-002), not as lifecycle states.

### Transitions are configuration

- Lifecycle states are stored in a `lifecycle_state` table.
- Permitted transitions are stored in a `lifecycle_transition` table: from state, to state, required permission, whether a reason is required, whether evidence is required.
- The initial states and transitions are delivered through seed data matching the diagram above.

### Transitions are history

- Every transition appends a `lifecycle_event`: workshop, previous state, new state, actor, timestamp, reason, comments, evidence.
- Lifecycle events are append-only (ADR-007).
- The current lifecycle state is the result of the latest lifecycle event. It may be projected onto the workshop row for convenience, updated in the same transaction as the event.

### Entry paths

Each workshop has an `entry_path`:

| Entry path | Meaning | Starting state |
|---|---|---|
| `NEW` | A new workshop onboarded through Comply360. | `PRE_COB` |
| `LEGACY` | An existing operational workshop migrated into Comply360. | `OPERATIONAL`, via a `LEGACY_ONBOARDED` lifecycle event |

For `LEGACY` workshops:

- Pre-COB history is recorded as **unavailable**. It is never fabricated.
- LOI date and Pre-COB dates may be empty.
- A database CHECK constraint permits these fields to be empty only when `entry_path = LEGACY`.

**The Post-COB pilot uses the `LEGACY` entry path.**

## Consequences

- One source of truth for lifecycle state; readiness detail lives in milestones.
- The existing estate can enter Post-COB immediately without fake Pre-COB data.
- New workshops keep the complete lifecycle.
- Adding a lifecycle state or transition is a data change, not a code change.
- Code must never assume a transition is valid without checking `lifecycle_transition` and the actor's permission.

## Deferred / Open

- Exact reason/evidence requirements per transition (before the lifecycle transitions are implemented).
- Suspension and re-approval rules for "repeated non-compliance" (later phase).
- Required fields for a legacy workshop (before Phase 4).

## Related

- PRD §5, §8, §37, §40a
- Domain Model §10, §11
- ADR-002, ADR-005, ADR-007
