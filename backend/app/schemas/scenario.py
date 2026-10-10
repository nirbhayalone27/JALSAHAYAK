"""Flood scenario and simulation schemas."""

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import MultiPolygonGeometry


class ScenarioStatus(str, Enum):
    """Execution status of flood scenarios."""
    DRAFT = "draft"
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class BreachType(str, Enum):
    """Physical breach failure mode."""
    PIPING = "piping"
    OVERTOPPING = "overtopping"
    GATE_FAILURE = "gate_failure"
    SUDDEN_COLLAPSE = "sudden_collapse"


class ScenarioParameters(BaseModel):
    """Hydraulic and geotechnical parameters for flood simulation."""
    breach_type: BreachType = BreachType.OVERTOPPING
    initial_reservoir_level_pct: float = Field(..., ge=0.0, le=100.0, description="Percentage of full reservoir capacity")
    breach_width_m: float = Field(50.0, ge=1.0, le=2000.0, description="Final breach bottom/top width in meters")
    breach_formation_time_hr: float = Field(2.0, ge=0.05, le=72.0, description="Time for breach to fully develop")
    simulation_duration_hr: float = Field(24.0, ge=1.0, le=168.0, description="Duration to simulate downstream surge")
    downstream_reach_km: float = Field(30.0, ge=1.0, le=200.0, description="Distance downstream to model")
    manning_roughness: Optional[float] = Field(0.04, ge=0.01, le=0.2, description="Channel roughness coefficient")


class ScenarioResult(BaseModel):
    """Aggregated numerical outputs of flood routing simulation."""
    peak_discharge_m3s: Optional[float] = None
    total_inundated_area_sqkm: Optional[float] = None
    time_to_peak_hr: Optional[float] = None
    max_flood_depth_m: Optional[float] = None
    affected_settlements_count: Optional[int] = None
    is_synthetic: bool = False


class ScenarioCreate(BaseModel):
    """Payload to initiate a new flood scenario run."""
    dam_id: Optional[uuid.UUID] = None
    name: Optional[str] = Field("Hypothetical Dam-Break Scenario", max_length=255)
    parameters: ScenarioParameters


class ScenarioResponse(BaseModel):
    """Scenario response representation."""
    id: uuid.UUID
    dam_id: uuid.UUID
    name: Optional[str] = None
    parameters: Dict[str, Any]
    status: ScenarioStatus
    result: Optional[Dict[str, Any]] = None
    flood_extent: Optional[MultiPolygonGeometry] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
