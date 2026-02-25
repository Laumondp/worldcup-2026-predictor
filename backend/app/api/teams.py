"""Teams API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from app.data.storage import get_db, Team
from app.data.processors.data_processor import DataProcessor

router = APIRouter(prefix="/teams", tags=["teams"])


class TeamResponse(BaseModel):
    """Team data response."""
    id: int
    name: str
    code: str
    confederation: str
    fifa_ranking: int
    elo_rating: float
    group: Optional[str]
    qualified: bool
    form_points: int
    goals_scored_avg: float
    goals_conceded_avg: float
    quali_points: int
    quali_goal_diff: int

    class Config:
        from_attributes = True


class TeamStatsResponse(BaseModel):
    """Detailed team statistics."""
    name: str
    code: str
    confederation: str
    fifa_ranking: int
    elo_rating: float
    group: Optional[str]
    stats: dict
    qualification: dict


class HeadToHeadResponse(BaseModel):
    """Head-to-head statistics."""
    team1: str
    team2: str
    total_matches: int
    team1_wins: int
    team2_wins: int
    draws: int
    team1_goals: int
    team2_goals: int


@router.get("/", response_model=List[TeamResponse])
def get_all_teams(
    confederation: Optional[str] = None,
    qualified: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all teams with optional filters."""
    query = db.query(Team)

    if confederation:
        query = query.filter(Team.confederation == confederation)
    if qualified is not None:
        query = query.filter(Team.qualified == qualified)

    teams = query.order_by(Team.fifa_ranking).all()

    return [TeamResponse(
        id=t.id,
        name=t.name,
        code=t.code,
        confederation=t.confederation,
        fifa_ranking=t.fifa_ranking,
        elo_rating=t.elo_rating,
        group=t.group_letter,
        qualified=t.qualified,
        form_points=t.form_points,
        goals_scored_avg=t.goals_scored_avg,
        goals_conceded_avg=t.goals_conceded_avg,
        quali_points=t.quali_points,
        quali_goal_diff=t.quali_goal_diff,
    ) for t in teams]


@router.get("/{team_name}", response_model=TeamStatsResponse)
def get_team(team_name: str, db: Session = Depends(get_db)):
    """Get detailed statistics for a team."""
    processor = DataProcessor(db)
    stats = processor.get_team_stats(team_name)

    if not stats:
        raise HTTPException(status_code=404, detail=f"Team not found: {team_name}")

    return TeamStatsResponse(**stats)


@router.get("/h2h/{team1}/{team2}", response_model=HeadToHeadResponse)
def get_head_to_head(
    team1: str,
    team2: str,
    db: Session = Depends(get_db)
):
    """Get head-to-head statistics between two teams."""
    processor = DataProcessor(db)
    h2h = processor.get_head_to_head(team1, team2)

    return HeadToHeadResponse(**h2h)


@router.get("/group/{group_letter}", response_model=List[TeamResponse])
def get_group_teams(group_letter: str, db: Session = Depends(get_db)):
    """Get teams in a specific group."""
    teams = db.query(Team).filter(
        Team.group_letter == group_letter.upper(),
        Team.qualified == True
    ).order_by(Team.fifa_ranking).all()

    if not teams:
        raise HTTPException(status_code=404, detail=f"Group not found: {group_letter}")

    return [TeamResponse(
        id=t.id,
        name=t.name,
        code=t.code,
        confederation=t.confederation,
        fifa_ranking=t.fifa_ranking,
        elo_rating=t.elo_rating,
        group=t.group_letter,
        qualified=t.qualified,
        form_points=t.form_points,
        goals_scored_avg=t.goals_scored_avg,
        goals_conceded_avg=t.goals_conceded_avg,
        quali_points=t.quali_points,
        quali_goal_diff=t.quali_goal_diff,
    ) for t in teams]


@router.get("/rankings/top/{n}")
def get_top_teams(n: int = 20, db: Session = Depends(get_db)):
    """Get top N teams by FIFA ranking."""
    teams = db.query(Team).filter(
        Team.qualified == True
    ).order_by(Team.fifa_ranking).limit(n).all()

    return [{
        "rank": t.fifa_ranking,
        "name": t.name,
        "code": t.code,
        "confederation": t.confederation,
        "elo_rating": t.elo_rating,
    } for t in teams]


@router.get("/confederations/summary")
def get_confederation_summary(db: Session = Depends(get_db)):
    """Get summary of qualified teams by confederation."""
    teams = db.query(Team).filter(Team.qualified == True).all()

    summary = {}
    for team in teams:
        conf = team.confederation
        if conf not in summary:
            summary[conf] = {"count": 0, "teams": []}
        summary[conf]["count"] += 1
        summary[conf]["teams"].append({
            "name": team.name,
            "ranking": team.fifa_ranking,
        })

    # Sort teams within each confederation
    for conf in summary:
        summary[conf]["teams"].sort(key=lambda x: x["ranking"])

    return summary
