# ADR-006: Audit Immutability and Template Versioning

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

Audits are immutable historical snapshots. Audit configuration (templates, questions, scoring, conditional logic) will change over time. A historical audit must remain understandable and unchanged after configuration changes.

Domain Model v0.1 referenced a "Question Version" on responses but versioned only templates, and listed both `CORRECTED` and `SUPERSEDED` audit states with overlapping meaning.

## Decision

### Template versioning

- `audit_template` has one or more `audit_template_version` rows.
- Template version states: `DRAFT → PUBLISHED → RETIRED`.
- A **published template version is frozen**. Its sections, questions, options, conditions, scores and weights cannot change. A database trigger rejects modifications.
- To change a template, create a new template version.
- The **template version is the unit of versioning**. Questions are not versioned independently.

### Questions

- A question may optionally reference a requirement from the Requirement Catalogue (ADR-003).
- Criticality, evidence rules and applicability default from the linked requirement and may be overridden on the question.
- Question type, options, score and weight are defined on the question within the template version.

### Publish-time resolution

When an audit template version is published:

- Each requirement-linked question **pins the specific Requirement Revision** (ADR-003) it uses.
- The question's effective **criticality** is resolved (requirement default or question override) and stored in the frozen template version.
- The question's effective **evidence rules** are resolved and stored in the frozen template version.
- The question's effective **applicability rules** (requirement applicability plus any question overrides) are resolved and stored in the frozen template version.

A later Requirement Revision must never change the interpretation of an already-published template version or of any historical audit. A new Requirement Revision takes effect in audits only through a newly published template version.

### Conditional logic

- Conditions are stored as data: source question, operator, expected value, action.
- Evaluation is implemented as a pure TypeScript module with thorough unit tests.
- Conditions are **re-evaluated on the server** at submission. The client's evaluation is never trusted.

### Audit execution

- An audit pins the template version when it starts.
- When the audit starts, the frozen applicability rules are evaluated once against the workshop's attributes, and the resulting set of applicable questions is stored with the audit.

### Audit states

```text
DRAFT → SUBMITTED → FINALIZED
                        │
                        └──► SUPERSEDED (only when a correcting audit is finalized)
```

- There is **no `CORRECTED` state**.
- A database trigger rejects `UPDATE` and `DELETE` on a finalized audit and its responses, except the single permitted transition of the audit status to `SUPERSEDED`.
- A correction is a **new audit** with `supersedes_audit_id` referencing the original. The original remains readable.

### Scoring

- Scores are calculated on the server at finalization and stored on the audit.
- Later changes to scoring configuration never recalculate historical audits.

### WAR Score

WAR Score is an **existing Comply360 business concept**.

Its formal definition, scoring method, criticality treatment and audit-result impact will be finalized during the Post-COB pilot phase (Phase 5–6). This ADR does not define or alter the WAR Score methodology. The scoring design above must be able to accommodate it.

### Delivery scope

The pilot Post-COB template is delivered through seed data. A template-builder UI is deferred.

## Consequences

- Historical audits remain exactly as finalized, regardless of later configuration changes.
- Corrections are explicit and traceable.
- Template changes require publishing a new version, which is a deliberate step.

## Deferred / Open

- WAR Score formal definition and methodology (Phase 5–6).
- Criticality effect on audit result (Phase 5–6).
- Finding creation rules (Phase 5–6).
- Who may finalize and who may supersede an audit (Phase 5–6, via the permission matrix).
- Can a Submitted audit be edited or returned to Draft, and by whom? (Phase 5–6; unresolved.)
- Post-COB checklist/template content (Phase 5–6).

## Related

- PRD §12–§17, §36
- Domain Model §14–§20
- Architecture §22, §23, §25
- ADR-003, ADR-007, ADR-008
