# JalSahayak — Project Memory

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## Purpose

This is the persistent memory of the JalSahayak project. It captures the current state of the project, key context, and decisions that any developer or AI agent needs to know. **Update this file whenever major product or technical context changes.**

---

## 1. Product Definition

**JalSahayak** is a focused dam-monitoring and flood-intelligence platform.

**Core loop:**
```
MONITOR DAM → GET OBSERVATION → COMPARE WITH HISTORY → DETECT CHANGE
  → UPDATE STATUS → ALERT IF NEEDED → ESTIMATE FLOOD IMPACT
    → IDENTIFY AFFECTED AREAS → GENERATE REPORT
```

**What it is:**
- Dam health monitoring system
- Satellite-based change detection for dams and reservoirs
- Flood scenario analysis tool
- Downstream impact assessment
- Alert and reporting platform

**What it is NOT:**
- Generic disaster management platform
- Satellite search engine
- Official government warning system
- Real-time monitoring system
- AI prediction oracle

---

## 2. Core Decisions

Reference: `docs/PRODUCT_DECISIONS.md` for full decision log.

**Key decisions (summary):**
1. Product focused on dam monitoring + flood intelligence only
2. Satellite data is one evidence layer, not the whole product
3. AI assists interpretation; physics models simulate floods
4. Modular monolith architecture for MVP
5. No unnecessary microservices
6. No fake accuracy or real-time claims
7. Every alert must have evidence
8. Synthetic data always labelled
9. Progressive real-data integration
10. Four-level status: NORMAL → WATCH → ALERT → CRITICAL

---

## 3. Architecture Principles

- **Modular monolith:** Single deployable unit, logically separated services
- **Abstract providers:** Satellite and simulation behind interfaces for swappability
- **Event-driven pipeline:** Observation → change detection → status → alert → report (automatic chain)
- **PostGIS for spatial:** All geometry in PostgreSQL with spatial indexes
- **Background jobs:** Redis + Celery for periodic and event-driven tasks
- **Object storage:** Imagery and results in MinIO/S3

---

## 4. Current Implementation State

| Component | Status |
|---|---|
| Documentation | ✅ Complete (Phase 0) |
| Project foundation (T-001) | ✅ Complete |
| Database schema & migrations (T-002) | ✅ Complete |
| Pydantic schemas (T-003) | ✅ Complete |
| Authentication (T-004) | ⬜ Not started |
| Dam service (T-005) | ⬜ Not started |
| Synthetic data | ⬜ Not started |
| Satellite provider | ⬜ Not started |
| Observation pipeline | ⬜ Not started |
| Change detection | ⬜ Not started |
| Status engine | ⬜ Not started |
| Flood simulation | ⬜ Not started |
| Scenario service | ⬜ Not started |
| Impact analysis | ⬜ Not started |
| Alert engine | ⬜ Not started |
| Report engine | ⬜ Not started |
| API endpoints | ⬜ Not started |
| Background jobs | ⬜ Not started |
| Frontend | 🟡 Scaffolded (UI deferred per rules) |

**Current phase:** Phase 1 — MVP Foundation (in progress)  
**Next tasks:** T-004 (Authentication), T-005 (Dam Service)

---

## 5. Known Limitations

1. **No real satellite data yet.** MVP uses synthetic observations.
2. **No real hydrodynamic simulation.** MVP uses synthetic flood results.
3. **Structural failure detection is beyond current scope.** Satellite observes surface changes only.
4. **Observation frequency limited by satellite revisit.** Not real-time.
5. **Infrastructure data is synthetic.** Real OSM/government data integration is future work.
6. **Single-server deployment.** Scaling requires architectural changes.
7. **No mobile app.** Desktop-first with responsive web.

---

## 6. Important Datasets

| Dataset | Purpose | Status |
|---|---|---|
| Demo dams (3) | Testing, demo | To be generated |
| Synthetic observations | Change detection testing | To be generated |
| Synthetic DEM | Flood simulation input | To be generated |
| Synthetic infrastructure | Impact analysis testing | To be generated |
| Synthetic scenarios | Flood result demo | To be generated |
| Sentinel-2 | Real optical satellite | Future (Phase 9) |
| Sentinel-1 | Real SAR satellite | Future (Phase 9) |
| SRTM / NASADEM | Real DEM | Future (Phase 8) |
| OpenStreetMap | Real infrastructure | Future (T-104) |

---

## 7. Important Assumptions

1. Users are technical professionals (dam engineers, water resource officers)
2. MVP will monitor up to 50 dams
3. Observation fetch frequency: every 6 hours (configurable)
4. Satellite data has days-level latency (not minutes)
5. A single server can handle MVP load
6. Indian dams are the initial geographic focus
7. English is the primary interface language for MVP

---

## 8. Pending Decisions

| Decision | Context | Owner |
|---|---|---|
| Exact satellite data source for Phase 9 | Copernicus CDSE vs other providers | ARCHITECT_AGENT |
| Hydrodynamic solver for Phase 8 | HEC-RAS vs Delft3D vs other | SIMULATION_AGENT |
| PDF rendering library | WeasyPrint vs ReportLab vs other | REPORT_AGENT |
| Task queue choice | Celery vs ARQ | ARCHITECT_AGENT |
| Frontend state management | Context+useReducer vs Zustand | ARCHITECT_AGENT |
| Email provider for notifications | Post-MVP decision | PRODUCT_AGENT |

---

## 9. Technology Stack (Confirmed)

| Layer | Choice | Version |
|---|---|---|
| Frontend | React + TypeScript | React 18+ |
| Build tool | Vite | Latest |
| Map library | MapLibre GL JS | Latest |
| Backend | Python + FastAPI | Python 3.11+, FastAPI 0.100+ |
| ORM | SQLAlchemy 2.0 + GeoAlchemy2 | Latest |
| Database | PostgreSQL + PostGIS | PG 15+, PostGIS 3.3+ |
| Cache / Queue | Redis | 7+ |
| Object storage | MinIO (dev) / S3 (prod) | Latest |
| Geospatial | GDAL, Rasterio, GeoPandas, Shapely | Latest |
| Containerization | Docker + Docker Compose | Latest |

---

## 10. Document Map

```
DIRECTOR.md ←── Project authority
      ↓
PRD.md ←── Product requirements
      ↓
PRODUCT_DECISIONS.md ←── Decision log
      ↓
TRD.md ←── Technical requirements
      ↓
ARCHITECTURE.md ←── System design
      ↓
API.md ←── REST contracts
      ↓
TASKS.md ←── Implementation backlog
      ↓
Implementation code

Supporting docs:
  RULES.md ←── Engineering rules
  CODING_STANDARDS.md ←── Code conventions
  DESIGN_RULES.md ←── UI rules (future)
  SECURITY.md ←── Security design
  AI_SYSTEMS.md ←── AI boundaries
  SYNTHETIC_DATA.md ←── Demo data plan
  ROADMAP.md ←── Phased plan
  MEMORY.md ←── This file
  AGENTS.md ←── Agent definitions
  ZERO.md ←── What not to build
```
