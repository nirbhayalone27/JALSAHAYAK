"""Satellite and environmental observation schemas."""

import uuid
from datetime import date, datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class ObservationBase(BaseModel):
    """Base observation attributes."""
    observation_date: date = Field(..., description="Date of observation acquisition")
    source: str = Field(..., description="Provider / sensor source, e.g. sentinel-2, synthetic")
    data_type: str = Field(..., description="Modality, e.g. optical, sar, derived")
    coverage_pct: Optional[float] = Field(None, ge=0.0, le=100.0, description="Spatial coverage percentage")
    quality: Optional[str] = Field("good", description="Observation clarity: good, moderate, poor")
    storage_path: Optional[str] = Field(None, description="Path to raster/derived artifact")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Payload attributes including is_synthetic")


class ObservationCreate(ObservationBase):
    """Payload for registering or ingesting a new observation."""
    dam_id: Optional[uuid.UUID] = Field(None, description="Parent dam UUID (if not supplied via URL path)")


class ObservationResponse(ObservationBase):
    """Full observation record response."""
    id: uuid.UUID
    dam_id: uuid.UUID
    ingested_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ObservationSummaryResponse(BaseModel):
    """Compact observation item for date timeline picker."""
    id: uuid.UUID
    dam_id: uuid.UUID
    observation_date: date
    source: str
    data_type: str
    quality: Optional[str] = None
    is_synthetic: bool = False

    model_config = ConfigDict(from_attributes=True)
