"""Dam database model."""

from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.database import Base
from app.models.base import UUIDPrimaryKeyMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.observation import Observation
    from app.models.change import Change
    from app.models.status import Status
    from app.models.scenario import Scenario
    from app.models.alert import Alert
    from app.models.report import Report


class Dam(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Monitored dam entity including spatial geometries for reservoir and downstream area."""

    __tablename__ = "dams"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    river: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    district: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # PostGIS geometries (SRID 4326 - WGS 84)
    location = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )
    reservoir_area = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=False,
    )
    monitoring_area = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=True,
    )
    downstream_region = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=True,
    )

    metadata_payload: Mapped[Optional[dict]] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    observations: Mapped[List["Observation"]] = relationship(
        "Observation", back_populates="dam", cascade="all, delete-orphan", order_by="desc(Observation.observation_date)"
    )
    changes: Mapped[List["Change"]] = relationship(
        "Change", back_populates="dam", cascade="all, delete-orphan", order_by="desc(Change.detected_at)"
    )
    statuses: Mapped[List["Status"]] = relationship(
        "Status", back_populates="dam", cascade="all, delete-orphan", order_by="desc(Status.computed_at)"
    )
    scenarios: Mapped[List["Scenario"]] = relationship(
        "Scenario", back_populates="dam", cascade="all, delete-orphan", order_by="desc(Scenario.created_at)"
    )
    alerts: Mapped[List["Alert"]] = relationship(
        "Alert", back_populates="dam", cascade="all, delete-orphan", order_by="desc(Alert.created_at)"
    )
    reports: Mapped[List["Report"]] = relationship(
        "Report", back_populates="dam", cascade="all, delete-orphan", order_by="desc(Report.generated_at)"
    )

    def __repr__(self) -> str:
        return f"<Dam {self.name} (id={self.id})>"
