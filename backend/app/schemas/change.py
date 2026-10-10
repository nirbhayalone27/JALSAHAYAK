"""Change detection schemas."""

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import PolygonGeometry


class ChangeSeverity(str, Enum):
    """Change severity levels."""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"


class ChangeMetrics(BaseModel):
    """Derived quantitative metrics for detected changes."""
    area_change_pct: Optional[float] = Field(None, description="Percentage area increase or decrease")
    area_diff_sqkm: Optional[float] = Field(None, description="Absolute area differential in sq km")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Detection confidence score")
    ndwi_delta: Optional[float] = Field(None, description="Water index delta between dates")
    is_synthetic: bool = False


class ChangeBase(BaseModel):
    """Base change record fields."""
    change_type: str = Field(..., description="water_spread, boundary_shift, surface_depletion, anomaly")
    severity: Optional[ChangeSeverity] = ChangeSeverity.LOW
    description: Optional[str] = Field(None, description="Human-readable description of detected variance")
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ChangeCreate(ChangeBase):
    """Payload for recording a newly computed change."""
    dam_id: Optional[uuid.UUID] = None
    observation_a_id: Optional[uuid.UUID] = None
    observation_b_id: Optional[uuid.UUID] = None
    change_geometry: Optional[PolygonGeometry] = None


class ChangeResponse(ChangeBase):
    """Full change record response."""
    id: uuid.UUID
    dam_id: uuid.UUID
    observation_a_id: Optional[uuid.UUID] = None
    observation_b_id: Optional[uuid.UUID] = None
    change_geometry: Optional[PolygonGeometry] = None
    detected_at: datetime

    model_config = ConfigDict(from_attributes=True)
