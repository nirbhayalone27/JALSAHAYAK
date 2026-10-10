# JalSahayak — AI Systems

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## 1. AI Philosophy

AI in JalSahayak **assists human interpretation**. It does not replace physics, hydrology, or engineering judgment.

**Core principles:**
- AI is an interpretation and classification layer — not a prediction oracle
- Physics-based simulation (hydrodynamic models) remains the authoritative source for flood modelling
- Every AI output must include confidence indication and be explainable
- AI must never claim certainty about dam structural failure
- All AI outputs are subject to human review

## 2. AI Role Boundaries

```
┌─────────────────────────────────────────────────────┐
│                    AI CAN DO                        │
├─────────────────────────────────────────────────────┤
│  • Classify satellite change types                  │
│  • Detect anomalies in observation time series      │
│  • Summarize changes in natural language            │
│  • Explain why a status level was assigned          │
│  • Generate human-readable report narratives        │
│  • Flag unusual patterns for human review           │
│  • Assist in prioritizing alerts                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  AI CANNOT DO                       │
├─────────────────────────────────────────────────────┤
│  ✗ Predict dam failure with certainty               │
│  ✗ Replace hydrodynamic flood simulation            │
│  ✗ Make structural integrity assessments            │
│  ✗ Generate authoritative evacuation orders         │
│  ✗ Override physics-based model outputs             │
│  ✗ Claim accuracy without validation evidence       │
└─────────────────────────────────────────────────────┘
```

## 3. AI Use Cases

### 3.1 Satellite Change Classification

**Purpose:** Classify the type and significance of detected changes between satellite observations.

```
INPUT:
  Observation A (raster / derived features)
  Observation B (raster / derived features)
  Change metrics (area diff, spectral diff)
      │
      ▼
MODEL:
  Classification model (rule-based for MVP; ML post-MVP)
      │
      ▼
OUTPUT:
  Change type: water_spread | boundary | downstream_water | surface_change
  Significance: low | moderate | high
  Confidence: 0.0 – 1.0
      │
      ▼
HUMAN REVIEW:
  Engineer reviews classification before it influences status
```

**MVP approach:** Rule-based classification using thresholds on NDWI difference, area change percentage, and spatial overlap metrics. No ML model required for MVP.

**Post-MVP:** Train a simple classifier on labelled change examples.

---

### 3.2 Anomaly Detection

**Purpose:** Flag observations that deviate significantly from the historical baseline for a dam.

```
INPUT:
  Time series of observation metrics per dam
  (water area, NDWI mean, spectral statistics)
      │
      ▼
MODEL:
  Statistical anomaly detection
  (Z-score / IQR-based for MVP; isolation forest post-MVP)
      │
      ▼
OUTPUT:
  Is anomalous: true | false
  Anomaly score: 0.0 – 1.0
  Deviation description: "Water area 2.3σ above 90-day mean"
      │
      ▼
HUMAN REVIEW:
  Anomaly flagged for review; does not auto-escalate beyond WATCH
```

**MVP approach:** Simple statistical methods (rolling mean ± N standard deviations). No neural networks needed.

---

### 3.3 Change Summarization

**Purpose:** Generate natural-language descriptions of detected changes.

```
INPUT:
  Change detection results (type, metrics, geometry)
  Dam context (name, river, recent status)
      │
      ▼
MODEL:
  Template-based generation (MVP)
  LLM-assisted generation (post-MVP, optional)
      │
      ▼
OUTPUT:
  Human-readable summary:
  "Between Oct 1 and Oct 5, the reservoir water spread of Koyna Dam
   increased by approximately 12% (1.8 km²). The change is concentrated
   on the northern arm of the reservoir."
      │
      ▼
CONFIDENCE:
  Template-based: high (deterministic)
  LLM-based: medium (requires review)
```

**MVP approach:** Template strings with variable substitution from change metrics.

---

### 3.4 Risk Explanation

**Purpose:** Explain why a dam's status is at a particular level.

```
INPUT:
  Current status level
  Contributing evidence (changes, observations, external signals)
  Status rules applied
      │
      ▼
MODEL:
  Rule-based explanation generator (MVP)
      │
      ▼
OUTPUT:
  Explanation:
  "Status elevated to WATCH because:
   1. Reservoir water spread increased by 12% (exceeds 8% threshold)
   2. Change detected in 2 consecutive observation periods
   3. No external rainfall signal found to explain increase"
      │
      ▼
CONFIDENCE:
  High (deterministic rule trace)
```

---

### 3.5 Report Narrative Generation

**Purpose:** Generate narrative sections of auto-generated reports.

```
INPUT:
  Structured report data (observations, changes, status, alerts, impact)
      │
      ▼
MODEL:
  Template engine (MVP)
  LLM summarization (post-MVP, optional)
      │
      ▼
OUTPUT:
  Report narrative paragraphs
      │
      ▼
CONFIDENCE:
  Template: high
  LLM: medium (flagged for review)
```

---

### 3.6 Alert Prioritization

**Purpose:** When multiple alerts are pending, rank them by urgency and relevance.

```
INPUT:
  List of pending alerts with severity, type, evidence
      │
      ▼
MODEL:
  Weighted scoring (MVP)
  ML ranker (post-MVP)
      │
      ▼
OUTPUT:
  Ranked alert list
  Priority score per alert
      │
      ▼
CONFIDENCE:
  Scoring weights are transparent and documented
```

## 4. AI Pipeline Architecture

```
┌─────────────────────────────────────────────┐
│              AI PIPELINE                    │
│                                             │
│  ┌──────────┐    ┌──────────┐    ┌────────┐ │
│  │  INPUT   │───▶│  MODEL   │───▶│ OUTPUT │ │
│  │  (data)  │    │ (rules/  │    │(result)│ │
│  │          │    │  stats/  │    │        │ │
│  │          │    │  ML)     │    │        │ │
│  └──────────┘    └──────────┘    └───┬────┘ │
│                                      │      │
│                              ┌───────▼────┐ │
│                              │ CONFIDENCE │ │
│                              │   SCORE    │ │
│                              └───────┬────┘ │
│                                      │      │
│                              ┌───────▼────┐ │
│                              │   HUMAN    │ │
│                              │   REVIEW   │ │
│                              └────────────┘ │
└─────────────────────────────────────────────┘
```

## 5. Confidence Framework

Every AI-generated output must carry a confidence indicator:

| Level | Score Range | Meaning | Action |
|---|---|---|---|
| **High** | 0.85 – 1.0 | Deterministic or well-validated | Auto-apply, log for audit |
| **Medium** | 0.5 – 0.84 | Reasonable but uncertain | Apply with review flag |
| **Low** | 0.0 – 0.49 | Uncertain or insufficient data | Flag only, do not auto-apply |

## 6. MVP vs Post-MVP AI

| Capability | MVP | Post-MVP |
|---|---|---|
| Change classification | Rule-based thresholds | ML classifier |
| Anomaly detection | Statistical (Z-score) | Isolation forest / autoencoder |
| Change summarization | Template strings | Optional LLM |
| Risk explanation | Rule trace | Improved narrative |
| Report narrative | Templates | Optional LLM |
| Alert prioritization | Weighted scoring | ML ranker |
| Water body segmentation | NDWI thresholding | U-Net / segmentation model |

## 7. Model Management (Post-MVP)

When ML models are introduced:

- **Versioning:** Every model has a version tag
- **Provenance:** Training data, hyperparameters, evaluation metrics recorded
- **A/B testing:** New model versions compared against baseline before promotion
- **Rollback:** Previous model version can be restored instantly
- **Monitoring:** Model prediction distribution tracked for drift detection

## 8. Ethical Guardrails

1. **No false certainty.** Never present AI output as definitive fact.
2. **No hidden models.** Every AI system is documented with inputs, outputs, and limitations.
3. **No automation of life-safety decisions.** AI assists; humans decide.
4. **Transparent limitations.** Reports and alerts state when AI-assisted content is included.
5. **Bias awareness.** Satellite data has geographic, temporal, and weather biases — acknowledged in all outputs.
