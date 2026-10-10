"""User and authentication schemas."""

import uuid
from datetime import datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(str, Enum):
    """User access roles."""
    ADMIN = "admin"
    ENGINEER = "engineer"
    VIEWER = "viewer"


class UserBase(BaseModel):
    """Base user fields."""
    email: EmailStr
    name: Optional[str] = Field(None, max_length=255)
    role: UserRole = UserRole.VIEWER


class UserCreate(UserBase):
    """Payload for creating a new user."""
    password: str = Field(..., min_length=8, max_length=128, description="Plaintext password, min 8 chars")


class UserResponse(UserBase):
    """Public user response representation."""
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    """Credentials payload for JWT token generation."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT bearer token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # in seconds
    refresh_token: Optional[str] = None


class TokenPayload(BaseModel):
    """Decoded JWT payload structure."""
    sub: str  # user UUID
    email: str
    role: str
    exp: int
