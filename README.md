# JalSahayak

> Simulate the surge. Challenge the scenario. Map the impact. Support the decision.

JalSahayak is a flood intelligence and decision-support platform designed for sudden water-release and dam-break scenarios.

---

## Overview

JalSahayak evaluates downstream hazards during sudden reservoir releases and dam-break events. The platform models dynamic floodwave propagation across terrain to identify exposed populations and infrastructure.

Designed for emergency planners and response teams, JalSahayak prioritizes scenario stress-testing. Rather than relying on a single forecast, it helps authorities formulate defensive evacuation strategies before and during release emergencies.

## Problem

Sudden dam releases and breach events trigger rapid flood surges that inundate downstream communities within hours. Conventional warning systems often depend on static inundation maps or single forecasts. These overlook operational uncertainties—such as varying breach rates, gate schedules, and channel roughness—creating dangerous blind spots during evacuations.

## Solution

JalSahayak applies a scenario-driven hydrodynamic workflow to address operational uncertainties. Instead of trusting a single outcome, it evaluates multiple plausible flood scenarios to identify robust downstream impacts:

```
DATA → PREPROCESS → SIMULATE → CHALLENGE → VALIDATE → IMPACT → DECISION
```

## Key Features

The repository is currently at the foundation stage; implemented and planned components are separated below:

- **Repository Core** *(Implemented)*: Base architecture, workflow specifications, and pipeline definitions.
- **Scenario Schema** *(In Development)*: Standard breach timing, peak discharge, and hydrograph parameters.
- **Dynamic Inundation Engine** *(Planned)*: Downstream water depth, velocity, and arrival-time solver.
- **Scenario Stress-Testing** *(Planned)*: Multi-run overlay isolating persistent inundation zones.
- **GIS Exposure Layering** *(Planned)*: Spatial overlay with roads, settlements, and critical assets.
- **Satellite Cross-Validation** *(Planned)*: Optical/SAR observation scenes to evaluate model extents.

## What Makes JalSahayak Different?

> *"Don't trust one flood scenario. Challenge it."*

Most flood platforms rely on a single simulation run that may fail under unpredictable field conditions. JalSahayak challenges this by simulating an ensemble of plausible operational releases and breach regimes. Comparing these runs reveals persistent impact zones flooded across all variations versus sensitive zones tied to specific assumptions. This enables decision-makers to act on robust flood intelligence rather than fragile single forecasts.

## System Workflow

```text
Input Data (DEM, River Geometry, Hydrographs)
                     ↓
               Preprocessing
                     ↓
           Scenario Configuration
                     ↓
          Hydrodynamic Simulation
                     ↓
             Inundation Mapping
                     ↓
            Scenario Comparison
                     ↓
        Validation (Observations)
                     ↓
                Impact Analysis
                     ↓
               Decision Support
```

## Tech Stack

Technologies planned and configured across platform layers:

- **Frontend**: TypeScript, MapLibre / WebGL *(Planned)*
- **Backend**: Python, FastAPI *(Planned)*
- **Geospatial**: GDAL, Rasterio, GeoPandas *(In Development)*
- **Modelling**: 2D Hydrodynamic Solvers *(Planned)*
- **Database**: PostgreSQL / PostGIS *(Planned)*
- **Infrastructure**: Docker *(Planned)*

## Current Prototype

- **Working**: Architecture specifications, schema design, and pipeline structure.
- **In Development**: Geospatial preprocessing scripts and scenario schema.
- **Planned**: Hydrodynamic engine, GIS overlay, comparison tools, and dashboard UI.

## Roadmap

1. **Prototype Setup**: Repository foundation, preprocessing scripts, and scenario schema *(Current)*.
2. **Hydrodynamic Integration**: 2D shallow-water inundation engine binding.
3. **Indian Basin Case Study**: Calibration against a real Indian river catchment.
4. **Satellite Validation**: Historical event comparison using SAR and optical imagery.
5. **Multi-Scenario Intelligence**: Automated scenario difference and robust-zone identification.
6. **Impact Analysis**: Exposure assessment across infrastructure and population layers.
7. **Production Deployment**: Cloud infrastructure and decision-support dashboard.

## Architecture

```text
[ Dashboard / UI ] (Planned)
          │
          ▼
   [ API Gateway ] (Planned)
          │
   ┌──────┴──────────────────────────┐
   ▼                                 ▼
[ Scenario Engine ]       [ GIS & Impact Module ]
   │                                 ▲
   ▼                                 │
[ Hydrodynamic Simulation Core ] ────┘
   │
   ▼
[ Results Store / Raster Cache ]
```

## Project Structure

```text
JALSAHAYAK/
└── README.md
```

*(Modular subdirectories for `preprocessing/`, `simulation/`, `api/`, and `web/` will be established as codebase modules are committed.)*

## Data Sources

The platform is designed to ingest:

- **Digital Elevation Models**: Copernicus DEM / SRTM terrain *(Planned)*.
- **Hydrological Records**: Gauge discharge hydrographs and release logs *(Planned)*.
- **Infrastructure**: OpenStreetMap roads, bridges, and settlements *(Planned)*.
- **Satellite Imagery**: Sentinel-1 SAR and Sentinel-2 optical scenes *(Planned)*.

## Validation

Validation focuses on empirical ground-truthing rather than theoretical assertions:
- Comparing simulated inundation boundaries against historical SAR/optical satellite observations.
- Sensitivity analysis across varying Manning's roughness, discharge hydrographs, and terrain elevations.
- Transparent reporting of assumptions without fabricated accuracy metrics.

## Limitations

- **Not an Official Warning System**: JalSahayak is a scenario evaluation tool, not an official emergency alerting service.
- **Input Sensitivity**: Model reliability depends on DEM accuracy, channel bathymetry, and hydrograph precision.
- **Validation Constraints**: Satellite validation requires timely passes and can be constrained by cloud cover.
- **Calibration Needs**: Deployment requires basin-specific hydraulic calibration.

## License

No license has currently been specified.

## Links

Project links and mirrors will be published here upon release.

---

```
SIMULATE → CHALLENGE → VALIDATE → FIND ROBUST IMPACT → ACT
```

*JalSahayak empowers emergency planners to challenge flood assumptions, discover robust downstream risks, and make defensible decisions during sudden water releases.*
