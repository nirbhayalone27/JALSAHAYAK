"""Downstream impact feature database model."""

import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.scenario import Scenario


class Impact(Base, UUIDPrimaryKeyMixin):
    """Downstream affected entity (settlement, road, bridge, agriculture) in a scenario."""

    __tablename__ = "impacts"

    scenario_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("scenarios.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    impact_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )  # settlement, road, bridge, agriculture, critical_infrastructure
    feature_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # PostGIS Generic Geometry (Point for village/bridge, LineString for road, Polygon for field)
    feature_geometry = mapped_column(
        Geometry(geometry_type="GEOMETRY", srid=4326, spatial_index=True),
        nullable=True,
    )

    estimated_impact: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )  # e.g. {"water_depth_m": 2.4, "arrival_time_hr": 1.5, "severity": "CRITICAL"}
    metadata_payload: Mapped[Optional[dict]] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    scenario: Mapped["Scenario"] = relationship("Scenario", back_populates="impacts")

    def __repr__(self) -> str:
        return f"<Impact type={self.impact_type} name={self.feature_name}>"
