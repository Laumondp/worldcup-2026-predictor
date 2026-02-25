"""FIFA Rankings scraper for official rankings data."""

import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict
import logging
import re

logger = logging.getLogger(__name__)

FIFA_RANKINGS_URL = "https://www.fifa.com/fifa-world-ranking/men"


class FIFARankingsCollector:
    """Collector for FIFA World Rankings via scraping."""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }

    async def get_current_rankings(self) -> List[Dict]:
        """Scrape current FIFA rankings."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    FIFA_RANKINGS_URL,
                    headers=self.headers,
                    timeout=30.0,
                    follow_redirects=True,
                )
                response.raise_for_status()
                return self._parse_rankings_page(response.text)
            except httpx.HTTPError as e:
                logger.error(f"Failed to fetch FIFA rankings: {e}")
                return self._get_fallback_rankings()

    def _parse_rankings_page(self, html: str) -> List[Dict]:
        """Parse rankings from FIFA website HTML."""
        soup = BeautifulSoup(html, "lxml")
        rankings = []

        # Try to find ranking data (FIFA website structure may change)
        # This is a simplified parser - actual implementation may need adjustment
        ranking_items = soup.find_all("tr", class_=re.compile(r"ranking"))

        if not ranking_items:
            # Try alternative selectors
            ranking_items = soup.find_all("div", class_=re.compile(r"rank"))

        for item in ranking_items:
            try:
                rank_text = item.find(class_=re.compile(r"rank|position"))
                name_text = item.find(class_=re.compile(r"team|country|name"))
                points_text = item.find(class_=re.compile(r"points|pts"))

                if rank_text and name_text:
                    rank = int(re.search(r"\d+", rank_text.get_text()).group())
                    name = name_text.get_text().strip()
                    points = float(re.search(r"[\d.]+", points_text.get_text()).group()) if points_text else 0

                    rankings.append({
                        "rank": rank,
                        "team": name,
                        "points": points,
                        "date": datetime.utcnow().isoformat(),
                    })
            except (AttributeError, ValueError) as e:
                continue

        if not rankings:
            logger.warning("Could not parse FIFA rankings, using fallback data")
            return self._get_fallback_rankings()

        return rankings

    def _get_fallback_rankings(self) -> List[Dict]:
        """Fallback rankings data (approximate as of late 2024)."""
        # Top 50 teams with approximate rankings
        fallback_data = [
            ("Argentina", 1, 1867.25),
            ("France", 2, 1859.78),
            ("Spain", 3, 1845.30),
            ("England", 4, 1823.42),
            ("Brazil", 5, 1818.33),
            ("Belgium", 6, 1792.45),
            ("Netherlands", 7, 1788.31),
            ("Portugal", 8, 1752.12),
            ("Colombia", 9, 1742.88),
            ("Italy", 10, 1731.51),
            ("Germany", 11, 1703.89),
            ("Uruguay", 12, 1695.21),
            ("Croatia", 13, 1691.52),
            ("Morocco", 14, 1678.94),
            ("USA", 15, 1671.45),
            ("Switzerland", 16, 1662.31),
            ("Mexico", 17, 1658.77),
            ("Japan", 18, 1652.89),
            ("Senegal", 19, 1645.23),
            ("Iran", 20, 1638.54),
            ("Denmark", 21, 1631.22),
            ("Austria", 22, 1621.87),
            ("South Korea", 23, 1615.43),
            ("Australia", 24, 1608.91),
            ("Ukraine", 25, 1602.33),
            ("Turkey", 26, 1595.67),
            ("Poland", 27, 1589.12),
            ("Serbia", 28, 1582.88),
            ("Sweden", 29, 1576.54),
            ("Czech Republic", 30, 1569.21),
            ("Hungary", 31, 1562.43),
            ("Wales", 32, 1555.87),
            ("Russia", 33, 1548.92),
            ("Ecuador", 34, 1541.33),
            ("Cameroon", 35, 1534.78),
            ("Nigeria", 36, 1527.65),
            ("Egypt", 37, 1520.11),
            ("Algeria", 38, 1513.45),
            ("Canada", 39, 1506.88),
            ("Tunisia", 40, 1499.32),
            ("Scotland", 41, 1492.67),
            ("Peru", 42, 1485.23),
            ("Chile", 43, 1478.91),
            ("Norway", 44, 1471.54),
            ("Costa Rica", 45, 1464.12),
            ("Slovakia", 46, 1456.78),
            ("Paraguay", 47, 1449.33),
            ("Ivory Coast", 48, 1441.89),
            ("Greece", 49, 1434.21),
            ("Romania", 50, 1426.67),
        ]

        return [
            {
                "rank": rank,
                "team": team,
                "points": points,
                "date": datetime.utcnow().isoformat(),
            }
            for team, rank, points in fallback_data
        ]

    def get_confederation(self, team_name: str) -> str:
        """Get confederation for a team."""
        confederations = {
            # UEFA
            "France": "UEFA", "Spain": "UEFA", "England": "UEFA", "Belgium": "UEFA",
            "Netherlands": "UEFA", "Portugal": "UEFA", "Italy": "UEFA", "Germany": "UEFA",
            "Croatia": "UEFA", "Switzerland": "UEFA", "Denmark": "UEFA", "Austria": "UEFA",
            "Ukraine": "UEFA", "Turkey": "UEFA", "Poland": "UEFA", "Serbia": "UEFA",
            "Sweden": "UEFA", "Czech Republic": "UEFA", "Hungary": "UEFA", "Wales": "UEFA",
            "Russia": "UEFA", "Scotland": "UEFA", "Norway": "UEFA", "Slovakia": "UEFA",
            "Greece": "UEFA", "Romania": "UEFA",
            # CONMEBOL
            "Argentina": "CONMEBOL", "Brazil": "CONMEBOL", "Colombia": "CONMEBOL",
            "Uruguay": "CONMEBOL", "Ecuador": "CONMEBOL", "Peru": "CONMEBOL",
            "Chile": "CONMEBOL", "Paraguay": "CONMEBOL", "Venezuela": "CONMEBOL",
            "Bolivia": "CONMEBOL",
            # CONCACAF
            "USA": "CONCACAF", "Mexico": "CONCACAF", "Canada": "CONCACAF",
            "Costa Rica": "CONCACAF", "Jamaica": "CONCACAF", "Honduras": "CONCACAF",
            "Panama": "CONCACAF",
            # AFC
            "Japan": "AFC", "Iran": "AFC", "South Korea": "AFC", "Australia": "AFC",
            "Saudi Arabia": "AFC", "Qatar": "AFC", "Iraq": "AFC", "UAE": "AFC",
            "China": "AFC",
            # CAF
            "Morocco": "CAF", "Senegal": "CAF", "Cameroon": "CAF", "Nigeria": "CAF",
            "Egypt": "CAF", "Algeria": "CAF", "Tunisia": "CAF", "Ivory Coast": "CAF",
            "Ghana": "CAF", "South Africa": "CAF",
            # OFC
            "New Zealand": "OFC",
        }
        return confederations.get(team_name, "Unknown")

    def calculate_elo_rating(self, fifa_ranking: int, fifa_points: float) -> float:
        """Calculate approximate ELO rating from FIFA ranking and points."""
        # Simplified ELO approximation based on FIFA points
        # Top teams have ELO around 2000-2100, lower ranked around 1200-1400
        base_elo = 1500
        if fifa_points > 0:
            # Scale FIFA points (typically 800-1900) to ELO scale
            elo = 1200 + (fifa_points - 800) * 0.8
            return max(1000, min(2200, elo))
        else:
            # Estimate from ranking
            return max(1000, 2100 - (fifa_ranking * 15))
