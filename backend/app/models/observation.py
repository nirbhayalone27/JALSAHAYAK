"""Observation database model."""

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Float, Date, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin, utcnow

if TYPE_CHECKING:
    from app.models.dam import Dam


class Observation(Base, UUIDPrimaryKeyMixin):
    """Satellite or environmental observation record for a monitored dam."""

    __tablename__ = "observations"

    dam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("dams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    observation_date: Mapped[date] = mapped_column(Date, nullable=False)
    source: Mapped[str] = mapped_column(String(100), nullable=False)  # sentinel-2, synthetic, landsat
    data_type: Mapped[str] = mapped_column(String(50), nullable=False)  # optical, sar, derived
    coverage_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    quality: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # good, moderate, poor
    storage_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    metadata_payload: Mapped[Optional[dict]] = mapped_column("metadata", JSONB, nullable=True)
    ingested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )

    # Relationships
    dam: Mapped["Dam"] = relationship("Dam", back_populates="observations")

    __table_args__ = (
        Index("ix_observations_dam_id_date", "dam_id", "observation_date"),
    )

    def __repr__(self) -> str:
        return f"<Observation dam={self.dam_id} date={self.observation_date} source={self.source}>"
