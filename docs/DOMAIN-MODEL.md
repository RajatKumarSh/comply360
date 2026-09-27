# Comply360 — Domain Model

| | |
|---|---|
| **Document Version** | 0.2 |
| **Status** | Draft / Foundation |
| **Last Updated** | September 2026 |

Accepted architecture decisions that refine this model are recorded in [`docs/adr/`](adr/README.md). Where this document and an accepted ADR differ, the ADR applies.

---

## Contents

1. [Purpose](#1-purpose)
2. [Core Domain Principle](#2-core-domain-principle)
3. [Domain Entities](#3-domain-entities)
4. [Organization](#4-organization)
5. [Region](#5-region)
6. [User](#6-user)
7. [User Role](#7-user-role)
8. [Workshop](#8-workshop)
9. [Workshop Type](#9-workshop-type)
10. [Workshop Lifecycle](#10-workshop-lifecycle)
11. [Lifecycle Event](#11-lifecycle-event)
12. [Milestone](#12-milestone)
13. [Milestone Requirement](#13-milestone-requirement)
14. [Audit Template](#14-audit-template)
15. [Audit Section](#15-audit-section)
16. [Question](#16-question)
17. [Conditional Logic](#17-conditional-logic)
18. [Audit](#18-audit)
19. [Audit Response](#19-audit-response)
20. [Audit Evidence](#20-audit-evidence)
21. [Compliance Update](#21-compliance-update)
22. [Compliance State](#22-compliance-state)
23. [Asset](#23-asset)
24. [Asset History](#24-asset-history)
25. [Technician / Manpower](#25-technician--manpower)
26. [Employment History](#26-employment-history)
27. [Salary History](#27-salary-history)
28. [Training Requirement](#28-training-requirement)
29. [Training Record](#29-training-record)
30. [Expense](#30-expense)
31. [Commercial Support](#31-commercial-support)
32. [Finding](#32-finding)
33. [CAPA](#33-capa)
34. [Document](#34-document)
35. [Timeline Event](#35-timeline-event)
36. [Relationships Overview](#36-relationships-overview)
37. [Historical Data Model](#37-historical-data-model)
38. [Immutability Rules](#38-immutability-rules)
39. [Configuration vs Transaction Data](#39-configuration-vs-transaction-data)
40. [Versioning](#40-versioning)
41. [Audit Trail](#41-audit-trail)
42. [Evidence Association](#42-evidence-association)
43. [Current State Reconstruction](#43-current-state-reconstruction)
44. [Workshop History Reconstruction](#44-workshop-history-reconstruction)
45. [Data Integrity Principles](#45-data-integrity-principles)
46. [Future Extensibility](#46-future-extensibility)
47. [Domain Model Decisions Still Pending](#47-domain-model-decisions-still-pending)
48. [Domain Model Guiding Principle](#48-domain-model-guiding-principle)
49. [Requirement Catalogue](#49-requirement-catalogue)
50. [Go Live Approval](#50-go-live-approval)
51. [Role Assignment and Scope](#51-role-assignment-and-scope)
52. [Supporting Master Data](#52-supporting-master-data)

---

## 1. Purpose

This document defines the core business entities, relationships, lifecycle concepts, and historical-data rules for Comply360.

It is a business/domain model, not the final database schema.

The database schema may introduce additional technical entities such as:

- Join tables
- Version tables
- Audit logs
- Configuration tables
- Authentication tables
- File metadata tables
- Notification tables
- System metadata

The domain model should remain understandable from a business perspective.

---

## 2. Core Domain Principle

The central entity of Comply360 is the:

> **Workshop**

Most operational entities relate directly or indirectly to a Workshop.

Conceptually:

```text
                        ┌──────────────┐
                        │    Region    │
                        └──────┬───────┘
                               │
   ┌──────────────┐      ┌─────▼──────┐
   │    Users     │──────│  Workshop  │
   └──────────────┘      └─────┬──────┘
                               │
   ┌───────────┬───────────┬───┴───────┬─────────────┐
   ▼           ▼           ▼           ▼             ▼
Lifecycle  Milestones    Audits      Assets     Technicians
   │           │           │           │             │
   ▼           ▼           └─────┬─────┘             ▼
Timeline   Evidence              ▼                Training
                          Compliance Updates
```

```text
   ┌────────────────────────────────────────────────┐
   │                    Workshop                    │
   └────────────────────────────────────────────────┘
              │            │              │
              ▼            ▼              ▼
          Expenses     Findings      Commercial
                           │           Support
                           ▼
                         CAPA
```

---

## 3. Domain Entities

Initial core entities:

- Organization
- Region
- User
- Workshop
- Workshop Lifecycle
- Milestone
- Audit Template
- Audit Section
- Question
- Audit
- Audit Response
- Compliance Update
- Asset
- Technician / Manpower
- Training
- Training Requirement
- Expense
- Commercial Support
- Finding
- CAPA
- Document / Evidence
- Timeline Event
- Requirement (Requirement Catalogue)
- Go Live Approval
- Role Assignment / Scope
- Designation, Product, State

Additional technical entities may be introduced during architecture and database design.

---

## 4. Organization

Represents the organization/company operating Comply360.

**Potential fields:**

- Organization ID
- Organization Name
- Code
- Status
- Created At
- Updated At

The initial implementation may support a single organization while keeping the model extensible for future multi-company SaaS.

---

## 5. Region

Represents a geographical or operational region.

**Potential fields:**

- Region ID
- Organization ID
- Region Name
- Region Code
- Status

**Relationships:**

```text
Organization
    │
    └── has many Regions
```

---

## 6. User

Represents an authenticated Comply360 user.

**Potential fields:**

- User ID
- Name
- Email
- Phone (where required)
- Role assignments (role + scope; see §51)
- Status
- Created At
- Updated At

Users may interact with:

- Workshops
- Audits
- Milestones
- Approvals
- Compliance updates
- Findings
- CAPA
- Documents
- Configuration

Every important user action should be attributable to a user.

---

## 7. User Role

**Initial roles:**

- Super Admin
- Admin
- Service / Operations
- SQM
- ASM
- RSM
- Auditor
- Dealer / Workshop User
- Leadership / Read Only

ASM and RSM are separate roles.

SQM is initially oriented around workshop compliance management, WAR Score / audit improvement, action tracking and monitoring within the assigned scope. Detailed permissions are not yet defined.

Roles are separate from users. A role grants permissions; a user receives a role for a scope through a role assignment (§51). Application behaviour depends on permissions, not role names. See ADR-005.

---

## 8. Workshop

The Workshop is the central domain entity.

**Potential fields:**

- Workshop ID (internal UUID)
- Workshop Code (human-readable, e.g. `W-000123`)
- Organization ID
- Entry Path (`NEW` / `LEGACY`)
- Workshop Name
- Dealer Name
- Dealer Code
- Workshop Type
- Region
- State
- City
- Address
- Map Location
- ASM / RSM (via role assignments with workshop or geographic scope; see §51)
- LOI Date
- Expected Go Live Date
- Actual Go Live Date
- Current Lifecycle State (projection of the latest Lifecycle Event)
- Created At
- Created By
- Updated At
- Updated By

**Relationships:**

```text
Workshop
 ├── has many Lifecycle Events
 ├── has many Workshop Milestones
 ├── has many Audits
 ├── has many Compliance Updates
 ├── has many Assets
 ├── has many Technicians
 ├── has many Training Records
 ├── has many Expenses
 ├── has many Findings
 ├── has many CAPA records
 ├── has many Documents
 ├── has Timeline (view)
 ├── has many Commercial Support records
 ├── has many Workshop Requirements
 ├── has many Compliance States (one per applicable requirement)
 └── has many Go Live Approvals
```

**Rules:**

- Expected Go Live Date is stored independently. For `NEW` workshops it defaults to LOI Date + a configurable number of days (initially 90). Changes record previous value, new value, reason and user.
- LOI Date and Pre-COB dates may be empty only for `LEGACY` workshops.

---

## 9. Workshop Type

Workshop Type should be configurable.

**Initial examples:**

- COCO
- DODO
- Dark Store

The system should allow additional types without requiring code changes.

---

## 10. Workshop Lifecycle

Lifecycle represents the high-level state of a workshop:

**Workshop → Pre-COB → Go Live / COB → Post-COB**

**Initial lifecycle states:**

- `PRE_COB`
- `OPERATIONAL` (Post-COB)
- `SUSPENDED`
- `CLOSED`

```text
PRE_COB ──► OPERATIONAL ──► SUSPENDED ──► OPERATIONAL ──► ... ──► CLOSED
   │                                                                ▲
   └──────────── (withdrawn / cancelled before Go Live) ────────────┘
```

Readiness steps (site, infrastructure / CI, tools & safety, manpower / training) are **not** lifecycle states. They are tracked as milestone progress (§12).

Lifecycle states and permitted transitions are configuration data. Each transition may require a permission, a reason and evidence.

**Entry paths:**

| Entry Path | Meaning | Starting State |
|---|---|---|
| `NEW` | New workshop onboarded through Comply360 | `PRE_COB` |
| `LEGACY` | Existing operational workshop | `OPERATIONAL`, via a `LEGACY_ONBOARDED` lifecycle event |

For `LEGACY` workshops, Pre-COB history is recorded as unavailable rather than fabricated.

The system must preserve every transition. See ADR-001.

---

## 11. Lifecycle Event

A Lifecycle Event records a state transition.

**Potential fields:**

- Event ID
- Workshop ID
- Previous State
- New State
- Changed By
- Changed At
- Reason
- Comments
- Evidence Reference (where applicable)

**Example:**

```text
Workshop:   W-001
Previous:   PRE_COB
New:        OPERATIONAL
Changed By: (user holding the Go Live approval permission)
Changed At: 2026-09-21
Reason:     Go Live approved
```

Lifecycle events are append-only. The event remains permanently available. The workshop's current lifecycle state is the result of its latest lifecycle event.

---

## 12. Milestone

Milestones represent Pre-COB readiness stages. Milestones are configurable and versioned.

**Milestone Plan (configuration):**

A versioned set of milestone definitions. A plan may be scoped by workshop type.

**Milestone Definition (configuration):**

- Code
- Name
- Description
- Sequence
- Active

**Initial milestones (plan v1):**

| Code | Milestone |
|---|---|
| M0 | Site Finalization |
| M1 | Infrastructure / CI (CI = Corporate Identity / branding) |
| M2 | Tools & Safety Equipment |
| M3 | Manpower / Training |

There is no M4 or M5. "Ready for Go Live" is a gate (§50), not a milestone.

**Workshop Milestone (transaction):**

Created when a workshop enters `PRE_COB`, from the applicable milestone plan. The workshop keeps the plan version used.

- Workshop Milestone ID
- Workshop ID
- Milestone Definition
- Milestone Plan Version
- Status
- Readiness Percentage (calculated)
- Start Date
- Target Date
- Completion Date
- Responsible User
- Remarks

**Readiness (V1):**

```text
readiness % = completed applicable mandatory requirements
              ÷ total applicable mandatory requirements
              × 100
```

- Shown as N/A when there are no applicable mandatory requirements.
- Calculated per milestone and overall.
- The method is configurable to allow weighted scoring in future.
- Applicable Critical requirements that are not completed are **critical blockers**, reported separately from the percentage.

See ADR-002.

---

## 13. Milestone Requirement

Milestone requirements are drawn from the Requirement Catalogue (§49).

**Milestone Requirement (configuration):** links a milestone definition to a catalogue requirement, with sequence and an optional mandatory override.

**Workshop Requirement (transaction):** one per applicable requirement per workshop.

**Example — M2: Tools & Safety Equipment**

1. Two Post Lift available
2. Compressor available
3. PCAN available
4. Fire extinguishers available

**Potential Workshop Requirement fields:**

- Workshop Requirement ID
- Workshop ID
- Workshop Milestone ID
- Requirement (and revision)
- Mandatory
- Status
- Owner
- Due Date
- Completed Date
- Evidence
- Remarks

Workshop requirement status changes are recorded as append-only events.

---

## 14. Audit Template

Defines the structure of an audit.

**Examples:**

- Pre-COB Audit
- Post-COB Workshop Audit
- Workshop Health Audit
- Compliance Audit

**Potential fields:**

- Template ID
- Name
- Version
- Status
- Applicable Workshop Types
- Applicable States
- Applicable Products
- Created By
- Created At

Templates are versioned through **Audit Template Versions** with states `DRAFT → PUBLISHED → RETIRED`.

A published template version is frozen: its sections, questions, options, conditions, scores and weights cannot change. Changes require a new template version.

The template version is the unit of versioning. Questions are not versioned independently.

An audit retains the template version used at the time of the audit. See ADR-006.

---

## 15. Audit Section

Groups questions within an audit template.

**Examples:**

- Tools
- Safety
- Branding
- Manpower
- Customer Area
- Documentation
- Housekeeping
- Process Compliance

**Potential fields:**

- Section ID
- Template ID
- Name
- Description
- Sequence
- Weight
- Status

---

## 16. Question

Represents a configurable audit question within a template version.

**Potential fields:**

- Question ID
- Section ID
- Question Code
- Question Text
- Question Type
- Requirement (optional link to the Requirement Catalogue, §49)
- Requirement Revision (pinned when the template version is published)
- Mandatory
- Score
- Weight
- Criticality (defaults from the linked requirement; may be overridden; resolved and frozen at publish)
- Evidence rules, e.g. requires photo / document (default from the linked requirement; may be overridden; resolved and frozen at publish)
- Applicability rules (default from the linked requirement; multi-valued overrides for states, workshop types, products; resolved and frozen at publish)
- Status

**Publish-time resolution:** when an Audit Template Version is published, each requirement-linked question pins the specific Requirement Revision it uses, and its effective criticality, evidence rules and applicability rules are resolved and stored in the frozen template version. A later Requirement Revision never changes the interpretation of an already-published template version or of any historical audit.

When an audit starts, the frozen applicability rules are evaluated against the workshop's attributes, and the resulting set of applicable questions is stored with the audit.

**Possible question types:**

- Yes / No
- Single Select
- Multi Select
- Number
- Text
- Long Text
- Date
- Photo
- Document
- Percentage
- Currency
- Asset Selection
- Person Selection

The final list may evolve.

---

## 17. Conditional Logic

Questions may depend on previous responses.

**Example:**

```text
Question A: Is PCAN available?
   │
   ├── YES ──► Question B: Enter quantity.
   │              ↓
   │           Question C: Upload PCAN photograph.
   │
   └── NO ───► Question D: Enter reason.
                  ↓
               Question E: Expected availability date.
```

Conditional logic should be represented as configuration.

**Potential conceptual structure:**

```text
Condition
 ├── Source Question
 ├── Operator
 ├── Expected Value
 └── Action
```

**Possible operators:**

- Equals
- Not Equals
- Greater Than
- Less Than
- Contains
- Is Empty
- Is Not Empty

**Possible actions:**

- Show Question
- Hide Question
- Make Mandatory
- Make Optional
- Require Evidence
- Skip Section

---

## 18. Audit

An Audit represents a specific execution of an audit template against a workshop.

**Potential fields:**

- Audit ID
- Workshop ID
- Template ID
- Template Version
- Audit Type
- Auditor
- Started At
- Submitted At
- Finalized At
- Status
- Overall Score
- Category / Grade (where configured)
- Critical Findings Count
- Supersedes Audit ID (set when this audit corrects an earlier audit)

**States:**

- `DRAFT`
- `SUBMITTED`
- `FINALIZED`
- `SUPERSEDED`

```text
DRAFT → SUBMITTED → FINALIZED ──► SUPERSEDED (when a correcting audit is finalized)
```

Historical finalized audits must be immutable. A correction is a new audit that references the original through Supersedes Audit ID; the original is marked `SUPERSEDED` and remains unchanged otherwise.

Scores are calculated server-side at finalization and stored. Later scoring configuration changes do not recalculate historical audits.

WAR Score is an existing Comply360 business concept. Its formal definition, scoring method, criticality treatment and audit-result impact will be finalized during the Post-COB pilot phase. See ADR-006.

---

## 19. Audit Response

Represents the answer to a question within a specific audit.

**Potential fields:**

- Response ID
- Audit ID
- Question ID (within the audit's pinned template version)
- Answer
- Score
- Applicable
- Criticality
- Remarks
- Evidence Requirement Status
- Created At

A response must belong to a specific audit.

Because the audit pins a frozen template version, each response always refers to the exact question definition used at the time, so historical audits remain understandable after configuration changes.

Responses of a finalized audit cannot be updated or deleted.

---

## 20. Audit Evidence

Evidence may include:

- Photograph
- Video (where supported)
- Document
- Certificate
- Invoice
- Installation proof
- Purchase proof

Evidence should be linked to its context.

**Example:**

```text
Workshop
   ↓
Audit
   ↓
Response
   ↓
Evidence
```

The same evidence architecture should also support:

```text
Workshop              Workshop
   ↓                     ↓
Milestone           Compliance Update
   ↓                     ↓
Evidence              Evidence
```

---

## 21. Compliance Update

Represents a change to the current operational compliance state.

**Example:**

```text
Historical Audit:    Two Post Lift = Not Available
Compliance Update:   Two Post Lift = Installed
```

**Potential fields:**

- Compliance Update ID
- Workshop ID
- Requirement (from the Requirement Catalogue, §49)
- Related Asset (where applicable)
- Previous State
- New State
- Source (`AUDIT_BASELINE` / `MANUAL_UPDATE` / `ASSET_EVENT` / `LEGACY_BASELINE`)
- Updated By
- Updated At
- Reason
- Remarks
- Evidence

Compliance updates are append-only.

Compliance updates must never modify the original audit response.

When an asset linked to a requirement changes status, the compliance update is generated automatically in the same transaction, so the fact is entered once. The asset status → compliance status mapping is configuration and is not yet defined. See ADR-008.

---

## 22. Compliance State

The current compliance state represents the latest known status of an operational requirement.

There is one compliance state per **workshop × requirement**. It changes only through Compliance Updates (§21).

Compliance status values are not yet defined.

**Example:**

```text
Two Post Lift
Current State → AVAILABLE
```

Historical audits may show:

```text
01 Aug → NOT_AVAILABLE
```

while the current state shows:

```text
11 Aug → AVAILABLE
```

Both are valid simultaneously.

| Question | Source |
|---|---|
| What was true during the audit? | The finalized audit's responses |
| What is true now? | Compliance State |
| What was true on date X? | Compliance Update history |

---

## 23. Asset

Represents a physical or operational asset associated with a workshop.

**Examples:**

- Two Post Lift
- Compressor
- PCAN
- Charger
- NPI Kit
- Special Tools
- General Tools
- Fire Extinguisher
- Safety Equipment
- Branding Asset

**Potential fields:**

- Asset ID
- Workshop ID
- Asset Type
- Serial Number
- Quantity
- Status
- Purchase Date
- Installation Date
- Vendor
- Current Condition
- Created At
- Updated At

**Possible statuses:**

- `ORDERED`
- `DELIVERED`
- `INSTALLED`
- `MISSING`
- `DAMAGED`
- `UNDER_REPAIR`
- `REMOVED`

---

## 24. Asset History

Asset state changes must be historically recorded.

**Example:**

| Date | Status |
|---|---|
| 01 Aug | `ORDERED` |
| 05 Aug | `DELIVERED` |
| 11 Aug | `INSTALLED` |
| 25 Sep | `UNDER_REPAIR` |

The system must retain the complete history.

---

## 25. Technician / Manpower

Represents a person working at a workshop.

**Potential fields:**

- Technician / Person ID
- Workshop ID
- Name
- Employee ID
- Designation (current; derived from Employment History)
- Joining Date
- Employment Status
- Leaving Date
- Leaving Reason
- Created At
- Updated At

Designation is a workshop manpower attribute (for example Technician, Workshop Manager, Service Advisor). It is not a system authorization role.

Current designation and current salary are **not stored as editable columns** on this record. They are derived from Employment History (§26) and Salary History (§27), so changes never overwrite earlier values.

Although named "Technician" initially, the model should support other workshop manpower roles.

---

## 26. Employment History

Employment history preserves changes over time.

**Example:**

| Date | Event |
|---|---|
| 01 Jan | Technician joins |
| 01 Jul | Designation changes |
| 01 Sep | Salary changes |
| 15 Nov | Employee leaves |

The employee record must remain available after leaving.

---

## 27. Salary History

Salary should be modeled historically.

**Example:**

| Period | Salary |
|---|---|
| Jan–Jun | ₹30,000 |
| Jul onward | ₹35,000 |

Historical salary values must not change when the current salary changes.

---

## 28. Training Requirement

Defines which training is required for a particular designation or context.

**Potential fields:**

- Training Requirement ID
- Designation
- Training Type
- Required
- Applicable Product
- Applicable Workshop Type
- Validity Period
- Status

**Example:**

```text
Technician
 ├── Coulson Training
 └── Product Training

Workshop Manager
 ├── DMS
 └── Workshop Operations

Service Advisor
 ├── DMS
 └── Customer Handling
```

The actual mapping will be finalized separately.

---

## 29. Training Record

Represents an individual's training completion.

**Potential fields:**

- Training Record ID
- Person / Technician ID
- Training Type
- Batch
- Training Date
- Trainer
- Status
- Certificate
- Expiry Date
- Evidence
- Created At

**Possible statuses:**

- `NOT_STARTED`
- `NOMINATED`
- `SCHEDULED`
- `COMPLETED`
- `EXPIRED`

---

## 30. Expense

Represents workshop-level operational expenses.

**Potential fields:**

- Expense ID
- Workshop ID
- Expense Month
- Expense Category
- Amount
- Source
- Remarks
- Created By
- Created At

**Initial categories:**

- Rent
- Electricity
- Water / Utilities
- Miscellaneous
- Salary

---

## 31. Commercial Support

Represents financial or operational support provided to a workshop.

**Examples:**

- Manpower Support
- Salary Reimbursement
- 1% Service Margin
- Other configurable support

**Potential fields:**

- Support ID
- Workshop ID
- Support Type
- Amount / Percentage
- Start Date
- End Date
- Eligibility
- Status
- Approval
- Compliance Condition
- Created By
- Created At

Support history must be preserved.

---

## 32. Finding

Represents an issue identified during an audit or other operational process.

**Potential fields:**

- Finding ID
- Workshop ID
- Audit ID
- Severity
- Description
- Owner
- Due Date
- Status
- Evidence
- Created At
- Closed At

**Possible statuses:**

- `OPEN`
- `IN_PROGRESS`
- `PENDING_VERIFICATION`
- `CLOSED`

**Overdue** is calculated from Due Date and status (not closed and past due date in the organization's time zone). It is not stored as a status.

Finding creation rules (for example, automatic creation from critical or failed answers) are not yet defined.

---

## 33. CAPA

Corrective and Preventive Action record.

**Potential fields:**

- CAPA ID
- Finding ID
- Workshop ID
- Corrective Action
- Preventive Action
- Assigned To
- Due Date
- Status
- Evidence
- Verification
- Verified By
- Verified At
- Closure Date

CAPA must maintain its history.

---

## 34. Document

Represents a stored document or file reference.

**Potential fields:**

- Document ID
- Workshop ID
- File Name
- File Type
- Storage Reference
- File Size
- SHA-256 Hash
- Document Type
- Uploaded By
- Uploaded At

A document is connected to its business context through a **Document Link** (§42) using typed foreign keys, not a generic "related entity / related entity ID" reference.

Documents are never deleted. A replacement document supersedes the previous one.

**Examples:**

- LOI
- Workshop Layout
- Certificate
- Invoice
- Approval
- Training Certificate
- Audit Evidence

Files are stored in a private Supabase Storage bucket and served only through short-lived signed URLs after authorization. See ADR-009.

---

## 35. Timeline Event

Represents an important event in the workshop's history.

The consolidated workshop timeline is a **read model**: a SQL view that combines the append-only domain events (lifecycle events, compliance updates, workshop requirement events, asset events, employment events, Go Live approvals, audit finalizations, and similar). There is no separately written timeline table, so the timeline cannot drift from its source records. See ADR-007.

**Timeline entry fields (as exposed by the view):**

- Workshop ID
- Event Type
- Event Date
- Description
- Actor
- Source record (the originating domain event)

**Examples:**

- `LOI_ISSUED`
- `SITE_FINALIZED`
- `MILESTONE_COMPLETED`
- `TECHNICIAN_JOINED`
- `TRAINING_COMPLETED`
- `GO_LIVE_APPROVED`
- `WORKSHOP_OPERATIONAL`
- `AUDIT_COMPLETED`
- `ASSET_INSTALLED`
- `COMPLIANCE_UPDATED`
- `WORKSHOP_SUSPENDED`
- `WORKSHOP_REACTIVATED`
- `LEGACY_ONBOARDED`

Timeline events remain available permanently because their source domain events are append-only.

---

## 36. Relationships Overview

Conceptual relationships:

```text
Organization
    │
    ├── Regions ── States
    │
    ├── Users ── Role Assignments ── Roles ── Permissions
    │                  └── Scope (Organization / Region / State / Workshop)
    │
    ├── Configuration
    │     ├── Requirement Catalogue
    │     │     ├── Categories
    │     │     ├── Criticality
    │     │     ├── Evidence Rules
    │     │     ├── Applicability (Workshop Type / State / Product)
    │     │     └── Revisions
    │     ├── Milestone Plans ── Milestone Definitions ── Milestone Requirements
    │     ├── Audit Templates ── Template Versions ── Sections ── Questions
    │     └── Lifecycle States / Transitions
    │
    └── Workshops
          │
          ├── Lifecycle Events
          ├── Workshop Milestones
          │     └── Workshop Requirements
          ├── Go Live Approvals
          │
          ├── Audits (pinned to a Template Version)
          │     ├── Responses
          │     └── Evidence
          │
          ├── Compliance States (per Requirement)
          │     └── Compliance Updates
          │
          ├── Assets
          │     └── Asset History
          │
          ├── Manpower
          │     ├── Employment History
          │     ├── Salary History
          │     └── Training Records
          │
          ├── Expenses
          │
          ├── Findings
          │     └── CAPA
          │
          ├── Commercial Support
          │
          ├── Documents (via Document Links)
          │
          └── Timeline (view over domain events)
```

---

## 37. Historical Data Model

Comply360 must distinguish between:

### Current State

The latest known operational state.

**Examples:**

- Current Workshop Status
- Current Asset Status
- Current Compliance Status
- Current Employee Status
- Current Salary
- Current Training Status

### Historical State

What was true at a specific point in time.

**Examples:**

- Historical Audit Response
- Historical Asset Status
- Historical Employment
- Historical Salary
- Historical Lifecycle State
- Historical Compliance Update
- Historical Support

Historical records must remain reconstructable.

---

## 38. Immutability Rules

The following records should generally be immutable after finalization:

- Finalized Audit
- Audit Response
- Historical Lifecycle Event
- Historical Compliance Update
- Historical Asset Event
- Historical Employment Record
- Historical Salary Record
- Historical Training Record
- Closed CAPA
- Historical Commercial Support record
- Go Live Approval
- Workshop Requirement Event
- Published Audit Template Version

If a correction is required, use:

- Versioning
- Superseding record (for audits: a new audit that supersedes the original)
- Explicit reversal

Business records are not hard-deleted. See ADR-007.

> Do not silently overwrite history.

---

## 39. Configuration vs Transaction Data

The system contains two broad categories of data.

### Configuration Data

**Examples:**

- Audit templates
- Questions
- Sections
- Scoring rules
- Criticality
- Conditional logic
- Workshop types
- Asset types
- Training types
- Roles
- Permissions
- Commercial support rules
- Requirement Catalogue (requirements, categories, evidence rules, applicability)
- Milestone plans and definitions
- Lifecycle states and transitions
- Organization settings

Configuration can evolve over time and should be versioned where necessary.

Configuration is stored as data from the start. In V1 it is delivered through migrations and seed data; administration screens are built only when a delivery phase requires them.

### Transactional Data

**Examples:**

- Workshop records
- Audits
- Responses
- Compliance updates
- Asset events
- Employee records
- Training records
- Expenses
- Findings
- CAPA
- Approvals

Transactional history must be protected.

---

## 40. Versioning

Versioning is required where configuration changes could affect historical interpretation.

**Examples:**

- Audit Template v1
- Audit Template v2
- Audit Template v3

A historical audit must reference the version used when it was performed.

Changing a question later must not change the meaning of an old audit.

Versioned configuration:

| Configuration | Mechanism |
|---|---|
| Audit templates | Audit Template Version (frozen when published) |
| Pre-COB milestones | Milestone Plan version (pinned by each workshop) |
| Requirements | Requirement Revision |

---

## 41. Audit Trail

Important changes should generate audit trail information.

**At minimum:**

- Actor
- Action
- Entity
- Entity ID
- Previous Value
- New Value
- Timestamp
- Reason (where applicable)

The approach combines:

- **Append-only domain event tables** for operationally significant changes (lifecycle events, compliance updates, workshop requirement events, asset events, employment events, salary periods, Go Live approvals).
- A **trigger-based `AuditLog`** for changes to configuration and master data.

See ADR-007.

---

## 42. Evidence Association

Evidence must be context-aware.

An evidence record may relate to:

- Workshop
- Audit
- Audit Response
- Workshop Milestone
- Workshop Requirement
- Compliance Update
- Asset
- Asset Event
- Finding
- CAPA
- Training Record
- Go Live Approval

**Document Link** connects a Document to exactly one of these contexts using typed foreign keys. A database constraint requires exactly one context to be set. New contexts are added by migration. See ADR-009.

This prevents documents/photos from becoming detached from their business context and keeps referential integrity enforceable by the database.

---

## 43. Current State Reconstruction

The architecture should allow the current state of a workshop to be determined reliably.

For example:

```text
Workshop
 ├── Current Lifecycle
 ├── Current Compliance
 ├── Current Assets
 ├── Current Manpower
 ├── Current Training
 ├── Current Commercial Support
 └── Current CAPA
```

Current state should be derived from valid current records rather than from modifying historical records.

---

## 44. Workshop History Reconstruction

A workshop's history should be reconstructable from:

- Lifecycle events
- Audits
- Milestones
- Asset history
- Employment history
- Training history
- Compliance updates
- Findings
- CAPA
- Commercial support
- Timeline events

The system should allow users to understand what happened, when it happened, and who performed the action.

---

## 45. Data Integrity Principles

The eventual database should enforce:

- Foreign-key integrity
- Required relationships
- Unique identifiers
- Valid enum/status values where appropriate
- Appropriate uniqueness constraints
- Historical record integrity
- Tenant/organization isolation if multi-company support is introduced
- Permission-aware access

---

## 46. Future Extensibility

The domain model should allow future modules such as:

- Inventory
- Spare Parts
- Warranty
- Vendor Management
- DMS Integration
- ERP Integration
- Mobile Audits
- Offline Audits
- QR Codes
- GPS Validation
- Digital Signatures
- AI Insights
- Notifications
- Multi-company SaaS

Future functionality should extend the model without breaking historical records.

---

## 47. Domain Model Decisions Still Pending

**Resolved by accepted ADRs:**

| Decision | ADR |
|---|---|
| Primary key strategy / UUID vs other identifiers | ADR-010 |
| Organization / tenant strategy | ADR-010 |
| Authentication provider (Supabase Auth) | ADR-004 |
| Authorization implementation | ADR-005 |
| Audit template versioning implementation | ADR-006 |
| Question versioning implementation (template version is the unit) | ADR-006 |
| History-table vs event-log strategy | ADR-007 |
| Audit-log architecture | ADR-007 |
| Soft-delete policy (no hard deletes; deactivate / reverse / supersede) | ADR-007 |
| File storage architecture | ADR-009 |

**Still pending:**

- Exact database schema
- Authentication method (email/password, magic link, future SSO)
- Notification architecture
- Search architecture
- Reporting architecture
- Data retention policy
- Backup and recovery strategy

These decisions should be documented before the corresponding implementation.

---

## 48. Domain Model Guiding Principle

The database should model the business truth rather than the current Google Sheet structure.

Google Sheets and Google Forms are current workflow tools, not the target data model.

The Comply360 domain model should be designed around:

```text
Workshop
    ↓
Lifecycle
    ↓
Readiness / Operations
    ↓
Audit
    ↓
Compliance
    ↓
Assets / Manpower / Training
    ↓
Findings / CAPA
    ↓
Commercial Support
    ↓
History / Timeline
```

while preserving complete historical context.

---

## 49. Requirement Catalogue

A configurable catalogue of reusable requirements. Requirements are not embedded directly in audit forms or milestones. See ADR-003.

The same requirement (for example, Two Post Lift) may be used by a Pre-COB milestone, a Post-COB audit question, compliance state and the asset register.

### Requirement

- Requirement ID
- Organization ID
- Code (stable, unique per organization)
- Name
- Description
- Category
- Criticality
- Mandatory by default
- Linked Asset Type (optional)
- Status (`ACTIVE` / `INACTIVE`)

Requirements are never deleted. A requirement that no longer applies is made inactive.

### Requirement Category

Configurable lookup. Initial examples: Site, Infrastructure / CI, Tools, Safety, Manpower, Training, Documentation.

### Criticality

Configurable ranked lookup. Initial levels: Normal < Important < Critical.

### Requirement Evidence Rule

- Requirement
- Evidence Type (photo, document, certificate, ...)
- Minimum Count

### Requirement Applicability

Multi-valued scope rules by:

- Workshop Type
- State
- Product

An empty dimension means "applies to all".

### Requirement Revision

A change to the meaning of a requirement creates a new revision. Historical records reference the revision in force at the time.

### Relationships

```text
Requirement
 ├── Category
 ├── Criticality
 ├── Evidence Rules
 ├── Applicability
 ├── Revisions
 ├── Milestone Requirements ──► Milestone Definitions
 ├── Questions (optional link)
 ├── Workshop Requirements
 └── Compliance States / Compliance Updates
```

---

## 50. Go Live Approval

"Ready for Go Live" is a gate after the Pre-COB milestones, not a milestone.

**Potential fields:**

- Go Live Approval ID
- Workshop ID
- Decision
- User
- User Role at the time of the decision
- Decided At
- Comments
- Evidence

Go Live approvals are append-only. A later decision never overwrites an earlier decision.

Approving requires the Go Live approval permission within the workshop's scope. Which roles hold this permission is not yet assigned.

Critical blockers are shown at the gate. By default, approval is blocked while critical blockers remain open; whether an approver may override a critical blocker is not yet decided.

An approved decision creates the `PRE_COB → OPERATIONAL` lifecycle event. See ADR-002.

---

## 51. Role Assignment and Scope

```text
User → Role Assignment (Role + Scope + Validity) → Role → Permissions
```

### Permission

A resource + action pair. Initial actions: view, create, edit, audit, approve, configure, administer.

### Role Assignment

- User
- Role
- Scope Type (`ORGANIZATION` / `REGION` / `STATE` / `WORKSHOP`)
- Scope ID
- Valid From
- Valid To

A user may hold several role assignments. Assignments are ended (Valid To), not deleted, which preserves assignment history — for example, which ASM or RSM covered a workshop over time.

The detailed role → permission matrix is not yet defined. See ADR-005.

---

## 52. Supporting Master Data

| Entity | Purpose |
|---|---|
| State | Geographic state. Belongs to a Region. Used for scope and applicability (for example Delhi-specific requirements). |
| Product | Euler product. Used for product-specific applicability (for example NPI kits, product training). |
| Designation | Manpower designation. Used for designation-based training requirements and employment history. |
| Organization Settings | Organization-level configuration such as default Go Live days (initially 90), readiness method (V1: mandatory count), at-risk thresholds (not yet defined) and business time zone (initially Asia/Kolkata). |

Master data lists (regions, states, workshop types, products, designations) are delivered through seed data in V1. Development uses synthetic values.
