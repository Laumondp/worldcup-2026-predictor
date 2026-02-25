"""Configuration settings for the World Cup 2026 Predictor."""

from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings."""

    # App settings
    app_name: str = "World Cup 2026 Predictor"
    debug: bool = True

    # Database
    database_url: str = "sqlite:///./data/worldcup.db"

    # API Keys (free tiers)
    api_football_key: str = ""
    football_data_org_key: str = ""

    # ML Model
    model_path: str = "./models/predictor.pkl"

    # Data refresh interval (hours)
    data_refresh_interval: int = 24

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
