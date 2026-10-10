# JalSahayak — Product Decisions Log

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## Purpose

This is the authoritative decision log for JalSahayak. Every significant product and technical decision is recorded here with rationale. **No agent or developer may override these decisions without updating this document first.**

---

## Decision Format

```
### PD-{number}: {Title}
**Date:** YYYY-MM-DD
**Status:** Active | Superseded | Under Review
**Decision:** What was decided.
**Rationale:** Why.
**Implications:** What this means for implementation.
```

---

### PD-001: Product Focus

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** JalSahayak is focused exclusively on dam monitoring + flood intelligence.  
**Rationale:** A focused product delivers more value than an overcrowded disaster-management super-app. Think "Setu-like simplicity + satellite intelligence + dam monitoring + flood impact analysis."  
**Implications:** Features unrelated to the core loop (monitor → detect → estimate → alert → report) are out of scope.

---

### PD-002: Satellite Data as Evidence Layer

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Satellite change analysis is one evidence layer inside JalSahayak — not the entire product.  
**Rationale:** Satellite imagery provides valuable observation data, but the product value is in the complete monitoring-to-impact chain.  
**Implications:** Do not turn JalSahayak into a satellite search/browse product. Satellite is input to the monitoring pipeline.

---

### PD-003: AI Does Not Replace Physics

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** AI assists interpretation (classification, summarization, explanation). Physics-based hydrodynamic modelling is the simulation authority.  
**Rationale:** Flood simulation requires physically grounded models. AI cannot predict flood dynamics from data patterns alone.  
**Implications:** AI systems are documented separately. Simulation service abstracts physical solvers. Never claim AI-predicted flood results.

---

### PD-004: Modular Monolith Architecture

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** MVP uses a modular monolith — logically separated services, single deployable unit.  
**Rationale:** Microservices add deployment complexity without proportional benefit at MVP scale. Services can be extracted later if needed.  
**Implications:** All services live in one codebase. Service interfaces remain clean for future extraction.

---

### PD-005: No Unnecessary Microservices

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Do not create separate deployable services for MVP.  
**Rationale:** A single FastAPI app with Celery workers is sufficient for 50 dams.  
**Implications:** Docker Compose runs one API server, one worker, one database, one Redis, one object store.

---

### PD-006: No Overloaded Dashboard

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** The dashboard must not be overcrowded. Maximum useful information per screen.  
**Rationale:** Dam safety engineers need clarity, not visual noise.  
**Implications:** UI follows map-first design. Simple navigation. No excessive cards, gradients, or decorative elements.

---

### PD-007: No Fake Accuracy

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Never present accuracy numbers that are not validated. Never claim certainty that does not exist.  
**Rationale:** Scientific integrity. Users make safety decisions based on our outputs.  
**Implications:** Confidence levels and limitations are always reported. AI outputs include uncertainty. Synthetic results are labelled.

---

### PD-008: No Fake Real-Time Claims

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Do not claim "real-time" unless the data pipeline actually operates in real-time.  
**Rationale:** Satellite revisit times are hours to days. Observation processing takes minutes. This is near-real-time at best.  
**Implications:** Use terms like "latest available" or "most recent observation" instead of "real-time."

---

### PD-009: Every Alert Must Have Evidence

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** No alert may be generated without a documented reason and evidence reference.  
**Rationale:** Meaningless alerts erode trust. Every alert must be traceable to data.  
**Implications:** Alert engine requires evidence threshold. Alert schema includes mandatory reason and evidence fields.

---

### PD-010: Synthetic Data Must Be Clearly Labelled

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** All synthetic/demo data carries `is_synthetic: true` and visible labels.  
**Rationale:** Users must never confuse demo data with real measurements.  
**Implications:** API responses, reports, and UI badges must indicate synthetic data. Synthetic data directory has its own README.

---

### PD-011: Real Integrations Come Progressively

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Build clean provider interfaces so real data sources can be plugged in later without refactoring the core system.  
**Rationale:** MVP must work with synthetic data. Real integrations (Sentinel, DEM, hydrodynamic solver) are added in later phases.  
**Implications:** Abstract provider interfaces for satellite, simulation, and infrastructure data. MVP uses synthetic providers.

---

### PD-012: Satellite Cannot Detect Structural Dam Failure

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Do not claim that satellite imagery alone can detect actual dam structural failure. Structural failure detection requires ground instrumentation and is a limited capability.  
**Rationale:** Scientific honesty. Satellites observe surface changes, not internal structural integrity.  
**Implications:** Documentation, UI, and reports must explicitly state this limitation. Change detection describes surface/water changes, not structural assessments.

---

### PD-013: Four-Level Status System

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Dam health uses four levels: NORMAL → WATCH → ALERT → CRITICAL.  
**Rationale:** Simple, actionable, easy to understand. Matches common alert frameworks.  
**Implications:** Status engine evaluates rules against evidence. Every status change logged with reasons.

---

### PD-014: PostgreSQL + PostGIS for All Spatial Data

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Use PostgreSQL with PostGIS extension for all spatial data storage and querying.  
**Rationale:** Industry standard for geospatial. Avoids maintaining a separate geospatial database. Rich spatial query capabilities.  
**Implications:** All geometry stored as PostGIS types. Spatial indexes on all geometry columns. GeoAlchemy2 for ORM integration.

---

### PD-015: Simulation Abstraction Layer

**Date:** 2026-10-08  
**Status:** Active  
**Decision:** Flood simulation is accessed through an abstract interface. MVP uses a synthetic simulator; real solvers plugged in later.  
**Rationale:** Real hydrodynamic solvers (HEC-RAS, Delft3D) are complex integrations. MVP must demonstrate the full loop without them.  
**Implications:** `BaseFloodSimulator` abstract class. `SyntheticSimulator` for MVP. `HydrodynamicSimulator` for Phase 8+. Same API contract for all.
