"""Dam status history database model."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin, utcnow

if TYPE_CHECKING:
    from app.models.dam import Dam


class Status(Base, UUIDPrimaryKeyMixin):
    """Dam operational and health status snapshot with evidence attribution."""

    __tablename__ = "statuses"

    dam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("dams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )  # NORMAL, WATCH, ALERT, CRITICAL
    previous_status: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    reasons: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )  # List of reason objects
    evidence_ids: Mapped[Optional[List[uuid.UUID]]] = mapped_column(
        ARRAY(UUID(as_uuid=True)),
        nullable=True,
    )
    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )

    # Relationships
    dam: Mapped["Dam"] = relationship("Dam", back_populates="statuses")

    __table_args__ = (
        Index("ix_statuses_dam_id_computed_at", "dam_id", "computed_at"),
    )

    def __repr__(self) -> str:
        return f"<Status dam={self.dam_id} status={self.status} at={self.computed_at}>"
