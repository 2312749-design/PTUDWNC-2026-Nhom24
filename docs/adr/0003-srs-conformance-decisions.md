# ADR 0003: SRS conformance decisions

Status: Accepted — 2026-11-13

## Concurrency token

The SRS proposes a `RowVersion` column. This implementation uses `UpdatedAt` as an HTTP ETag-style optimistic-concurrency token. The edit client sends the value in `If-Match`; a stale version returns HTTP 412. A malformed header returns 400. A concurrent database write detected by EF returns 409. PostgreSQL timestamp comparison uses microsecond precision. These responses distinguish invalid input, failed HTTP preconditions and database conflicts.

Changing every entity to inherit a new persistence base class would require a broad migration without improving the demonstrated recipe-edit use case. `CreatedAt`, `UpdatedAt`, and soft-delete fields therefore remain explicit domain properties.

## Refresh token transport

The SRS data model lists refresh-token storage. The application uses a protected, HttpOnly, SameSite cookie and a hashed/revocable server record. JavaScript cannot read the refresh credential. Production sets `AUTH_COOKIES_SECURE=true` behind HTTPS.

## External providers

Google OAuth and SMTP are implemented but intentionally disabled without credentials. Local email behavior can be demonstrated with the `email-test` Docker profile and MailHog. A real Google client ID and production SMTP secret must be supplied by the deployer; no fake secret is committed.

## Seed and user content are different requirements

Lab 2 requires at least 20 categories, 100 recipes, 10 ingredients and 5 steps per seeded recipe. The full catalog is normalized after new rows are saved and checked after a second seed run. SRS user-created recipes use the separate minimum of one ingredient and one step; the editor must allow removing extra rows down to that minimum.

## Rendering and deployment initialization

Public home and category pages use ISR with a 3600-second interval. Search and recipe lists render server-side from URL filters. The production startup script invalidates build-time home/category HTML after the API becomes available, using a random process-only secret. This prevents a successful offline image build from freezing an empty catalog for an hour. The endpoint accepts no arbitrary paths and rejects unauthenticated requests. Recipe changes can take the documented ISR interval to appear on cached pages; search reads fresh results.

## Architecture scope

Application references Domain and persistence abstractions; it does not reference EF Core or Infrastructure. Recipe ingredient/step reads and writes, category detail, and recipe delete/restore use MediatR. Recipe detail, PATCH, sitemap/view tracking and several account operations still contain persistence code in API handlers. Authentication commands delegate through an API workflow adapter. These are remaining deviations from a strict all-use-cases-in-Application requirement, not evidence of full CQRS completion.

