# JalSahayak — Product Requirements Document (PRD)

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## 1. Product Vision

JalSahayak is a focused dam-monitoring and flood-intelligence platform that continuously watches selected dams, detects meaningful environmental changes using satellite and other data, estimates downstream flood impact for dam-break scenarios, and delivers actionable alerts and auto-generated reports to responsible decision-makers.

**Vision statement:** *"Every monitored dam has a continuously updated, evidence-based health profile — and every downstream community has a clear picture of potential flood impact."*

## 2. Problem

- Dams are monitored manually or through fragmented systems with significant observation gaps.
- Satellite data exists but is not operationalized into continuous dam-specific monitoring.
- Flood-impact analysis is typically done as one-off studies, not as a living, updating capability.
- When a dam-break or sudden release occurs, there is no single platform connecting observation → detection → impact → alert → report.
- Decision-makers lack a consolidated, evidence-based view of dam health and downstream risk.

## 3. Target Users

| User | Need |
|---|---|
| **Dam Safety Engineer** | Continuous monitoring status, change alerts, historical comparison |
| **District / Emergency Manager** | Downstream impact understanding, flood scenarios, action recommendations |
| **Water Resources Department** | Dam portfolio overview, trend analysis, periodic reports |
| **Disaster Response Team** | Rapid impact assessment, affected-area identification |

For MVP, the primary user is a **Dam Safety Engineer or Water Resources Officer** responsible for a small set of dams.

## 4. Core Use Cases

### UC-1: Monitor a Dam
User adds/selects a dam → system fetches observations → maintains timeline → updates status.

### UC-2: Compare Satellite Observations
User views satellite observation timeline → selects two dates → sees change analysis → understands what changed.

### UC-3: Check Dam Health Status
User views dam overview → sees current status (NORMAL/WATCH/ALERT/CRITICAL) → reads reasons/evidence.

### UC-4: Run Flood / Dam-Break Scenario
User configures breach parameters → system estimates flood extent, depth, flow, arrival time → visualizes impact.

### UC-5: Assess Downstream Impact
User views potentially affected settlements, roads, bridges, agriculture, infrastructure for a given scenario.

### UC-6: Receive Alerts
System detects concerning changes → generates alert with severity, evidence, recommended action.

### UC-7: View Auto-Generated Report
User opens dam report → sees latest monitoring summary, changes, status, impact, alerts, evidence.

## 5. MVP Scope

### In Scope

| Capability | MVP Scope |
|---|---|
| Dam management | Add, edit, view dams with metadata |
| Observation pipeline | Fetch / ingest satellite observations (abstracted provider) |
| Date comparison | Compare two observation dates for a dam |
| Change detection | Detect water-spread, reservoir-boundary, surface changes |
| Dam health status | Four-level status with evidence-based rules |
| Flood scenario | Configure breach; estimate flood extent using simulation abstraction |
| Impact analysis | Overlay flood extent with infrastructure/settlement layers |
| Alerts | Evidence-based alerts with severity, reason, recommendation |
| Reports | Auto-generated, continuously updated dam monitoring reports |
| Synthetic data | Deterministic demo data for all features before real integration |

### Out of Scope (MVP)

- Real-time structural sensor integration
- Multi-dam cascade failure analysis
- Official government warning system certification
- Mobile application
- Public-facing portal
- Advanced AI prediction models
- Full hydrodynamic solver integration (abstraction only in MVP)

## 6. Features

### F1: Dam Registry
- Add dam with name, river, location, reservoir, coordinates, monitoring area, downstream region
- Edit dam details
- List all monitored dams
- View single dam overview

### F2: Observation Timeline
- Automatic periodic fetch of available satellite observations
- Store observation metadata: date, source, type, coverage, quality
- Display chronological observation timeline per dam
- Manual observation triggering

### F3: Satellite Change Detection
- Compare observation at Date A vs Date B
- Detect: water-spread change, reservoir boundary change, downstream water appearance, land/water transition, significant surface change
- Display change results with geographic context
- Maintain change history

### F4: Dam Health Status Engine
- Status levels: `NORMAL` | `WATCH` | `ALERT` | `CRITICAL`
- Status computed from defined rules and evidence
- Every status change includes WHY it changed
- Status history maintained

**Status Rules (MVP):**

| Condition | Status |
|---|---|
| No significant changes detected | NORMAL |
| Moderate water-spread change OR unusual observation | WATCH |
| Significant reservoir change OR downstream water increase + external signal | ALERT |
| Multiple critical indicators OR confirmed anomaly | CRITICAL |

### F5: Flood / Dam-Break Scenario Engine
- Create scenario with inputs: reservoir level, breach width, breach depth, release condition, simulation duration, downstream terrain
- Run simulation (via abstraction layer — synthetic/demo output for MVP)
- Output: flood extent, water depth, flow direction, arrival time, potentially affected areas
- View scenario results on map

### F6: Downstream Impact Analysis
- Overlay flood extent with:
  - Villages / settlements
  - Roads
  - Bridges
  - Buildings
  - Agriculture
  - Critical infrastructure
- Summary: area affected, population potentially impacted, infrastructure count

### F7: Alert Engine
- Alerts generated when defined conditions are satisfied
- Alert fields: severity, time, dam, reason, evidence, recommended next action
- Alert types:
  - Unusual reservoir change detected
  - Significant downstream water change detected
  - Flood-risk scenario requires review
  - New satellite observation available
  - Potential impact area has expanded
- No spam — alerts require evidence threshold
- Alert history per dam

### F8: Automatic Report Generation
- One report per monitored dam, continuously updated
- Report contents:
  - Dam metadata
  - Monitoring period
  - Latest and previous observation dates
  - Detected changes
  - Current status with reasons
  - Potential downstream impact
  - Active alerts
  - Evidence (satellite observations, data sources, model output)
- Report updates when new data becomes available
- Exportable (PDF / Markdown)

## 7. User Flows

### Primary Flow

```
LOGIN
  → MY DAMS (list of monitored dams)
    → SELECT DAM
      → DAM OVERVIEW (name, location, current status, latest observation)
        → SATELLITE TIMELINE (chronological observations)
          → CHANGE DETECTION (compare two dates, view changes)
        → FLOOD / DAM-BREAK ANALYSIS (configure scenario, view results)
          → IMPACT AREA (affected zones, infrastructure)
        → ALERTS (dam-specific alert history)
        → AUTO-GENERATED REPORT (current monitoring report)
```

### Secondary Flows

- **Add new dam:** MY DAMS → ADD DAM → Enter details → Save → Dam added to monitoring
- **Run new scenario:** DAM OVERVIEW → NEW SCENARIO → Configure → Run → View results
- **View all alerts:** ALERTS (global) → Filter by dam / severity / date

## 8. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | System shall allow CRUD operations on dam records |
| FR-02 | System shall periodically check for new satellite observations per dam |
| FR-03 | System shall store observation metadata and imagery references |
| FR-04 | System shall compare two observations and produce change results |
| FR-05 | System shall compute dam health status based on defined rules |
| FR-06 | System shall explain every status change with reasons and evidence |
| FR-07 | System shall accept flood scenario parameters and produce simulation output |
| FR-08 | System shall overlay flood extent with infrastructure/settlement data |
| FR-09 | System shall generate alerts when defined conditions are met |
| FR-10 | System shall auto-generate and update dam monitoring reports |
| FR-11 | System shall maintain historical records of observations, changes, statuses, and alerts |
| FR-12 | System shall support user authentication and role-based access |
| FR-13 | System shall clearly label all synthetic/demo data |

## 9. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | Observation fetch cycle: configurable, minimum every 6 hours |
| NFR-02 | Change detection for a single comparison: < 60 seconds |
| NFR-03 | Flood scenario simulation (MVP demo): < 30 seconds |
| NFR-04 | API response time for dashboard data: < 2 seconds |
| NFR-05 | System must handle at least 50 monitored dams concurrently |
| NFR-06 | All data must be backed up daily |
| NFR-07 | Audit trail for all status changes and alerts |
| NFR-08 | System should be deployable on a single server for MVP |

## 10. Alert Logic

```
OBSERVATION RECEIVED
      │
      ▼
CHANGE DETECTION RUN
      │
      ▼
CHANGE SIGNIFICANT? ──── No ──→ Log, no alert
      │
     Yes
      │
      ▼
DETERMINE ALERT TYPE
      │
      ▼
CHECK ALERT THRESHOLD (avoid spam / duplicates)
      │
      ▼
CREATE ALERT
  - Severity (INFO / WARNING / CRITICAL)
  - Timestamp
  - Dam reference
  - Reason (human-readable)
  - Evidence (observation IDs, change metrics)
  - Recommended action
      │
      ▼
NOTIFY (in-app, email if configured)
```

## 11. Monitoring Logic

```
FOR EACH MONITORED DAM:
  │
  ├─ CHECK FOR NEW OBSERVATIONS (periodic)
  │     └─ If new → Ingest → Run change detection vs previous
  │
  ├─ COMPUTE CURRENT STATUS
  │     └─ Evaluate all active evidence against status rules
  │     └─ If status changed → Log reason → Generate alert if warranted
  │
  ├─ UPDATE REPORT
  │     └─ Refresh report with latest data
  │
  └─ REPEAT
```

## 12. Report Requirements

Each auto-generated report must include:

1. **Header:** Dam name, report generation timestamp, monitoring period
2. **Latest Observation:** Date, source, summary
3. **Previous Observation:** Date, source
4. **Detected Changes:** List of changes with descriptions
5. **Current Status:** Level + reasons
6. **Downstream Impact:** Summary from latest scenario (if run)
7. **Active Alerts:** List with severity and reason
8. **Evidence:** Links to satellite observations, data sources, model outputs
9. **Limitations:** What the report does NOT cover

## 13. Success Criteria

| Criteria | Measure |
|---|---|
| Complete monitoring loop | One dam can be monitored end-to-end: observation → change → status → alert → report |
| Change detection works | Two dates compared, meaningful changes detected and displayed |
| Scenario produces results | Flood scenario configured and impact area visualized |
| Alerts are evidence-based | Every alert has a reason and evidence reference |
| Reports are auto-generated | Report updates when new data arrives |
| Demo flow runs end-to-end | Using synthetic data, the entire user flow is demonstrable |

## 14. Out of Scope

- Generic chatbot
- Social features
- 3D globe visualization
- Blockchain / NFT
- Gamification
- Multi-dam cascade analysis
- Real-time sensor telemetry
- Official certification as warning system
- Mobile app
- Public-facing portal
- Integration with every possible satellite provider
- Advanced ML models beyond basic classification
- Features unrelated to dam monitoring and flood intelligence
