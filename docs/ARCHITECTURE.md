# JalSahayak — System Architecture

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## 1. Architecture Philosophy

- **Modular monolith** — logically separated services, single deployable unit for MVP
- **Clean interfaces** — every external dependency behind an abstraction layer
- **Progressive integration** — synthetic providers replaced with real ones over time
- **No unnecessary microservices** — split only when operationally justified

## 2. High-Level Architecture

```
                            ┌──────────────────────┐
                            │                      │
                            │     DASHBOARD        │
                            │   (React + TS)       │
                            │                      │
                            └──────────┬───────────┘
                                       │
                                  HTTPS / REST
                                       │
                            ┌──────────▼───────────┐
                            │                      │
                            │      API LAYER       │
                            │     (FastAPI)        │
                            │                      │
                            └──────────┬───────────┘
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 │                     │                     │
        ┌────────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
        │                 │   │                 │   │                │
        │   DAM SERVICE   │   │  MONITORING     │   │  SATELLITE     │
        │                 │   │  SERVICE        │   │  DATA SERVICE  │
        │  CRUD, metadata │   │  orchestration  │   │  fetch, ingest │
        │                 │   │                 │   │                │
        └────────┬────────┘   └────────┬────────┘   └───────┬────────┘
                 │                     │                     │
                 │              ┌──────▼──────┐              │
                 │              │             │              │
                 │              │  CHANGE     │◄─────────────┘
                 │              │  DETECTION  │
                 │              │             │
                 │              └──────┬──────┘
                 │                     │
                 │              ┌──────▼──────┐
                 │              │             │
                 │              │    RISK     │
                 │              │   ENGINE    │
                 │              │  (status)   │
                 │              │             │
                 │              └──────┬──────┘
                 │                     │
                 │         ┌───────────┼───────────┐
                 │         │                       │
                 │  ┌──────▼──────┐         ┌──────▼──────┐
                 │  │             │         │             │
                 │  │   FLOOD     │         │   ALERT     │
                 │  │  SCENARIO   │         │   ENGINE    │
                 │  │   ENGINE    │         │             │
                 │  │             │         └──────┬──────┘
                 │  └──────┬──────┘                │
                 │         │                       │
                 │  ┌──────▼──────┐                │
                 │  │             │                │
                 │  │   IMPACT    │                │
                 │  │   ENGINE    │                │
                 │  │             │                │
                 │  └──────┬──────┘                │
                 │         │                       │
                 │         └───────────┬───────────┘
                 │                     │
                 │              ┌──────▼──────┐
                 │              │             │
                 │              │   REPORT    │
                 │              │   ENGINE    │
                 │              │             │
                 │              └─────────────┘
                 │
        ┌────────▼────────────────────────────────────┐
        │                                             │
        │              DATA LAYER                     │
        │                                             │
        │  ┌────────────┐ ┌──────┐ ┌───────────────┐  │
        │  │ PostgreSQL │ │Redis │ │ Object Store  │  │
        │  │  + PostGIS │ │      │ │ (MinIO / S3)  │  │
        │  └────────────┘ └──────┘ └───────────────┘  │
        │                                             │
        └─────────────────────────────────────────────┘
```

## 3. Component Descriptions

### 3.1 Dashboard (Frontend)

**Purpose:** User-facing interface for dam monitoring, visualization, and interaction.

| Responsibility | Details |
|---|---|
| Dam management | List, add, view dams |
| Observation viewer | Satellite timeline, date comparison |
| Change visualization | Map-based change display |
| Scenario interface | Configure and view flood scenarios |
| Impact display | Affected-area overlay |
| Alert management | View, acknowledge alerts |
| Report viewer | View and export reports |

**Technology:** React + TypeScript + MapLibre GL JS

---

### 3.2 API Layer

**Purpose:** REST API gateway between frontend and backend services.

| Responsibility | Details |
|---|---|
| Request routing | Route to appropriate service |
| Authentication | JWT validation, role enforcement |
| Validation | Pydantic schema validation |
| Error handling | Consistent error response format |
| Rate limiting | Request throttling |

**Technology:** FastAPI + Uvicorn

---

### 3.3 Dam Service

**Purpose:** CRUD operations for dam registry.

| Input | Output |
|---|---|
| Dam metadata (name, river, coordinates, areas) | Stored dam record |
| Dam ID | Dam details with associated data |

**Dependencies:** Database only.

---

### 3.4 Monitoring Service

**Purpose:** Orchestrates the continuous monitoring loop for each dam.

```
FOR EACH DAM:
  Check for new observations → Run change detection → Update status → Evaluate alerts → Update report
```

| Responsibility | Details |
|---|---|
| Scheduling | Periodic observation checks per dam |
| Orchestration | Coordinates satellite, change, risk, alert, report services |
| State tracking | Tracks monitoring state per dam |

**Dependencies:** Satellite Data Service, Change Detection, Risk Engine, Alert Engine, Report Engine.

---

### 3.5 Satellite Data Service

**Purpose:** Abstracts satellite data fetching from specific providers.

```
┌────────────────────────────────────┐
│       Satellite Data Service       │
│                                    │
│  ┌──────────────────────────────┐  │
│  │   BaseSatelliteProvider      │  │
│  │   (abstract interface)       │  │
│  └──────────┬───────────────────┘  │
│             │                      │
│    ┌────────┼────────┐             │
│    │        │        │             │
│  Synthetic  Sentinel  Future       │
│  Provider   Provider  Providers    │
│                                    │
└────────────────────────────────────┘
```

| Responsibility | Details |
|---|---|
| Search | Find available observations for a dam's area and date range |
| Fetch | Download observation data |
| Ingest | Store data and create observation record |

**MVP:** Uses SyntheticProvider with deterministic demo data.

---

### 3.6 Change Detection

**Purpose:** Compares two observations and identifies meaningful changes.

| Input | Output |
|---|---|
| Observation A, Observation B | List of detected changes with type, severity, geometry, metrics |

**Change Types:**
- Water-spread change (area increase/decrease)
- Reservoir boundary change
- Downstream water appearance
- Land/water transition
- Significant surface change

**Method (MVP):** Threshold-based comparison of derived indices (e.g., NDWI difference). Synthetic provider returns scripted change results.

---

### 3.7 Risk Engine (Status Engine)

**Purpose:** Computes and updates dam health status based on evidence.

| Input | Output |
|---|---|
| Recent changes, current conditions, historical context | Status (NORMAL / WATCH / ALERT / CRITICAL) + reasons |

**Decision Logic:**

```
EVALUATE:
  recent_changes = get_recent_changes(dam_id, window=7_days)
  external_signals = get_external_signals(dam_id)  # rainfall, hydro data

  IF no significant changes AND no external signals:
    → NORMAL

  IF moderate change OR unusual single observation:
    → WATCH

  IF significant reservoir change OR downstream water + external signal:
    → ALERT

  IF multiple critical indicators OR confirmed anomaly:
    → CRITICAL

  ALWAYS attach reasons[] and evidence_ids[] to status record
```

---

### 3.8 Flood Scenario Engine

**Purpose:** Runs dam-break / flood scenarios and produces inundation estimates.

| Input | Output |
|---|---|
| Scenario parameters (breach, reservoir, duration, terrain) | Flood extent, depth, flow direction, arrival times |

**Architecture:**

```
┌──────────────────────────────────┐
│     Flood Scenario Engine        │
│                                  │
│  ┌────────────────────────────┐  │
│  │  BaseFloodSimulator        │  │
│  │  (abstract interface)      │  │
│  └──────────┬─────────────────┘  │
│             │                    │
│    ┌────────┼────────┐           │
│    │        │        │           │
│  Synthetic  Future:   Future:    │
│  Simulator  HEC-RAS  Delft3D    │
│                                  │
└──────────────────────────────────┘
```

**MVP:** SyntheticSimulator returns deterministic demo flood outputs.

---

### 3.9 Impact Engine

**Purpose:** Overlays flood extent with infrastructure/settlement data to identify affected areas.

| Input | Output |
|---|---|
| Flood extent polygon + infrastructure layers | List of affected features (settlements, roads, bridges, agriculture) with impact estimates |

**Method:** Spatial intersection of flood extent geometry with infrastructure layers (from database or GeoJSON files).

---

### 3.10 Alert Engine

**Purpose:** Generates evidence-based alerts when defined conditions are met.

| Input | Output |
|---|---|
| Changes, status transitions, scenarios | Alert records (severity, type, reason, evidence, recommended action) |

**Rules:**
- No duplicate alerts within cooldown window
- Every alert must have evidence references
- Alerts categorized: INFO / WARNING / CRITICAL

---

### 3.11 Report Engine

**Purpose:** Assembles and updates auto-generated monitoring reports per dam.

| Input | Output |
|---|---|
| Latest observation, changes, status, scenarios, alerts | Structured report (JSON → Markdown / HTML / PDF) |

**Trigger:** Updated whenever underlying data changes (new observation, change, status update, alert).

## 4. Data Flow

### 4.1 Monitoring Loop (Automatic)

```
                    SCHEDULER
                       │
                       ▼
              ┌─────────────────┐
              │ For each dam:   │
              │                 │
              │ 1. Search for   │
              │    new satellite│──────▶ Satellite Data Service
              │    observations │              │
              │                 │              ▼
              │ 2. If new data  │       Ingest & Store
              │    found:       │              │
              │                 │              ▼
              │ 3. Run change   │──────▶ Change Detection
              │    detection    │              │
              │                 │              ▼
              │ 4. Update dam   │──────▶ Risk Engine
              │    status       │              │
              │                 │              ▼
              │ 5. Evaluate     │──────▶ Alert Engine
              │    alerts       │              │
              │                 │              ▼
              │ 6. Update       │──────▶ Report Engine
              │    report       │
              │                 │
              └─────────────────┘
```

### 4.2 Scenario Flow (User-Initiated)

```
USER configures scenario
        │
        ▼
  API receives request
        │
        ▼
  Scenario Service validates & stores
        │
        ▼
  Flood Simulation Service runs
        │
        ▼
  Results stored (extent, depth, timing)
        │
        ▼
  Impact Engine overlays with infrastructure
        │
        ▼
  Results returned to user via API
```

## 5. Cross-Cutting Concerns

### 5.1 Authentication & Authorization
- JWT tokens issued on login
- Middleware validates token on every API request
- Role extracted from token, checked against endpoint requirements

### 5.2 Logging
- Structured JSON logs (structlog)
- Correlation ID per request
- Background job logs tagged with job ID + dam ID

### 5.3 Error Handling
- Service exceptions mapped to HTTP status codes
- Consistent error response schema: `{ "error": { "code": "...", "message": "...", "details": {} } }`
- Background job failures: logged, retried (max 3), then marked failed

### 5.4 Configuration
- Environment-based configuration (pydantic-settings)
- Secrets via environment variables (not in code)
- Per-dam configurable monitoring intervals

## 6. Deployment Architecture (MVP)

```
┌─────────────────────────────────────────────┐
│              Docker Compose                  │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ nginx   │  │ FastAPI  │  │  Worker   │  │
│  │ + React │  │ (API)    │  │ (Celery)  │  │
│  │ static  │  │          │  │           │  │
│  └────┬────┘  └────┬─────┘  └─────┬─────┘  │
│       │            │              │         │
│       │       ┌────▼─────────────▼────┐     │
│       │       │     Internal Network   │     │
│       │       └────┬─────────────┬────┘     │
│       │       ┌────▼────┐  ┌─────▼─────┐    │
│       │       │PostgreSQL│  │   Redis   │    │
│       │       │+ PostGIS │  │           │    │
│       │       └─────────┘  └───────────┘    │
│       │       ┌─────────┐                   │
│       │       │  MinIO  │                   │
│       │       │ (S3)    │                   │
│       │       └─────────┘                   │
└───────┴─────────────────────────────────────┘
```

## 7. Key Architecture Decisions

| Decision | Rationale |
|---|---|
| Modular monolith over microservices | Simpler deployment, debugging, and development for MVP |
| Abstract provider interfaces | Enables progressive replacement of synthetic with real data |
| PostGIS for spatial data | Industry standard; avoids separate geospatial database |
| Redis for job queue | Lightweight, proven, works with Celery |
| Object storage for imagery | Keeps database lean; scales independently |
| JWT for auth | Stateless, simple, sufficient for MVP |
| Event-driven internal pipeline | Change detection triggers status → alert → report automatically |

## 8. Scalability Path

MVP runs on a single server. Future scaling options:

1. **Vertical:** Larger server for more dams
2. **Worker scaling:** Multiple Celery workers for parallel observation processing
3. **Read replicas:** PostgreSQL replicas for dashboard queries
4. **Service extraction:** If a service becomes a bottleneck, extract to separate deployment
5. **CDN:** Static assets and rendered map tiles via CDN
