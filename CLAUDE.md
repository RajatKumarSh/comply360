# Comply360 - Claude Code Instructions

## Project

Comply360 is a Workshop Lifecycle, Audit, Compliance & Operations Management Platform.

The system is being designed as a scalable, maintainable product rather than a temporary prototype.

---

# 1. Core Business Principles

## Workshop is the central entity

Almost all operational entities relate to a Workshop.

Examples:

- Audits
- Compliance
- Assets
- Technicians
- Training
- Expenses
- Findings
- CAPA
- Documents
- Commercial Support
- Timeline Events

---

# 2. Historical Data

Historical information must never be silently overwritten or deleted.

Audits are immutable snapshots.

If an audit records:

Two Post Lift = Not Available

and the lift is installed later:

- Do not modify the original audit.
- Create a Compliance Update.
- Update the current compliance state.
- Record who made the update.
- Record when it happened.
- Record evidence where applicable.
- Preserve the original audit permanently.

The same principle applies to:

- Assets
- Technicians
- Salary
- Training
- Workshop lifecycle
- COB status
- Commercial support

---

# 3. Dynamic Audit Engine

Audit questions must NOT be hardcoded into frontend components.

The system should support configurable:

- Audit templates
- Sections
- Questions
- Question types
- Options
- Scores
- Weights
- Criticality
- Mandatory status
- Evidence requirements
- Conditional logic
- Workshop applicability
- State-specific applicability
- Product-specific applicability

Example:

A charger requirement may apply only to Delhi workshops.

A future Euler product may introduce new training or asset requirements.

These should be configurable wherever practical.

---

# 4. Conditional Logic

The audit engine must support conditional questions.

Example:

IF:

PCAN available = YES

THEN show:

- Quantity
- Condition
- Photo

IF:

PCAN available = NO

THEN show:

- Reason
- Expected availability
- Corrective action

Do not implement business-specific conditions directly inside UI components when they can be represented as configuration/data.

---

# 5. Pre-COB

A non-operational workshop follows the Pre-COB readiness process.

Current milestones:

M0 - Site Finalization

M1 - Infrastructure & Branding

M2 - Tools & Safety

M3 - Manpower

M4 - Training

M5 - Ready for Go Live

The system should calculate:

- Milestone progress
- Overall readiness
- Days elapsed since LOI
- Days remaining
- Delay
- At-risk status

The target lifecycle is generally tracked against the LOI-to-Go-Live timeline.

---

# 6. Go Live

ASM/RM approval is currently part of the business process.

Approval must record:

- User
- Role
- Date/time
- Decision
- Comments
- Relevant evidence

Do not assume that approval rules are permanently fixed. Design them so they can become configurable.

---

# 7. Post-COB

Operational workshops can undergo Post-COB audits.

Post-COB supports:

- Conditional questions
- Evidence
- Photos
- Scoring
- Criticality
- Findings
- CAPA

---

# 8. Compliance

Compliance updates must be separate from historical audits.

The system must support:

Historical state:

"What was true during the audit?"

Current state:

"What is true now?"

Both must be available.

---

# 9. Technician & Manpower

Technicians/employees must not be deleted when they leave.

Use employment/status history.

Track:

- Name
- Employee ID
- Designation
- Joining date
- Salary
- Active/inactive status
- Leaving date
- Leaving reason

Salary changes should preserve salary history.

---

# 10. Training

Training requirements can differ by designation.

Do not assume all manpower requires the same training.

The system should support configurable relationships:

Designation -> Required Training

Examples may include:

Technician -> Coulson / Product Training

Workshop Manager -> DMS / Workshop Operations

Service Advisor -> DMS / Customer Handling

Actual training requirements will be defined later.

---

# 11. Assets

Assets may include:

- Two Post Lift
- Compressor
- PCAN
- Charger
- NPI Kit
- Special Tools
- General Tools
- Fire Extinguishers
- Safety Equipment
- Branding Assets

Some requirements may be:

- State-specific
- Product-specific
- Workshop-type-specific

Assets require current state and historical state.

---

# 12. Commercial Support

Workshops may receive different forms of support, including:

- Euler manpower
- Salary reimbursement
- 1% Service Margin Support

Support eligibility may depend on compliance.

Do not hardcode commercial eligibility rules unless explicitly specified.

---

# 13. COB Lifecycle

A workshop may become operational and later have COB withdrawn/suspended because of repeated non-compliance.

The system must preserve:

- Original operational date
- Suspension date
- Reason
- Relevant findings
- Compliance restoration
- Re-approval
- Re-operational date

Never erase the previous operational history.

---

# 14. Audit Trail

Important changes should record:

- Who
- What
- When
- Previous value
- New value
- Reason where applicable

Nothing important should happen silently.

---

# 15. Security

Never commit:

- Passwords
- API keys
- Access tokens
- Service-role keys
- Database credentials
- Private company data

Environment variables must be used for secrets.

Do not use real Euler/customer/employee data during development unless explicitly authorized.

Use synthetic data for development and testing.

---

# 16. Development Principles

Prefer:

- TypeScript
- Strong typing
- Reusable components
- Modular architecture
- Server-side validation
- Database constraints
- Automated tests
- Clear error handling
- Small focused changes
- Documentation

Avoid:

- Hardcoded business rules
- Duplicated logic
- Giant components
- Unnecessary dependencies
- Temporary hacks presented as final architecture
- Destructive database changes
- Silent data loss

---

# 17. Before Implementing Features

Before implementing a significant feature:

1. Read relevant documentation.
2. Identify affected entities.
3. Identify business rules.
4. Consider historical/audit implications.
5. Consider permissions.
6. Consider validation.
7. Consider testing.
8. Implement the smallest maintainable solution.
9. Run tests/type checking/linting.
10. Explain changes made.

If a requirement is ambiguous and materially affects architecture or business behavior, stop and ask for clarification rather than inventing a business rule.

---

# 18. Do Not Overbuild

Build according to the current approved requirements.

Do not add:

- AI
- unnecessary integrations
- unnecessary abstractions
- speculative enterprise features

unless requested.

The architecture should allow future expansion without implementing everything today.

---

# 19. Source of Truth

Business requirements are documented under /docs.

CLAUDE.md provides development rules.

Git history provides implementation history.

Do not treat generated code as the source of truth for business requirements.

---

# 20. Quality Standard

A feature is not considered complete merely because the UI works.

Completion should consider:

- UI
- Validation
- Authorization
- Database integrity
- Error handling
- Historical integrity
- Testing
- Documentation

