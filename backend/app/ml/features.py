"""Feature engineering for World Cup predictions."""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from app.data.storage import Team, HistoricalMatch, FIFARanking


class FeatureEngineer:
    """Feature engineering for match predictions."""

    CONFEDERATIONS = ["UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF", "OFC"]

    def __init__(self, db: Session):
        self.db = db
        self._rankings_cache = {}
        self._load_rankings()

    def _load_rankings(self):
        """Load FIFA rankings into cache."""
        rankings = self.db.query(FIFARanking).all()
        for r in rankings:
            self._rankings_cache[r.team_name] = {
                "ranking": r.ranking,
                "points": r.points,
            }

    def get_ranking(self, team_name: str) -> int:
        """Get FIFA ranking for a team."""
        if team_name in self._rankings_cache:
            return self._rankings_cache[team_name]["ranking"]
        return 100  # Default for unknown teams

    def get_elo(self, team_name: str) -> float:
        """Calculate ELO rating from ranking."""
        ranking = self.get_ranking(team_name)
        # Approximate ELO from ranking
        return max(1000, 2100 - (ranking * 12))

    def calculate_form(self, team_name: str, num_matches: int = 5) -> Tuple[int, float, float]:
        """
        Calculate recent form for a team.

        Returns:
            Tuple of (form_points, avg_goals_scored, avg_goals_conceded)
        """
        matches = self.db.query(HistoricalMatch).filter(
            (HistoricalMatch.home_team == team_name) |
            (HistoricalMatch.away_team == team_name)
        ).order_by(HistoricalMatch.date.desc()).limit(num_matches).all()

        if not matches:
            return 0, 0.0, 0.0

        points = 0
        goals_scored = 0
        goals_conceded = 0

        for match in matches:
            if match.home_team == team_name:
                goals_scored += match.home_score
                goals_conceded += match.away_score
                if match.home_score > match.away_score:
                    points += 3
                elif match.home_score == match.away_score:
                    points += 1
            else:
                goals_scored += match.away_score
                goals_conceded += match.home_score
                if match.away_score > match.home_score:
                    points += 3
                elif match.home_score == match.away_score:
                    points += 1

        n = len(matches)
        return points, goals_scored / n, goals_conceded / n

    def get_head_to_head_stats(self, team1: str, team2: str) -> Tuple[int, int, int]:
        """
        Get head-to-head statistics.

        Returns:
            Tuple of (team1_wins, team2_wins, draws)
        """
        matches = self.db.query(HistoricalMatch).filter(
            ((HistoricalMatch.home_team == team1) & (HistoricalMatch.away_team == team2)) |
            ((HistoricalMatch.home_team == team2) & (HistoricalMatch.away_team == team1))
        ).all()

        team1_wins = 0
        team2_wins = 0
        draws = 0

        for match in matches:
            if match.home_team == team1:
                if match.home_score > match.away_score:
                    team1_wins += 1
                elif match.home_score < match.away_score:
                    team2_wins += 1
                else:
                    draws += 1
            else:
                if match.away_score > match.home_score:
                    team1_wins += 1
                elif match.away_score < match.home_score:
                    team2_wins += 1
                else:
                    draws += 1

        return team1_wins, team2_wins, draws

    def get_confederation_code(self, confederation: str) -> int:
        """Encode confederation as integer."""
        if confederation in self.CONFEDERATIONS:
            return self.CONFEDERATIONS.index(confederation)
        return len(self.CONFEDERATIONS)

    def extract_match_features(
        self,
        home_team: str,
        away_team: str,
        is_knockout: bool = False
    ) -> Dict[str, float]:
        """
        Extract all features for a match prediction.

        Args:
            home_team: Home team name
            away_team: Away team name
            is_knockout: Whether it's a knockout stage match

        Returns:
            Dictionary of feature names to values
        """
        # Get team data
        home_team_db = self.db.query(Team).filter(Team.name == home_team).first()
        away_team_db = self.db.query(Team).filter(Team.name == away_team).first()

        # Rankings
        home_ranking = home_team_db.fifa_ranking if home_team_db else self.get_ranking(home_team)
        away_ranking = away_team_db.fifa_ranking if away_team_db else self.get_ranking(away_team)

        # ELO ratings
        home_elo = home_team_db.elo_rating if home_team_db else self.get_elo(home_team)
        away_elo = away_team_db.elo_rating if away_team_db else self.get_elo(away_team)

        # Form (last 5 matches)
        home_form, home_goals_scored, home_goals_conceded = self.calculate_form(home_team)
        away_form, away_goals_scored, away_goals_conceded = self.calculate_form(away_team)

        # Head-to-head
        h2h_home_wins, h2h_away_wins, h2h_draws = self.get_head_to_head_stats(home_team, away_team)

        # Confederations
        home_conf = home_team_db.confederation if home_team_db else "Unknown"
        away_conf = away_team_db.confederation if away_team_db else "Unknown"

        # Qualification stats
        home_quali_points = home_team_db.quali_points if home_team_db else 0
        away_quali_points = away_team_db.quali_points if away_team_db else 0
        home_quali_gd = home_team_db.quali_goal_diff if home_team_db else 0
        away_quali_gd = away_team_db.quali_goal_diff if away_team_db else 0

        return {
            # Rankings
            "fifa_ranking_home": home_ranking,
            "fifa_ranking_away": away_ranking,
            "ranking_diff": away_ranking - home_ranking,  # Positive = home team ranked better

            # ELO
            "elo_rating_home": home_elo,
            "elo_rating_away": away_elo,
            "elo_diff": home_elo - away_elo,

            # Form
            "form_home": home_form,
            "form_away": away_form,
            "form_diff": home_form - away_form,
            "goals_scored_avg_home": home_goals_scored,
            "goals_scored_avg_away": away_goals_scored,
            "goals_conceded_avg_home": home_goals_conceded,
            "goals_conceded_avg_away": away_goals_conceded,

            # Head-to-head
            "h2h_wins_home": h2h_home_wins,
            "h2h_wins_away": h2h_away_wins,
            "h2h_draws": h2h_draws,
            "h2h_total": h2h_home_wins + h2h_away_wins + h2h_draws,

            # Context
            "is_knockout": 1 if is_knockout else 0,
            "confederation_home": self.get_confederation_code(home_conf),
            "confederation_away": self.get_confederation_code(away_conf),
            "same_confederation": 1 if home_conf == away_conf else 0,

            # Qualification
            "quali_points_home": home_quali_points,
            "quali_points_away": away_quali_points,
            "quali_goal_diff_home": home_quali_gd,
            "quali_goal_diff_away": away_quali_gd,
        }

    def prepare_training_data(self) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Prepare training data from historical matches.

        Returns:
            Tuple of (features DataFrame, target Series)
        """
        matches = self.db.query(HistoricalMatch).all()

        features_list = []
        targets = []

        for match in matches:
            features = self.extract_match_features(
                match.home_team,
                match.away_team,
                is_knockout="Final" in (match.tournament or "") or
                           "Semi" in (match.tournament or "") or
                           "Quarter" in (match.tournament or "")
            )

            # Determine outcome (0 = home win, 1 = draw, 2 = away win)
            if match.home_score > match.away_score:
                target = 0
            elif match.home_score == match.away_score:
                target = 1
            else:
                target = 2

            features_list.append(features)
            targets.append(target)

        X = pd.DataFrame(features_list)
        y = pd.Series(targets)

        return X, y

    def get_feature_names(self) -> List[str]:
        """Get list of feature names in order."""
        return [
            "fifa_ranking_home", "fifa_ranking_away", "ranking_diff",
            "elo_rating_home", "elo_rating_away", "elo_diff",
            "form_home", "form_away", "form_diff",
            "goals_scored_avg_home", "goals_scored_avg_away",
            "goals_conceded_avg_home", "goals_conceded_avg_away",
            "h2h_wins_home", "h2h_wins_away", "h2h_draws", "h2h_total",
            "is_knockout",
            "confederation_home", "confederation_away", "same_confederation",
            "quali_points_home", "quali_points_away",
            "quali_goal_diff_home", "quali_goal_diff_away",
        ]
