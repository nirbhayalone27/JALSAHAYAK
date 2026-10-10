"""Alert notification database model."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin, utcnow

if TYPE_CHECKING:
    from app.models.dam import Dam


class Alert(Base, UUIDPrimaryKeyMixin):
    """Actionable alert item generated with concrete evidence and reason."""

    __tablename__ = "alerts"

    dam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("dams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    severity: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )  # INFO, WARNING, CRITICAL
    alert_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )  # RAPID_INFLOW, ABNORMAL_SPREAD, DOWNSTREAM_WATER, BREACH_SIMULATION
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    recommended_action: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    acknowledged: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )

    # Relationships
    dam: Mapped["Dam"] = relationship("Dam", back_populates="alerts")

    __table_args__ = (
        Index("ix_alerts_dam_id_created_at", "dam_id", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Alert {self.title} severity={self.severity} dam={self.dam_id}>"
