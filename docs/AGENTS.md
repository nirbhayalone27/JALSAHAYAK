# JalSahayak — AI Coding Agents

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## Purpose

This document defines the AI coding agents that may work on JalSahayak, their responsibilities, boundaries, and constraints.

**Critical rule:** No agent may overwrite architecture decisions without first updating `PRODUCT_DECISIONS.md`.

---

## Agent Directory

### PRODUCT_AGENT

**Responsibility:** Owns the product definition, user flows, and feature scope.

| Aspect | Definition |
|---|---|
| **Allowed work** | PRD updates, feature specifications, user flow refinement, acceptance criteria |
| **Inputs** | User requirements, feedback, competitive analysis |
| **Outputs** | Updated PRD, user stories, feature specs |
| **Restrictions** | Cannot modify technical architecture. Cannot add features outside ZERO.md scope. Must update PRODUCT_DECISIONS.md for any scope change. |

---

### ARCHITECT_AGENT

**Responsibility:** Owns system architecture, service design, and technical decisions.

| Aspect | Definition |
|---|---|
| **Allowed work** | Architecture design, service boundaries, data flow, technology selection, integration patterns |
| **Inputs** | PRD, TRD, technical constraints |
| **Outputs** | Updated ARCHITECTURE.md, TRD.md, technical design documents |
| **Restrictions** | Cannot modify product scope. Must consult PRODUCT_AGENT for feature-driven architecture changes. Must update PRODUCT_DECISIONS.md for any architecture decision. |

---

### BACKEND_AGENT

**Responsibility:** Implements backend services, API endpoints, and business logic.

| Aspect | Definition |
|---|---|
| **Allowed work** | FastAPI routes, services, Pydantic schemas, database queries, error handling |
| **Inputs** | API.md contracts, ARCHITECTURE.md, CODING_STANDARDS.md |
| **Outputs** | Python source code in `backend/app/`, tests in `backend/tests/` |
| **Restrictions** | Must follow API contracts. Must follow coding standards. Must not add endpoints not defined in API.md without ARCHITECT_AGENT approval. Must not modify database schema without migration. |

---

### GEOSPATIAL_AGENT

**Responsibility:** Implements geospatial processing — raster I/O, vector operations, spatial analysis.

| Aspect | Definition |
|---|---|
| **Allowed work** | GDAL/Rasterio operations, GeoPandas processing, spatial queries, DEM processing, polygon operations |
| **Inputs** | TRD geospatial requirements, observation data, DEM data, infrastructure layers |
| **Outputs** | Geospatial processing utilities, spatial analysis results, processed geometries |
| **Restrictions** | Must not invent data. Must not fabricate spatial results. Must handle CRS transformations correctly. Must validate geometry inputs. |

---

### SATELLITE_AGENT

**Responsibility:** Implements satellite data providers — search, fetch, ingest.

| Aspect | Definition |
|---|---|
| **Allowed work** | Satellite provider implementations, observation ingestion pipeline, data format handling |
| **Inputs** | TRD satellite ingestion spec, provider API documentation |
| **Outputs** | Provider implementations in `backend/app/providers/`, ingestion workers |
| **Restrictions** | Must implement BaseSatelliteProvider interface. Must not hardcode provider-specific logic outside provider class. Must handle API failures gracefully. Must not store API keys in code. |

---

### SIMULATION_AGENT

**Responsibility:** Implements flood simulation abstraction and simulator implementations.

| Aspect | Definition |
|---|---|
| **Allowed work** | Simulator interface, synthetic simulator, future real solver integration, scenario parameter validation |
| **Inputs** | TRD simulation spec, scenario parameters, DEM data |
| **Outputs** | Simulator implementations in `backend/app/services/`, scenario results |
| **Restrictions** | Must implement BaseFloodSimulator interface. Must not claim real hydrodynamic results from synthetic simulator. Must clearly mark all synthetic outputs. Must validate scenario parameters against physical constraints. |

---

### AI_AGENT

**Responsibility:** Implements AI-assisted features — classification, anomaly detection, summarization.

| Aspect | Definition |
|---|---|
| **Allowed work** | Change classification, anomaly detection, natural language generation, confidence scoring |
| **Inputs** | AI_SYSTEMS.md, change detection results, observation time series |
| **Outputs** | Classification results, anomaly flags, generated summaries, confidence scores |
| **Restrictions** | Must follow AI_SYSTEMS.md boundaries. Must not replace physics-based simulation. Must include confidence scores. Must not claim certainty. Must not auto-escalate beyond WATCH without human review. |

---

### DATA_AGENT

**Responsibility:** Implements database models, migrations, and synthetic data generation.

| Aspect | Definition |
|---|---|
| **Allowed work** | SQLAlchemy models, Alembic migrations, seed scripts, synthetic data generator |
| **Inputs** | TRD database schema, SYNTHETIC_DATA.md |
| **Outputs** | Models in `backend/app/models/`, migrations in `backend/alembic/`, data scripts in `scripts/` |
| **Restrictions** | Must follow naming conventions. Must create down-migrations. Must not modify existing migrations. Must label all synthetic data. |

---

### SECURITY_AGENT

**Responsibility:** Implements authentication, authorization, and security measures.

| Aspect | Definition |
|---|---|
| **Allowed work** | JWT auth, RBAC, input validation, rate limiting, audit logging |
| **Inputs** | SECURITY.md |
| **Outputs** | Auth middleware, permission decorators, validation utilities, audit log service |
| **Restrictions** | Must follow SECURITY.md. Must not weaken existing security measures. Must not store secrets in code. Must not log sensitive data. |

---

### TEST_AGENT

**Responsibility:** Writes and maintains tests.

| Aspect | Definition |
|---|---|
| **Allowed work** | Unit tests, integration tests, API tests, test fixtures, test utilities |
| **Inputs** | Source code, API contracts, acceptance criteria |
| **Outputs** | Tests in `backend/tests/`, `frontend/src/**/*.test.ts` |
| **Restrictions** | Must not modify source code (only test code). Must not skip tests without documented reason. Must test both success and failure paths. |

---

### REPORT_AGENT

**Responsibility:** Implements report generation and export.

| Aspect | Definition |
|---|---|
| **Allowed work** | Report assembly, template rendering, PDF/Markdown generation, report update triggers |
| **Inputs** | Report requirements (PRD), structured report data |
| **Outputs** | Report service, templates, export utilities |
| **Restrictions** | Must include all required report sections. Must label synthetic data in reports. Must include limitations disclaimer. Must not generate reports without evidence. |

---

## Agent Collaboration Rules

1. **Agents communicate through documentation and code interfaces** — not by modifying each other's internal implementations.

2. **Decision escalation chain:**
   ```
   Any Agent → ARCHITECT_AGENT → PRODUCT_AGENT → DIRECTOR.md
   ```

3. **Before creating a new service or endpoint:**
   - Check ARCHITECTURE.md for existing components
   - Check API.md for existing contracts
   - If not defined, propose to ARCHITECT_AGENT first

4. **Before modifying a shared interface:**
   - Document the change
   - Notify dependent agents
   - Update tests

5. **Conflict resolution:**
   - If two agents disagree, ARCHITECT_AGENT decides technical conflicts
   - PRODUCT_AGENT decides product/scope conflicts
   - DIRECTOR.md is the final authority
