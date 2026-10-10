# JalSahayak

> Monitor the dam. Detect the change. Estimate the impact. Alert the decision-maker.

**JalSahayak** is a focused dam-monitoring and flood-intelligence platform. It continuously watches selected dams using satellite and environmental data, detects meaningful changes, estimates downstream flood impact for dam-break scenarios, and generates actionable alerts and reports.

---

## Problem

Dams are critical infrastructure. A sudden breach or uncontrolled release can inundate downstream communities within hours. Today, monitoring relies on fragmented manual inspections, delayed satellite analysis, and disconnected flood models. There is no single platform that ties **continuous dam observation → change detection → flood-impact estimation → alerts → reports** into one operational loop.

## Solution

JalSahayak closes that loop:

```
MONITOR DAM → GET OBSERVATION → COMPARE WITH HISTORY → DETECT CHANGE
      → UPDATE STATUS → ALERT IF NEEDED → ESTIMATE FLOOD IMPACT
            → IDENTIFY AFFECTED AREAS → GENERATE REPORT
```

Satellite imagery is one intelligence layer — not the entire product. Physics-based flood modelling is the simulation layer. AI assists interpretation but does not replace physics.

## Core Features

| Feature | Description |
|---|---|
| **Dam Monitoring** | Register dams, track coordinates, river, reservoir, downstream region. Periodically update observations. |
| **Satellite Change Detection** | Fetch available satellite observations; compare date-wise; detect water-spread, reservoir-boundary, and surface changes. |
| **Dam Health Status** | Simple four-level status: `NORMAL` · `WATCH` · `ALERT` · `CRITICAL` — always with evidence and reasons. |
| **Flood / Dam-Break Scenario** | Configure breach parameters; estimate flood extent, depth, flow direction, arrival time, affected areas. |
| **Downstream Impact Analysis** | Identify potentially affected villages, roads, bridges, agriculture, critical infrastructure. |
| **Alerts** | Evidence-based alerts with severity, time, dam, reason, and recommended next action. No spam. |
| **Automatic Reports** | Continuously updated monitoring reports per dam — changes, status, impact, alerts, evidence. |

## Product Workflow

```
LOGIN → MY DAMS → SELECT DAM → DAM OVERVIEW → LATEST STATUS
  → SATELLITE TIMELINE → CHANGE DETECTION → FLOOD ANALYSIS
    → IMPACT AREA → ALERTS → AUTO-GENERATED REPORT
```

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Dashboard                      │
└──────────────────────┬──────────────────────────┘
                       │
                  REST API
                       │
       ┌───────────────┼───────────────┐
       │               │               │
  Dam Service    Monitoring Svc   Satellite Svc
       │               │               │
       └───────┬───────┘               │
               │                       │
        Change Detection ◄─────────────┘
               │
          Risk Engine
               │
     Flood Scenario Engine
               │
         Impact Engine
               │
     ┌─────────┴─────────┐
  Alert Engine      Report Engine
```

Modular monolith — services are logically separated, deployed as a single application for MVP.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Python + FastAPI |
| Database | PostgreSQL + PostGIS |
| Background Jobs | Redis + worker system |
| Geospatial | GDAL / Rasterio / GeoPandas / Shapely |
| Satellite | Copernicus / Sentinel (progressive integration) |
| Storage | Object storage for imagery/results |
| Simulation | Service abstraction (future SPH / Delft3D integration) |

## MVP Status

**Phase: Documentation & Foundation**

- [x] Product definition
- [x] Architecture design
- [x] API contracts
- [ ] Database schema
- [ ] Synthetic demo data
- [ ] Backend services
- [ ] Satellite pipeline abstraction
- [ ] Flood scenario engine
- [ ] Alert & report engines
- [ ] Frontend implementation

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the full phased plan — from product definition (Phase 0) through institutional pilot (Phase 10).

## Documentation

All project documentation lives in `docs/`:

| Document | Purpose |
|---|---|
| `PRD.md` | Product requirements |
| `TRD.md` | Technical requirements |
| `ARCHITECTURE.md` | System architecture |
| `API.md` | REST API contracts |
| `AI_SYSTEMS.md` | AI usage boundaries |
| `SECURITY.md` | Security design |
| `SYNTHETIC_DATA.md` | Demo data strategy |
| `ROADMAP.md` | Phased roadmap |
| `PRODUCT_DECISIONS.md` | Decision log |
| `CODING_STANDARDS.md` | Code conventions |
| `DESIGN_RULES.md` | Future UI rules |
| `AGENTS.md` | AI agent definitions |
| `RULES.md` | Engineering rulebook |
| `TASKS.md` | Implementation backlog |
| `MEMORY.md` | Persistent project memory |
| `DIRECTOR.md` | Project director |
| `ZERO.md` | What we will NOT build |

## Important Limitations

- **Not an official warning system.** JalSahayak is a monitoring and decision-support tool.
- **Satellite imagery alone cannot detect structural dam failure.** Structural failure detection requires ground instrumentation.
- **Flood simulation in MVP uses abstracted / synthetic data.** Real hydrodynamic solvers will be integrated progressively.
- **Input sensitivity.** Model outputs depend on DEM accuracy, breach parameters, and terrain quality.
- **No fake accuracy.** All confidence levels and limitations are reported transparently.

## License

License to be specified.

---

*JalSahayak — focused dam monitoring and flood intelligence for the people who need it.*
