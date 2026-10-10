"""Dam registry Pydantic schemas."""

import uuid
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import PointGeometry, PolygonGeometry


class DamBase(BaseModel):
    """Base dam attributes."""
    name: str = Field(..., min_length=1, max_length=200, description="Dam identification name")
    river: Optional[str] = Field(None, max_length=200, description="Parent river basin or channel")
    state: Optional[str] = Field(None, max_length=100, description="State / Province")
    district: Optional[str] = Field(None, max_length=100, description="District / Region")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Custom metadata and structural specs")


class DamCreate(DamBase):
    """Schema for registering a new dam."""
    location: PointGeometry = Field(..., description="Dam crest central coordinates")
    reservoir_area: PolygonGeometry = Field(..., description="Reservoir polygon boundary")
    monitoring_area: Optional[PolygonGeometry] = Field(None, description="Extended monitoring buffer polygon")
    downstream_region: Optional[PolygonGeometry] = Field(None, description="Downstream valley flood study zone")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Khadakwasla Dam",
                "river": "Mutha",
                "state": "Maharashtra",
                "district": "Pune",
                "location": {
                    "type": "Point",
                    "coordinates": [73.7618, 18.4357]
                },
                "reservoir_area": {
                    "type": "Polygon",
                    "coordinates": [[[73.72, 18.42], [73.78, 18.42], [73.78, 18.46], [73.72, 18.46], [73.72, 18.42]]]
                },
                "metadata": {
                    "height_m": 32,
                    "type": "Masonry gravity",
                    "is_synthetic": False
                }
            }
        }
    )


class DamUpdate(BaseModel):
    """Schema for updating dam information."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    river: Optional[str] = Field(None, max_length=200)
    state: Optional[str] = Field(None, max_length=100)
    district: Optional[str] = Field(None, max_length=100)
    location: Optional[PointGeometry] = None
    reservoir_area: Optional[PolygonGeometry] = None
    monitoring_area: Optional[PolygonGeometry] = None
    downstream_region: Optional[PolygonGeometry] = None
    metadata: Optional[Dict[str, Any]] = None


class DamSummaryResponse(BaseModel):
    """Lightweight dam representation for table and map overview lists."""
    id: uuid.UUID
    name: str
    river: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    location: PointGeometry
    latest_status: Optional[str] = "NORMAL"
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DamResponse(DamBase):
    """Full dam detail response representation."""
    id: uuid.UUID
    location: PointGeometry
    reservoir_area: PolygonGeometry
    monitoring_area: Optional[PolygonGeometry] = None
    downstream_region: Optional[PolygonGeometry] = None
    latest_status: Optional[str] = "NORMAL"
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
