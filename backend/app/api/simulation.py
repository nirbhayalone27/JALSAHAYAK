"""API router for dam-break hydrodynamic simulation."""

import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Response
from pydantic import BaseModel, Field
from app.services.hydrodynamic_solver import (
    HydrodynamicSolver,
    MAHARASHTRA_DAM_DATABASE,
)

router = APIRouter(prefix="/simulation", tags=["simulation"])


class RunSimulationRequest(BaseModel):
    dam_id: str
    breach_type: str = Field("Overtopping", description="Failure mode")
    breach_width_m: float = Field(75.0, ge=10.0, le=1000.0)
    formation_time_min: float = Field(30.0, ge=5.0, le=720.0)
    duration_hrs: float = Field(24.0, ge=1.0, le=168.0)
    reservoir_level_pct: float = Field(95.0, ge=10.0, le=100.0)


@router.get("/dams")
async def list_simulation_dams():
    """Returns all Maharashtra dams supported by the hydrodynamic simulation solver."""
    return [
        {
            "id": d.id,
            "name": d.name,
            "river": d.river,
            "basin": d.basin,
            "district": d.district,
            "latitude": d.latitude,
            "longitude": d.longitude,
            "height_m": d.height_m,
            "capacity_mcm": d.capacity_mcm,
            "crest_elevation_msl": d.crest_elevation_msl,
            "dam_type": d.dam_type,
            "corridor_name": d.downstream_corridor_name,
            "settlements_count": len(d.settlements),
            "safe_zones_count": len(d.safe_zones),
        }
        for d in MAHARASHTRA_DAM_DATABASE.values()
    ]


@router.get("/dam/{dam_id}")
async def get_dam_profile(dam_id: str):
    """Returns hydrodynamic profile for a specific Maharashtra dam."""
    dam = HydrodynamicSolver.get_or_create_dam_profile(dam_id)
    return dam.model_dump()


@router.post("/run")
async def run_hydrodynamic_simulation(payload: RunSimulationRequest):
    """Executes hydrodynamic dam-break calculation and returns time-stepped inundation layers."""
    try:
        result = HydrodynamicSolver.run_simulation(
            dam_id=payload.dam_id,
            breach_type=payload.breach_type,
            breach_width_m=payload.breach_width_m,
            formation_time_min=payload.formation_time_min,
            duration_hrs=payload.duration_hrs,
            reservoir_level_pct=payload.reservoir_level_pct,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


@router.get("/export/geojson")
async def export_simulation_geojson(
    dam_id: str = Query("khadakwasla"),
    hours: int = Query(24)
):
    """Exports simulation inundation polygon as standard GeoJSON."""
    try:
        sim = HydrodynamicSolver.run_simulation(dam_id=dam_id)
        # Find step
        step = next((s for s in sim["timesteps"] if s["hours"] == hours), sim["timesteps"][-1])
        
        feature = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "dam_id": sim["dam_id"],
                        "dam_name": sim["dam_name"],
                        "hours": step["hours"],
                        "peak_discharge_m3s": step["peak_discharge_m3s"],
                        "max_depth_m": step["max_depth_m"],
                        "inundated_area_sqkm": step["inundated_area_sqkm"],
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [pt[1], pt[0]] for pt in step["flood_polygon"]
                        ]]
                    }
                }
            ]
        }
        return Response(
            content=json.dumps(feature),
            media_type="application/geo+json",
            headers={"Content-Disposition": f"attachment; filename=jalsahayak_sim_{dam_id}_{hours}h.geojson"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
