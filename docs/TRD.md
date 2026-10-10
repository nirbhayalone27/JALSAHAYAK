# JalSahayak — Technical Requirements Document (TRD)

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## 1. System Overview

JalSahayak is a modular monolith application with a React frontend, Python/FastAPI backend, PostgreSQL+PostGIS database, Redis-backed background jobs, and abstracted service layers for satellite data, flood simulation, and impact analysis.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend   │────▶│   REST API   │────▶│  Service Layer   │
│  React + TS  │     │   FastAPI    │     │  (Python modules) │
└──────────────┘     └──────────────┘     └────────┬─────────┘
                                                   │
                            ┌──────────────────────┼──────────────────────┐
                            │                      │                      │
                     ┌──────▼──────┐       ┌───────▼───────┐     ┌───────▼───────┐
                     │  PostgreSQL │       │     Redis     │     │ Object Store  │
                     │  + PostGIS  │       │  (Job Queue)  │     │  (Imagery)    │
                     └─────────────┘       └───────────────┘     └───────────────┘
```

## 2. Frontend

### Technology
- **Framework:** React 18+
- **Language:** TypeScript (strict mode)
- **Build tool:** Vite
- **Map library:** MapLibre GL JS (open-source, no vendor lock-in)
- **State management:** React Context + useReducer for MVP; evaluate Zustand if complexity grows
- **HTTP client:** Axios or native fetch with typed wrappers
- **Charting:** Recharts or lightweight alternative
- **Styling:** CSS Modules or vanilla CSS (no TailwindCSS unless explicitly requested)

### Responsibilities
- Dam list, dam overview, dam detail views
- Satellite observation timeline and comparison viewer
- Change detection result display
- Flood scenario configuration and result visualization
- Impact area overlay on map
- Alert list and detail views
- Report viewer and export trigger
- Authentication UI (login, session management)

### Key Principles
- Desktop-first, responsive
- Map-first where geographic context is relevant
- Minimal navigation depth (max 3 levels)
- No overcrowded dashboards

## 3. Backend

### Technology
- **Framework:** FastAPI (Python 3.11+)
- **ASGI server:** Uvicorn
- **Validation:** Pydantic v2
- **ORM:** SQLAlchemy 2.0 (async) + GeoAlchemy2 for PostGIS
- **Migration:** Alembic
- **Task queue:** Celery with Redis broker (or ARQ as lighter alternative)
- **Testing:** pytest + pytest-asyncio + httpx (TestClient)

### Structure (Modular Monolith)

```
backend/
├── app/
│   ├── main.py                  # FastAPI app entry
│   ├── config.py                # Settings (pydantic-settings)
│   ├── database.py              # DB session management
│   ├── models/                  # SQLAlchemy models
│   │   ├── dam.py
│   │   ├── observation.py
│   │   ├── change.py
│   │   ├── status.py
│   │   ├── scenario.py
│   │   ├── impact.py
│   │   ├── alert.py
│   │   └── report.py
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── services/                # Business logic
│   │   ├── dam_service.py
│   │   ├── monitoring_service.py
│   │   ├── satellite_service.py
│   │   ├── change_detection_service.py
│   │   ├── status_engine.py
│   │   ├── scenario_service.py
│   │   ├── flood_simulation_service.py
│   │   ├── impact_service.py
│   │   ├── alert_service.py
│   │   └── report_service.py
│   ├── providers/               # External data providers (abstracted)
│   │   ├── base_satellite_provider.py
│   │   ├── sentinel_provider.py
│   │   └── synthetic_provider.py
│   ├── api/                     # Route definitions
│   │   ├── dams.py
│   │   ├── observations.py
│   │   ├── scenarios.py
│   │   ├── alerts.py
│   │   └── reports.py
│   ├── workers/                 # Background tasks
│   │   ├── observation_fetcher.py
│   │   ├── change_detector.py
│   │   ├── status_updater.py
│   │   └── report_generator.py
│   └── utils/                   # Shared utilities
├── alembic/                     # Database migrations
├── tests/
└── requirements.txt
```

### Key Principles
- Service/repository pattern: routes → services → repositories (models)
- Type hints on all function signatures
- Pydantic for all external-facing data
- No business logic in route handlers
- Structured logging (JSON)
- Exception hierarchy with proper HTTP mapping

## 4. Database

### Technology
- **Engine:** PostgreSQL 15+
- **Spatial extension:** PostGIS 3.3+
- **Connection pooling:** asyncpg via SQLAlchemy async

### Core Tables

```sql
-- Dam registry
dams (
    id UUID PK,
    name VARCHAR NOT NULL,
    river VARCHAR,
    state VARCHAR,
    district VARCHAR,
    location GEOMETRY(Point, 4326),
    reservoir_area GEOMETRY(Polygon, 4326),
    monitoring_area GEOMETRY(Polygon, 4326),
    downstream_region GEOMETRY(Polygon, 4326),
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)

-- Satellite / environmental observations
observations (
    id UUID PK,
    dam_id UUID FK → dams,
    observation_date DATE NOT NULL,
    source VARCHAR NOT NULL,          -- sentinel-2, synthetic, etc.
    data_type VARCHAR NOT NULL,       -- optical, sar, derived
    coverage_pct FLOAT,
    quality VARCHAR,
    storage_path VARCHAR,             -- path in object store
    metadata JSONB,
    ingested_at TIMESTAMPTZ
)

-- Change detection results
changes (
    id UUID PK,
    dam_id UUID FK → dams,
    observation_a_id UUID FK → observations,
    observation_b_id UUID FK → observations,
    change_type VARCHAR NOT NULL,     -- water_spread, boundary, surface, etc.
    severity VARCHAR,
    description TEXT,
    change_geometry GEOMETRY(Polygon, 4326),
    metrics JSONB,
    detected_at TIMESTAMPTZ
)

-- Dam status history
statuses (
    id UUID PK,
    dam_id UUID FK → dams,
    status VARCHAR NOT NULL,          -- NORMAL, WATCH, ALERT, CRITICAL
    previous_status VARCHAR,
    reasons JSONB NOT NULL,           -- array of reason objects
    evidence_ids UUID[],              -- references to changes, observations
    computed_at TIMESTAMPTZ
)

-- Flood / dam-break scenarios
scenarios (
    id UUID PK,
    dam_id UUID FK → dams,
    name VARCHAR,
    parameters JSONB NOT NULL,        -- reservoir_level, breach_width, etc.
    status VARCHAR,                   -- draft, running, completed, failed
    result JSONB,                     -- flood_extent, depth, arrival_time, etc.
    flood_extent GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
)

-- Impact analysis results
impacts (
    id UUID PK,
    scenario_id UUID FK → scenarios,
    impact_type VARCHAR NOT NULL,     -- settlement, road, bridge, agriculture
    feature_name VARCHAR,
    feature_geometry GEOMETRY(Geometry, 4326),
    estimated_impact JSONB,           -- depth, area, etc.
    metadata JSONB
)

-- Alerts
alerts (
    id UUID PK,
    dam_id UUID FK → dams,
    severity VARCHAR NOT NULL,        -- INFO, WARNING, CRITICAL
    alert_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    reason TEXT NOT NULL,
    evidence JSONB,
    recommended_action TEXT,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ
)

-- Reports
reports (
    id UUID PK,
    dam_id UUID FK → dams,
    monitoring_period_start DATE,
    monitoring_period_end DATE,
    content JSONB NOT NULL,           -- structured report data
    generated_at TIMESTAMPTZ,
    version INTEGER DEFAULT 1
)

-- Users
users (
    id UUID PK,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    name VARCHAR,
    role VARCHAR NOT NULL,            -- admin, engineer, viewer
    created_at TIMESTAMPTZ
)
```

### Indexes
- `dams.location` — GIST spatial index
- `dams.reservoir_area` — GIST spatial index
- `observations(dam_id, observation_date)` — composite B-tree
- `changes(dam_id, detected_at)` — composite B-tree
- `statuses(dam_id, computed_at)` — composite B-tree
- `alerts(dam_id, created_at)` — composite B-tree
- `scenarios.flood_extent` — GIST spatial index
- `impacts.feature_geometry` — GIST spatial index

## 5. Geospatial Processing

### Libraries
- **GDAL** — raster/vector I/O, reprojection, format conversion
- **Rasterio** — Python-friendly raster I/O
- **GeoPandas** — vector data manipulation
- **Shapely** — geometry operations
- **pyproj** — coordinate transformations

### Operations Required
- Raster ingestion and tiling
- Water-body extraction (NDWI / threshold-based for optical)
- Polygon comparison (intersection, difference, area change)
- DEM processing (slope, flow direction, flow accumulation)
- Flood extent polygon generation
- Spatial overlay (flood extent × infrastructure layers)

## 6. Satellite Data Ingestion

### Architecture
Abstract provider interface so multiple sources can be plugged in:

```python
class BaseSatelliteProvider(ABC):
    @abstractmethod
    async def search(self, bbox, date_range, cloud_cover_max) -> list[ObservationMeta]: ...

    @abstractmethod
    async def fetch(self, observation_id) -> ObservationData: ...

    @abstractmethod
    def get_provider_name(self) -> str: ...
```

### MVP Provider: Synthetic
- Returns pre-built deterministic demo observations
- Dates, extents, and change patterns are scripted

### Future Provider: Copernicus / Sentinel
- Sentinel-2 (optical, 10m) — water body mapping, NDWI
- Sentinel-1 (SAR) — all-weather water detection
- Access via Copernicus Data Space Ecosystem APIs

### Ingestion Pipeline
```
SCHEDULER (periodic)
      │
      ▼
SEARCH provider for new observations per dam
      │
      ▼
NEW OBSERVATION found?
      │
     Yes → FETCH data → STORE in object storage → CREATE observation record
      │
      ▼
TRIGGER change detection (vs previous observation)
```

## 7. Data Pipeline

```
┌──────────────────────────────────────────────────────┐
│                  SCHEDULER (cron / periodic)          │
│                                                      │
│  For each monitored dam:                             │
│    1. Check satellite provider for new data           │
│    2. Ingest new observation                          │
│    3. Run change detection (current vs previous)      │
│    4. Evaluate status rules                           │
│    5. Generate alert if threshold met                 │
│    6. Update report                                   │
│                                                      │
│  Frequency: configurable per dam (default: 6h)       │
└──────────────────────────────────────────────────────┘
```

## 8. Simulation Service

### Abstraction Layer

```python
class BaseFloodSimulator(ABC):
    @abstractmethod
    async def run(self, scenario_params: ScenarioParams) -> SimulationResult: ...

class SyntheticSimulator(BaseFloodSimulator):
    """Deterministic demo results for MVP."""
    async def run(self, params): ...

class HydrodynamicSimulator(BaseFloodSimulator):
    """Future: wraps Delft3D, HEC-RAS, or SPH solver."""
    async def run(self, params): ...
```

### Scenario Parameters (MVP)
```json
{
  "reservoir_level_m": 145.0,
  "breach_width_m": 50.0,
  "breach_depth_m": 30.0,
  "breach_formation_time_hr": 1.0,
  "release_condition": "sudden",
  "simulation_duration_hr": 24.0,
  "downstream_terrain_dem": "dem_reference_id"
}
```

### Simulation Output (MVP)
```json
{
  "flood_extent_geojson": { ... },
  "max_depth_m": 8.5,
  "flow_direction": "SE",
  "arrival_times": [
    { "distance_km": 5, "arrival_hr": 1.2 },
    { "distance_km": 10, "arrival_hr": 2.8 }
  ],
  "affected_area_km2": 42.5,
  "is_synthetic": true
}
```

## 9. Alert Engine

### Architecture
- Alert rules evaluated after each change detection run and status update
- Rules are configurable per dam
- Deduplication: no duplicate alerts within configurable cooldown window
- Alert delivery: in-app (MVP), email (post-MVP)

### Alert Evaluation
```python
def evaluate_alerts(dam_id, changes, current_status, previous_status):
    alerts = []
    if significant_water_change(changes):
        alerts.append(AlertTemplate.RESERVOIR_CHANGE)
    if downstream_water_increase(changes):
        alerts.append(AlertTemplate.DOWNSTREAM_CHANGE)
    if current_status != previous_status and current_status in [ALERT, CRITICAL]:
        alerts.append(AlertTemplate.STATUS_ESCALATION)
    return deduplicate(alerts, cooldown=timedelta(hours=6))
```

## 10. Report Generation

### Approach
- Structured JSON report assembled from latest data per dam
- Rendered to Markdown / HTML / PDF on demand
- Updated automatically when new observations, changes, or alerts arrive

### Template Sections
1. Header (dam name, period, generation timestamp)
2. Latest observation summary
3. Change detection results
4. Current status with reasons
5. Scenario / impact summary (if available)
6. Active alerts
7. Evidence references
8. Limitations disclaimer

## 11. Background Jobs

### Job Types
| Job | Trigger | Frequency |
|---|---|---|
| `observation_fetch` | Scheduler | Per-dam configurable (default 6h) |
| `change_detection` | After new observation ingested | Event-driven |
| `status_update` | After change detection | Event-driven |
| `alert_evaluation` | After status update | Event-driven |
| `report_update` | After any dam data change | Event-driven |
| `scenario_run` | User request | On-demand |

### Technology
- **Redis** as message broker
- **Celery** or **ARQ** as task runner
- Job status tracked in database
- Failed jobs logged and retried with exponential backoff (max 3 retries)

## 12. Storage

### Object Storage
- Satellite imagery, DEM tiles, simulation outputs stored in object storage
- MinIO for local development; S3-compatible for production
- Directory structure: `/{dam_id}/observations/{date}/`, `/{dam_id}/scenarios/{scenario_id}/`

### File Types
- GeoTIFF (raster data)
- GeoJSON (vector results)
- PNG (rendered map tiles, report images)
- JSON (metadata, structured results)

## 13. Authentication & Authorization

### MVP Approach
- JWT-based authentication
- Password hashing: bcrypt
- Roles: `admin`, `engineer`, `viewer`
- Route-level authorization middleware
- Token refresh mechanism

### Role Permissions
| Action | Admin | Engineer | Viewer |
|---|---|---|---|
| Manage dams | ✓ | ✓ | ✗ |
| View dams | ✓ | ✓ | ✓ |
| Run scenarios | ✓ | ✓ | ✗ |
| View scenarios | ✓ | ✓ | ✓ |
| Acknowledge alerts | ✓ | ✓ | ✗ |
| Manage users | ✓ | ✗ | ✗ |

## 14. Logging

- **Structured JSON logging** via Python `structlog`
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Every service call logged with correlation ID
- Background job logs include job ID and dam ID
- Frontend errors reported to backend error endpoint

## 15. Application Monitoring

### MVP
- Health check endpoint: `GET /health`
- Background job dashboard (Celery Flower or similar)
- Database connection pool monitoring
- Error rate tracking via structured logs

### Post-MVP
- Prometheus metrics
- Grafana dashboards
- Uptime monitoring

## 16. Deployment

### MVP (Single Server)
```
┌──────────────────────────────────┐
│           Docker Compose         │
│                                  │
│  ┌──────────┐  ┌──────────────┐  │
│  │ Frontend │  │   Backend    │  │
│  │ (nginx)  │  │  (uvicorn)   │  │
│  └──────────┘  └──────────────┘  │
│  ┌──────────┐  ┌──────────────┐  │
│  │PostgreSQL│  │    Redis     │  │
│  │+ PostGIS │  │              │  │
│  └──────────┘  └──────────────┘  │
│  ┌──────────┐  ┌──────────────┐  │
│  │  MinIO   │  │   Worker     │  │
│  │          │  │  (Celery)    │  │
│  └──────────┘  └──────────────┘  │
└──────────────────────────────────┘
```

### Production (Future)
- Container orchestration (Kubernetes or managed container service)
- Managed PostgreSQL with PostGIS
- Managed Redis
- S3-compatible object storage
- CI/CD pipeline (GitHub Actions)
- Blue-green or rolling deployments
