# Comply360 — Domain Model

| | |
|---|---|
| **Document Version** | 0.1 |
| **Status** | Draft / Foundation |
| **Last Updated** | September 2026 |

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
- Role
- Region
- State / geography (where applicable)
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
- HO Admin
- Regional Manager
- Area Service Manager
- Workshop Manager
- Auditor
- Leadership / Read Only

Role definitions should eventually be separated from users so that permissions can be managed independently.

---

## 8. Workshop

The Workshop is the central domain entity.

**Potential fields:**

- Workshop ID
- Organization ID
- Workshop Name
- Dealer Name
- Dealer Code
- Workshop Type
- Region
- State
- City
- Address
- Map Location
- ASM
- RM
- LOI Date
- Expected Go Live Date
- Actual Go Live Date
- Current Operational Status
- Current Lifecycle Stage
- Created At
- Created By
- Updated At
- Updated By

**Relationships:**

```text
Workshop
 ├── has many Lifecycle Events
 ├── has many Milestones
 ├── has many Audits
 ├── has many Compliance Updates
 ├── has many Assets
 ├── has many Technicians
 ├── has many Training Records
 ├── has many Expenses
 ├── has many Findings
 ├── has many CAPA records
 ├── has many Documents
 ├── has many Timeline Events
 └── has many Commercial Support records
```

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

Lifecycle represents the high-level state of a workshop.

**Initial conceptual states:**

- `LOI_ISSUED`
- `SITE_FINALIZED`
- `INFRASTRUCTURE`
- `BRANDING`
- `TOOLS_AND_SAFETY`
- `MANPOWER`
- `TRAINING`
- `READY_FOR_GO_LIVE`
- `OPERATIONAL`
- `SUSPENDED`
- `CLOSED`

A workshop may move between states according to configured business rules.

**Example:**

```text
READY_FOR_GO_LIVE
        ↓
   OPERATIONAL
        ↓
    SUSPENDED
        ↓
OPERATIONAL_AGAIN
```

The system must preserve every transition.

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
Previous:   READY_FOR_GO_LIVE
New:        OPERATIONAL
Changed By: ASM
Changed At: 2026-09-21
Reason:     Go Live approved
```

The event remains permanently available.

---

## 12. Milestone

Milestones represent Pre-COB readiness stages.

**Initial milestones:**

| Code | Milestone |
|---|---|
| M0 | Site Finalization |
| M1 | Infrastructure & Branding |
| M2 | Tools & Safety |
| M3 | Manpower |
| M4 | Training |
| M5 | Ready for Go Live |

**Potential fields:**

- Milestone ID
- Workshop ID
- Milestone Type
- Sequence
- Status
- Progress Percentage
- Start Date
- Target Date
- Completion Date
- Responsible User
- Remarks

Milestones may contain configurable checklist items/questions.

---

## 13. Milestone Requirement

A milestone may contain multiple requirements.

**Example — M2: Tools & Safety**

1. Two Post Lift available
2. Compressor available
3. PCAN available
4. Fire extinguishers available

**Potential fields:**

- Requirement ID
- Milestone ID
- Requirement Type
- Requirement Name
- Mandatory
- Status
- Owner
- Due Date
- Completed Date
- Evidence Required
- Remarks

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

Templates should be versioned.

A finalized audit should retain the template version used at the time of the audit.

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

Represents a configurable audit question or requirement.

**Potential fields:**

- Question ID
- Section ID
- Question Code
- Question Text
- Question Type
- Mandatory
- Score
- Weight
- Criticality
- Requires Photo
- Requires Document
- Applicable State
- Applicable Workshop Type
- Applicable Product
- Status

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

**Possible states:**

- `DRAFT`
- `SUBMITTED`
- `FINALIZED`
- `CORRECTED`
- `SUPERSEDED`

Historical finalized audits must be immutable.

---

## 19. Audit Response

Represents the answer to a question within a specific audit.

**Potential fields:**

- Response ID
- Audit ID
- Question ID
- Question Version
- Answer
- Score
- Applicable
- Criticality
- Remarks
- Evidence Requirement Status
- Created At

A response must belong to a specific audit.

The response should retain the relevant question/template version so historical audits remain understandable even after configuration changes.

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
- Item / Asset
- Previous State
- New State
- Updated By
- Updated At
- Reason
- Remarks
- Evidence

Compliance updates must never modify the original audit response.

---

## 22. Compliance State

The current compliance state represents the latest known status of an operational requirement.

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

- Technician ID
- Workshop ID
- Name
- Employee ID
- Designation
- Joining Date
- Employment Status
- Leaving Date
- Leaving Reason
- Current Salary
- Created At
- Updated At

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
- `OVERDUE`

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
- Document Type
- Uploaded By
- Uploaded At
- Related Entity
- Related Entity ID

**Examples:**

- LOI
- Workshop Layout
- Certificate
- Invoice
- Approval
- Training Certificate
- Audit Evidence

The physical file storage mechanism will be decided during architecture design.

---

## 35. Timeline Event

Represents an important event in the workshop's history.

**Potential fields:**

- Timeline Event ID
- Workshop ID
- Event Type
- Event Date
- Description
- Actor
- Related Entity
- Related Entity ID
- Created At

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

Timeline events should remain available permanently.

---

## 36. Relationships Overview

Conceptual relationships:

```text
Organization
    │
    ├── Regions
    │
    ├── Users
    │
    └── Workshops
          │
          ├── Lifecycle Events
          ├── Milestones
          │     └── Requirements
          │
          ├── Audits
          │     ├── Audit Template
          │     │     ├── Sections
          │     │     │     └── Questions
          │     │     └── Version
          │     │
          │     ├── Responses
          │     └── Evidence
          │
          ├── Compliance Updates
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
          ├── Documents
          │
          └── Timeline Events
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

If a correction is required, use:

- Correction record
- Versioning
- Superseding record
- Explicit reversal

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

Configuration can evolve over time and should be versioned where necessary.

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

**Potential future entity:** `AuditLog`

The final implementation may use a centralized audit-log mechanism rather than individual history tables for every entity, or a combination of both.

---

## 42. Evidence Association

Evidence must be context-aware.

An evidence record may relate to:

- Workshop
- Audit
- Audit Response
- Milestone
- Milestone Requirement
- Asset
- Compliance Update
- Finding
- CAPA
- Training
- Approval

This prevents documents/photos from becoming detached from their business context.

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

The following require architecture/design decisions:

- Exact database schema
- Primary key strategy
- UUID vs other identifiers
- Organization / tenant strategy
- Authentication provider
- Authorization implementation
- Audit template versioning implementation
- Question versioning implementation
- History-table vs event-log strategy
- File storage architecture
- Audit-log architecture
- Notification architecture
- Search architecture
- Reporting architecture
- Soft-delete policy
- Data retention policy
- Backup and recovery strategy

These decisions should be documented before implementation.

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
