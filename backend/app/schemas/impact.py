"""Downstream impact feature schemas."""

import uuid
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import GenericGeometry


class ImpactType(str, Enum):
    """Categories of downstream affected assets."""
    SETTLEMENT = "settlement"
    ROAD = "road"
    BRIDGE = "bridge"
    AGRICULTURE = "agriculture"
    CRITICAL_INFRASTRUCTURE = "critical_infrastructure"


class EstimatedImpact(BaseModel):
    """Quantitative impact attributes for a single feature."""
    water_depth_m: Optional[float] = Field(None, ge=0.0, description="Estimated maximum flood depth")
    arrival_time_hr: Optional[float] = Field(None, ge=0.0, description="Hours after breach before water reaches feature")
    duration_hr: Optional[float] = Field(None, ge=0.0, description="Estimated inundation duration")
    severity: Optional[str] = Field("MODERATE", description="LOW, MODERATE, CRITICAL")
    population_affected: Optional[int] = Field(None, ge=0, description="Estimated population impacted")
    area_ha: Optional[float] = Field(None, ge=0.0, description="Flooded area in hectares")


class ImpactCreate(BaseModel):
    """Payload to record an impacted feature."""
    scenario_id: Optional[uuid.UUID] = None
    impact_type: ImpactType
    feature_name: Optional[str] = Field(None, max_length=255)
    feature_geometry: Optional[GenericGeometry] = None
    estimated_impact: Optional[EstimatedImpact] = None
    metadata: Optional[Dict[str, Any]] = None


class ImpactResponse(BaseModel):
    """Impacted feature representation."""
    id: uuid.UUID
    scenario_id: uuid.UUID
    impact_type: ImpactType
    feature_name: Optional[str] = None
    feature_geometry: Optional[GenericGeometry] = None
    estimated_impact: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
