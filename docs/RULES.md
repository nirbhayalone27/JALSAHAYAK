# JalSahayak — Engineering Rules

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## Purpose

This is the global engineering rulebook for JalSahayak. Every developer and AI agent must follow these rules. Violations must be flagged and corrected.

---

## The Rules

### Data Integrity

**Rule 1: Never invent data.**
Do not generate fake measurements, coordinates, elevations, or observations. Use synthetic data from the synthetic data pipeline with clear labels.

**Rule 2: Never invent accuracy.**
Do not claim precision, accuracy, or confidence levels that have not been validated. If a metric has not been measured, do not display it.

**Rule 3: Never claim real-time unless actually real-time.**
Satellite revisit times are hours to days. Processing takes minutes. Use "latest available" or "most recent" — not "real-time."

**Rule 4: Never present synthetic data as real.**
Every synthetic data point must carry `is_synthetic: true`. Every UI view, API response, and report must indicate when data is synthetic.

**Rule 5: Never silently fail.**
Every error must be logged. Every failed background job must be recorded. Every API error must return a meaningful response. No swallowed exceptions.

---

### AI & Science

**Rule 6: Never hide model uncertainty.**
Every AI output must include a confidence indicator. Every simulation result must state its assumptions. Every report must list limitations.

**Rule 7: Never use AI as replacement for hydrodynamic physics.**
AI classifies, summarizes, and explains. Physics models simulate flood dynamics. These are separate concerns. AI does not predict flood extent.

**Rule 8: Satellite imagery cannot detect structural dam failure.**
Document this limitation clearly. Satellites observe surface changes, not internal structural integrity. Do not imply otherwise.

---

### Alerts & Reporting

**Rule 9: Every alert must have a reason.**
No alert may be generated without: reason (text), evidence (data reference), severity (level), and recommended action.

**Rule 10: Every external dataset must have provenance.**
Record: source, date acquired, date of data, spatial extent, resolution, license, and any processing applied.

---

### Engineering

**Rule 11: Keep MVP simple.**
If a feature is not in the current phase's scope, do not build it. If a simpler approach works, use it.

**Rule 12: Prefer existing reliable libraries.**
Use GDAL, Rasterio, GeoPandas, Shapely, FastAPI, SQLAlchemy — battle-tested tools. Do not write custom implementations for problems already solved by mature libraries.

**Rule 13: Avoid unnecessary dependencies.**
Every new dependency must justify its inclusion. Prefer standard library where sufficient. Check license compatibility.

**Rule 14: Document major architecture changes.**
Any change to service boundaries, database schema, API contracts, or provider interfaces must be documented in the relevant doc file and logged in PRODUCT_DECISIONS.md.

**Rule 15: Test before marking a feature complete.**
A feature without tests is not done. Minimum: service-level tests for business logic, API-level tests for contracts, edge cases for error paths.

**Rule 16: Never delete working functionality without reason.**
If something works and is in scope, do not remove it. If removal is necessary, document why and get approval.

---

### Code Quality

**Rule 17: Type everything.**
Python: type hints on all functions. TypeScript: strict mode, no `any`.

**Rule 18: Log meaningfully.**
Structured logging with context (dam_id, job_id, user_id). Not `print("here")`.

**Rule 19: Handle errors at the right level.**
Services throw domain exceptions. API layer maps to HTTP status. Background jobs retry with backoff. Nothing is ignored.

**Rule 20: Keep secrets out of code.**
Environment variables for all secrets. `.env` in `.gitignore`. Never commit API keys, passwords, or tokens.

---

### Process

**Rule 21: Read documentation before writing code.**
Before implementing a feature, read the relevant docs (PRD, TRD, ARCHITECTURE, API). If the docs are wrong, update them first.

**Rule 22: One concern per commit.**
Each commit addresses one change. `feat:` adds a feature. `fix:` fixes a bug. `refactor:` restructures. Do not mix.

**Rule 23: Migrations are append-only.**
Never modify an existing migration that has been applied. Always create a new migration.

**Rule 24: Spatial data uses EPSG:4326.**
All geometry stored in WGS84 (EPSG:4326). Reproject on input if needed. Display projections handled by the map library.

**Rule 25: UTC everywhere.**
All timestamps stored as UTC. Display in user's timezone in the UI. No timezone ambiguity in API responses (use ISO 8601 with `Z` or offset).

---

## Enforcement

- Code reviews check for rule violations
- AI agents reference this file before implementation
- Violations logged and tracked
- Rules updated through PRODUCT_DECISIONS.md process
