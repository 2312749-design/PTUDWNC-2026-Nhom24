# Changelog

## Unreleased

### Added

- FluentValidation pipeline behavior and application-layer validators.
- CQRS handlers for recipe updates, lifecycle transitions, full-text search, ingredients, steps, images, and Register/Login/Refresh.
- SRS routes for authentication, dashboard, profile, category detail, and search.
- ISR/SSR/CSR rendering policies, category-aware sitemap generation, and UTC scheduling.
- Production HTTPS override, SMTP sandbox, k6 smoke test, coverage collection, and backup script.

### Changed

- A recipe now requires at least one ingredient and one instruction step, matching the SRS.
- Optional community features are hidden unless `NEXT_PUBLIC_ENABLE_EXTENSIONS=true`.
- Login and registration now continue to the SRS dashboard.

