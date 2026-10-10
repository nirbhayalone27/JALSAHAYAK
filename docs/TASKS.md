# JalSahayak — Implementation Backlog (TASKS)

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## Organization

Tasks are organized into three categories:

- **NOW** — MVP-critical, must be done for the core loop to work
- **NEXT** — Important but not blocking MVP demo
- **LATER** — Future enhancements, real-world integrations

Each task has: ID, title, description, dependencies, and acceptance criteria.

---

## NOW (MVP-Critical)

### T-001: Project Foundation
**Description:** Set up repository structure, Docker Compose, and development environment.
**Dependencies:** None
**Acceptance Criteria:**
- [x] Backend directory structure matches CODING_STANDARDS.md
- [x] Frontend directory scaffolded (React + TypeScript + Vite)
- [x] Docker Compose starts PostgreSQL + PostGIS, Redis, MinIO
- [x] `.env.example` with all required environment variables
- [x] `Makefile` or scripts for common dev tasks

---

### T-002: Database Schema & Migrations
**Description:** Create SQLAlchemy models and Alembic migrations for all core entities.
**Dependencies:** T-001
**Acceptance Criteria:**
- [x] Models: `dams`, `observations`, `changes`, `statuses`, `scenarios`, `impacts`, `alerts`, `reports`, `users`
- [x] All spatial columns use PostGIS types
- [x] Spatial indexes created
- [x] Migrations run cleanly up and down
- [x] Models match TRD.md schema definition

---

### T-003: Pydantic Schemas
**Description:** Create request/response schemas for all API endpoints.
**Dependencies:** T-002
**Acceptance Criteria:**
- [x] Create/Update/Response schemas for each entity
- [x] Pagination response wrapper
- [x] Error response schema
- [x] GeoJSON geometry types
- [x] Validators for business rules (coordinate ranges, string lengths, etc.)

---

### T-004: Authentication System
**Description:** Implement JWT-based authentication.
**Dependencies:** T-001, T-002
**Acceptance Criteria:**
- [ ] User registration (admin-only for MVP)
- [ ] Login endpoint returns JWT access + refresh tokens
- [ ] Token refresh endpoint
- [ ] Auth middleware validates JWT on protected routes
- [ ] Role extraction from token
- [ ] Password hashing with bcrypt

---

### T-005: Dam Service
**Description:** Implement dam CRUD operations.
**Dependencies:** T-002, T-003, T-004
**Acceptance Criteria:**
- [ ] Create dam with all required fields (name, river, location, areas)
- [ ] List dams with pagination and filters
- [ ] Get single dam with full details
- [ ] Update dam details
- [ ] Delete dam
- [ ] API endpoints match API.md contracts
- [ ] Service-level tests

---

### T-006: Synthetic Data Generator
**Description:** Create script to generate deterministic demo data for 3 dams.
**Dependencies:** T-002
**Acceptance Criteria:**
- [ ] Generates 3 demo dams with realistic metadata and geometries
- [ ] Generates 10 observations per dam over 30-day timeline
- [ ] Generates change detection results for consecutive observations
- [ ] Generates DEM tiles (simplified)
- [ ] Generates flood scenario outputs
- [ ] Generates infrastructure layers (settlements, roads, bridges, agriculture)
- [ ] All data labelled as synthetic
- [ ] Deterministic — re-running produces identical output
- [ ] Data stored in `data/synthetic/`

---

### T-007: Satellite Provider Abstraction
**Description:** Implement `BaseSatelliteProvider` and `SyntheticProvider`.
**Dependencies:** T-002, T-006
**Acceptance Criteria:**
- [ ] `BaseSatelliteProvider` abstract class with `search`, `fetch` methods
- [ ] `SyntheticProvider` returns demo observations from `data/synthetic/`
- [ ] Provider returns typed `ObservationMeta` and `ObservationData` objects
- [ ] Provider is configurable (via dependency injection)

---

### T-008: Observation Ingestion Pipeline
**Description:** Implement observation fetch, ingest, and storage.
**Dependencies:** T-005, T-007
**Acceptance Criteria:**
- [ ] Background job: fetch new observations per dam from provider
- [ ] Store observation metadata in database
- [ ] Store observation data in object storage
- [ ] Create observation record with source, date, coverage, quality
- [ ] API endpoints: list observations, get observation, trigger fetch
- [ ] Service-level tests

---

### T-009: Change Detection Service
**Description:** Compare two observations and detect changes.
**Dependencies:** T-008
**Acceptance Criteria:**
- [ ] Compare observation A vs observation B
- [ ] Detect change types: water_spread, boundary, downstream_water, surface_change
- [ ] Assign severity: low, moderate, high
- [ ] Store change results with geometry and metrics
- [ ] Auto-trigger after new observation ingested
- [ ] API endpoints: list changes, request comparison
- [ ] Service-level tests

---

### T-010: Dam Status Engine
**Description:** Compute dam health status from evidence and rules.
**Dependencies:** T-009
**Acceptance Criteria:**
- [ ] Evaluate status rules against recent changes and signals
- [ ] Assign status: NORMAL, WATCH, ALERT, CRITICAL
- [ ] Every status change includes reasons and evidence IDs
- [ ] Status history maintained
- [ ] Auto-trigger after change detection
- [ ] API endpoint: get current status and history
- [ ] Service-level tests

---

### T-011: Flood Simulation Abstraction
**Description:** Implement `BaseFloodSimulator` and `SyntheticSimulator`.
**Dependencies:** T-002, T-006
**Acceptance Criteria:**
- [ ] `BaseFloodSimulator` abstract class with `run` method
- [ ] `SyntheticSimulator` returns deterministic demo flood results
- [ ] Results include: flood extent GeoJSON, max depth, flow direction, arrival times, affected area
- [ ] Results marked as `is_synthetic: true`
- [ ] Simulator is swappable via configuration

---

### T-012: Scenario Service
**Description:** Implement flood scenario creation, execution, and result storage.
**Dependencies:** T-005, T-011
**Acceptance Criteria:**
- [ ] Create scenario with breach parameters
- [ ] Validate parameters against reasonable physical ranges
- [ ] Run scenario (background job)
- [ ] Store results with flood extent geometry
- [ ] API endpoints: create, list, get, run scenario
- [ ] Service-level tests

---

### T-013: Impact Analysis Service
**Description:** Overlay flood extent with infrastructure to identify affected areas.
**Dependencies:** T-012, T-006
**Acceptance Criteria:**
- [ ] Spatial intersection of flood extent with infrastructure layers
- [ ] Identify affected: settlements, roads, bridges, agriculture, critical infrastructure
- [ ] Per-feature impact: estimated depth, arrival time
- [ ] Summary: total area, counts per type
- [ ] API endpoint: get impact for scenario
- [ ] Service-level tests

---

### T-014: Alert Engine
**Description:** Implement rule-based alert generation.
**Dependencies:** T-009, T-010
**Acceptance Criteria:**
- [ ] Alerts triggered by: significant change, status escalation, downstream water, new observation
- [ ] Alert includes: severity, type, title, reason, evidence, recommended action
- [ ] Deduplication within configurable cooldown window
- [ ] Alert history per dam
- [ ] API endpoints: list alerts, acknowledge alert
- [ ] Service-level tests

---

### T-015: Report Engine
**Description:** Implement auto-generated monitoring reports.
**Dependencies:** T-008, T-009, T-010, T-014
**Acceptance Criteria:**
- [ ] Report assembles: dam metadata, observations, changes, status, impact, alerts, evidence
- [ ] Report auto-updates on new data
- [ ] Report includes limitations disclaimer
- [ ] Synthetic data flagged in report
- [ ] API endpoints: list reports, get report, export (Markdown)
- [ ] Service-level tests

---

### T-016: API Foundation
**Description:** Wire all services to FastAPI routes following API.md contracts.
**Dependencies:** T-005, T-008, T-009, T-010, T-012, T-013, T-014, T-015
**Acceptance Criteria:**
- [ ] All endpoints defined in API.md are implemented
- [ ] Request/response schemas match contracts
- [ ] Error handling consistent
- [ ] Health endpoint functional
- [ ] Pagination working
- [ ] Auth required on all protected endpoints
- [ ] API-level tests for all endpoints

---

### T-017: Background Job Infrastructure
**Description:** Set up Celery/ARQ with Redis for background jobs.
**Dependencies:** T-001
**Acceptance Criteria:**
- [ ] Worker starts and connects to Redis
- [ ] Periodic task: observation fetch per dam
- [ ] Event-driven tasks: change detection, status update, alert evaluation, report update
- [ ] Job status tracking
- [ ] Failed job logging and retry (max 3)
- [ ] Worker monitoring (Flower or equivalent)

---

### T-018: End-to-End MVP Flow Test
**Description:** Test the complete monitoring loop with synthetic data.
**Dependencies:** T-001 through T-017
**Acceptance Criteria:**
- [ ] Create demo dam via API
- [ ] Fetch observations (synthetic)
- [ ] Change detection runs automatically
- [ ] Status computed correctly
- [ ] Alert generated when threshold exceeded
- [ ] Scenario created and run
- [ ] Impact analysis returns results
- [ ] Report generated with all sections
- [ ] Entire flow works without manual intervention (except dam creation)

---

## NEXT (Post-MVP Enhancement)

### T-100: Real Sentinel-2 Provider
Implement Copernicus Data Space API integration for Sentinel-2 optical imagery.

### T-101: Real Sentinel-1 Provider
Implement SAR data ingestion for all-weather water detection.

### T-102: Real DEM Integration
Ingest SRTM / Copernicus DEM for downstream terrain.

### T-103: Rainfall Data Integration
Integrate rainfall data source for external signal in risk engine.

### T-104: OpenStreetMap Infrastructure
Pull real infrastructure data from OSM for impact analysis.

### T-105: Hydrodynamic Solver Integration
Connect HEC-RAS or Delft3D via simulation abstraction.

### T-106: Improved Change Detection
NDWI-based water body extraction and comparison on real satellite data.

### T-107: Better Anomaly Detection
Statistical anomaly detection on observation time series.

### T-108: PDF Report Export
Render reports as formatted PDF documents.

### T-109: Email Notifications
Send alert notifications via email.

### T-110: Frontend Implementation
Build React dashboard following DESIGN_RULES.md.

---

## LATER (Future)

### T-200: Multi-Dam Cascade Analysis
Model cascade failure where one dam's breach affects downstream dams.

### T-201: Advanced AI Change Classification
Train ML classifier on labelled satellite change data.

### T-202: Institutional SSO Integration
SAML / OAuth integration for government organizations.

### T-203: Multi-Tenancy
Support multiple organizations with data isolation.

### T-204: Historical Event Replay
Replay past dam events using historical satellite data.

### T-205: Public Alert Portal
Read-only public view for downstream communities.

### T-206: Mobile Companion App
Lightweight mobile app for field engineers.

### T-207: Large-Scale Deployment
Kubernetes deployment for monitoring hundreds of dams.

### T-208: Automated Validation Pipeline
Continuous validation of model outputs against observed events.
