"""Alert notification schemas."""

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class AlertSeverity(str, Enum):
    """Alert priority level."""
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class AlertType(str, Enum):
    """Event trigger type for alert generation."""
    RAPID_INFLOW = "RAPID_INFLOW"
    ABNORMAL_SPREAD = "ABNORMAL_SPREAD"
    DOWNSTREAM_WATER = "DOWNSTREAM_WATER"
    BREACH_SIMULATION = "BREACH_SIMULATION"
    SYSTEM_NOTICE = "SYSTEM_NOTICE"


class AlertBase(BaseModel):
    """Base alert attributes."""
    severity: AlertSeverity
    alert_type: AlertType
    title: str = Field(..., min_length=1, max_length=255, description="Short descriptive alert headline")
    reason: str = Field(..., min_length=1, description="Concrete factual reason for alert generation")
    evidence: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Supporting observation or change data")
    recommended_action: Optional[str] = Field(None, description="Prescribed operational response for decision-makers")


class AlertCreate(AlertBase):
    """Payload to trigger an alert."""
    dam_id: Optional[uuid.UUID] = None


class AlertAcknowledge(BaseModel):
    """Payload to acknowledge an alert."""
    acknowledged: bool = True


class AlertResponse(AlertBase):
    """Full alert response representation."""
    id: uuid.UUID
    dam_id: uuid.UUID
    acknowledged: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
