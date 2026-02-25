"""Data collectors for World Cup predictor."""

from .api_football import APIFootballCollector
from .football_data_org import FootballDataOrgCollector
from .fifa_rankings import FIFARankingsCollector
from .historical import HistoricalDataCollector

__all__ = [
    "APIFootballCollector",
    "FootballDataOrgCollector",
    "FIFARankingsCollector",
    "HistoricalDataCollector",
]
