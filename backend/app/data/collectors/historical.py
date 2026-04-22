"""Historical data collector for World Cup matches."""

import pandas as pd
from datetime import datetime
from typing import List, Dict
import logging
import os

logger = logging.getLogger(__name__)


class HistoricalDataCollector:
    """Collector for historical World Cup and international match data."""

    def __init__(self, data_dir: str = "./data"):
        self.data_dir = data_dir

    def get_world_cup_history(self) -> List[Dict]:
        """Get historical World Cup match data."""
        # Comprehensive historical World Cup data
        historical_matches = [
            # 2022 World Cup - Key matches
            {"date": "2022-12-18", "home": "Argentina", "away": "France", "home_score": 3, "away_score": 3, "tournament": "World Cup 2022", "stage": "Final"},
            {"date": "2022-12-14", "home": "Argentina", "away": "Croatia", "home_score": 3, "away_score": 0, "tournament": "World Cup 2022", "stage": "Semi-final"},
            {"date": "2022-12-14", "home": "France", "away": "Morocco", "home_score": 2, "away_score": 0, "tournament": "World Cup 2022", "stage": "Semi-final"},
            {"date": "2022-12-10", "home": "Argentina", "away": "Netherlands", "home_score": 2, "away_score": 2, "tournament": "World Cup 2022", "stage": "Quarter-final"},
            {"date": "2022-12-10", "home": "Croatia", "away": "Brazil", "home_score": 1, "away_score": 1, "tournament": "World Cup 2022", "stage": "Quarter-final"},
            {"date": "2022-12-10", "home": "Morocco", "away": "Portugal", "home_score": 1, "away_score": 0, "tournament": "World Cup 2022", "stage": "Quarter-final"},
            {"date": "2022-12-10", "home": "England", "away": "France", "home_score": 1, "away_score": 2, "tournament": "World Cup 2022", "stage": "Quarter-final"},

            # 2018 World Cup - Key matches
            {"date": "2018-07-15", "home": "France", "away": "Croatia", "home_score": 4, "away_score": 2, "tournament": "World Cup 2018", "stage": "Final"},
            {"date": "2018-07-11", "home": "France", "away": "Belgium", "home_score": 1, "away_score": 0, "tournament": "World Cup 2018", "stage": "Semi-final"},
            {"date": "2018-07-11", "home": "Croatia", "away": "England", "home_score": 2, "away_score": 1, "tournament": "World Cup 2018", "stage": "Semi-final"},
            {"date": "2018-07-07", "home": "France", "away": "Uruguay", "home_score": 2, "away_score": 0, "tournament": "World Cup 2018", "stage": "Quarter-final"},
            {"date": "2018-07-07", "home": "Brazil", "away": "Belgium", "home_score": 1, "away_score": 2, "tournament": "World Cup 2018", "stage": "Quarter-final"},

            # 2014 World Cup - Key matches
            {"date": "2014-07-13", "home": "Germany", "away": "Argentina", "home_score": 1, "away_score": 0, "tournament": "World Cup 2014", "stage": "Final"},
            {"date": "2014-07-09", "home": "Germany", "away": "Brazil", "home_score": 7, "away_score": 1, "tournament": "World Cup 2014", "stage": "Semi-final"},
            {"date": "2014-07-09", "home": "Argentina", "away": "Netherlands", "home_score": 0, "away_score": 0, "tournament": "World Cup 2014", "stage": "Semi-final"},

            # 2010 World Cup - Key matches
            {"date": "2010-07-11", "home": "Spain", "away": "Netherlands", "home_score": 1, "away_score": 0, "tournament": "World Cup 2010", "stage": "Final"},
            {"date": "2010-07-07", "home": "Germany", "away": "Spain", "home_score": 0, "away_score": 1, "tournament": "World Cup 2010", "stage": "Semi-final"},
            {"date": "2010-07-07", "home": "Netherlands", "away": "Uruguay", "home_score": 3, "away_score": 2, "tournament": "World Cup 2010", "stage": "Semi-final"},

            # 2006 World Cup - Key matches
            {"date": "2006-07-09", "home": "Italy", "away": "France", "home_score": 1, "away_score": 1, "tournament": "World Cup 2006", "stage": "Final"},
            {"date": "2006-07-05", "home": "Germany", "away": "Italy", "home_score": 0, "away_score": 2, "tournament": "World Cup 2006", "stage": "Semi-final"},
            {"date": "2006-07-05", "home": "France", "away": "Portugal", "home_score": 1, "away_score": 0, "tournament": "World Cup 2006", "stage": "Semi-final"},
        ]

        # Add group stage matches for training data diversity
        group_matches = self._generate_group_stage_history()
        historical_matches.extend(group_matches)

        return historical_matches

    def _generate_group_stage_history(self) -> List[Dict]:
        """Generate comprehensive group stage historical data."""
        # Sample group stage matches from recent World Cups
        group_matches = [
            # 2022 Group Stage samples
            {"date": "2022-11-22", "home": "Argentina", "away": "Saudi Arabia", "home_score": 1, "away_score": 2, "tournament": "World Cup 2022", "stage": "Group C"},
            {"date": "2022-11-22", "home": "France", "away": "Australia", "home_score": 4, "away_score": 1, "tournament": "World Cup 2022", "stage": "Group D"},
            {"date": "2022-11-23", "home": "Germany", "away": "Japan", "home_score": 1, "away_score": 2, "tournament": "World Cup 2022", "stage": "Group E"},
            {"date": "2022-11-23", "home": "Spain", "away": "Costa Rica", "home_score": 7, "away_score": 0, "tournament": "World Cup 2022", "stage": "Group E"},
            {"date": "2022-11-24", "home": "Brazil", "away": "Serbia", "home_score": 2, "away_score": 0, "tournament": "World Cup 2022", "stage": "Group G"},
            {"date": "2022-11-24", "home": "Portugal", "away": "Ghana", "home_score": 3, "away_score": 2, "tournament": "World Cup 2022", "stage": "Group H"},
            {"date": "2022-11-25", "home": "England", "away": "Iran", "home_score": 6, "away_score": 2, "tournament": "World Cup 2022", "stage": "Group B"},
            {"date": "2022-11-25", "home": "Netherlands", "away": "Senegal", "home_score": 2, "away_score": 0, "tournament": "World Cup 2022", "stage": "Group A"},
            {"date": "2022-11-26", "home": "Argentina", "away": "Mexico", "home_score": 2, "away_score": 0, "tournament": "World Cup 2022", "stage": "Group C"},
            {"date": "2022-11-26", "home": "France", "away": "Denmark", "home_score": 2, "away_score": 1, "tournament": "World Cup 2022", "stage": "Group D"},

            # 2018 Group Stage samples
            {"date": "2018-06-14", "home": "Russia", "away": "Saudi Arabia", "home_score": 5, "away_score": 0, "tournament": "World Cup 2018", "stage": "Group A"},
            {"date": "2018-06-15", "home": "Spain", "away": "Portugal", "home_score": 3, "away_score": 3, "tournament": "World Cup 2018", "stage": "Group B"},
            {"date": "2018-06-16", "home": "Argentina", "away": "Iceland", "home_score": 1, "away_score": 1, "tournament": "World Cup 2018", "stage": "Group D"},
            {"date": "2018-06-17", "home": "Germany", "away": "Mexico", "home_score": 0, "away_score": 1, "tournament": "World Cup 2018", "stage": "Group F"},
            {"date": "2018-06-17", "home": "Brazil", "away": "Switzerland", "home_score": 1, "away_score": 1, "tournament": "World Cup 2018", "stage": "Group E"},
            {"date": "2018-06-18", "home": "Belgium", "away": "Panama", "home_score": 3, "away_score": 0, "tournament": "World Cup 2018", "stage": "Group G"},
            {"date": "2018-06-18", "home": "England", "away": "Tunisia", "home_score": 2, "away_score": 1, "tournament": "World Cup 2018", "stage": "Group G"},
            {"date": "2018-06-19", "home": "Colombia", "away": "Japan", "home_score": 1, "away_score": 2, "tournament": "World Cup 2018", "stage": "Group H"},

            # 2014 Group Stage samples
            {"date": "2014-06-12", "home": "Brazil", "away": "Croatia", "home_score": 3, "away_score": 1, "tournament": "World Cup 2014", "stage": "Group A"},
            {"date": "2014-06-13", "home": "Spain", "away": "Netherlands", "home_score": 1, "away_score": 5, "tournament": "World Cup 2014", "stage": "Group B"},
            {"date": "2014-06-14", "home": "Germany", "away": "Portugal", "home_score": 4, "away_score": 0, "tournament": "World Cup 2014", "stage": "Group G"},
            {"date": "2014-06-15", "home": "Argentina", "away": "Bosnia", "home_score": 2, "away_score": 1, "tournament": "World Cup 2014", "stage": "Group F"},
        ]

        return group_matches

    def get_international_friendlies(self) -> List[Dict]:
        """Get recent international friendly matches (legacy — kept for init)."""
        return self.get_recent_international_matches()

    def get_recent_international_matches(self) -> List[Dict]:
        """Get comprehensive 2024-2025 international match results (friendlies + major tournaments)."""
        matches = [
            # ── March 2024 international window ──────────────────────────────────
            {"date": "2024-03-22", "home": "France", "away": "Germany", "home_score": 2, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-03-22", "home": "Argentina", "away": "El Salvador", "home_score": 3, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-03-23", "home": "England", "away": "Brazil", "home_score": 0, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-03-23", "home": "Belgium", "away": "England", "home_score": 2, "away_score": 2, "tournament": "Friendly"},
            {"date": "2024-03-23", "home": "Portugal", "away": "Sweden", "home_score": 5, "away_score": 2, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Spain", "away": "Brazil", "home_score": 3, "away_score": 3, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Netherlands", "away": "Germany", "home_score": 2, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Argentina", "away": "Costa Rica", "home_score": 3, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Italy", "away": "Ecuador", "home_score": 2, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Croatia", "away": "Portugal", "home_score": 0, "away_score": 2, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Colombia", "away": "Spain", "home_score": 1, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Morocco", "away": "Angola", "home_score": 3, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "Japan", "away": "South Korea", "home_score": 0, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-03-26", "home": "USA", "away": "Mexico", "home_score": 2, "away_score": 0, "tournament": "Friendly"},
            # ── June 2024 warm-ups (pre-Euro / pre-Copa America) ─────────────────
            {"date": "2024-06-03", "home": "England", "away": "Bosnia", "home_score": 3, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-04", "home": "Germany", "away": "Ukraine", "home_score": 0, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-04", "home": "Italy", "away": "Turkey", "home_score": 0, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-05", "home": "France", "away": "Luxembourg", "home_score": 3, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-05", "home": "Spain", "away": "Andorra", "home_score": 5, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-05", "home": "Portugal", "away": "Finland", "home_score": 4, "away_score": 2, "tournament": "Friendly"},
            {"date": "2024-06-05", "home": "Argentina", "away": "Ecuador", "home_score": 1, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-07", "home": "Germany", "away": "Greece", "home_score": 2, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-06-07", "home": "England", "away": "Iceland", "home_score": 1, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-08", "home": "Belgium", "away": "Montenegro", "home_score": 5, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-06-09", "home": "France", "away": "Canada", "home_score": 0, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-09", "home": "Netherlands", "away": "Iceland", "home_score": 4, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-09", "home": "Italy", "away": "Bosnia", "home_score": 1, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-06-09", "home": "Colombia", "away": "USA", "home_score": 5, "away_score": 1, "tournament": "Friendly"},
            # ── UEFA Euro 2024 (June–July 2024) ──────────────────────────────────
            {"date": "2024-06-14", "home": "Germany", "away": "Scotland", "home_score": 5, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-15", "home": "Spain", "away": "Croatia", "home_score": 3, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-15", "home": "Italy", "away": "Albania", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-16", "home": "Netherlands", "away": "Poland", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-16", "home": "England", "away": "Serbia", "home_score": 1, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-17", "home": "France", "away": "Austria", "home_score": 1, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-17", "home": "Belgium", "away": "Slovakia", "home_score": 0, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-18", "home": "Portugal", "away": "Czech Republic", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-19", "home": "Germany", "away": "Hungary", "home_score": 2, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-20", "home": "Spain", "away": "Italy", "home_score": 1, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-20", "home": "England", "away": "Denmark", "home_score": 1, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-21", "home": "France", "away": "Netherlands", "home_score": 0, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-22", "home": "Belgium", "away": "Romania", "home_score": 2, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-24", "home": "Spain", "away": "Albania", "home_score": 1, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-25", "home": "France", "away": "Poland", "home_score": 1, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-25", "home": "England", "away": "Slovenia", "home_score": 0, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-26", "home": "Netherlands", "away": "Austria", "home_score": 2, "away_score": 3, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-26", "home": "Portugal", "away": "Georgia", "home_score": 2, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-26", "home": "Belgium", "away": "Ukraine", "home_score": 0, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-29", "home": "Germany", "away": "Denmark", "home_score": 2, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-30", "home": "Spain", "away": "Georgia", "home_score": 4, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-06-30", "home": "England", "away": "Slovakia", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-01", "home": "France", "away": "Belgium", "home_score": 1, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-02", "home": "Netherlands", "away": "Romania", "home_score": 3, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-01", "home": "Portugal", "away": "Slovenia", "home_score": 0, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-05", "home": "Spain", "away": "Germany", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-05", "home": "France", "away": "Portugal", "home_score": 0, "away_score": 0, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-06", "home": "Netherlands", "away": "Turkey", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-06", "home": "England", "away": "Switzerland", "home_score": 1, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-09", "home": "Spain", "away": "France", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-10", "home": "England", "away": "Netherlands", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            {"date": "2024-07-14", "home": "Spain", "away": "England", "home_score": 2, "away_score": 1, "tournament": "UEFA Euro 2024"},
            # ── Copa America 2024 (June–July 2024) ───────────────────────────────
            {"date": "2024-06-20", "home": "Argentina", "away": "Canada", "home_score": 2, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-06-22", "home": "USA", "away": "Bolivia", "home_score": 2, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-06-22", "home": "Mexico", "away": "Jamaica", "home_score": 0, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-06-24", "home": "Colombia", "away": "Paraguay", "home_score": 2, "away_score": 1, "tournament": "Copa America 2024"},
            {"date": "2024-06-25", "home": "Argentina", "away": "Chile", "home_score": 1, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-06-26", "home": "Uruguay", "away": "Bolivia", "home_score": 5, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-06-28", "home": "Brazil", "away": "Paraguay", "home_score": 4, "away_score": 1, "tournament": "Copa America 2024"},
            {"date": "2024-07-02", "home": "Brazil", "away": "Colombia", "home_score": 1, "away_score": 1, "tournament": "Copa America 2024"},
            {"date": "2024-07-04", "home": "Argentina", "away": "Ecuador", "home_score": 1, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-07-04", "home": "Venezuela", "away": "Canada", "home_score": 1, "away_score": 2, "tournament": "Copa America 2024"},
            {"date": "2024-07-05", "home": "USA", "away": "Uruguay", "home_score": 0, "away_score": 1, "tournament": "Copa America 2024"},
            {"date": "2024-07-06", "home": "Colombia", "away": "Panama", "home_score": 5, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-07-09", "home": "Argentina", "away": "Canada", "home_score": 2, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-07-10", "home": "Colombia", "away": "Uruguay", "home_score": 1, "away_score": 0, "tournament": "Copa America 2024"},
            {"date": "2024-07-14", "home": "Argentina", "away": "Colombia", "home_score": 1, "away_score": 0, "tournament": "Copa America 2024"},
            # ── UEFA Nations League 2024/25 — Septembre 2024 ─────────────────────
            {"date": "2024-09-05", "home": "Netherlands", "away": "Bosnia", "home_score": 5, "away_score": 2, "tournament": "UEFA Nations League"},
            {"date": "2024-09-07", "home": "England", "away": "Finland", "home_score": 2, "away_score": 0, "tournament": "UEFA Nations League"},
            {"date": "2024-09-07", "home": "Portugal", "away": "Croatia", "home_score": 2, "away_score": 1, "tournament": "UEFA Nations League"},
            {"date": "2024-09-07", "home": "Italy", "away": "France", "home_score": 1, "away_score": 3, "tournament": "UEFA Nations League"},
            {"date": "2024-09-08", "home": "Spain", "away": "Serbia", "home_score": 3, "away_score": 0, "tournament": "UEFA Nations League"},
            {"date": "2024-09-09", "home": "Germany", "away": "Hungary", "home_score": 5, "away_score": 0, "tournament": "UEFA Nations League"},
            {"date": "2024-09-09", "home": "Belgium", "away": "France", "home_score": 0, "away_score": 2, "tournament": "UEFA Nations League"},
            {"date": "2024-09-10", "home": "Croatia", "away": "Portugal", "home_score": 1, "away_score": 1, "tournament": "UEFA Nations League"},
            {"date": "2024-09-10", "home": "Switzerland", "away": "Denmark", "home_score": 2, "away_score": 2, "tournament": "UEFA Nations League"},
            # ── UEFA Nations League — Octobre 2024 ───────────────────────────────
            {"date": "2024-10-10", "home": "England", "away": "Greece", "home_score": 1, "away_score": 2, "tournament": "UEFA Nations League"},
            {"date": "2024-10-10", "home": "Italy", "away": "Belgium", "home_score": 2, "away_score": 2, "tournament": "UEFA Nations League"},
            {"date": "2024-10-13", "home": "France", "away": "Belgium", "home_score": 2, "away_score": 1, "tournament": "UEFA Nations League"},
            {"date": "2024-10-14", "home": "Germany", "away": "Netherlands", "home_score": 1, "away_score": 0, "tournament": "UEFA Nations League"},
            {"date": "2024-10-15", "home": "Spain", "away": "Serbia", "home_score": 3, "away_score": 0, "tournament": "UEFA Nations League"},
            {"date": "2024-10-15", "home": "Portugal", "away": "Poland", "home_score": 3, "away_score": 2, "tournament": "UEFA Nations League"},
            {"date": "2024-10-15", "home": "Switzerland", "away": "Spain", "home_score": 1, "away_score": 4, "tournament": "UEFA Nations League"},
            # ── UEFA Nations League — Novembre 2024 ──────────────────────────────
            {"date": "2024-11-14", "home": "Netherlands", "away": "Germany", "home_score": 4, "away_score": 0, "tournament": "UEFA Nations League"},
            {"date": "2024-11-14", "home": "Greece", "away": "England", "home_score": 2, "away_score": 3, "tournament": "UEFA Nations League"},
            {"date": "2024-11-15", "home": "France", "away": "Israel", "home_score": 4, "away_score": 1, "tournament": "UEFA Nations League"},
            {"date": "2024-11-15", "home": "Spain", "away": "Denmark", "home_score": 5, "away_score": 2, "tournament": "UEFA Nations League"},
            {"date": "2024-11-17", "home": "Italy", "away": "France", "home_score": 1, "away_score": 3, "tournament": "UEFA Nations League"},
            {"date": "2024-11-17", "home": "Germany", "away": "Bosnia", "home_score": 7, "away_score": 0, "tournament": "UEFA Nations League"},
            {"date": "2024-11-18", "home": "Portugal", "away": "Croatia", "home_score": 1, "away_score": 1, "tournament": "UEFA Nations League"},
            {"date": "2024-11-18", "home": "Switzerland", "away": "Serbia", "home_score": 4, "away_score": 0, "tournament": "UEFA Nations League"},
            # ── CONCACAF Nations League 2024/25 ──────────────────────────────────
            {"date": "2024-09-07", "home": "USA", "away": "Canada", "home_score": 2, "away_score": 1, "tournament": "CONCACAF Nations League"},
            {"date": "2024-09-10", "home": "Mexico", "away": "Panama", "home_score": 2, "away_score": 0, "tournament": "CONCACAF Nations League"},
            {"date": "2024-10-15", "home": "USA", "away": "Jamaica", "home_score": 3, "away_score": 1, "tournament": "CONCACAF Nations League"},
            {"date": "2024-11-14", "home": "Mexico", "away": "Costa Rica", "home_score": 2, "away_score": 0, "tournament": "CONCACAF Nations League"},
            {"date": "2024-11-17", "home": "Canada", "away": "Jamaica", "home_score": 4, "away_score": 0, "tournament": "CONCACAF Nations League"},
            # ── Matchs amicaux — Novembre 2024 ───────────────────────────────────
            {"date": "2024-11-14", "home": "Argentina", "away": "Paraguay", "home_score": 2, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-11-14", "home": "Brazil", "away": "Uruguay", "home_score": 1, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-11-18", "home": "Argentina", "away": "Peru", "home_score": 1, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-11-19", "home": "Brazil", "away": "Colombia", "home_score": 2, "away_score": 1, "tournament": "Friendly"},
            {"date": "2024-11-18", "home": "Morocco", "away": "Gabon", "home_score": 3, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-11-19", "home": "Japan", "away": "China", "home_score": 7, "away_score": 0, "tournament": "Friendly"},
            {"date": "2024-11-19", "home": "South Korea", "away": "Palestine", "home_score": 4, "away_score": 1, "tournament": "Friendly"},
            # ── Matchs amicaux — Mars 2025 ────────────────────────────────────────
            {"date": "2025-03-20", "home": "France", "away": "Croatia", "home_score": 0, "away_score": 0, "tournament": "Friendly"},
            {"date": "2025-03-20", "home": "Germany", "away": "Italy", "home_score": 1, "away_score": 1, "tournament": "Friendly"},
            {"date": "2025-03-20", "home": "Spain", "away": "Netherlands", "home_score": 3, "away_score": 2, "tournament": "Friendly"},
            {"date": "2025-03-21", "home": "England", "away": "Albania", "home_score": 5, "away_score": 0, "tournament": "Friendly"},
            {"date": "2025-03-22", "home": "Argentina", "away": "Uruguay", "home_score": 0, "away_score": 1, "tournament": "Friendly"},
            {"date": "2025-03-22", "home": "Brazil", "away": "Mexico", "home_score": 3, "away_score": 0, "tournament": "Friendly"},
            {"date": "2025-03-22", "home": "Portugal", "away": "Denmark", "home_score": 2, "away_score": 0, "tournament": "Friendly"},
            {"date": "2025-03-22", "home": "Colombia", "away": "Ecuador", "home_score": 2, "away_score": 0, "tournament": "Friendly"},
            {"date": "2025-03-22", "home": "USA", "away": "Venezuela", "home_score": 1, "away_score": 1, "tournament": "Friendly"},
            {"date": "2025-03-23", "home": "Japan", "away": "Australia", "home_score": 2, "away_score": 1, "tournament": "Friendly"},
            {"date": "2025-03-23", "home": "Morocco", "away": "Ivory Coast", "home_score": 2, "away_score": 0, "tournament": "Friendly"},
            {"date": "2025-03-23", "home": "Senegal", "away": "Nigeria", "home_score": 1, "away_score": 1, "tournament": "Friendly"},
        ]
        return matches

    def get_qualifications_data(self) -> Dict[str, Dict]:
        """Get World Cup 2026 qualification standings by confederation."""
        qualifications = {
            # CONMEBOL (6.5 spots)
            "CONMEBOL": {
                "Argentina": {"points": 22, "played": 10, "gd": 15, "qualified": True},
                "Colombia": {"points": 19, "played": 10, "gd": 8, "qualified": False},
                "Uruguay": {"points": 18, "played": 10, "gd": 10, "qualified": False},
                "Brazil": {"points": 17, "played": 10, "gd": 7, "qualified": False},
                "Ecuador": {"points": 16, "played": 10, "gd": 5, "qualified": False},
                "Paraguay": {"points": 12, "played": 10, "gd": -2, "qualified": False},
                "Venezuela": {"points": 11, "played": 10, "gd": -1, "qualified": False},
                "Bolivia": {"points": 10, "played": 10, "gd": -8, "qualified": False},
                "Chile": {"points": 8, "played": 10, "gd": -6, "qualified": False},
                "Peru": {"points": 6, "played": 10, "gd": -10, "qualified": False},
            },
            # UEFA (16 spots)
            "UEFA": {
                "Spain": {"points": 18, "played": 6, "gd": 12, "qualified": False},
                "France": {"points": 16, "played": 6, "gd": 10, "qualified": False},
                "Germany": {"points": 15, "played": 6, "gd": 8, "qualified": False},
                "England": {"points": 15, "played": 6, "gd": 11, "qualified": False},
                "Portugal": {"points": 14, "played": 6, "gd": 9, "qualified": False},
                "Netherlands": {"points": 14, "played": 6, "gd": 7, "qualified": False},
                "Belgium": {"points": 13, "played": 6, "gd": 6, "qualified": False},
                "Italy": {"points": 13, "played": 6, "gd": 5, "qualified": False},
                "Croatia": {"points": 12, "played": 6, "gd": 4, "qualified": False},
                "Switzerland": {"points": 11, "played": 6, "gd": 3, "qualified": False},
            },
            # CONCACAF (6.5 spots) - Includes host nations USA, Mexico, Canada
            "CONCACAF": {
                "USA": {"points": 0, "played": 0, "gd": 0, "qualified": True},  # Host
                "Mexico": {"points": 0, "played": 0, "gd": 0, "qualified": True},  # Host
                "Canada": {"points": 0, "played": 0, "gd": 0, "qualified": True},  # Host
                "Costa Rica": {"points": 10, "played": 6, "gd": 2, "qualified": False},
                "Panama": {"points": 9, "played": 6, "gd": 1, "qualified": False},
                "Jamaica": {"points": 7, "played": 6, "gd": -2, "qualified": False},
            },
            # AFC (8.5 spots)
            "AFC": {
                "Japan": {"points": 16, "played": 6, "gd": 10, "qualified": False},
                "Iran": {"points": 14, "played": 6, "gd": 8, "qualified": False},
                "South Korea": {"points": 13, "played": 6, "gd": 6, "qualified": False},
                "Australia": {"points": 12, "played": 6, "gd": 4, "qualified": False},
                "Saudi Arabia": {"points": 10, "played": 6, "gd": 2, "qualified": False},
                "Qatar": {"points": 8, "played": 6, "gd": 0, "qualified": False},
            },
            # CAF (9.5 spots)
            "CAF": {
                "Morocco": {"points": 14, "played": 6, "gd": 8, "qualified": False},
                "Senegal": {"points": 13, "played": 6, "gd": 6, "qualified": False},
                "Nigeria": {"points": 12, "played": 6, "gd": 5, "qualified": False},
                "Cameroon": {"points": 11, "played": 6, "gd": 3, "qualified": False},
                "Egypt": {"points": 10, "played": 6, "gd": 2, "qualified": False},
                "Algeria": {"points": 9, "played": 6, "gd": 1, "qualified": False},
            },
        }
        return qualifications

    def load_kaggle_dataset(self, filepath: str) -> pd.DataFrame:
        """Load Kaggle dataset if available."""
        if os.path.exists(filepath):
            try:
                return pd.read_csv(filepath)
            except Exception as e:
                logger.error(f"Failed to load Kaggle dataset: {e}")
        return pd.DataFrame()

    def get_all_historical_data(self) -> List[Dict]:
        """Combine all historical data sources."""
        all_data = []
        all_data.extend(self.get_world_cup_history())
        all_data.extend(self.get_international_friendlies())
        return all_data
