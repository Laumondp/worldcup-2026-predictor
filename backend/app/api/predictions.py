"""Predictions API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import numpy as np

from app.data.storage import get_db, Match, Team
from app.ml.model import WorldCupPredictor
from app.ml.features import FeatureEngineer

router = APIRouter(prefix="/predictions", tags=["predictions"])

# Global model instance
predictor = WorldCupPredictor()
predictor.load()


class MatchPredictionRequest(BaseModel):
    """Request for match prediction."""
    home_team: str
    away_team: str
    is_knockout: bool = False


class MatchPredictionResponse(BaseModel):
    """Response with prediction results."""
    home_team: str
    away_team: str
    home_win_probability: float
    draw_probability: float
    away_win_probability: float
    predicted_outcome: str
    confidence: float
    predicted_home_score: float
    predicted_away_score: float


class TournamentSimulationResponse(BaseModel):
    """Response with tournament simulation."""
    winner: str
    runner_up: str
    semi_finalists: List[str]
    simulations_run: int
    win_probabilities: dict


@router.post("/match", response_model=MatchPredictionResponse)
def predict_match(
    request: MatchPredictionRequest,
    db: Session = Depends(get_db)
):
    """Predict the outcome of a single match."""
    feature_engineer = FeatureEngineer(db)

    # Check teams exist
    home_team = db.query(Team).filter(Team.name == request.home_team).first()
    away_team = db.query(Team).filter(Team.name == request.away_team).first()

    if not home_team:
        raise HTTPException(status_code=404, detail=f"Team not found: {request.home_team}")
    if not away_team:
        raise HTTPException(status_code=404, detail=f"Team not found: {request.away_team}")

    # Extract features
    features = feature_engineer.extract_match_features(
        request.home_team,
        request.away_team,
        request.is_knockout
    )

    # Make prediction
    prediction = predictor.predict(features)
    home_score, away_score = predictor.predict_score(features)

    return MatchPredictionResponse(
        home_team=request.home_team,
        away_team=request.away_team,
        home_win_probability=round(prediction["home_win"], 3),
        draw_probability=round(prediction["draw"], 3),
        away_win_probability=round(prediction["away_win"], 3),
        predicted_outcome=prediction["predicted_outcome"],
        confidence=round(prediction["confidence"], 3),
        predicted_home_score=home_score,
        predicted_away_score=away_score,
    )


@router.get("/match/{match_id}", response_model=MatchPredictionResponse)
def get_match_prediction(
    match_id: int,
    db: Session = Depends(get_db)
):
    """Get prediction for a specific match by ID."""
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    feature_engineer = FeatureEngineer(db)
    is_knockout = "Group" not in match.stage

    features = feature_engineer.extract_match_features(
        match.home_team.name,
        match.away_team.name,
        is_knockout
    )

    prediction = predictor.predict(features)
    home_score, away_score = predictor.predict_score(features)

    return MatchPredictionResponse(
        home_team=match.home_team.name,
        away_team=match.away_team.name,
        home_win_probability=round(prediction["home_win"], 3),
        draw_probability=round(prediction["draw"], 3),
        away_win_probability=round(prediction["away_win"], 3),
        predicted_outcome=prediction["predicted_outcome"],
        confidence=round(prediction["confidence"], 3),
        predicted_home_score=home_score,
        predicted_away_score=away_score,
    )


@router.post("/simulate-tournament", response_model=TournamentSimulationResponse)
def simulate_tournament(
    num_simulations: int = 1000,
    db: Session = Depends(get_db)
):
    """Run Monte Carlo simulation of the entire tournament."""
    teams = db.query(Team).filter(Team.qualified == True).all()
    team_names = [t.name for t in teams]

    feature_engineer = FeatureEngineer(db)
    win_counts = {name: 0 for name in team_names}
    finals_counts = {name: 0 for name in team_names}
    semis_counts = {name: 0 for name in team_names}

    for _ in range(num_simulations):
        # Simplified simulation - randomly progress teams based on probabilities
        remaining_teams = team_names.copy()

        # Simulate rounds until we have a winner
        while len(remaining_teams) > 1:
            next_round = []
            np.random.shuffle(remaining_teams)

            for i in range(0, len(remaining_teams) - 1, 2):
                team1 = remaining_teams[i]
                team2 = remaining_teams[i + 1]

                features = feature_engineer.extract_match_features(team1, team2, is_knockout=True)
                prediction = predictor.predict(features)

                # Simulate match outcome
                rand = np.random.random()
                if rand < prediction["home_win"]:
                    winner = team1
                elif rand < prediction["home_win"] + prediction["draw"]:
                    # In knockout, simulate penalties (50-50)
                    winner = team1 if np.random.random() < 0.5 else team2
                else:
                    winner = team2

                next_round.append(winner)

                # Track semi-finalists and finalists
                if len(remaining_teams) == 4:
                    semis_counts[team1] += 1
                    semis_counts[team2] += 1
                elif len(remaining_teams) == 2:
                    finals_counts[team1] += 1
                    finals_counts[team2] += 1

            # Handle odd number of teams
            if len(remaining_teams) % 2 == 1:
                next_round.append(remaining_teams[-1])

            remaining_teams = next_round

        # Winner
        if remaining_teams:
            win_counts[remaining_teams[0]] += 1

    # Calculate probabilities
    win_probs = {k: v / num_simulations for k, v in win_counts.items()}
    sorted_probs = sorted(win_probs.items(), key=lambda x: x[1], reverse=True)

    # Top semi-finalists
    sorted_semis = sorted(semis_counts.items(), key=lambda x: x[1], reverse=True)

    return TournamentSimulationResponse(
        winner=sorted_probs[0][0] if sorted_probs else "Unknown",
        runner_up=sorted_probs[1][0] if len(sorted_probs) > 1 else "Unknown",
        semi_finalists=[t[0] for t in sorted_semis[:4]],
        simulations_run=num_simulations,
        win_probabilities={k: round(v, 4) for k, v in sorted_probs[:10]},
    )


@router.get("/accuracy")
def get_prediction_accuracy(db: Session = Depends(get_db)):
    """Get accuracy statistics for past predictions."""
    from app.data.storage import Prediction

    predictions = db.query(Prediction).filter(Prediction.actual_outcome.isnot(None)).all()

    if not predictions:
        return {
            "total_predictions": 0,
            "correct_predictions": 0,
            "accuracy": 0,
            "message": "No completed predictions yet"
        }

    correct = sum(1 for p in predictions if p.correct)
    total = len(predictions)

    return {
        "total_predictions": total,
        "correct_predictions": correct,
        "accuracy": round(correct / total, 3) if total > 0 else 0,
    }
