"""Unit tests for Pydantic schemas and validation rules."""

import uuid
from datetime import date, datetime, timezone
import pytest
from pydantic import ValidationError

from app.schemas.common import (
    PointGeometry,
    PolygonGeometry,
    MultiPolygonGeometry,
    PaginationMeta,
    PaginatedResponse,
    ErrorResponse,
)
from app.schemas.user import UserCreate, UserResponse, UserRole, LoginRequest
from app.schemas.dam import DamCreate, DamUpdate, DamResponse, DamSummaryResponse
from app.schemas.observation import ObservationCreate, ObservationResponse
from app.schemas.change import ChangeCreate, ChangeResponse, ChangeSeverity
from app.schemas.status import StatusCreate, StatusResponse, DamHealthStatus, StatusReason
from app.schemas.scenario import ScenarioCreate, ScenarioResponse, BreachType, ScenarioStatus
from app.schemas.impact import ImpactCreate, ImpactResponse, ImpactType
from app.schemas.alert import AlertCreate, AlertResponse, AlertSeverity, AlertType
from app.schemas.report import ReportCreate, ReportResponse


def test_point_geometry_valid():
    """Test valid GeoJSON point coordinates."""
    point = PointGeometry(coordinates=[73.7537, 17.3965])
    assert point.type == "Point"
    assert point.coordinates == [73.7537, 17.3965]


def test_point_geometry_invalid_lat_lon():
    """Test rejection of out-of-bounds coordinates."""
    with pytest.raises(ValidationError):
        PointGeometry(coordinates=[185.0, 10.0])  # Lon > 180

    with pytest.raises(ValidationError):
        PointGeometry(coordinates=[70.0, -95.0])  # Lat < -90


def test_polygon_geometry_valid():
    """Test polygon geometry structure."""
    poly = PolygonGeometry(
        coordinates=[[[73.73, 17.38], [73.77, 17.38], [73.77, 17.41], [73.73, 17.41], [73.73, 17.38]]]
    )
    assert poly.type == "Polygon"
    assert len(poly.coordinates[0]) == 5


def test_pagination_wrapper():
    """Test generic paginated response."""
    items = ["item1", "item2"]
    meta = PaginationMeta(page=1, page_size=10, total_items=2, total_pages=1)
    paginated = PaginatedResponse[str](items=items, pagination=meta)
    assert paginated.pagination.page == 1
    assert len(paginated.items) == 2


def test_dam_create_and_validation():
    """Test DamCreate payload and required fields."""
    dam = DamCreate(
        name="Khadakwasla Dam",
        river="Mutha",
        state="Maharashtra",
        district="Pune",
        location=PointGeometry(coordinates=[73.7618, 18.4357]),
        reservoir_area=PolygonGeometry(
            coordinates=[[[73.72, 18.42], [73.78, 18.42], [73.78, 18.46], [73.72, 18.46], [73.72, 18.42]]]
        ),
        metadata={"is_synthetic": False},
    )
    assert dam.name == "Khadakwasla Dam"
    assert dam.location.coordinates[0] == 73.7618


def test_dam_create_missing_name():
    """Test validation fails when name is empty."""
    with pytest.raises(ValidationError):
        DamCreate(
            name="",
            location=PointGeometry(coordinates=[73.7537, 17.3965]),
            reservoir_area=PolygonGeometry(
                coordinates=[[[73.73, 17.38], [73.77, 17.38], [73.77, 17.41], [73.73, 17.41], [73.73, 17.38]]]
            ),
        )


def test_status_health_scale():
    """Test DamHealthStatus enum enforcement."""
    assert DamHealthStatus.NORMAL.value == "NORMAL"
    assert DamHealthStatus.CRITICAL.value == "CRITICAL"

    reason = StatusReason(
        code="WATER_INCREASE",
        description="Significant reservoir level expansion",
        evidence_type="change",
        evidence_id=uuid.uuid4(),
    )
    status_create = StatusCreate(
        dam_id=uuid.uuid4(),
        status=DamHealthStatus.WATCH,
        reasons=[reason],
    )
    assert status_create.status == DamHealthStatus.WATCH
    assert len(status_create.reasons) == 1


def test_alert_schema():
    """Test AlertCreate and AlertResponse schemas."""
    dam_id = uuid.uuid4()
    alert_create = AlertCreate(
        dam_id=dam_id,
        severity=AlertSeverity.WARNING,
        alert_type=AlertType.RAPID_INFLOW,
        title="Elevated Reservoir Water Spread",
        reason="Water spread increased by 14% across 48 hours.",
        recommended_action="Verify downstream discharge gates and alert local division.",
    )
    assert alert_create.severity == AlertSeverity.WARNING
    assert alert_create.alert_type == AlertType.RAPID_INFLOW


def test_scenario_parameters_validation():
    """Test scenario simulation parameters boundaries."""
    from app.schemas.scenario import ScenarioParameters

    params = ScenarioParameters(
        breach_type=BreachType.OVERTOPPING,
        initial_reservoir_level_pct=95.0,
        breach_width_m=60.0,
        breach_formation_time_hr=1.5,
        simulation_duration_hr=24.0,
        downstream_reach_km=30.0,
    )
    assert params.initial_reservoir_level_pct == 95.0

    # Over 100% capacity should fail
    with pytest.raises(ValidationError):
        ScenarioParameters(
            initial_reservoir_level_pct=110.0,
        )
