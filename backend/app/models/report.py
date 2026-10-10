"""Monitoring report database model."""

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Integer, Date, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin, utcnow

if TYPE_CHECKING:
    from app.models.dam import Dam


class Report(Base, UUIDPrimaryKeyMixin):
    """Automatically compiled monitoring and impact intelligence report."""

    __tablename__ = "reports"

    dam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("dams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    monitoring_period_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    monitoring_period_end: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Relationships
    dam: Mapped["Dam"] = relationship("Dam", back_populates="reports")

    __table_args__ = (
        Index("ix_reports_dam_id_generated_at", "dam_id", "generated_at"),
    )

    def __repr__(self) -> str:
        return f"<Report dam={self.dam_id} v{self.version} generated_at={self.generated_at}>"
