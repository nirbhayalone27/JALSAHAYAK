"""Configuration management for JalSahayak backend."""

import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # Application
    APP_ENV: str = "development"
    DEBUG: bool = True
    APP_NAME: str = "JalSahayak"
    APP_VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Security & JWT
    SECRET_KEY: str = "development-secret-key-jalsahayak-insecure-default-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database URLs
    # Async for FastAPI application, Sync for Alembic migrations
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/jalsahayak"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/jalsahayak"

    # Background Jobs / Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Object Storage (MinIO / S3)
    STORAGE_TYPE: str = "minio"
    STORAGE_ENDPOINT: str = "localhost:9000"
    STORAGE_ACCESS_KEY: str = "minioadmin"
    STORAGE_SECRET_KEY: str = "minioadmin"
    STORAGE_BUCKET: str = "jalsahayak-data"
    STORAGE_SECURE: bool = False

    # External Provider Configs
    COPERNICUS_CLIENT_ID: str = ""
    COPERNICUS_CLIENT_SECRET: str = ""
    USE_SYNTHETIC_FALLBACK: bool = True

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
