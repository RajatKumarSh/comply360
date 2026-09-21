# Comply360 — Architecture Decision Document

| | |
|---|---|
| **Document Version** | 0.1 |
| **Status** | Draft / Foundation |
| **Last Updated** | September 2026 |

---

## Contents

1. [Purpose](#1-purpose)
2. [Architecture Goals](#2-architecture-goals)
3. [Architecture Principles](#3-architecture-principles)
4. [Initial Technology Stack](#4-initial-technology-stack)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Next.js Architecture](#6-nextjs-architecture)
7. [TypeScript](#7-typescript)
8. [Database Architecture](#8-database-architecture)
9. [Supabase](#9-supabase)
10. [Database Portability](#10-database-portability)
11. [ORM / Data Access Strategy](#11-orm--data-access-strategy)
12. [Database Migrations](#12-database-migrations)
13. [Database Constraints](#13-database-constraints)
14. [Primary Keys](#14-primary-keys)
15. [Multi-Tenant Readiness](#15-multi-tenant-readiness)
16. [Authentication](#16-authentication)
17. [Authorization](#17-authorization)
18. [Row-Level Access](#18-row-level-access)
19. [Business Logic Layer](#19-business-logic-layer)
20. [Validation](#20-validation)
21. [Forms](#21-forms)
22. [Dynamic Audit Engine](#22-dynamic-audit-engine)
23. [Audit Versioning](#23-audit-versioning)
24. [Historical Data Architecture](#24-historical-data-architecture)
25. [Audit Immutability](#25-audit-immutability)
26. [Current Compliance vs Historical Audit](#26-current-compliance-vs-historical-audit)
27. [Asset Architecture](#27-asset-architecture)
28. [Manpower Architecture](#28-manpower-architecture)
29. [Training Architecture](#29-training-architecture)
30. [File Storage](#30-file-storage)
31. [Evidence Security](#31-evidence-security)
32. [Audit Trail Architecture](#32-audit-trail-architecture)
33. [Timeline Architecture](#33-timeline-architecture)
34. [Event-Driven Design](#34-event-driven-design)
35. [Modular Monolith](#35-modular-monolith)
36. [API Strategy](#36-api-strategy)
37. [Error Handling](#37-error-handling)
38. [Logging](#38-logging)
39. [Testing Strategy](#39-testing-strategy)
40. [Critical Workflow Testing](#40-critical-workflow-testing)
41. [Environment Strategy](#41-environment-strategy)
42. [Environment Variables](#42-environment-variables)
43. [.env Policy](#43-env-policy)
44. [Git Strategy](#44-git-strategy)
45. [Commit Strategy](#45-commit-strategy)
46. [CI/CD](#46-cicd)
47. [Deployment](#47-deployment)
48. [Backup & Recovery](#48-backup--recovery)
49. [Security Principles](#49-security-principles)
50. [Dependency Management](#50-dependency-management)
51. [AI Coding Tool Policy](#51-ai-coding-tool-policy)
52. [AI Change Workflow](#52-ai-change-workflow)
53. [Development Workflow](#53-development-workflow)
54. [Avoiding Vendor Lock-In](#54-avoiding-vendor-lock-in)
55. [Initial Architecture Diagram](#55-initial-architecture-diagram)
56. [Initial Architecture Decision Summary](#56-initial-architecture-decision-summary)
57. [Decisions Requiring Validation](#57-decisions-requiring-validation)
58. [Architecture Rule](#58-architecture-rule)
59. [Final Architecture Principle](#59-final-architecture-principle)

---

## 1. Purpose

This document defines the initial technical architecture for Comply360.

It translates the Product Requirements Document and Domain Model into a practical software architecture.

This document is intentionally an architecture baseline rather than a final implementation specification.

Architecture decisions may evolve as the system is developed, but significant changes should be documented explicitly.

---

## 2. Architecture Goals

The architecture must support:

- Scalability
- Maintainability
- Security
- Strong data integrity
- Historical data preservation
- Configurable business rules
- Configurable audit templates
- Role-based access control
- Good developer experience
- Automated testing
- Clear separation of concerns
- Future mobile application support
- Future integrations
- Future multi-company SaaS capability
- Portability away from individual vendors where practical

---

## 3. Architecture Principles

### 3.1 Source Code Ownership

The project owner must retain control of:

- GitHub repository
- Source code
- Database
- Database backups
- Deployment configuration
- Domain
- Application credentials
- Infrastructure credentials
- Environment variables

AI coding tools are development assistants and must not become the owner of the application.

### 3.2 Database Is the Source of Truth

Business-critical data must be stored in the application database.

The application must not depend on:

- Google Sheets as the primary database
- Google Forms as the primary workflow engine
- Local browser storage for critical records
- AI tools for business state

### 3.3 Business Rules Must Not Live Only in the UI

Important business rules must be enforced server-side and/or at database level where appropriate.

**Example:** a user interface may prevent an unauthorized user from approving Go Live, but the backend must also reject an unauthorized approval request.

### 3.4 Historical Data Must Be Protected

Finalized historical records must not be silently overwritten.

The architecture must support:

- Immutable audit records
- Historical configuration versions
- Lifecycle history
- Asset history
- Employment history
- Salary history
- Compliance history
- Commercial support history
- Audit trail

### 3.5 Configuration Over Hardcoding

Audit questions, scoring, applicability and conditional logic should be represented as configuration data.

The application should not require source-code changes for ordinary business configuration changes.

---

## 4. Initial Technology Stack

The initial technology direction is:

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| UI | React |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui |
| Database | PostgreSQL |
| Backend Platform | Supabase |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Validation | Zod |
| Forms | React Hook Form |
| Charts | Apache ECharts |
| Source Control | GitHub |
| Deployment | Vercel |
| AI Development | Claude Code |
| Package Manager | npm |

This stack is a starting architecture and should be validated during implementation.

---

## 5. Frontend Architecture

The application will use Next.js with TypeScript.

The frontend should be organized around reusable domain-oriented components rather than large page-specific components.

Conceptual structure:

```text
Application
│
├── Authentication
├── Dashboard
├── Workshops
├── Pre-COB
├── Post-COB
├── Audits
├── Compliance
├── Assets
├── Manpower
├── Training
├── Findings
├── CAPA
├── Commercial Support
├── Documents
├── Reports
└── Administration
```

---

## 6. Next.js Architecture

The application should use the Next.js App Router unless architecture review identifies a strong reason otherwise.

The application should distinguish between:

- Server Components
- Client Components
- Server-side data access
- Client-side interactive state

Client-side JavaScript should not be used unnecessarily.

---

## 7. TypeScript

TypeScript should be used throughout the application.

The project should use strict TypeScript configuration.

Avoid `any` unless there is a documented reason.

Types should be derived or shared where practical to reduce inconsistencies between:

- Database
- Server logic
- Forms
- API responses
- UI

---

## 8. Database Architecture

PostgreSQL will be the primary relational database.

The domain model maps naturally to a relational database because Comply360 contains:

- Strong relationships
- Historical records
- Transactions
- Configurable entities
- Role relationships
- Audit records
- Financial data
- Structured reporting requirements

The database must enforce important integrity constraints.

---

## 9. Supabase

Supabase will initially provide:

- PostgreSQL database
- Authentication
- Storage
- Database APIs where appropriate
- Local development tooling where useful

Supabase should be treated as infrastructure rather than as the application's business logic.

Business rules should remain in application/domain services and database constraints where appropriate.

---

## 10. Database Portability

The underlying database is PostgreSQL.

The application should avoid unnecessary dependence on proprietary database features when a portable PostgreSQL implementation is practical.

The project should be able to migrate from Supabase to another PostgreSQL hosting provider if required.

**Important considerations:**

- Database migrations must be stored in Git
- Database schema must be reproducible
- Seed data must be reproducible
- Backups must be exportable
- Business logic should not depend unnecessarily on Supabase-specific APIs

---

## 11. ORM / Data Access Strategy

An ORM should not be introduced automatically.

The first architecture implementation should evaluate whether direct typed PostgreSQL access through Supabase is sufficient.

**Potential future options:**

- Prisma
- Drizzle
- Supabase generated types
- Other typed data-access approaches

**Decision criteria:**

- Type safety
- Query complexity
- Migration workflow
- Developer experience
- Performance
- PostgreSQL portability
- Maintainability

Avoid adding an ORM simply because it is popular.

---

## 12. Database Migrations

All schema changes must be version-controlled.

Conceptually:

```text
Migration 001
Migration 002
Migration 003
...
```

A developer should be able to reproduce the database structure from the repository.

> Never make undocumented production database changes.

---

## 13. Database Constraints

The database should enforce critical constraints wherever practical.

**Examples:**

- Primary keys
- Foreign keys
- Unique Workshop IDs
- Required relationships
- Valid references
- Appropriate unique constraints
- Check constraints where appropriate

Application validation and database validation should complement each other.

---

## 14. Primary Keys

UUIDs are the preferred initial primary-key strategy.

**Reasons:**

- Globally unique
- Suitable for distributed systems
- Avoid predictable sequential identifiers
- Useful for future integrations
- Suitable for future multi-company architecture

Human-readable identifiers may still exist separately.

**Example:**

```text
Internal ID:   550e8400-e29b-41d4-a716-446655440000
Workshop ID:   W-000123
```

The exact identifier format will be finalized during database design.

---

## 15. Multi-Tenant Readiness

The initial application may operate as a single organization.

However, the data model should avoid decisions that make future multi-company support impossible.

Where appropriate, domain entities may include `organization_id`. This allows future tenant isolation.

Multi-tenancy should not add unnecessary complexity to V1 unless required.

---

## 16. Authentication

Authentication should initially use Supabase Auth.

**Potential authentication methods:**

- Email/password
- Magic link
- Enterprise SSO in the future

Authentication answers: **Who is the user?**

Authorization answers: **What is the user allowed to do?**

These concerns must remain separate.

---

## 17. Authorization

Comply360 requires role-based access control.

**Initial roles:**

- Super Admin
- HO Admin
- Regional Manager
- Area Service Manager
- Workshop Manager
- Auditor
- Leadership / Read Only

Authorization must be enforced server-side. UI hiding is not sufficient security.

**Example:**

```text
UI:       Hide "Approve Go Live"
Backend:  Reject Go Live approval if user lacks permission
```

---

## 18. Row-Level Access

Where appropriate, database-level access controls should be used to restrict records by:

- Organization
- Region
- Assigned geography
- Workshop
- Role

Supabase Row Level Security may be used where appropriate.

RLS policies must be designed carefully and tested.

---

## 19. Business Logic Layer

Business logic should not be scattered across UI components.

Conceptually:

```text
UI
 ↓
Server Action / API
 ↓
Validation
 ↓
Domain / Business Logic
 ↓
Data Access
 ↓
PostgreSQL
```

The exact implementation may use:

- Server Actions
- Route Handlers
- Domain services
- Repository/data-access functions

The architecture should choose the simplest appropriate approach.

---

## 20. Validation

Zod will be used for application-level validation.

Validation should exist at appropriate boundaries:

```text
User Input
   ↓
Schema Validation
   ↓
Authorization
   ↓
Business Rules
   ↓
Database Constraints
```

Validation errors should be understandable to users.

---

## 21. Forms

React Hook Form may be used for complex forms.

It is particularly relevant to:

- Workshop creation
- Audit responses
- Milestone updates
- Asset forms
- Manpower forms
- Training forms
- CAPA forms
- Configuration forms

Dynamic audit forms must be generated from configuration rather than duplicated manually.

---

## 22. Dynamic Audit Engine

The audit engine is one of the most important architectural components.

Conceptually:

```text
Audit Template
      ↓
Template Version
      ↓
Sections
      ↓
Questions
      ↓
Conditional Logic
      ↓
Responses
      ↓
Scoring
      ↓
Findings
      ↓
Audit Result
```

The frontend should render audit forms dynamically from the configuration model.

---

## 23. Audit Versioning

When an audit starts, it must reference a specific template version.

**Example:**

```text
Workshop:   W-001
Audit:      A-001
Template:   Post-COB
Version:    3
```

If the template later becomes Version 4, Audit A-001 must continue referencing Version 3.

This ensures historical audits remain understandable.

---

## 24. Historical Data Architecture

The system should use a combination of:

- Current-state records
- History tables/events
- Immutable finalized records
- Audit logs

The exact implementation will be finalized during database design.

The goal is to answer both **What is true now?** and **What was true on a specific date?**

---

## 25. Audit Immutability

Once an audit becomes `FINALIZED`:

- Responses should not be directly edited
- Scores should not silently change
- Evidence should remain linked
- Template version must remain fixed
- Historical result must remain reconstructable

If a correction is required:

```text
Original Audit
      ↓
Correction / Superseding Record
```

rather than silent modification.

---

## 26. Current Compliance vs Historical Audit

The system must explicitly separate **Historical Audit** from **Current Compliance**.

**Example:**

```text
01 Aug Audit
Two Post Lift = NOT AVAILABLE

11 Aug Compliance Update
Two Post Lift = AVAILABLE
```

The August 1 audit remains unchanged.

The current compliance state reflects the August 11 update.

---

## 27. Asset Architecture

Assets should have:

```text
Asset                Asset History
  ↓                       ↓
Current State      Historical Changes
```

**Example:**

```text
ORDERED
   ↓
DELIVERED
   ↓
INSTALLED
   ↓
UNDER_REPAIR
```

Asset state changes must be traceable.

---

## 28. Manpower Architecture

Manpower should separate:

```text
Person
   ↓
Employment
   ↓
Designation History
   ↓
Salary History
   ↓
Training Records
```

This prevents a simple employee record from becoming a container for all historical changes.

---

## 29. Training Architecture

Training should be configuration-driven.

Conceptually:

```text
Designation
      ↓
Training Requirement
      ↓
Person
      ↓
Training Record
```

This supports different training requirements for different roles.

---

## 30. File Storage

Supabase Storage will initially be considered for:

- Audit photos
- Documents
- Certificates
- Invoices
- Training certificates
- Installation evidence

Files should not be stored directly inside PostgreSQL as binary data unless there is a specific requirement.

The database should store:

- File metadata
- Storage path/reference
- Entity relationship
- Uploading user
- Timestamp
- File type
- File size
- Context

---

## 31. Evidence Security

Evidence may contain sensitive operational information.

Access must be authorization-aware.

Users should not be able to access arbitrary storage objects simply because they know a URL.

Signed URLs or equivalent access-controlled mechanisms should be considered.

---

## 32. Audit Trail Architecture

Important actions should generate an audit trail.

**Example:**

```text
Actor:      Rajat
Action:     UPDATE_ASSET_STATUS
Entity:     Asset
Old:        ORDERED
New:        INSTALLED
Timestamp:  2026-09-21 20:00
Reason:     Installation completed
```

The final implementation may use:

- Central audit log
- Domain history tables
- Database triggers
- Application-generated events

The appropriate combination will be decided during implementation.

---

## 33. Timeline Architecture

Timeline events should provide a human-readable operational history.

They may be generated when important domain events occur.

**Example:**

```text
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
```

Timeline should not become the only source of truth. It is a derived/read-oriented representation of important domain events.

---

## 34. Event-Driven Design

The application may use domain events internally.

**Example:**

```text
GO_LIVE_APPROVED
        ↓
Create Timeline Event
        ↓
Update Workshop Lifecycle
        ↓
Create Notification
```

However, a full event-driven/microservices architecture is not required for V1.

Start with a modular monolith.

---

## 35. Modular Monolith

Comply360 should initially be built as a modular monolith.

Conceptually:

```text
Comply360
│
├── Workshop Module
├── Lifecycle Module
├── Pre-COB Module
├── Audit Module
├── Compliance Module
├── Asset Module
├── Manpower Module
├── Training Module
├── Expense Module
├── Findings Module
├── CAPA Module
├── Commercial Support Module
├── Document Module
├── Reporting Module
└── Administration Module
```

These modules share one application and database but maintain clear domain boundaries.

Microservices should not be introduced unless scale or operational requirements justify them.

---

## 36. API Strategy

The application should expose APIs or server-side operations where integrations require them.

**Potential future integrations:**

- DMS
- ERP
- CRM
- Workshop systems
- Notification systems

Internal application operations do not need to become public APIs unnecessarily.

---

## 37. Error Handling

Errors should be handled at multiple levels.

**Expected categories:**

- Validation errors
- Authorization errors
- Not found
- Conflict
- Database errors
- File upload errors
- External service errors
- Unexpected application errors

Users should receive understandable messages.

Developers should have sufficient logging to investigate failures.

Sensitive information must not be exposed in error messages.

---

## 38. Logging

Application logs should support troubleshooting.

Logs should avoid exposing:

- Passwords
- Tokens
- API keys
- Sensitive personal information
- Database credentials

Production logging strategy will be finalized before production deployment.

---

## 39. Testing Strategy

Testing should exist at multiple levels.

### Unit Tests

Test:

- Business rules
- Scoring
- Calculations
- Conditional logic
- Permission checks

### Integration Tests

Test:

- Database interactions
- Server operations
- Authentication
- Authorization
- File workflows

### End-to-End Tests

Test important workflows:

- Workshop creation
- Pre-COB readiness
- Go Live approval
- Post-COB audit
- Compliance update
- Asset installation
- Technician onboarding
- CAPA closure

---

## 40. Critical Workflow Testing

The following must receive strong test coverage.

### Historical Audit

```text
Audit finalized
    ↓
Configuration changed
    ↓
Historical audit remains unchanged
```

### Compliance Update

```text
Audit:   Asset unavailable
Later:   Asset installed

Result:  Historical audit unchanged
         Current compliance updated
```

### Employee Exit

```text
Employee active
    ↓
Employee leaves
    ↓
Employee becomes inactive
    ↓
Historical employment retained
```

### Salary Change

```text
Salary A
    ↓
Salary B
```

Historical salary A remains available.

---

## 41. Environment Strategy

The project should eventually use separate environments.

Initial conceptual environments:

```text
Local Development
       ↓
Development / Test
       ↓
Staging
       ↓
Production
```

Production should never be the primary development environment.

---

## 42. Environment Variables

Secrets must be stored through environment variables or secure secret-management systems.

**Examples:**

```bash
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AUTH_SECRET
```

Actual values must never be committed to Git.

---

## 43. .env Policy

Local environment files such as:

```text
.env
.env.local
.env.development.local
.env.production.local
```

must remain excluded from Git where they contain secrets.

A safe example file may be committed — `.env.example` — containing variable names but no secrets.

---

## 44. Git Strategy

GitHub is the source-control system.

The `main` branch represents the stable project branch.

Development should generally happen through feature branches as the project becomes more complex.

**Example:**

```text
main
 │
 ├── feature/workshop-master
 ├── feature/audit-engine
 ├── feature/compliance
 └── feature/training
```

Small documentation changes may be committed directly to `main` during the early foundation phase.

---

## 45. Commit Strategy

Commits should be:

- Small
- Focused
- Descriptive
- Reversible

**Examples:**

```text
docs: add product requirements document
docs: add domain model
docs: add architecture decision document
feat: add workshop master
feat: add audit template engine
fix: prevent finalized audit mutation
```

---

## 46. CI/CD

Continuous integration should eventually run:

- Type checking
- Linting
- Unit tests
- Integration tests where appropriate
- Build verification

A deployment pipeline can later connect:

```text
GitHub
   ↓
CI Checks
   ↓
Vercel
   ↓
Deployment
```

Production deployment should only occur when required checks pass.

---

## 47. Deployment

Vercel is the initial deployment candidate for the Next.js application.

Supabase will host the initial PostgreSQL database and storage.

The architecture should remain portable enough to migrate the application to another hosting provider if necessary.

---

## 48. Backup & Recovery

The production database must have a defined backup strategy before production adoption.

**Requirements include:**

- Automated backups
- Point-in-time recovery where available
- Export capability
- Recovery testing
- Documented recovery process

Backups should not depend solely on the application code repository.

---

## 49. Security Principles

Security requirements include:

- Secure authentication
- Server-side authorization
- Database access controls
- RLS where appropriate
- Input validation
- Output validation where needed
- Secure file access
- Secret management
- HTTPS
- Dependency updates
- Audit logging
- Least privilege

---

## 50. Dependency Management

Dependencies should be added only when they provide clear value.

Avoid unnecessary libraries.

Before adding a major dependency, evaluate:

- Maintenance status
- Security
- License
- Bundle impact
- Developer experience
- Long-term need
- Vendor lock-in

---

## 51. AI Coding Tool Policy

Claude Code may be used as the primary implementation assistant.

AI coding tools must:

- Read `CLAUDE.md`
- Read relevant documents in `/docs`
- Follow architecture decisions
- Avoid inventing business rules
- Avoid changing requirements silently
- Avoid deleting historical logic
- Avoid exposing secrets
- Run appropriate tests/checks
- Explain significant architectural changes

The AI tool must not become the source of truth. The repository documentation remains authoritative.

---

## 52. AI Change Workflow

Before implementing a significant feature:

```text
Read Requirements
       ↓
Read Domain Model
       ↓
Read Architecture
       ↓
Identify Entities
       ↓
Identify Business Rules
       ↓
Identify Permissions
       ↓
Identify Historical Impact
       ↓
Implement
       ↓
Test
       ↓
Review
       ↓
Commit
```

---

## 53. Development Workflow

Initial workflow:

```text
ChatGPT
   ↓
Requirements / Architecture / Acceptance Criteria
   ↓
Claude Code
   ↓
Implementation
   ↓
Local Testing
   ↓
Git
   ↓
GitHub
```

The user remains the final decision-maker for product requirements.

---

## 54. Avoiding Vendor Lock-In

The architecture should avoid unnecessary dependence on:

- AI vendors
- Hosting vendors
- Database-specific proprietary features
- Proprietary business-rule engines

**Examples:**

- Source code remains in GitHub
- Database is PostgreSQL
- Database migrations are version-controlled
- Files can be exported
- Business rules remain in application/domain code and database structures
- AI tools do not own production infrastructure

---

## 55. Initial Architecture Diagram

Conceptual architecture:

```text
                    ┌─────────────────────┐
                    │        User         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Next.js App     │
                    │  TypeScript/React   │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ Business Logic  │        │ Authentication  │
        │ / Server Layer  │        │  Supabase Auth  │
        └────────┬────────┘        └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   PostgreSQL    │
        │    Supabase     │
        └────────┬────────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
┌───────────────┐  ┌────────────────┐
│    Storage    │  │ Future Systems │
│   Supabase    │  │ DMS / ERP etc. │
└───────────────┘  └────────────────┘
```

---

## 56. Initial Architecture Decision Summary

| Decision | Initial Choice | Status |
|---|---|---|
| Frontend | Next.js | Proposed |
| Language | TypeScript | Proposed |
| UI | React | Proposed |
| Styling | Tailwind CSS | Proposed |
| Components | shadcn/ui | Proposed |
| Database | PostgreSQL | Proposed |
| Backend Platform | Supabase | Proposed |
| Authentication | Supabase Auth | Proposed |
| Storage | Supabase Storage | Proposed |
| Validation | Zod | Proposed |
| Forms | React Hook Form | Proposed |
| Charts | Apache ECharts | Proposed |
| Hosting | Vercel | Proposed |
| Source Control | GitHub | **Confirmed** |
| AI Coding | Claude Code | Proposed |
| Architecture | Modular Monolith | Proposed |

---

## 57. Decisions Requiring Validation

Before production implementation, validate:

- Supabase architecture
- Authentication approach
- Authorization/RLS strategy
- ORM vs direct typed database access
- File storage architecture
- Audit logging
- History implementation
- Template versioning
- Environment separation
- Backup/recovery
- CI/CD
- Production hosting
- Notification architecture
- Reporting architecture

---

## 58. Architecture Rule

When a new feature is proposed, the team should ask:

1. Which domain entity does it affect?
2. What business rule does it implement?
3. What permissions are required?
4. Does it create historical data?
5. Does it modify current state?
6. Does it require configuration?
7. Does it require evidence?
8. Does it affect reporting?
9. Does it require audit logging?
10. How will it be tested?

This prevents feature development from becoming disconnected from the core architecture.

---

## 59. Final Architecture Principle

Comply360 should initially be:

```text
A modular monolith
        +
PostgreSQL
        +
Configurable business rules
        +
Immutable historical records
        +
Role-based authorization
        +
Version-controlled infrastructure
        +
Automated testing
```

The architecture should remain simple enough for a small team to operate while being structured enough to evolve into a larger enterprise platform.
