# Comply360 — Product Requirements Document

**Document Version:** 0.1  
**Status:** Draft / Foundation  
**Product:** Comply360  
**Last Updated:** September 2026

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

     LOI Issued
    ↓
Site Finalized
    ↓
Infrastructure
    ↓
Branding
    ↓
Tools & Safety
    ↓
Manpower
    ↓
Training
    ↓
Ready for Go Live
    ↓
Operational
    ↓
Periodic Compliance
    ↓
Suspended / COB Called Off
    ↓
Operational Again
    ↓
Closed

The exact lifecycle transitions should be configurable and governed by permissions.

Every lifecycle transition must be recorded historically.

# 6. Workshop Master

Each workshop should have a unique Workshop ID.

Initial Workshop Master fields include:

Workshop ID
Workshop Name
Dealer Name
Dealer Code
Workshop Type
Region
State
City
Address
Google Map Pin / Location
ASM
RM
LOI Date
Expected Go Live Date
Actual Go Live Date
Operational Status
Current Lifecycle Stage
Created Date
Created By
Updated Date
Updated By

Additional fields may be added as requirements evolve.

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

When a workshop is selected for Pre-COB, the auditor/user should record its operational status.

If the workshop is already operational, the system should not force the user through an inappropriate construction/readiness workflow.

If the workshop is not operational, the milestone workflow should be initiated.

# 9. Pre-COB Milestones

Initial milestone structure:

M0 — Site Finalization

Possible requirements:

Site finalized.
Site information captured.
Current-state site photographs.
Required documents.
Approval/evidence.
M1 — Infrastructure & Branding

Possible requirements:

Workshop layout.
Bays.
Infrastructure.
Electrical setup.
Customer area.
Parts area.
Branding.
CI compliance.
Required photographs.
Evidence.
M2 — Tools & Safety

Possible requirements:

Tools available.
Safety equipment.
Two Post Lift.
Compressor.
PCAN.
Charger where applicable.
NPI kit where applicable.
Fire extinguishers.
Other required equipment.

Evidence may include:

Photographs.
Purchase proof.
Delivery proof.
Installation proof.
Documents.
M3 — Manpower

Possible requirements:

Required manpower defined.
Technicians available.
Workshop Manager availability.
Service Advisor availability.
Other required roles.
Training readiness.

Example logic:

Technician Available?
    ├── No → Record requirement / nomination / action
    └── Yes
          ↓
       Trained?
          ├── Yes → Continue
          └── No → Training workflow
M4 — Training

Track:

Required training.
Training status.
Training batch.
Training date.
Trainer.
Certificate.
Expiry where applicable.
M5 — Ready for Go Live

Final readiness should be calculated from configured requirements.

The workshop should have:

Overall readiness.
Milestone progress.
Pending requirements.
Critical blockers.
Evidence status.
Target Go Live date.
Delay/at-risk status.

# 10. Pre-COB Progress & Timeline

Pre-COB should provide a visual progress bar/timeline.

The system should track:

LOI Date.
Target Go Live Date.
Current Date.
Elapsed Days.
Remaining Days.
Delay Days.
At-Risk status.
Milestone completion.
Overall readiness percentage.

The system should support an LOI-to-90-day view.

The exact threshold rules should be configurable.

# 11. Go Live Approval

ASM and/or RM can approve Go Live according to configured business rules.

A Go Live approval should record:

Workshop.
Decision.
User.
User Role.
Date/time.
Comments.
Evidence where required.
Approval history.

Approval should not overwrite previous decisions.

# 12. Post-COB Audit

Post-COB applies to operational workshops.

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

Initial roles:

Super Admin.
HO Admin.
Regional Manager.
Area Service Manager.
Workshop Manager.
Auditor.
Leadership / Read Only.

The final permission matrix will define:

View.
Create.
Edit.
Approve.
Configure.
Export.
Upload.
Close.
Reopen.
Manage users.
Manage master data.

Permissions should be role-based and preferably configurable.

# 33. Master Data & Configuration

Authorized administrators should eventually be able to manage:

Questions.
Audit Templates.
Sections.
Scoring.
Criticality.
Conditional Logic.
Milestones.
Training Types.
Designations.
Designation/Training Mapping.
Asset Types.
Workshop Types.
Regions.
States.
Dashboard Thresholds.
Lifecycle Rules.
Roles.
Permissions.
Commercial Support Rules.
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

Historical audits should be immutable after final submission.

If a correction is required, the system should use an explicit correction/version mechanism rather than silently changing the historical record.

The system should clearly distinguish:

Draft
Submitted
Finalized
Corrected / Superseded

The exact correction workflow will be defined later.

# 37. Existing Workshop Data

The current live estate contains existing workshops.

Some existing workshops may not have historical Pre-COB data available.

The system must not fabricate historical data.

For legacy workshops, Comply360 may support:

Current State Baseline.
Legacy Migration Record.
Current Compliance State.
Existing Audit History where available.

Missing historical information should be explicitly represented as unavailable rather than invented.

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

The initial technical architecture is expected to use:

Next.js.
TypeScript.
PostgreSQL.
Supabase.
Tailwind CSS.
shadcn/ui.
Zod.
React Hook Form.
Apache ECharts.
GitHub.
Vercel.

This is an initial direction, not a final architectural decision.

Architecture review should confirm:

Database architecture.
Authentication.
Authorization.
ORM/data access approach.
File storage.
Application structure.
Deployment.
Testing.
Environment management.

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

Complete workshop roles.
Complete designation list.
Manpower-to-training mapping.
Complete workshop types.
Complete Pre-COB checklist.
Complete Post-COB checklist.
Final scoring methodology.
Criticality rules.
Critical blocker rules.
Final user permission matrix.
Final report formats.
Complete lifecycle approval process.
Commercial support eligibility rules.
Exact CAPA workflow.
Exact asset master.
Exact expense categories.
Notification requirements.
Document retention requirements.
Audit correction/versioning rules.
Final dashboard KPI definitions.

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

Project Repository       ✅
GitHub                   ✅
Git Configuration        ✅
Initial Documentation    ✅
CLAUDE.md                ✅
README.md                ✅
PRD                      🟡 Foundation
Domain Model             ⏳
Architecture Decision    ⏳
Permission Matrix        ⏳
Audit Engine Spec        ⏳
Database Schema          ⏳
Application              ⏳
Testing                  ⏳
Pilot                    ⏳
Production               ⏳

# 46. Product Goal

The long-term goal is to create a reliable, configurable, scalable Workshop Lifecycle and Compliance platform that can replace fragmented manual workflows while preserving complete operational history and providing a single source of truth for workshop operations.


### Step 4 — Save

After pasting:

**Press `Ctrl + S`**

That's it for now.

**Do not run Git commands yet. Do not ask Claude Code to modify anything yet.**

Once you've pasted and saved it, tell me:

> **PRD pasted and saved**

Then we'll verify the file and make our **first documentation commit** properly.