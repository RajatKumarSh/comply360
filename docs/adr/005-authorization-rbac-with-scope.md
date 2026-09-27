# ADR-005: Authorization — RBAC with Data Scope

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

Users must only access the workshops and data they are authorized to access, and only perform the actions they are permitted to perform.

Authorization must not depend only on role names. The final permission matrix is not yet defined, so the design must allow permissions to be assigned later without code changes.

## Decision

### Model

```text
User → Role Assignment (role + scope + validity) → Role → Permissions → permitted data/actions
```

| Entity | Purpose |
|---|---|
| `role` | A named role with a description of its intended purpose. |
| `permission` | A resource + action pair, e.g. `workshop.view`, `audit.audit`, `go_live.approve`. |
| `role_permission` | Which permissions a role grants. |
| `user_role_assignment` | User, role, scope type, scope ID, `valid_from`, `valid_to`. |

Initial permission actions:

- `view`
- `create`
- `edit`
- `audit`
- `approve`
- `configure`
- `administer`

### Scope

Scope types:

- `ORGANIZATION`
- `REGION`
- `STATE`
- `WORKSHOP`

A user may hold multiple role assignments. Assignments are **ended** (by setting `valid_to`), not deleted. This also preserves the history of ASM and RSM assignments to workshops.

### Initial roles

| Role | Intended purpose |
|---|---|
| Super Admin | Full system administration. |
| Admin | Organization administration and configuration. |
| Service / Operations | Service / operations team responsibilities within the assigned scope (to be detailed in the permission matrix). |
| SQM | Workshop compliance management, WAR Score / audit improvement, action tracking and monitoring within the assigned scope. |
| ASM | Area Service Manager responsibilities within the assigned scope. |
| RSM | Regional Service Manager responsibilities within the assigned scope. |
| Auditor | Performing audits. |
| Dealer / Workshop User | Workshop-level user limited to their own workshop(s). |
| Leadership / Read Only | Read-only visibility within the assigned scope. |

ASM and RSM are **separate roles**.

The descriptions above record intended purpose only. **The detailed role → permission matrix is not defined in this ADR.** Until it is finalized:

- The seed grants all permissions to Super Admin only.
- Other roles are created without detailed permission grants, or with grants explicitly approved in a later phase.
- `go_live.approve` is not assigned to any role other than Super Admin (ADR-002).

### Permission checks, not role names

Application code checks **permissions**, never role names.

```text
Correct:    can(user, 'go_live.approve', workshopId)
Incorrect:  if (user.role === 'ASM')
```

### Enforcement

Authorization is enforced in two layers:

1. **Server:** every Server Action / Route Handler calls a central `authorize()` before executing domain logic. UI hiding is not security.
2. **Database:** Row Level Security on workshop-scoped tables, using a `SECURITY DEFINER` SQL function such as `has_workshop_permission(workshop_id, permission)`. Application requests use the **user's session**, so RLS applies.

The service-role key is reserved for narrow, audited system operations. It is never exposed to the browser.

### Excluded for now

- Attribute-based policy engines (ABAC).
- Custom role creation through the UI.
- Field-level permissions.

## Consequences

- Permissions can be reassigned between roles through data changes only.
- Scope is enforced both in the application and in the database.
- Every protected operation must be written against a named permission.

## Deferred / Open

- Final role → permission matrix, including detailed SQM permissions (before Phase 2 for pilot roles).
- Default scope type for each role (before Phase 2).
- Go Live approver rule (before Pre-COB implementation).
- Authentication method (email/password, magic link, future SSO) (before Phase 2).

## Related

- PRD §11, §32
- Domain Model §6, §7
- Architecture §16, §17, §18
- ADR-002, ADR-004
