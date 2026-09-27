# ADR-009: Documents and Evidence

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-09-27 |

## Context

Evidence (photos, documents, certificates, invoices, installation proof) must stay linked to its business context and be access-controlled.

Domain Model v0.1 used a generic "Related Entity / Related Entity ID" reference, which cannot be enforced with foreign keys and conflicts with the principle that the database enforces integrity.

## Decision

### Storage

- Files are stored in a **private** Supabase Storage bucket.
- Object path convention: `{organization_id}/{workshop_id}/{yyyy}/{uuid}.{ext}`.
- Files are not stored as binary data in PostgreSQL.

### Metadata

`document`:

- File name
- File type (MIME)
- File size
- SHA-256 hash
- Storage path
- Document type
- Uploaded by
- Uploaded at

### Context links

`document_link` connects a document to its business context using **typed nullable foreign keys**, for example:

- `workshop_id`
- `audit_id`
- `audit_response_id`
- `workshop_milestone_id`
- `workshop_requirement_id`
- `compliance_update_id`
- `asset_id`
- `asset_event_id`
- `finding_id`
- `capa_id`
- `training_record_id`
- `go_live_approval_id`

A CHECK constraint requires **exactly one** context foreign key to be set. New contexts are added by migration.

Generic entity-type / entity-ID references are not used.

### Access

- Files are served only through short-lived **signed URLs**, issued after `authorize()` (ADR-005).
- Knowing a storage path or URL is not sufficient to access a file.

### No deletion

Documents are never deleted. A replacement document supersedes the previous one; the previous document remains linked and retrievable.

## Consequences

- Referential integrity for every evidence link.
- Evidence access follows the same authorization model as the data it supports.
- Adding a new evidence context requires a migration.

## Deferred / Open

- File size and type limits.
- Document retention requirements.

## Related

- PRD §28
- Domain Model §20, §34, §42
- Architecture §30, §31
- ADR-005, ADR-007
