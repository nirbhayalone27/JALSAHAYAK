"""JalSahayak database models registry."""

from app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin
from app.models.user import User
from app.models.dam import Dam
from app.models.observation import Observation
from app.models.change import Change
from app.models.status import Status
from app.models.scenario import Scenario
from app.models.impact import Impact
from app.models.alert import Alert
from app.models.report import Report

__all__ = [
    "Base",
    "UUIDPrimaryKeyMixin",
    "TimestampMixin",
    "User",
    "Dam",
    "Observation",
    "Change",
    "Status",
    "Scenario",
    "Impact",
    "Alert",
    "Report",
]
