"""API-Football collector for live match data and statistics."""

import httpx
from datetime import datetime
from typing import Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)

BASE_URL = "https://v3.football.api-sports.io"


class APIFootballCollector:
    """Collector for API-Football data (100 requests/day free tier)."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.api_football_key
        self.headers = {
            "x-apisports-key": self.api_key,
        }

    async def _request(self, endpoint: str, params: dict = None) -> dict:
        """Make API request."""
        if not self.api_key:
            logger.warning("API-Football key not configured")
            return {"response": []}

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
                logger.error(f"API-Football request failed: {e}")
                return {"response": []}

    async def get_world_cup_fixtures(self, season: int = 2026) -> list:
        """Get World Cup 2026 fixtures."""
        # World Cup league ID is typically 1
        data = await self._request(
            "fixtures",
            {"league": 1, "season": season}
        )
        return data.get("response", [])

    async def get_team_statistics(self, team_id: int, league_id: int = 1, season: int = 2026) -> dict:
        """Get team statistics for a specific league/season."""
        data = await self._request(
            "teams/statistics",
            {"team": team_id, "league": league_id, "season": season}
        )
        return data.get("response", {})

    async def get_head_to_head(self, team1_id: int, team2_id: int, last: int = 10) -> list:
        """Get head-to-head results between two teams."""
        data = await self._request(
            "fixtures/headtohead",
            {"h2h": f"{team1_id}-{team2_id}", "last": last}
        )
        return data.get("response", [])

    async def get_team_form(self, team_id: int, last: int = 5) -> list:
        """Get team's recent form (last N matches)."""
        data = await self._request(
            "fixtures",
            {"team": team_id, "last": last}
        )
        return data.get("response", [])

    async def get_standings(self, league_id: int, season: int) -> list:
        """Get league standings."""
        data = await self._request(
            "standings",
            {"league": league_id, "season": season}
        )
        response = data.get("response", [])
        if response:
            return response[0].get("league", {}).get("standings", [])
        return []

    async def get_odds(self, fixture_id: int) -> dict:
        """Get betting odds for a fixture."""
        data = await self._request(
            "odds",
            {"fixture": fixture_id}
        )
        return data.get("response", [])

    def parse_fixture(self, fixture_data: dict) -> dict:
        """Parse fixture data into standardized format."""
        fixture = fixture_data.get("fixture", {})
        teams = fixture_data.get("teams", {})
        goals = fixture_data.get("goals", {})
        score = fixture_data.get("score", {})

        return {
            "id": fixture.get("id"),
            "date": fixture.get("date"),
            "venue": fixture.get("venue", {}).get("name"),
            "city": fixture.get("venue", {}).get("city"),
            "status": fixture.get("status", {}).get("short"),
            "home_team": {
                "id": teams.get("home", {}).get("id"),
                "name": teams.get("home", {}).get("name"),
                "logo": teams.get("home", {}).get("logo"),
            },
            "away_team": {
                "id": teams.get("away", {}).get("id"),
                "name": teams.get("away", {}).get("name"),
                "logo": teams.get("away", {}).get("logo"),
            },
            "home_score": goals.get("home"),
            "away_score": goals.get("away"),
            "halftime_home": score.get("halftime", {}).get("home"),
            "halftime_away": score.get("halftime", {}).get("away"),
        }

    def calculate_form_points(self, matches: list, team_id: int) -> int:
        """Calculate form points from recent matches (W=3, D=1, L=0)."""
        points = 0
        for match in matches:
            home_team = match.get("teams", {}).get("home", {})
            away_team = match.get("teams", {}).get("away", {})
            home_goals = match.get("goals", {}).get("home", 0) or 0
            away_goals = match.get("goals", {}).get("away", 0) or 0

            if home_team.get("id") == team_id:
                if home_goals > away_goals:
                    points += 3
                elif home_goals == away_goals:
                    points += 1
            elif away_team.get("id") == team_id:
                if away_goals > home_goals:
                    points += 3
                elif home_goals == away_goals:
                    points += 1

        return points
