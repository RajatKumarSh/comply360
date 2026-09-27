# Comply360 — Product Requirements Document

**Document Version:** 0.2  
**Status:** Draft / Foundation  
**Product:** Comply360  
**Last Updated:** September 2026

Accepted architecture decisions are recorded in [`docs/adr/`](adr/README.md).

---

## 1. Product Overview

Comply360 is a scalable Workshop Lifecycle, Audit, Compliance, and Operations Management Platform.

The platform will manage a workshop from initial onboarding and pre-COB readiness through Go Live, operational audits, compliance tracking, manpower, training, assets, findings, CAPA, commercial support, and eventual suspension or closure.

The workshop is the central business entity.

Comply360 is intended to replace fragmented workflows currently handled through Google Forms, Google Sheets, manual trackers, documents, and disconnected reports.

The existing Google Form process will remain operational during development and testing. Comply360 will only become the production system after sufficient testing, validation, and pilot adoption.

---

# 2. Product Vision

Build a single source of truth for workshop lifecycle and operational compliance.

The system should allow authorized users to:

- Create and manage workshops.
- Track workshop lifecycle stages.
- Manage Pre-COB readiness.
- Manage Post-COB audits.
- Track compliance continuously after audits.
- Manage assets and their current status.
- Manage technicians and manpower history.
- Manage training requirements and completion.
- Track findings and CAPA.
- Manage documents and evidence.
- Track commercial support.
- View complete workshop history.
- Generate operational and leadership dashboards.
- Maintain immutable historical records.

The platform must be designed to scale as business processes evolve.

---

# 3. Core Principles

## 3.1 Workshop Is the Central Entity

Every major module should connect to the Workshop entity.

Examples:

- Audits belong to workshops.
- Assets belong to workshops.
- Technicians belong to workshops.
- Training records relate to workshop personnel.
- Expenses belong to workshops.
- Findings belong to workshops.
- CAPA belongs to findings/workshops.
- Commercial support belongs to workshops.
- Timeline events belong to workshops.

---

## 3.2 Never Delete History

Historical records must never be silently overwritten or deleted.

Examples:

- An old audit must remain unchanged.
- An asset being installed later must not change an old audit response.
- A technician leaving the workshop must not remove their historical employment record.
- A salary change must preserve the previous salary.
- A workshop suspension must remain visible in the lifecycle history.

The system should maintain both:

1. Current State
2. Historical State

---

## 3.3 Everything Important Should Be Auditable

Important changes should record:

- Who made the change.
- What changed.
- Previous value.
- New value.
- Date/time.
- Reason where applicable.
- Related entity/context.

---

## 3.4 Configuration Over Hardcoding

Business rules should not be hardcoded unnecessarily.

Authorized administrators should eventually be able to configure:

- Audit questions.
- Sections.
- Scores.
- Weights.
- Criticality.
- Mandatory requirements.
- Evidence requirements.
- Conditional logic.
- Applicable workshop types.
- Applicable states.
- Applicable products.
- Training requirements.
- Asset requirements.
- Thresholds.
- Lifecycle rules.
- Commercial support rules.

Adding a new business requirement should preferably require configuration rather than code changes.

---

# 4. Current Business Context

The current workshop management process uses a combination of:

- Google Forms.
- Google Sheets.
- Manual trackers.
- Documents.
- Dashboards.
- Operational follow-ups.

The current process should not be immediately replaced.

Comply360 will initially be developed in parallel.

The intended transition is:

Current Google Form / Sheet Process
                ↓
        Comply360 Development
                ↓
       Testing & Validation
                ↓
             Pilot
                ↓
       Production Adoption
                ↓
     Gradual Legacy Replacement

# 5. Workshop Lifecycle

The workshop lifecycle is:

Workshop → Pre-COB → Go Live / COB → Post-COB

The lifecycle is a small set of coarse states:

```text
PRE_COB ──► OPERATIONAL (Post-COB) ──► SUSPENDED ──► OPERATIONAL ──► ... ──► CLOSED
   │                                                                         ▲
   └──────────────── (withdrawn / cancelled before Go Live) ─────────────────┘
```

- PRE_COB: the workshop is progressing through readiness milestones (§9).
- OPERATIONAL: the workshop is live and subject to Post-COB audits and periodic compliance.
- SUSPENDED: COB has been withdrawn / called off.
- CLOSED: the workshop is closed.

Readiness steps (site, infrastructure / CI, tools & safety, manpower / training) are tracked as Pre-COB milestone progress, not as separate lifecycle states.

## 5.1 Entry Paths

A workshop enters Comply360 through one of two entry paths:

| Entry Path | Applies To | Starting State |
|---|---|---|
| New | New workshops onboarded through Comply360 | PRE_COB |
| Legacy | Existing operational workshops | OPERATIONAL (Post-COB) |

New workshops follow Pre-COB → Go Live / COB → Post-COB.

Legacy workshops enter directly into Post-COB compliance and audit. Their Pre-COB history is recorded as unavailable rather than fabricated (§37).

The exact lifecycle transitions should be configurable and governed by permissions.

Every lifecycle transition must be recorded historically.

See ADR-001.

# 6. Workshop Master

Each workshop should have a unique Workshop ID.

Initial Workshop Master fields include:

Workshop ID (internal)
Workshop Code (human-readable, e.g. W-000123)
Entry Path (New / Legacy)
Workshop Name
Dealer Name
Dealer Code
Workshop Type
Region
State
City
Address
Google Map Pin / Location
ASM / RSM (via role assignments, §32.1)
LOI Date
Expected Go Live Date
Actual Go Live Date
Current Lifecycle State
Created Date
Created By
Updated Date
Updated By

Additional fields may be added as requirements evolve.

Expected Go Live Date is stored independently. For new workshops it defaults to LOI Date + 90 days (a configurable organization setting) and may be edited according to business rules and permissions. Every change records the previous value, new value, reason and user.

LOI Date and Pre-COB dates may be empty only for Legacy workshops.

Current Lifecycle State is the workshop's single current lifecycle state (§5). It is the result of the latest recorded lifecycle transition, not a separately edited field.

# 7. Workshop Types

The system should support configurable workshop types.

Initial examples include:

COCO
DODO
Dark Store
Other configurable workshop types

The system should not assume that these are the only possible workshop types.

# 8. Pre-COB Workflow

Pre-COB is the workshop readiness process before operational Go Live.

Pre-COB applies to workshops on the New entry path (§5.1).

Existing operational workshops are onboarded on the Legacy entry path and enter directly into Post-COB. They are not forced through a construction/readiness workflow.

For a new workshop, the milestone workflow is initiated when the workshop enters Pre-COB.

# 9. Pre-COB Milestones

Pre-COB milestones are configurable and versioned. A workshop keeps the milestone plan version that applied when it entered Pre-COB.

Each milestone supports requirements, validation, evidence, status, ownership and readiness tracking. Milestone requirements come from the Requirement Catalogue (§13a).

The requirement examples below are illustrative. The complete Pre-COB requirement list will be defined separately (§43).

Initial milestone structure:

## M0 — Site Finalization

Possible requirements:

- Site finalized.
- Site information captured.
- Current-state site photographs.
- Required documents.
- Approval/evidence.

## M1 — Infrastructure / CI

CI means Corporate Identity / branding requirements.

Possible requirements:

- Workshop layout.
- Bays.
- Infrastructure.
- Electrical setup.
- Customer area.
- Parts area.
- Branding.
- CI compliance.
- Required photographs.
- Evidence.

## M2 — Tools & Safety Equipment

Possible requirements:

- Tools available.
- Safety equipment.
- Two Post Lift.
- Compressor.
- PCAN.
- Charger where applicable.
- NPI kit where applicable.
- Fire extinguishers.
- Other required equipment.

Evidence may include:

- Photographs.
- Purchase proof.
- Delivery proof.
- Installation proof.
- Documents.

## M3 — Manpower / Training

Possible manpower requirements:

- Required manpower defined.
- Technicians available.
- Workshop Manager availability.
- Service Advisor availability.
- Other required roles.
- Training readiness.

Example logic:

```text
Technician Available?
    ├── No → Record requirement / nomination / action
    └── Yes
          ↓
       Trained?
          ├── Yes → Continue
          └── No → Training workflow
```

Training to track:

- Required training.
- Training status.
- Training batch.
- Training date.
- Trainer.
- Certificate.
- Expiry where applicable.

"Ready for Go Live" is a gate, not a milestone. See §11.

See ADR-002.

# 10. Pre-COB Progress & Timeline

Pre-COB should provide a visual progress bar/timeline.

The system should track:

- LOI Date.
- Expected Go Live Date.
- Current Date.
- Elapsed Days since LOI.
- Remaining Days to Expected Go Live Date.
- Delay Days after Expected Go Live Date.
- At-Risk status.
- Milestone completion.
- Overall readiness percentage.

## 10.1 Target Date

The Expected Go Live Date is the operational target date.

LOI Date + 90 days may be used as the default expected calculation where applicable. The default number of days is a configurable setting.

The Expected Go Live Date is stored independently and may be edited according to business rules and permissions. Every change records the previous value, new value, reason and user (§6).

## 10.2 Readiness Calculation

Readiness is calculated from requirement data. It is not entered manually.

For V1:

```text
readiness % = completed applicable mandatory requirements
              ÷ total applicable mandatory requirements
              × 100
```

If there are no applicable mandatory requirements, readiness is shown as N/A rather than 100%.

Readiness is calculated per milestone and overall.

The calculation method is configurable so that weighted scoring can be introduced in future without changing previously calculated results.

## 10.3 Critical Blockers

An applicable Critical requirement that is not completed is a critical blocker.

Critical blockers are reported separately from the readiness percentage. They are not treated as additional points.

Critical blockers are surfaced at the Go Live gate (§11).

## 10.4 At-Risk Status

At-risk thresholds are configurable.

Threshold values have not yet been defined and remain an open configuration decision (§43).

See ADR-002.

# 11. Go Live Approval

"Ready for Go Live" is a gate that follows the Pre-COB milestones. It is not a milestone.

At the Go Live gate, the workshop should show:

- Overall readiness.
- Milestone progress.
- Pending requirements.
- Critical blockers.
- Evidence status.
- Expected Go Live Date.
- Delay/at-risk status.

Go Live approval is permission-based within the approver's authorized scope.

Which roles may approve Go Live is configurable. It must not be permanently hard-coded, and will be assigned when the permission matrix is finalized (§32, §43).

By default, Go Live approval is blocked while critical blockers remain open. Whether an authorized approver may override an open critical blocker is an open decision (§43).

An approved Go Live decision moves the workshop from Pre-COB to Operational (Post-COB).

A Go Live approval should record:

- Workshop.
- Decision.
- User.
- User Role at the time of the decision.
- Date/time.
- Comments.
- Evidence where required.
- Approval history.

Approval should not overwrite previous decisions.

See ADR-002 and ADR-005.

# 12. Post-COB Audit

Post-COB applies to operational workshops, including workshops onboarded on the Legacy entry path (§5.1).

Post-COB is the first pilot scope (§40a).

The audit should evaluate areas such as:

Bay marking.
Manpower.
Branding.
Tools.
Safety.
Documentation.
Customer area.
Process compliance.
Housekeeping.
Assets.
Training.
Other configured operational requirements.

Post-COB audits should be based on configurable templates.

# 13. Dynamic Audit Engine

The audit engine is a core component of Comply360.

Questions must not be permanently hardcoded into frontend code.

The system should support configurable:

Audit Templates.
Sections.
Questions.
Question Types.
Options.
Scores.
Weights.
Criticality.
Mandatory status.
Evidence requirements.
Photo requirements.
Document requirements.
Applicability.
Conditional logic.

Audit questions may reference a requirement from the Requirement Catalogue (§13a). Criticality, evidence rules and applicability default from the linked requirement and may be overridden on the question.

Audit templates are versioned. A published template version is frozen, and each audit keeps the template version it started with. See ADR-006.

# 13a. Requirement Catalogue

Requirements are maintained in a configurable Requirement Catalogue rather than embedded directly inside audit forms or milestones.

The same requirement (for example, Two Post Lift) may be used in a Pre-COB milestone, a Post-COB audit question, current compliance state and the asset register.

At minimum, each requirement relates to:

- Category.
- Milestone (where applicable).
- Criticality.
- Evidence requirement.
- Applicable workshop type / scope (for example state or product).
- Active / Inactive status.

Requirements are never deleted. A requirement that no longer applies is made inactive.

A change to the meaning of a requirement is recorded as a new revision. Historical records keep the revision that applied at the time.

The catalogue must support future changes to tools, equipment, CI, manpower, training and audit requirements without application-code changes.

In V1 the catalogue is maintained through controlled configuration data. A catalogue administration screen will be built only when a later phase requires it.

See ADR-003.

# 14. Conditional Questions

The audit engine must support conditional logic.

Example:

Is PCAN available?

YES
 ↓
Enter quantity
 ↓
Select condition
 ↓
Upload photograph

NO
 ↓
Enter reason
 ↓
Expected availability date
 ↓
Action / owner

Another example:

Is charger available?

YES → Continue

NO → Record reason/action

The charger requirement may be applicable only to Delhi-specific workshops.

Applicability should therefore be configurable rather than hardcoded.

# 15. Product / NPI Applicability

The system must support changing product requirements.

Example:

NPI Kit

may be required depending on the products currently included in Euler's portfolio.

If a new product is introduced, the system should allow new requirements to be configured.

Examples:

New NPI kit.
New training.
New special tool.
New safety requirement.
New diagnostic equipment.

The audit engine should support applicability based on:

Product.
State.
Workshop type.
Other configured criteria.

Applicability is defined on the requirement in the Requirement Catalogue (§13a) and may be overridden on an individual audit question.

# 16. Scoring Engine

Audit scoring should be configurable.

Possible configuration:

Question score.
Question weight.
Section weight.
Criticality.
Pass/fail requirement.
Overall threshold.
Category thresholds.
Critical finding rules.

The system should support future changes to scoring methodology without requiring major application rewrites.

Scores are calculated server-side when an audit is finalized and stored with the audit. Later scoring configuration changes do not recalculate historical audits.

## 16.1 WAR Score

WAR Score is an existing Comply360 business concept.

Its formal definition, scoring method, criticality treatment and audit-result impact will be finalized during the Post-COB pilot phase. The scoring engine must be able to accommodate it.

# 17. Criticality

Questions/items may have configurable criticality.

Examples:

Normal
Important
Critical

Critical requirements may affect:

Audit result.
Go Live eligibility.
Compliance status.
Commercial support eligibility.

The exact business rules must be configurable.

# 18. Compliance Management

Compliance is different from historical auditing.

Example:

Audit on 1 August:

Two Post Lift = Not Available

On 11 August:

Two Post Lift Installed

The historical audit must continue to show:

1 August → Not Available

The current compliance state should show:

Current → Available

The compliance update should record:

Item.
Previous status.
New status.
Evidence.
Updated By.
Date/time.
Comments.
Related asset where applicable.

Current compliance state is tracked per workshop per requirement (§13a).

Current compliance state changes only through timestamped compliance updates. Compliance updates may come from:

- A finalized audit (baseline).
- A manual update with reason and evidence.
- An asset status change for an asset-linked requirement.
- A legacy baseline for an existing workshop.

When an asset linked to a requirement changes status, the compliance update is created automatically so the same fact is not entered twice.

The system must be able to show what was true during an audit, what is true now, and what was true on a given date.

See ADR-008.

# 19. Reverse Compliance Scenario

If an item was available during an audit but is later removed:

Historical audit:

Available

Current state:

Unavailable

The historical audit must remain unchanged.

The system must therefore distinguish between:

Historical Audit Result

and

Current Compliance State

# 20. Asset Management

The system should support configurable asset types.

Initial examples:

Two Post Lift.
Compressor.
PCAN.
Charger.
NPI Kit.
Special Tools.
General Tools.
Fire Extinguishers.
Safety Equipment.
Branding Assets.

Asset status may include:

Ordered
Delivered
Installed
Missing
Damaged
Under Repair
Removed

Asset history must be preserved.

Each asset may contain:

Asset Type.
Workshop.
Quantity.
Serial Number where applicable.
Status.
Installation Date.
Purchase Date.
Vendor.
Evidence.
Photos.
Current condition.
History.

# 21. Technician & Manpower Management

Technicians and other manpower must be managed as historical records.

Initial fields may include:

Name.
Employee ID.
Designation.
Joining Date.
Salary.
Active/Inactive.
Leaving Date.
Leaving Reason.

When an employee leaves:

Active → Inactive

The employee record must not be deleted.

# 22. Salary History

Salary changes must preserve history.

Example:

Jan–Jun → ₹30,000
Jul–Dec → ₹35,000

The system must retain both salary periods.

Current salary should be calculated from the active/current record.

Historical expenses should not change because a salary is later updated.

# 23. Training Management

Training requirements should be designation-based and configurable.

Example:

Technician
    → Coulson Training
    → Product Training

Workshop Manager
    → DMS
    → Workshop Operations

Service Advisor
    → DMS
    → Customer Handling

The exact mapping will be provided separately.

The system should support:

Designation.
Training Type.
Required/Optional status.
Training Batch.
Training Date.
Trainer.
Completion Status.
Certificate.
Expiry Date.
Evidence.

The system should eventually support training reminders.

# 24. Workshop Expenses

Monthly workshop expenses should be tracked.

Initial categories:

Rent.
Electricity.
Water / Utilities.
Miscellaneous.
Salary Expense.

Salary expense should be calculated from active manpower records where possible.

Historical expense values must remain unchanged.

# 25. Future Workshop P&L

A future module may include:

Revenue.
Parts Revenue.
Labour Revenue.
Expenses.
Salary Cost.
Rent.
Utilities.
Other Costs.
Profit/Loss.
EBITDA.
Monthly Trends.

This is a future expansion and should not unnecessarily complicate the initial release.

# 26. Commercial Support

Some workshops may receive commercial support.

Examples:

Euler manpower support.
Salary reimbursement.
1% service margin/support.
Other configurable support types.

Commercial Support should track:

Support Type.
Workshop.
Eligibility.
Start Date.
End Date.
Amount / Percentage.
Status.
Approval.
Compliance Conditions.
Hold/Suspension.
History.

Eligibility rules should be configurable.

Non-compliance may result in support being held or suspended according to configured business rules.

# 27. Findings & CAPA

Audit findings should support:

Finding.
Severity.
Description.
Owner.
Due Date.
Status.
Evidence.

CAPA should support:

Corrective Action.
Preventive Action.
Assigned To.
Due Date.
Status.
Evidence.
Verification.
Closure Date.
Closure By.

Historical finding and CAPA information must remain available.

# 28. Documents & Evidence

Documents and evidence should be linked to the appropriate context.

Possible documents:

LOI.
Workshop Layout.
Certificates.
Invoices.
Approvals.
Training Certificates.
Audit Evidence.
Photographs.
Installation Proof.
Purchase Proof.

Every important evidence record should capture:

Workshop.
Context.
File.
Uploaded By.
Upload Date/Time.
Related Audit/Milestone/Question/Compliance Update where applicable.
# 29. Workshop Timeline

Each workshop should have a permanent digital timeline.

Example events:

LOI Issued
↓
Site Finalized
↓
Infrastructure Started
↓
Technician Joined
↓
Training Completed
↓
Go Live Approved
↓
Workshop Operational
↓
Audit Completed
↓
Asset Installed
↓
Compliance Updated
↓
COB Suspended
↓
Operational Again

Timeline events must not be silently deleted.

# 30. Dashboards

Comply360 should provide role-appropriate dashboards.

## 30.1 Pre-COB Dashboard

Possible KPIs:

Total Pre-COB Workshops.
Under Construction.
Ready for Go Live.
Delayed Workshops.
At-Risk Workshops.
Average Readiness.
Upcoming Go Live.
Pending Milestones.
Critical Blockers.

## 30.2 Post-COB Dashboard

Possible KPIs:

Total Operational Workshops.
Compliance Score.
Critical Findings.
Open CAPA.
Overdue CAPA.
Training Compliance.
Asset Compliance.
Suspended Workshops.
Workshops Requiring Attention.

## 30.3 Leadership Dashboard

Possible KPIs:

Total Workshops.
Operational Workshops.
Pre-COB WIP.
Delayed Workshops.
Average Readiness.
Compliance Score.
Critical Findings.
CAPA.
Training Compliance.
Commercial Support.
Future P&L.

# 31. Reports

Initial report categories:

Pre-COB Report.
Post-COB Audit Report.
Compliance Report.
Asset Report.
Training Report.
Workshop Summary.
Monthly Dashboard.
Workshop History.
CAPA Report.
Commercial Support Report.

Report formats and exact layouts will be defined separately.

# 32. User Roles

Authorization uses role-based access control with organizational/data scope:

```text
User → Role → Scope → permitted data/actions
```

In more detail:

```text
User → Role Assignment (Role + Scope + Validity) → Role → Permissions
```

Initial roles:

- Super Admin.
- Admin.
- Service / Operations.
- SQM.
- ASM.
- RSM.
- Auditor.
- Dealer / Workshop User.
- Leadership / Read Only.

ASM and RSM are separate roles.

SQM is initially oriented around workshop compliance management, WAR Score / audit improvement, action tracking and monitoring within the user's assigned scope. Detailed SQM permissions will be defined in the permission matrix.

## 32.1 Scope

A role is assigned to a user for a scope:

- Organization.
- Region.
- State.
- Workshop.

Users may only access the workshops and data within their authorized scope. Scope must be enforced server-side and at database level.

A user may hold more than one role assignment. Role assignments are ended rather than deleted, so assignment history (for example, which ASM or RSM covered a workshop) is preserved.

## 32.2 Permissions

Permissions are assigned to roles as configuration. Application behaviour must depend on permissions, not on role names.

Initial permission actions:

- View.
- Create.
- Edit.
- Audit.
- Approve.
- Configure.
- Administer.

The final permission matrix may add further actions, such as Export, Upload, Close, Reopen, Manage users and Manage master data.

The final role → permission matrix is an open question (§43). Until it is finalized, only Super Admin holds broad permissions, and approval permissions (including Go Live approval) are not assigned to any other role.

See ADR-005.

# 33. Master Data & Configuration

Authorized administrators should eventually be able to manage:

- Requirement Catalogue.
- Requirement Categories.
- Criticality Levels.
- Questions.
- Audit Templates.
- Sections.
- Scoring.
- Conditional Logic.
- Milestone Plans / Milestones.
- Training Types.
- Designations.
- Designation/Training Mapping.
- Asset Types.
- Products.
- Workshop Types.
- Regions.
- States.
- Dashboard Thresholds.
- Lifecycle States and Transitions.
- Roles.
- Permissions.
- Commercial Support Rules.
- Organization Settings (for example default Go Live days, readiness method, time zone).

Configuration is stored as data from the start. In V1, configuration is delivered through controlled database migrations and seed data. Administration screens are built only when a delivery phase requires them (§40a).

# 34. Security Requirements

The application must follow secure development practices.

Never commit:

Passwords.
API Keys.
Authentication Tokens.
Service Role Keys.
Database Credentials.
Private Company Data.
Production Secrets.

Secrets must be stored using appropriate environment/configuration mechanisms.

Development should initially use synthetic or non-sensitive data.

# 35. Data Integrity

The database must enforce important business constraints wherever practical.

Examples:

Unique Workshop ID.
Valid foreign-key relationships.
Valid lifecycle states.
Valid audit references.
Valid user relationships.
Required fields.
Appropriate uniqueness constraints.

Business rules should not rely solely on frontend validation.

# 36. Audit History Integrity

Historical audits are immutable after finalization.

If a correction is required, the system must use an explicit correction mechanism rather than silently changing the historical record.

Audit states:

- Draft.
- Submitted.
- Finalized.
- Superseded.

A correction is made by creating a new audit that supersedes the original. The original audit is marked Superseded and remains available unchanged.

Who may finalize and who may supersede an audit will be defined in the permission matrix (§43).

See ADR-006.

# 37. Existing Workshop Data

The current live estate contains existing workshops.

Some existing workshops may not have historical Pre-COB data available.

The system must not fabricate historical data.

Existing operational workshops are onboarded on the Legacy entry path (§5.1). They enter directly into Post-COB compliance and audit, and are the initial pilot scope (§40a).

For legacy workshops, Comply360 may support:

- Current State Baseline.
- Legacy Migration Record.
- Current Compliance State.
- Existing Audit History where available.

Missing historical information should be explicitly represented as unavailable rather than invented.

The required fields for a legacy workshop are an open question (§43).

# 38. Future Features

Potential future capabilities include:

Mobile Application.
Offline Audits.
QR Codes.
GPS Validation.
Digital Signatures.
AI Insights.
OCR.
Push Notifications.
Vendor Management.
Inventory Management.
Spare Parts.
Warranty.
DMS Integration.
ERP Integration.
Multi-company SaaS.
Advanced Analytics.

These are intentionally outside the initial scope unless prioritized later.

# 39. Initial Technical Direction

The initial technical architecture uses:

- Next.js.
- TypeScript.
- PostgreSQL.
- Supabase (database, authentication, storage).
- Supabase CLI with SQL migrations as the database source of truth.
- Generated TypeScript database types.
- Tailwind CSS.
- shadcn/ui.
- Zod.
- React Hook Form.
- Apache ECharts.
- GitHub.
- Vercel.

No ORM is used at this stage.

Accepted architecture decisions are recorded in `docs/adr/`:

- Database architecture and data access: ADR-004.
- Authorization: ADR-005.
- Audit versioning and immutability: ADR-006.
- History and audit trail: ADR-007.
- File storage: ADR-009.
- Identifiers and tenancy: ADR-010.

Still to be confirmed during implementation:

- Authentication method.
- Application structure.
- Deployment.
- Testing.
- Environment management.

# 40. Development Strategy

Development should happen incrementally.

The project should use vertical slices rather than building every frontend screen first and backend later.

Each feature should ideally include:

Data model.
Database constraints.
Backend logic.
Validation.
Authorization.
UI.
Error handling.
Audit/history handling.
Tests.
Documentation.

# 40a. Pilot Scope

The pilot starts with Post-COB.

- Existing operational workshops are onboarded on the Legacy entry path and enter directly into Post-COB compliance and audit.
- New workshops follow Pre-COB → Go Live / COB → Post-COB. Pre-COB is designed now and implemented after the Post-COB pilot.

This allows the pilot to address the existing workshop estate immediately while preserving the full lifecycle architecture for new workshops.

The architecture supports configurability, but implementation remains incremental. The complete configuration/administration engine is not built during the foundation phases. Pilot configuration (for example the Post-COB template and requirement catalogue) is delivered through controlled seed data.

# 41. Quality Standard

Comply360 should be treated as a serious production-oriented software project.

Quality expectations include:

Maintainable code.
Strong typing.
Reusable components.
Clear architecture.
Server-side validation.
Database integrity.
Role-based authorization.
Error handling.
Historical data integrity.
Automated tests.
Documentation.
Secure secret management.
Good UX.
Responsive UI.
Accessible UI where practical.

# 42. AI Development Principles

AI coding tools may be used to accelerate development.

However:

AI must not invent business rules.
AI must not silently change requirements.
AI must not delete historical logic.
AI must not expose secrets.
AI must not introduce unnecessary complexity.
AI-generated code must be reviewed.
Significant architectural decisions must be documented.
Ambiguous business requirements should be clarified before implementation.

The project owner retains control of:

GitHub.
Source code.
Database.
Deployment.
Credentials.
Architecture.
Product requirements.

# 43. Open Questions

The following requirements still need confirmation:

- Final role → permission matrix, including detailed SQM permissions.
- Default scope type for each role.
- Authentication method.
- Complete workshop roles.
- Complete designation list.
- Manpower-to-training mapping.
- Complete workshop types.
- Complete Pre-COB checklist / requirement list per milestone.
- Complete Post-COB checklist.
- WAR Score formal definition, scoring method, criticality treatment and audit-result impact (to be finalized during the Post-COB pilot phase).
- Final scoring methodology.
- Criticality rules and their effect on audit results.
- Finding creation rules.
- Who may finalize and who may supersede an audit.
- Can a Submitted audit be edited or returned to Draft, and by whom?
- Required fields for legacy workshops.
- Compliance status values.
- Asset status → compliance status mapping.
- Go Live approver rule (which roles hold Go Live approval permission).
- Whether an authorized approver may override an open critical blocker.
- At-risk threshold values.
- Whether evidence must be complete before a requirement can be marked completed.
- Lifecycle transition rules (reason/evidence requirements per transition, suspension and re-approval rules).
- Final report formats.
- Commercial support eligibility rules.
- Exact CAPA workflow.
- Exact asset master.
- Exact expense categories.
- Notification requirements.
- Document retention requirements.
- Final dashboard KPI definitions.

These must be finalized before the corresponding functionality is treated as complete.

# 44. Definition of Done

A feature should not be considered complete merely because the UI works.

A feature is considered complete when:

Requirements are documented.
Data model is appropriate.
Database constraints exist where required.
Backend validation exists.
Authorization is implemented.
UI is functional.
Error states are handled.
Historical integrity is preserved.
Tests exist where appropriate.
Documentation is updated.
Code passes project checks.
Changes are committed to Git.

# 45. Current Project Status

Current status:

```text
Project Repository       ✅
GitHub                   ✅
Git Configuration        ✅
Initial Documentation    ✅
CLAUDE.md                ✅
README.md                ✅
PRD                      🟡 Draft v0.2
Domain Model             🟡 Draft v0.2
Architecture Document    🟡 Draft v0.2
ADRs 001–010             ✅ Accepted
Permission Matrix        ⏳
Audit Engine Spec        ⏳
Database Schema          ⏳
Application              ⏳ (Next.js scaffold only)
Testing                  ⏳
Pilot (Post-COB)         ⏳
Production               ⏳
```

# 46. Product Goal

The long-term goal is to create a reliable, configurable, scalable Workshop Lifecycle and Compliance platform that can replace fragmented manual workflows while preserving complete operational history and providing a single source of truth for workshop operations.
