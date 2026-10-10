"""Common reusable schemas: GeoJSON primitives, pagination, and error responses."""

from typing import Generic, List, Literal, Optional, TypeVar, Union
from pydantic import BaseModel, ConfigDict, Field, field_validator

T = TypeVar("T")


class PointGeometry(BaseModel):
    """GeoJSON Point geometry."""
    type: Literal["Point"] = "Point"
    coordinates: List[float] = Field(..., min_length=2, max_length=3, description="[longitude, latitude, elevation?]")

    @field_validator("coordinates")
    @classmethod
    def validate_coordinates(cls, v: List[float]) -> List[float]:
        lon, lat = v[0], v[1]
        if not (-180.0 <= lon <= 180.0):
            raise ValueError(f"Longitude must be between -180 and 180, got {lon}")
        if not (-90.0 <= lat <= 90.0):
            raise ValueError(f"Latitude must be between -90 and 90, got {lat}")
        return v


class PolygonGeometry(BaseModel):
    """GeoJSON Polygon geometry."""
    type: Literal["Polygon"] = "Polygon"
    coordinates: List[List[List[float]]] = Field(..., description="List of linear rings [ [ [lon, lat], ... ] ]")


class MultiPolygonGeometry(BaseModel):
    """GeoJSON MultiPolygon geometry."""
    type: Literal["MultiPolygon"] = "MultiPolygon"
    coordinates: List[List[List[List[float]]]] = Field(..., description="List of polygon coordinate rings")


class GenericGeometry(BaseModel):
    """Generic GeoJSON geometry."""
    type: str
    coordinates: Union[List[float], List[List[List[float]]], List[List[List[List[float]]]]]


# --- Pagination ---

class PaginationMeta(BaseModel):
    """Metadata for paginated collections."""
    page: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, le=100, description="Items per page")
    total_items: int = Field(..., ge=0, description="Total count of items across all pages")
    total_pages: int = Field(..., ge=0, description="Total pages available")


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard generic wrapper for paginated API responses."""
    items: List[T]
    pagination: PaginationMeta

    model_config = ConfigDict(from_attributes=True)


# --- Error Representation ---

class ErrorDetail(BaseModel):
    """Structured individual error detail."""
    field: Optional[str] = None
    message: str
    error_type: Optional[str] = None


class ErrorResponse(BaseModel):
    """Standard error response payload."""
    error: str
    message: str
    code: int
    details: Optional[List[ErrorDetail]] = None
