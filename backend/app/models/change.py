"""Change detection database model."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Text, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin, utcnow

if TYPE_CHECKING:
    from app.models.dam import Dam
    from app.models.observation import Observation


class Change(Base, UUIDPrimaryKeyMixin):
    """Change detection results derived from comparing two observation dates."""

    __tablename__ = "changes"

    dam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("dams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    observation_a_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("observations.id", ondelete="SET NULL"),
        nullable=True,
    )
    observation_b_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("observations.id", ondelete="SET NULL"),
        nullable=True,
    )
    change_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )  # water_spread, boundary_shift, surface_depletion, anomaly
    severity: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )  # low, moderate, high
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # PostGIS Polygon of detected change
    change_geometry = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=True,
    )

    metrics: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
    )  # e.g. {"area_change_pct": 14.2, "area_diff_sqkm": 2.4, "confidence": 0.88}
    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )

    # Relationships
    dam: Mapped["Dam"] = relationship("Dam", back_populates="changes")
    observation_a: Mapped[Optional["Observation"]] = relationship(
        "Observation", foreign_keys=[observation_a_id]
    )
    observation_b: Mapped[Optional["Observation"]] = relationship(
        "Observation", foreign_keys=[observation_b_id]
    )

    __table_args__ = (
        Index("ix_changes_dam_id_detected_at", "dam_id", "detected_at"),
    )

    def __repr__(self) -> str:
        return f"<Change dam={self.dam_id} type={self.change_type} severity={self.severity}>"
