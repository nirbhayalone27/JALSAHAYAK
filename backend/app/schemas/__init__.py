"""Pydantic schemas registry for JalSahayak API."""

from app.schemas.common import (
    PointGeometry,
    PolygonGeometry,
    MultiPolygonGeometry,
    GenericGeometry,
    PaginationMeta,
    PaginatedResponse,
    ErrorDetail,
    ErrorResponse,
)
from app.schemas.user import (
    UserRole,
    UserCreate,
    UserResponse,
    LoginRequest,
    TokenResponse,
    TokenPayload,
)
from app.schemas.dam import (
    DamBase,
    DamCreate,
    DamUpdate,
    DamResponse,
    DamSummaryResponse,
)
from app.schemas.observation import (
    ObservationBase,
    ObservationCreate,
    ObservationResponse,
    ObservationSummaryResponse,
)
from app.schemas.change import (
    ChangeSeverity,
    ChangeMetrics,
    ChangeBase,
    ChangeCreate,
    ChangeResponse,
)
from app.schemas.status import (
    DamHealthStatus,
    StatusReason,
    StatusCreate,
    StatusResponse,
)
from app.schemas.scenario import (
    ScenarioStatus,
    BreachType,
    ScenarioParameters,
    ScenarioResult,
    ScenarioCreate,
    ScenarioResponse,
)
from app.schemas.impact import (
    ImpactType,
    EstimatedImpact,
    ImpactCreate,
    ImpactResponse,
)
from app.schemas.alert import (
    AlertSeverity,
    AlertType,
    AlertBase,
    AlertCreate,
    AlertAcknowledge,
    AlertResponse,
)
from app.schemas.report import (
    ReportContent,
    ReportCreate,
    ReportResponse,
)

__all__ = [
    # Common
    "PointGeometry",
    "PolygonGeometry",
    "MultiPolygonGeometry",
    "GenericGeometry",
    "PaginationMeta",
    "PaginatedResponse",
    "ErrorDetail",
    "ErrorResponse",
    # User & Auth
    "UserRole",
    "UserCreate",
    "UserResponse",
    "LoginRequest",
    "TokenResponse",
    "TokenPayload",
    # Dam
    "DamBase",
    "DamCreate",
    "DamUpdate",
    "DamResponse",
    "DamSummaryResponse",
    # Observation
    "ObservationBase",
    "ObservationCreate",
    "ObservationResponse",
    "ObservationSummaryResponse",
    # Change
    "ChangeSeverity",
    "ChangeMetrics",
    "ChangeBase",
    "ChangeCreate",
    "ChangeResponse",
    # Status
    "DamHealthStatus",
    "StatusReason",
    "StatusCreate",
    "StatusResponse",
    # Scenario
    "ScenarioStatus",
    "BreachType",
    "ScenarioParameters",
    "ScenarioResult",
    "ScenarioCreate",
    "ScenarioResponse",
    # Impact
    "ImpactType",
    "EstimatedImpact",
    "ImpactCreate",
    "ImpactResponse",
    # Alert
    "AlertSeverity",
    "AlertType",
    "AlertBase",
    "AlertCreate",
    "AlertAcknowledge",
    "AlertResponse",
    # Report
    "ReportContent",
    "ReportCreate",
    "ReportResponse",
]
