"""Football-Data.org collector for historical data and competitions."""

import httpx
from datetime import datetime
from typing import Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)

BASE_URL = "https://api.football-data.org/v4"


class FootballDataOrgCollector:
    """Collector for Football-Data.org API (free tier)."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.football_data_org_key
        self.headers = {
            "X-Auth-Token": self.api_key,
        } if self.api_key else {}

    async def _request(self, endpoint: str, params: dict = None) -> dict:
        """Make API request."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{BASE_URL}/{endpoint}",
                    headers=self.headers,
                    params=params or {},
                    timeout=30.0,
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                logger.error(f"Football-Data.org request failed: {e}")
                return {}

    async def get_competitions(self) -> list:
        """Get available competitions."""
        data = await self._request("competitions")
        return data.get("competitions", [])

    async def get_world_cup_matches(self, season: int = 2022) -> list:
        """Get World Cup matches for a season."""
        # WC competition code
        data = await self._request(f"competitions/WC/matches", {"season": season})
        return data.get("matches", [])

    async def get_world_cup_standings(self, season: int = 2022) -> list:
        """Get World Cup group standings."""
        data = await self._request(f"competitions/WC/standings", {"season": season})
        return data.get("standings", [])

    async def get_world_cup_teams(self, season: int = 2022) -> list:
        """Get teams participating in World Cup."""
        data = await self._request(f"competitions/WC/teams", {"season": season})
        return data.get("teams", [])

    async def get_team_matches(self, team_id: int, date_from: str = None, date_to: str = None) -> list:
        """Get matches for a specific team."""
        params = {}
        if date_from:
            params["dateFrom"] = date_from
        if date_to:
            params["dateTo"] = date_to

        data = await self._request(f"teams/{team_id}/matches", params)
        return data.get("matches", [])

    async def get_international_matches(self, date_from: str = None, date_to: str = None) -> list:
        """Get international matches."""
        params = {"competitions": "WC,EC,CA,CAN"}  # World Cup, Euro, Copa America, African Cup
        if date_from:
            params["dateFrom"] = date_from
        if date_to:
            params["dateTo"] = date_to

        data = await self._request("matches", params)
        return data.get("matches", [])

    def parse_match(self, match_data: dict) -> dict:
        """Parse match data into standardized format."""
        return {
            "id": match_data.get("id"),
            "date": match_data.get("utcDate"),
            "competition": match_data.get("competition", {}).get("name"),
            "stage": match_data.get("stage"),
            "group": match_data.get("group"),
            "home_team": {
                "id": match_data.get("homeTeam", {}).get("id"),
                "name": match_data.get("homeTeam", {}).get("name"),
                "code": match_data.get("homeTeam", {}).get("tla"),
            },
            "away_team": {
                "id": match_data.get("awayTeam", {}).get("id"),
                "name": match_data.get("awayTeam", {}).get("name"),
                "code": match_data.get("awayTeam", {}).get("tla"),
            },
            "home_score": match_data.get("score", {}).get("fullTime", {}).get("home"),
            "away_score": match_data.get("score", {}).get("fullTime", {}).get("away"),
            "status": match_data.get("status"),
        }

    async def get_historical_world_cups(self) -> list:
        """Get historical World Cup data for multiple seasons."""
        historical_seasons = [2022, 2018, 2014, 2010, 2006, 2002, 1998]
        all_matches = []

        for season in historical_seasons:
            try:
                matches = await self.get_world_cup_matches(season)
                for match in matches:
                    parsed = self.parse_match(match)
                    parsed["season"] = season
                    all_matches.append(parsed)
            except Exception as e:
                logger.error(f"Failed to get World Cup {season}: {e}")

        return all_matches
