"""Unit tests for SQLAlchemy models structure and metadata."""

from app.models import (
    Base,
    User,
    Dam,
    Observation,
    Change,
    Status,
    Scenario,
    Impact,
    Alert,
    Report,
)


def test_models_table_names():
    """Verify all 9 core tables are registered with correct plural snake_case names."""
    tables = Base.metadata.tables
    assert "users" in tables
    assert "dams" in tables
    assert "observations" in tables
    assert "changes" in tables
    assert "statuses" in tables
    assert "scenarios" in tables
    assert "impacts" in tables
    assert "alerts" in tables
    assert "reports" in tables


def test_dam_model_columns_and_geometry():
    """Verify dam table columns and spatial geometries."""
    table = Base.metadata.tables["dams"]
    columns = table.c

    assert "id" in columns
    assert "name" in columns
    assert "river" in columns
    assert "state" in columns
    assert "location" in columns
    assert "reservoir_area" in columns
    assert "monitoring_area" in columns
    assert "downstream_region" in columns
    assert "metadata" in columns
    assert "created_at" in columns
    assert "updated_at" in columns


def test_observation_model_columns():
    """Verify observation table columns and foreign key."""
    table = Base.metadata.tables["observations"]
    columns = table.c

    assert "id" in columns
    assert "dam_id" in columns
    assert "observation_date" in columns
    assert "source" in columns
    assert "data_type" in columns
    assert "coverage_pct" in columns
    assert "quality" in columns


def test_scenario_and_impact_columns():
    """Verify scenario and impact tables."""
    scenarios_table = Base.metadata.tables["scenarios"]
    impacts_table = Base.metadata.tables["impacts"]

    assert "flood_extent" in scenarios_table.c
    assert "parameters" in scenarios_table.c
    assert "status" in scenarios_table.c

    assert "scenario_id" in impacts_table.c
    assert "impact_type" in impacts_table.c
    assert "feature_geometry" in impacts_table.c
    assert "estimated_impact" in impacts_table.c


def test_alert_and_status_columns():
    """Verify alert and status tables."""
    alerts_table = Base.metadata.tables["alerts"]
    statuses_table = Base.metadata.tables["statuses"]

    assert "severity" in alerts_table.c
    assert "alert_type" in alerts_table.c
    assert "reason" in alerts_table.c
    assert "evidence" in alerts_table.c
    assert "acknowledged" in alerts_table.c

    assert "status" in statuses_table.c
    assert "reasons" in statuses_table.c
    assert "evidence_ids" in statuses_table.c
