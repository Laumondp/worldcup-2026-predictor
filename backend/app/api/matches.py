"""Matches API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.data.storage import get_db, Match, Team

router = APIRouter(prefix="/matches", tags=["matches"])


class MatchResponse(BaseModel):
    """Match data response."""
    id: int
    home_team: str
    home_team_code: str
    away_team: str
    away_team_code: str
    date: datetime
    stage: str
    venue: Optional[str]
    city: Optional[str]
    played: bool
    home_score: Optional[int]
    away_score: Optional[int]
    pred_home_win: Optional[float]
    pred_draw: Optional[float]
    pred_away_win: Optional[float]
    pred_home_score: Optional[float]
    pred_away_score: Optional[float]


class GroupStandingsResponse(BaseModel):
    """Group standings response."""
    group: str
    teams: List[dict]


class MatchResultUpdate(BaseModel):
    """Update match result."""
    home_score: int
    away_score: int


@router.get("/", response_model=List[MatchResponse])
def get_all_matches(
    stage: Optional[str] = None,
    played: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all matches with optional filters."""
    query = db.query(Match)

    if stage:
        query = query.filter(Match.stage.contains(stage))
    if played is not None:
        query = query.filter(Match.played == played)

    matches = query.order_by(Match.date).all()

    return [MatchResponse(
        id=m.id,
        home_team=m.home_team.name,
        home_team_code=m.home_team.code,
        away_team=m.away_team.name,
        away_team_code=m.away_team.code,
        date=m.date,
        stage=m.stage,
        venue=m.venue,
        city=m.city,
        played=m.played,
        home_score=m.home_score,
        away_score=m.away_score,
        pred_home_win=m.pred_home_win,
        pred_draw=m.pred_draw,
        pred_away_win=m.pred_away_win,
        pred_home_score=m.pred_home_score,
        pred_away_score=m.pred_away_score,
    ) for m in matches]


@router.get("/{match_id}", response_model=MatchResponse)
def get_match(match_id: int, db: Session = Depends(get_db)):
    """Get a specific match by ID."""
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    return MatchResponse(
        id=match.id,
        home_team=match.home_team.name,
        home_team_code=match.home_team.code,
        away_team=match.away_team.name,
        away_team_code=match.away_team.code,
        date=match.date,
        stage=match.stage,
        venue=match.venue,
        city=match.city,
        played=match.played,
        home_score=match.home_score,
        away_score=match.away_score,
        pred_home_win=match.pred_home_win,
        pred_draw=match.pred_draw,
        pred_away_win=match.pred_away_win,
        pred_home_score=match.pred_home_score,
        pred_away_score=match.pred_away_score,
    )


@router.put("/{match_id}/result")
def update_match_result(
    match_id: int,
    result: MatchResultUpdate,
    db: Session = Depends(get_db)
):
    """Update match result after it's played."""
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    match.home_score = result.home_score
    match.away_score = result.away_score
    match.played = True

    db.commit()

    return {"status": "success", "match_id": match_id}


@router.get("/upcoming/next/{n}")
def get_upcoming_matches(n: int = 10, db: Session = Depends(get_db)):
    """Get next N upcoming matches."""
    matches = db.query(Match).filter(
        Match.played == False
    ).order_by(Match.date).limit(n).all()

    return [{
        "id": m.id,
        "home_team": m.home_team.name,
        "away_team": m.away_team.name,
        "date": m.date,
        "stage": m.stage,
        "predictions": {
            "home_win": m.pred_home_win,
            "draw": m.pred_draw,
            "away_win": m.pred_away_win,
        }
    } for m in matches]


@router.get("/groups/standings", response_model=List[GroupStandingsResponse])
def get_all_group_standings(db: Session = Depends(get_db)):
    """Get standings for all groups."""
    # Get all groups
    teams = db.query(Team).filter(
        Team.qualified == True,
        Team.group_letter.isnot(None)
    ).all()

    groups = {}
    for team in teams:
        if team.group_letter not in groups:
            groups[team.group_letter] = []
        groups[team.group_letter].append(team)

    standings = []
    for group_letter in sorted(groups.keys()):
        group_teams = groups[group_letter]

        # Calculate standings based on played matches
        team_stats = []
        for team in group_teams:
            # Get matches for this team in this group
            home_matches = db.query(Match).filter(
                Match.home_team_id == team.id,
                Match.stage == f"Group {group_letter}",
                Match.played == True
            ).all()

            away_matches = db.query(Match).filter(
                Match.away_team_id == team.id,
                Match.stage == f"Group {group_letter}",
                Match.played == True
            ).all()

            played = len(home_matches) + len(away_matches)
            wins = sum(1 for m in home_matches if m.home_score > m.away_score)
            wins += sum(1 for m in away_matches if m.away_score > m.home_score)
            draws = sum(1 for m in home_matches if m.home_score == m.away_score)
            draws += sum(1 for m in away_matches if m.home_score == m.away_score)
            losses = played - wins - draws

            gf = sum(m.home_score or 0 for m in home_matches)
            gf += sum(m.away_score or 0 for m in away_matches)
            ga = sum(m.away_score or 0 for m in home_matches)
            ga += sum(m.home_score or 0 for m in away_matches)

            points = wins * 3 + draws

            team_stats.append({
                "name": team.name,
                "code": team.code,
                "played": played,
                "wins": wins,
                "draws": draws,
                "losses": losses,
                "goals_for": gf,
                "goals_against": ga,
                "goal_difference": gf - ga,
                "points": points,
            })

        # Sort by points, then goal difference, then goals scored
        team_stats.sort(key=lambda x: (-x["points"], -x["goal_difference"], -x["goals_for"]))

        standings.append(GroupStandingsResponse(
            group=group_letter,
            teams=team_stats
        ))

    return standings


@router.get("/groups/{group_letter}/matches")
def get_group_matches(group_letter: str, db: Session = Depends(get_db)):
    """Get all matches in a specific group."""
    matches = db.query(Match).filter(
        Match.stage == f"Group {group_letter.upper()}"
    ).order_by(Match.date).all()

    if not matches:
        raise HTTPException(status_code=404, detail=f"Group not found: {group_letter}")

    return [{
        "id": m.id,
        "home_team": m.home_team.name,
        "away_team": m.away_team.name,
        "date": m.date,
        "played": m.played,
        "home_score": m.home_score,
        "away_score": m.away_score,
        "predictions": {
            "home_win": m.pred_home_win,
            "draw": m.pred_draw,
            "away_win": m.pred_away_win,
        }
    } for m in matches]


@router.get("/knockout/bracket")
def get_knockout_bracket(db: Session = Depends(get_db)):
    """Get knockout stage bracket."""
    stages = [
        "Round of 32",
        "Round of 16",
        "Quarter-final",
        "Semi-final",
        "Third Place",
        "Final"
    ]

    bracket = {}
    for stage in stages:
        matches = db.query(Match).filter(
            Match.stage == stage
        ).order_by(Match.date).all()

        bracket[stage] = [{
            "id": m.id,
            "home_team": m.home_team.name if m.home_team else "TBD",
            "away_team": m.away_team.name if m.away_team else "TBD",
            "date": m.date,
            "played": m.played,
            "home_score": m.home_score,
            "away_score": m.away_score,
            "predictions": {
                "home_win": m.pred_home_win,
                "draw": m.pred_draw,
                "away_win": m.pred_away_win,
            } if m.pred_home_win else None
        } for m in matches]

    return bracket
