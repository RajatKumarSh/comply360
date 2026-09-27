# ADR-003: Requirement Catalogue

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

The same real-world requirement — for example "Two Post Lift available" — appears in several places:

- A Pre-COB milestone.
- A Post-COB audit question.
- The workshop's current compliance state.
- The asset register.

Without a single stable identity for that requirement, the system cannot reliably connect an audit answer to a compliance item, an asset or a milestone, especially across template versions.

Requirements for tools, equipment, CI, manpower, training and audits will change as Euler's products and processes evolve. These changes must not require application-code changes.

## Decision

Introduce a configurable **Requirement Catalogue**.

### Requirement

`requirement`:

- Code (stable, unique per organization)
- Name
- Description
- Category
- Criticality
- Mandatory by default
- Evidence rules
- Linked asset type (optional)
- Status: `ACTIVE` / `INACTIVE`

Requirements are **never deleted**. A requirement that no longer applies is deactivated.

### Supporting configuration

| Entity | Purpose |
|---|---|
| `requirement_category` | Configurable lookup. Initial seed: Site, Infrastructure / CI, Tools, Safety, Manpower, Training, Documentation. |
| `criticality` | Configurable ranked lookup. Initial seed: Normal < Important < Critical. Rank allows rules such as "Critical or above". |
| `requirement_evidence_rule` | Required evidence type (photo, document, certificate, ...) and minimum count per requirement. |
| `requirement_applicability` | Multi-valued scope rules by workshop type, state and product. An empty dimension means "applies to all". |
| `milestone_requirement` | Many-to-many link between milestone definitions (ADR-002) and requirements, with sequence and a mandatory override. |
| `requirement_revision` | Records a change to the meaning of a requirement. |

Example applicability: a charger requirement may apply only where state = Delhi.

A single requirement may belong to a Pre-COB milestone **and** be checked in Post-COB audits.

### Relationship to audits and compliance

- Audit questions may reference a requirement (ADR-006).
- A finalized audit answer to a requirement-linked question provides the compliance baseline for that requirement (ADR-008).
- Current compliance state is keyed by workshop × requirement (ADR-008).

### Revisions

Changing the meaning of a requirement creates a new `requirement_revision` rather than editing text in place. Historical records reference the revision in force when they were created.

Non-semantic corrections (for example a typo) are recorded in the audit log (ADR-007).

### Delivery scope

In V1 the catalogue is maintained through seed data and migrations. A catalogue administration UI is deferred until a phase requires it.

## Consequences

- New tools, NPI kits, CI rules, training or safety items are catalogue rows, not code.
- Compliance can be reported per requirement consistently across Pre-COB, audits and current state.
- The catalogue becomes a foundational dependency for the audit engine, Pre-COB and compliance modules.

## Deferred / Open

- Complete requirement list (Pre-COB and Post-COB checklists).
- Final criticality rules and their effect on audit results (Phase 5–6).
- Product master list.

## Related

- PRD §3.4, §13, §13a, §14, §15, §17
- Domain Model: Requirement, Requirement Category, Criticality, Requirement Revision, Requirement Applicability
- ADR-002, ADR-006, ADR-008
