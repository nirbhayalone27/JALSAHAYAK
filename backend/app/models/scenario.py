"""Flood and dam-break scenario database model."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin, utcnow

if TYPE_CHECKING:
    from app.models.dam import Dam
    from app.models.impact import Impact


class Scenario(Base, UUIDPrimaryKeyMixin):
    """Flood simulation and hypothetical dam-break scenario."""

    __tablename__ = "scenarios"

    dam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("dams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    parameters: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )  # e.g. breach_type, breach_width_m, breach_time_hours, initial_level_pct
    status: Mapped[str] = mapped_column(
        String(50),
        default="draft",
        nullable=False,
    )  # draft, queued, running, completed, failed
    result: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )  # max_discharge, peak_time_hr, affected_area_sqkm, etc.

    # PostGIS MultiPolygon of inundated flood extent
    flood_extent = mapped_column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    dam: Mapped["Dam"] = relationship("Dam", back_populates="scenarios")
    impacts: Mapped[List["Impact"]] = relationship(
        "Impact", back_populates="scenario", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Scenario {self.name} (dam={self.dam_id}, status={self.status})>"
