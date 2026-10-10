"""Monitoring report schemas."""

import uuid
from datetime import date, datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ReportContent(BaseModel):
    """Structured sections of an auto-generated dam intelligence report."""
    dam_name: str
    location: Dict[str, Any]
    monitoring_period: Dict[str, Optional[date]]
    total_observations_analyzed: int
    key_changes: List[Dict[str, Any]] = Field(default_factory=list)
    current_status: str
    active_alerts: List[Dict[str, Any]] = Field(default_factory=list)
    scenario_summary: Optional[Dict[str, Any]] = None
    limitations: List[str] = Field(
        default_factory=lambda: [
            "Satellite observations reflect surface water extent; cannot determine internal structural health.",
            "Hydrodynamic routing is model-based and subject to DEM accuracy."
        ]
    )
    is_synthetic: bool = False


class ReportCreate(BaseModel):
    """Payload to request/generate a report."""
    dam_id: Optional[uuid.UUID] = None
    monitoring_period_start: Optional[date] = None
    monitoring_period_end: Optional[date] = None
    content: Optional[Dict[str, Any]] = None


class ReportResponse(BaseModel):
    """Report response representation."""
    id: uuid.UUID
    dam_id: uuid.UUID
    monitoring_period_start: Optional[date] = None
    monitoring_period_end: Optional[date] = None
    content: Dict[str, Any]
    generated_at: datetime
    version: int

    model_config = ConfigDict(from_attributes=True)
