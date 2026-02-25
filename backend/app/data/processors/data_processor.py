"""Data processor for combining and transforming data from multiple sources."""

import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
import logging

from app.data.storage import Team, Match, HistoricalMatch, FIFARanking
from app.data.collectors import (
    FIFARankingsCollector,
    HistoricalDataCollector,
)

logger = logging.getLogger(__name__)


class DataProcessor:
    """Process and combine data from multiple sources."""

    def __init__(self, db: Session):
        self.db = db
        self.fifa_collector = FIFARankingsCollector()
        self.historical_collector = HistoricalDataCollector()

    async def initialize_database(self):
        """Initialize database with all required data."""
        logger.info("Initializing database...")

        # Load FIFA rankings
        await self._load_fifa_rankings()

        # Load historical matches
        self._load_historical_matches()

        # Initialize World Cup 2026 teams
        self._initialize_wc2026_teams()

        # Initialize World Cup 2026 groups and matches
        self._initialize_wc2026_matches()

        logger.info("Database initialization complete")

    async def _load_fifa_rankings(self):
        """Load FIFA rankings into database."""
        rankings = await self.fifa_collector.get_current_rankings()

        for ranking_data in rankings:
            ranking = FIFARanking(
                team_name=ranking_data["team"],
                ranking=ranking_data["rank"],
                points=ranking_data["points"],
                date=datetime.utcnow(),
            )
            self.db.merge(ranking)

        self.db.commit()
        logger.info(f"Loaded {len(rankings)} FIFA rankings")

    def _load_historical_matches(self):
        """Load historical match data."""
        matches = self.historical_collector.get_all_historical_data()

        for match_data in matches:
            match = HistoricalMatch(
                date=datetime.strptime(match_data["date"], "%Y-%m-%d"),
                home_team=match_data["home"],
                away_team=match_data["away"],
                home_score=match_data["home_score"],
                away_score=match_data["away_score"],
                tournament=match_data["tournament"],
                neutral=match_data.get("neutral", True),
            )
            self.db.add(match)

        self.db.commit()
        logger.info(f"Loaded {len(matches)} historical matches")

    def _initialize_wc2026_teams(self):
        """Initialize World Cup 2026 qualified teams."""
        # 48-team World Cup 2026
        # This is a projected list based on current qualifications
        wc2026_teams = [
            # Host nations (automatically qualified)
            {"name": "USA", "code": "USA", "confederation": "CONCACAF", "group": "A"},
            {"name": "Mexico", "code": "MEX", "confederation": "CONCACAF", "group": "B"},
            {"name": "Canada", "code": "CAN", "confederation": "CONCACAF", "group": "C"},

            # CONMEBOL (projected)
            {"name": "Argentina", "code": "ARG", "confederation": "CONMEBOL", "group": "D"},
            {"name": "Brazil", "code": "BRA", "confederation": "CONMEBOL", "group": "E"},
            {"name": "Colombia", "code": "COL", "confederation": "CONMEBOL", "group": "F"},
            {"name": "Uruguay", "code": "URU", "confederation": "CONMEBOL", "group": "G"},
            {"name": "Ecuador", "code": "ECU", "confederation": "CONMEBOL", "group": "H"},
            {"name": "Paraguay", "code": "PAR", "confederation": "CONMEBOL", "group": "I"},

            # UEFA (projected)
            {"name": "France", "code": "FRA", "confederation": "UEFA", "group": "A"},
            {"name": "Spain", "code": "ESP", "confederation": "UEFA", "group": "B"},
            {"name": "England", "code": "ENG", "confederation": "UEFA", "group": "C"},
            {"name": "Germany", "code": "GER", "confederation": "UEFA", "group": "D"},
            {"name": "Portugal", "code": "POR", "confederation": "UEFA", "group": "E"},
            {"name": "Netherlands", "code": "NED", "confederation": "UEFA", "group": "F"},
            {"name": "Belgium", "code": "BEL", "confederation": "UEFA", "group": "G"},
            {"name": "Italy", "code": "ITA", "confederation": "UEFA", "group": "H"},
            {"name": "Croatia", "code": "CRO", "confederation": "UEFA", "group": "I"},
            {"name": "Switzerland", "code": "SUI", "confederation": "UEFA", "group": "J"},
            {"name": "Denmark", "code": "DEN", "confederation": "UEFA", "group": "K"},
            {"name": "Austria", "code": "AUT", "confederation": "UEFA", "group": "L"},
            {"name": "Poland", "code": "POL", "confederation": "UEFA", "group": "A"},
            {"name": "Serbia", "code": "SRB", "confederation": "UEFA", "group": "B"},
            {"name": "Ukraine", "code": "UKR", "confederation": "UEFA", "group": "C"},
            {"name": "Turkey", "code": "TUR", "confederation": "UEFA", "group": "D"},

            # AFC (projected)
            {"name": "Japan", "code": "JPN", "confederation": "AFC", "group": "E"},
            {"name": "South Korea", "code": "KOR", "confederation": "AFC", "group": "F"},
            {"name": "Australia", "code": "AUS", "confederation": "AFC", "group": "G"},
            {"name": "Iran", "code": "IRN", "confederation": "AFC", "group": "H"},
            {"name": "Saudi Arabia", "code": "KSA", "confederation": "AFC", "group": "I"},
            {"name": "Qatar", "code": "QAT", "confederation": "AFC", "group": "J"},
            {"name": "Iraq", "code": "IRQ", "confederation": "AFC", "group": "K"},
            {"name": "UAE", "code": "UAE", "confederation": "AFC", "group": "L"},

            # CAF (projected)
            {"name": "Morocco", "code": "MAR", "confederation": "CAF", "group": "A"},
            {"name": "Senegal", "code": "SEN", "confederation": "CAF", "group": "B"},
            {"name": "Nigeria", "code": "NGA", "confederation": "CAF", "group": "C"},
            {"name": "Cameroon", "code": "CMR", "confederation": "CAF", "group": "D"},
            {"name": "Egypt", "code": "EGY", "confederation": "CAF", "group": "E"},
            {"name": "Algeria", "code": "ALG", "confederation": "CAF", "group": "F"},
            {"name": "Tunisia", "code": "TUN", "confederation": "CAF", "group": "G"},
            {"name": "Ivory Coast", "code": "CIV", "confederation": "CAF", "group": "H"},
            {"name": "Ghana", "code": "GHA", "confederation": "CAF", "group": "I"},

            # CONCACAF additional
            {"name": "Costa Rica", "code": "CRC", "confederation": "CONCACAF", "group": "J"},
            {"name": "Panama", "code": "PAN", "confederation": "CONCACAF", "group": "K"},
            {"name": "Jamaica", "code": "JAM", "confederation": "CONCACAF", "group": "L"},

            # OFC
            {"name": "New Zealand", "code": "NZL", "confederation": "OFC", "group": "L"},
        ]

        # Get qualification data
        quali_data = self.historical_collector.get_qualifications_data()

        for team_data in wc2026_teams:
            # Find qualification stats
            quali_stats = {}
            for conf, teams in quali_data.items():
                if team_data["name"] in teams:
                    quali_stats = teams[team_data["name"]]
                    break

            # Get FIFA ranking
            ranking_record = self.db.query(FIFARanking).filter(
                FIFARanking.team_name == team_data["name"]
            ).first()

            fifa_ranking = ranking_record.ranking if ranking_record else 50
            fifa_points = ranking_record.points if ranking_record else 1400
            elo = self.fifa_collector.calculate_elo_rating(fifa_ranking, fifa_points)

            team = Team(
                name=team_data["name"],
                code=team_data["code"],
                confederation=team_data["confederation"],
                fifa_ranking=fifa_ranking,
                elo_rating=elo,
                qualified=True,
                group_letter=team_data["group"],
                quali_points=quali_stats.get("points", 0),
                quali_goal_diff=quali_stats.get("gd", 0),
                quali_played=quali_stats.get("played", 0),
            )
            self.db.merge(team)

        self.db.commit()
        logger.info(f"Initialized {len(wc2026_teams)} World Cup 2026 teams")

    def _initialize_wc2026_matches(self):
        """Initialize World Cup 2026 match schedule."""
        # World Cup 2026 will have 12 groups of 4 teams
        # Generate group stage matches
        groups = {}
        teams = self.db.query(Team).filter(Team.qualified == True).all()

        for team in teams:
            if team.group_letter not in groups:
                groups[team.group_letter] = []
            groups[team.group_letter].append(team)

        match_id = 1
        base_date = datetime(2026, 6, 11)  # World Cup starts June 11, 2026

        for group_letter, group_teams in groups.items():
            # Each team plays against every other team in the group
            for i in range(len(group_teams)):
                for j in range(i + 1, len(group_teams)):
                    match = Match(
                        home_team_id=group_teams[i].id,
                        away_team_id=group_teams[j].id,
                        date=base_date,
                        stage=f"Group {group_letter}",
                        venue="TBD",
                        city="TBD",
                        played=False,
                    )
                    self.db.add(match)
                    match_id += 1

        self.db.commit()
        logger.info("Initialized World Cup 2026 match schedule")

    def get_team_stats(self, team_name: str) -> Dict:
        """Get comprehensive stats for a team."""
        team = self.db.query(Team).filter(Team.name == team_name).first()
        if not team:
            return {}

        # Get historical match data
        home_matches = self.db.query(HistoricalMatch).filter(
            HistoricalMatch.home_team == team_name
        ).all()

        away_matches = self.db.query(HistoricalMatch).filter(
            HistoricalMatch.away_team == team_name
        ).all()

        # Calculate statistics
        total_matches = len(home_matches) + len(away_matches)
        wins = sum(1 for m in home_matches if m.home_score > m.away_score)
        wins += sum(1 for m in away_matches if m.away_score > m.home_score)
        draws = sum(1 for m in home_matches if m.home_score == m.away_score)
        draws += sum(1 for m in away_matches if m.home_score == m.away_score)
        losses = total_matches - wins - draws

        goals_scored = sum(m.home_score for m in home_matches)
        goals_scored += sum(m.away_score for m in away_matches)
        goals_conceded = sum(m.away_score for m in home_matches)
        goals_conceded += sum(m.home_score for m in away_matches)

        return {
            "name": team.name,
            "code": team.code,
            "confederation": team.confederation,
            "fifa_ranking": team.fifa_ranking,
            "elo_rating": team.elo_rating,
            "group": team.group_letter,
            "stats": {
                "matches": total_matches,
                "wins": wins,
                "draws": draws,
                "losses": losses,
                "goals_scored": goals_scored,
                "goals_conceded": goals_conceded,
                "goal_difference": goals_scored - goals_conceded,
            },
            "qualification": {
                "points": team.quali_points,
                "goal_diff": team.quali_goal_diff,
                "played": team.quali_played,
            },
        }

    def get_head_to_head(self, team1_name: str, team2_name: str) -> Dict:
        """Get head-to-head statistics between two teams."""
        matches = self.db.query(HistoricalMatch).filter(
            ((HistoricalMatch.home_team == team1_name) & (HistoricalMatch.away_team == team2_name)) |
            ((HistoricalMatch.home_team == team2_name) & (HistoricalMatch.away_team == team1_name))
        ).all()

        team1_wins = 0
        team2_wins = 0
        draws = 0
        team1_goals = 0
        team2_goals = 0

        for match in matches:
            if match.home_team == team1_name:
                team1_goals += match.home_score
                team2_goals += match.away_score
                if match.home_score > match.away_score:
                    team1_wins += 1
                elif match.home_score < match.away_score:
                    team2_wins += 1
                else:
                    draws += 1
            else:
                team1_goals += match.away_score
                team2_goals += match.home_score
                if match.away_score > match.home_score:
                    team1_wins += 1
                elif match.away_score < match.home_score:
                    team2_wins += 1
                else:
                    draws += 1

        return {
            "team1": team1_name,
            "team2": team2_name,
            "total_matches": len(matches),
            "team1_wins": team1_wins,
            "team2_wins": team2_wins,
            "draws": draws,
            "team1_goals": team1_goals,
            "team2_goals": team2_goals,
        }
