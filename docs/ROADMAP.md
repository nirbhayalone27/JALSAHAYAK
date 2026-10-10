# JalSahayak — Roadmap

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## Phase 0 — Product Definition

**Goal:** Establish complete product, architecture, and engineering documentation before any code is written.

**Features:**
- Product requirements document (PRD)
- Technical requirements document (TRD)
- System architecture design
- API contracts
- AI systems definition
- Security design
- Synthetic data strategy
- Coding standards
- Engineering rules
- Implementation backlog

**Exit Criteria:**
- [ ] All documentation files created and reviewed
- [ ] No contradictions between documents
- [ ] Clear implementation order defined
- [ ] Decision log initialized

---

## Phase 1 — MVP Foundation

**Goal:** Set up project infrastructure, database, and core models.

**Features:**
- Project repository structure (backend + frontend scaffolding)
- PostgreSQL + PostGIS database setup
- Alembic migration framework
- SQLAlchemy models for all core entities (dam, observation, change, status, scenario, impact, alert, report, user)
- Pydantic schemas for all request/response types
- FastAPI app skeleton with health endpoint
- Redis setup for background jobs
- Object storage setup (MinIO)
- Docker Compose for local development
- Basic authentication (JWT)
- Synthetic data generation script

**Exit Criteria:**
- [ ] `docker-compose up` starts all services
- [ ] Database migrations run successfully
- [ ] Health endpoint returns healthy
- [ ] Authentication works (login, JWT validation)
- [ ] Synthetic data generated for 3 demo dams

---

## Phase 2 — Dam Monitoring

**Goal:** Implement dam CRUD and monitoring state management.

**Features:**
- Dam service (create, read, update, delete)
- Dam API endpoints (`/dams`, `/dams/{id}`)
- Dam monitoring configuration (intervals, areas)
- Monitoring service skeleton (periodic check orchestration)

**Exit Criteria:**
- [ ] Can create a dam via API with all required fields
- [ ] Can list and view dams
- [ ] Dam record includes spatial fields (location, reservoir, monitoring area, downstream)
- [ ] Monitoring service can be triggered for a dam

---

## Phase 3 — Satellite Ingestion + Date Comparison

**Goal:** Implement satellite observation pipeline with synthetic provider.

**Features:**
- Satellite provider abstraction (`BaseSatelliteProvider`)
- Synthetic satellite provider (returns demo observations)
- Observation ingestion and storage
- Observation API endpoints (`/dams/{id}/observations`)
- Observation timeline per dam
- Background job: periodic observation fetch

**Exit Criteria:**
- [ ] Synthetic observations ingested for demo dams
- [ ] Observation timeline API returns chronological records
- [ ] Background job fetches new observations on schedule
- [ ] Observation data stored in object storage with metadata in database

---

## Phase 4 — Change Detection

**Goal:** Implement comparison between observations and detect meaningful changes.

**Features:**
- Change detection service
- Rule-based change classification (water spread, boundary, downstream water, surface)
- Change severity assessment
- Change API endpoints (`/dams/{id}/changes`, compare endpoint)
- Change history per dam

**Exit Criteria:**
- [ ] Two observations can be compared and changes detected
- [ ] Changes classified by type and severity
- [ ] Change results include geometry and metrics
- [ ] Change detection runs automatically after new observation ingestion

---

## Phase 5 — Flood Scenario Engine

**Goal:** Implement flood/dam-break scenario configuration and simulation abstraction.

**Features:**
- Scenario service (create, configure, run)
- Flood simulator abstraction (`BaseFloodSimulator`)
- Synthetic simulator (deterministic demo outputs)
- Scenario API endpoints (`/dams/{id}/scenarios`, `/scenarios/{id}`, `/scenarios/{id}/run`)
- Scenario results with flood extent, depth, arrival times

**Exit Criteria:**
- [ ] Scenario can be created with breach parameters
- [ ] Simulation runs and returns deterministic results
- [ ] Flood extent returned as GeoJSON
- [ ] Arrival times computed for downstream distances
- [ ] Results clearly marked as synthetic

---

## Phase 6 — Impact Analysis

**Goal:** Overlay flood extent with infrastructure to identify affected areas.

**Features:**
- Impact analysis service
- Spatial intersection of flood extent with infrastructure layers
- Impact API endpoint (`/scenarios/{id}/impact`)
- Impact summary (area, settlements, roads, bridges, agriculture)
- Per-feature impact details

**Exit Criteria:**
- [ ] Flood extent overlaid with demo infrastructure data
- [ ] Affected settlements, roads, bridges, agriculture identified
- [ ] Impact summary with counts and area returned via API
- [ ] Per-feature impact includes estimated depth and arrival time

---

## Phase 7 — Alerts + Automatic Reports

**Goal:** Implement alert generation and auto-generated reports.

**Features:**
- Alert engine with rule-based triggers
- Alert deduplication and cooldown
- Alert API endpoints (`/dams/{id}/alerts`, `/alerts/{id}/acknowledge`)
- Report engine (JSON → Markdown / HTML)
- Report API endpoints (`/dams/{id}/reports`, `/reports/{id}`, export)
- Report auto-update on data changes

**Exit Criteria:**
- [ ] Alerts generated when change thresholds exceeded
- [ ] Every alert has severity, reason, evidence, recommended action
- [ ] No duplicate alerts within cooldown window
- [ ] Report auto-generated per dam with all required sections
- [ ] Report updates when new data arrives
- [ ] Report exportable as PDF/Markdown

---

## Phase 8 — Real Hydrodynamic Integration

**Goal:** Connect a real hydrodynamic solver for flood simulation.

**Features:**
- HEC-RAS or Delft3D integration via simulator abstraction
- Real DEM ingestion (SRTM / Copernicus DEM)
- Solver configuration and calibration interface
- Validation against known flood events

**Exit Criteria:**
- [ ] At least one real solver connected
- [ ] Simulation runs with real DEM data
- [ ] Results validated against at least one historical event
- [ ] Solver swap transparent to rest of system (abstraction works)

---

## Phase 9 — Real-World Validation

**Goal:** Validate the system with real data for at least one Indian dam.

**Features:**
- Real Sentinel-2 / Sentinel-1 integration via Copernicus provider
- Real satellite observations ingested for validation dam
- Change detection tested on real observation pairs
- Flood scenario calibrated against known dam parameters
- Impact analysis validated against ground truth data
- Report reviewed by domain expert

**Exit Criteria:**
- [ ] Real satellite data flowing for at least one dam
- [ ] Change detection results assessed by expert
- [ ] Flood simulation compared with historical inundation data
- [ ] Report quality acceptable for institutional review
- [ ] Limitations documented based on real-world findings

---

## Phase 10 — Institutional Pilot

**Goal:** Deploy for a real institutional user (water resources department, dam safety agency).

**Features:**
- Multi-user authentication and role management
- Production deployment (cloud or on-premise)
- Monitoring and alerting infrastructure
- User training documentation
- Performance optimization for production load
- Data backup and recovery procedures
- Security hardening audit

**Exit Criteria:**
- [ ] System deployed in production environment
- [ ] At least one institutional user trained and using the system
- [ ] 5+ dams monitored continuously for 30+ days
- [ ] Alert and report quality validated by institutional user
- [ ] SLA defined and monitored
- [ ] Feedback loop established for product improvement

---

## Timeline Summary

| Phase | Description | Duration (est.) |
|---|---|---|
| 0 | Product definition | 1 week |
| 1 | MVP foundation | 2 weeks |
| 2 | Dam monitoring | 1 week |
| 3 | Satellite ingestion | 2 weeks |
| 4 | Change detection | 2 weeks |
| 5 | Flood scenario engine | 2 weeks |
| 6 | Impact analysis | 1 week |
| 7 | Alerts + reports | 2 weeks |
| 8 | Real hydro integration | 4–6 weeks |
| 9 | Real-world validation | 4–6 weeks |
| 10 | Institutional pilot | 4–8 weeks |

**MVP (Phases 0–7):** ~13 weeks  
**Full validation (through Phase 9):** ~25 weeks  
**Pilot (through Phase 10):** ~35 weeks
