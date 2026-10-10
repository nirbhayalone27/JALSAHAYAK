# JalSahayak — Synthetic Data Strategy

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## 1. Purpose

Synthetic data allows the full JalSahayak product loop to be demonstrated and tested **before** real satellite, hydrological, and terrain integrations are complete.

**Rules:**
- All synthetic data must be **clearly labelled** as `DEMO / SYNTHETIC`
- Synthetic data must be **deterministic** — same input produces same output
- Synthetic data must be **physically reasonable** — not random noise
- Synthetic data must **never** be presented as real measurements
- Every API response and report using synthetic data must include `"is_synthetic": true`

## 2. Synthetic Data Inventory

### 2.1 Demo Dams

Create **3 demo dams** with realistic Indian dam metadata:

| Field | Dam 1 | Dam 2 | Dam 3 |
|---|---|---|---|
| Name | Koyna Dam (Demo) | Hirakud Dam (Demo) | Tehri Dam (Demo) |
| River | Koyna | Mahanadi | Bhagirathi |
| State | Maharashtra | Odisha | Uttarakhand |
| District | Satara | Sambalpur | Tehri Garhwal |
| Latitude | 17.3965 | 21.5230 | 30.3775 |
| Longitude | 73.7537 | 83.8680 | 78.4800 |
| Type | Gravity | Composite | Earth & Rockfill |
| Height (m) | 103 | 61 | 260 |
| Reservoir capacity | Large | Very large | Large |

Each dam includes:
- **Reservoir area polygon** — realistic boundary around known reservoir shape
- **Monitoring area polygon** — reservoir + buffer zone (~5 km)
- **Downstream region polygon** — river valley downstream ~30 km

**Data format:** GeoJSON files stored in `data/synthetic/dams/`

---

### 2.2 Demo Observations

For each demo dam, create a **timeline of 10 synthetic satellite observations** spanning 30 days:

| Date | Source | Quality | Notes |
|---|---|---|---|
| Day 0 (baseline) | synthetic-optical | good | Normal conditions |
| Day 3 | synthetic-optical | good | Normal |
| Day 6 | synthetic-optical | moderate | Slight cloud |
| Day 9 | synthetic-optical | good | Normal |
| Day 12 | synthetic-optical | good | Water spread starts increasing |
| Day 15 | synthetic-optical | good | Noticeable increase |
| Day 18 | synthetic-optical | moderate | Increase continues |
| Day 21 | synthetic-optical | good | Significant change |
| Day 24 | synthetic-optical | good | Downstream water detected |
| Day 27 | synthetic-optical | good | Stabilizing |

Each observation includes:
- **Derived water mask** — polygon representing detected water body
- **NDWI-equivalent metric** — synthetic numeric index
- **Coverage percentage**
- **Thumbnail** — simple generated image (blue/green for water/land)

**Data format:** JSON metadata + GeoJSON water mask per observation

**Storage:** `data/synthetic/observations/{dam_id}/{date}/`

---

### 2.3 Demo DEM Tiles

For each downstream region:
- **Synthetic DEM** — realistic elevation grid following general terrain profile
- Resolution: ~30m (matching SRTM scale)
- Elevation values: realistic for the region (not random)
- River channel: lowest elevation following known river path

**Data format:** GeoTIFF (small tiles, ~1000x1000 pixels)

**Storage:** `data/synthetic/dem/{dam_id}/`

---

### 2.4 Demo Change Detection Results

Pre-computed change results for consecutive observation pairs:

| Comparison | Change Type | Severity | Metrics |
|---|---|---|---|
| Day 0 → Day 3 | none | - | area_change: 0% |
| Day 3 → Day 6 | none | - | area_change: 0.5% |
| Day 6 → Day 9 | none | - | area_change: 1% |
| Day 9 → Day 12 | water_spread | low | area_change: 4% |
| Day 12 → Day 15 | water_spread | moderate | area_change: 8% |
| Day 15 → Day 18 | water_spread | moderate | area_change: 10% |
| Day 18 → Day 21 | water_spread | high | area_change: 15% |
| Day 21 → Day 24 | downstream_water | high | new_water_area: 2.1 km² |
| Day 24 → Day 27 | water_spread | low | area_change: -3% (receding) |

**Data format:** JSON per comparison

---

### 2.5 Demo Flood Scenario Outputs

Pre-computed flood simulation results for each demo dam:

**Scenario: Standard breach**

```json
{
  "scenario_name": "Standard breach scenario (DEMO)",
  "dam": "Koyna Dam (Demo)",
  "parameters": {
    "reservoir_level_m": 650.0,
    "breach_width_m": 50.0,
    "breach_depth_m": 30.0,
    "breach_formation_time_hr": 1.0,
    "release_condition": "sudden",
    "simulation_duration_hr": 24.0
  },
  "result": {
    "flood_extent_geojson": "...",
    "max_depth_m": 8.5,
    "flow_direction": "NW",
    "arrival_times": [
      { "location": "5 km downstream", "distance_km": 5, "arrival_hr": 1.2 },
      { "location": "10 km downstream", "distance_km": 10, "arrival_hr": 2.8 },
      { "location": "20 km downstream", "distance_km": 20, "arrival_hr": 5.1 },
      { "location": "30 km downstream", "distance_km": 30, "arrival_hr": 8.4 }
    ],
    "affected_area_km2": 42.5,
    "is_synthetic": true
  }
}
```

**Flood extent:** Pre-defined GeoJSON polygons following downstream river valley with realistic widening.

**Storage:** `data/synthetic/scenarios/{dam_id}/`

---

### 2.6 Demo Impact Layers

Infrastructure data for downstream regions:

| Layer | Source | Count (per dam) |
|---|---|---|
| Settlements | Synthetic | 8–15 villages/towns |
| Roads | Synthetic | 3–5 road segments |
| Bridges | Synthetic | 2–4 bridges |
| Agriculture | Synthetic | 5–10 field polygons |
| Critical infrastructure | Synthetic | 1–3 (hospital, school, etc.) |

Each feature has:
- Name
- Type
- Geometry (point, line, or polygon)
- Estimated population (for settlements)

**Data format:** GeoJSON per layer per dam

**Storage:** `data/synthetic/infrastructure/{dam_id}/`

---

### 2.7 Demo Alerts

Pre-generated alert sequence for each dam's observation timeline:

| Day | Alert | Severity |
|---|---|---|
| Day 12 | New satellite observation available | INFO |
| Day 15 | Moderate water-spread change detected | WARNING |
| Day 21 | Significant reservoir change — status elevated to ALERT | WARNING |
| Day 24 | Downstream water appearance detected | CRITICAL |
| Day 27 | Conditions stabilizing — continued monitoring recommended | INFO |

---

### 2.8 Demo Status Timeline

| Day | Status | Reason |
|---|---|---|
| Day 0 – Day 9 | NORMAL | No significant changes |
| Day 12 | NORMAL | Minor change within threshold |
| Day 15 | WATCH | Moderate water-spread change (8%) |
| Day 18 | WATCH | Continued increase (10%) |
| Day 21 | ALERT | Significant change (15%) |
| Day 24 | CRITICAL | Downstream water detected |
| Day 27 | ALERT | Conditions stabilizing, downstream water receding |

## 3. Data Generation

### Approach
- **Script-generated:** A Python script (`scripts/generate_synthetic_data.py`) generates all synthetic data
- **Deterministic:** Uses fixed random seeds; re-running produces identical output
- **Physically grounded:** Geometries follow real geographic shapes (simplified); elevations follow real terrain profiles (smoothed)
- **Version-controlled:** Generated data committed to `data/synthetic/` directory

### Generation Script Structure
```python
# scripts/generate_synthetic_data.py

def generate_dams() -> list[DamData]: ...
def generate_observations(dam: DamData) -> list[ObservationData]: ...
def generate_dem(dam: DamData) -> DEMTile: ...
def generate_changes(observations: list) -> list[ChangeResult]: ...
def generate_scenario(dam: DamData) -> ScenarioOutput: ...
def generate_infrastructure(dam: DamData) -> InfrastructureLayers: ...
def generate_alerts(dam: DamData, changes: list) -> list[Alert]: ...
def generate_status_timeline(dam: DamData, changes: list) -> list[Status]: ...

if __name__ == "__main__":
    for dam in generate_dams():
        # Generate and save all layers
        ...
```

## 4. Directory Structure

```
data/
└── synthetic/
    ├── README.md                          # "ALL DATA IN THIS DIRECTORY IS SYNTHETIC"
    ├── dams/
    │   ├── koyna_demo.geojson
    │   ├── hirakud_demo.geojson
    │   └── tehri_demo.geojson
    ├── observations/
    │   ├── koyna_demo/
    │   │   ├── day_00/
    │   │   │   ├── metadata.json
    │   │   │   └── water_mask.geojson
    │   │   ├── day_03/
    │   │   └── ...
    │   ├── hirakud_demo/
    │   └── tehri_demo/
    ├── dem/
    │   ├── koyna_demo.tif
    │   ├── hirakud_demo.tif
    │   └── tehri_demo.tif
    ├── scenarios/
    │   ├── koyna_demo/
    │   │   ├── standard_breach.json
    │   │   └── flood_extent.geojson
    │   └── ...
    ├── infrastructure/
    │   ├── koyna_demo/
    │   │   ├── settlements.geojson
    │   │   ├── roads.geojson
    │   │   ├── bridges.geojson
    │   │   └── agriculture.geojson
    │   └── ...
    └── seed.json                          # Master seed file with all references
```

## 5. Labelling Requirements

Every piece of synthetic data must be labelled:

### In JSON/GeoJSON metadata
```json
{
  "is_synthetic": true,
  "data_source": "jalsahayak-synthetic-generator",
  "generator_version": "1.0",
  "disclaimer": "This data is synthetic and generated for demonstration purposes only. It does not represent real measurements or observations."
}
```

### In API responses
```json
{
  "data": { ... },
  "is_synthetic": true
}
```

### In reports
```
⚠ SYNTHETIC DATA
This report uses synthetic demonstration data.
Results do not represent real measurements or observations.
```

### In the UI
- Visual badge: `DEMO` or `SYNTHETIC` prominently displayed
- Different color treatment for synthetic vs real data
