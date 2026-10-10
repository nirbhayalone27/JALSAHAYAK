"""Dam health and monitoring status schemas."""

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class DamHealthStatus(str, Enum):
    """Four-tier health and operational status."""
    NORMAL = "NORMAL"
    WATCH = "WATCH"
    ALERT = "ALERT"
    CRITICAL = "CRITICAL"


class StatusReason(BaseModel):
    """Structured explanation for status assignment."""
    code: str = Field(..., description="Machine-readable reason code, e.g. ELEVATED_WATER_SPREAD")
    description: str = Field(..., description="Human-readable reason narrative")
    evidence_type: Optional[str] = Field(None, description="change, observation, scenario")
    evidence_id: Optional[uuid.UUID] = Field(None, description="UUID of primary supporting entity")
    metrics: Optional[Dict[str, Any]] = None


class StatusCreate(BaseModel):
    """Payload for registering a newly computed status."""
    dam_id: Optional[uuid.UUID] = None
    status: DamHealthStatus
    previous_status: Optional[DamHealthStatus] = None
    reasons: List[StatusReason] = Field(default_factory=list)
    evidence_ids: Optional[List[uuid.UUID]] = Field(default_factory=list)


class StatusResponse(BaseModel):
    """Dam status record response representation."""
    id: uuid.UUID
    dam_id: uuid.UUID
    status: DamHealthStatus
    previous_status: Optional[DamHealthStatus] = None
    reasons: List[Dict[str, Any]] = Field(default_factory=list)
    evidence_ids: Optional[List[uuid.UUID]] = Field(default_factory=list)
    computed_at: datetime

    model_config = ConfigDict(from_attributes=True)
