"""Database models and storage for World Cup data."""

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Boolean,
    ForeignKey,
    Text,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from app.config import settings

# Create engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Team(Base):
    """Team model."""

    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    code = Column(String(3))  # FIFA country code
    confederation = Column(String(20))  # UEFA, CONMEBOL, etc.
    fifa_ranking = Column(Integer)
    elo_rating = Column(Float)
    flag_url = Column(String(255))
    qualified = Column(Boolean, default=False)
    group_letter = Column(String(1), nullable=True)

    # Recent form stats
    form_points = Column(Integer, default=0)  # Points from last 5 matches
    goals_scored_avg = Column(Float, default=0.0)
    goals_conceded_avg = Column(Float, default=0.0)

    # Qualification stats
    quali_points = Column(Integer, default=0)
    quali_goal_diff = Column(Integer, default=0)
    quali_played = Column(Integer, default=0)

    updated_at = Column(DateTime, default=datetime.utcnow)

    home_matches = relationship("Match", back_populates="home_team", foreign_keys="Match.home_team_id")
    away_matches = relationship("Match", back_populates="away_team", foreign_keys="Match.away_team_id")


class Match(Base):
    """Match model."""

    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    date = Column(DateTime)
    stage = Column(String(50))  # Group A, Round of 16, Quarter-final, etc.
    venue = Column(String(100))
    city = Column(String(100))

    # Result (null if not played)
    home_score = Column(Integer, nullable=True)
    away_score = Column(Integer, nullable=True)
    played = Column(Boolean, default=False)

    # Predictions
    pred_home_win = Column(Float, nullable=True)
    pred_draw = Column(Float, nullable=True)
    pred_away_win = Column(Float, nullable=True)
    pred_home_score = Column(Float, nullable=True)
    pred_away_score = Column(Float, nullable=True)

    home_team = relationship("Team", back_populates="home_matches", foreign_keys=[home_team_id])
    away_team = relationship("Team", back_populates="away_matches", foreign_keys=[away_team_id])


class HistoricalMatch(Base):
    """Historical match data for training."""

    __tablename__ = "historical_matches"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    home_team = Column(String(100))
    away_team = Column(String(100))
    home_score = Column(Integer)
    away_score = Column(Integer)
    tournament = Column(String(100))
    neutral = Column(Boolean, default=False)

    # Features at time of match
    home_fifa_ranking = Column(Integer, nullable=True)
    away_fifa_ranking = Column(Integer, nullable=True)
    home_elo = Column(Float, nullable=True)
    away_elo = Column(Float, nullable=True)


class Prediction(Base):
    """Stored predictions for tracking accuracy."""

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    home_win_prob = Column(Float)
    draw_prob = Column(Float)
    away_win_prob = Column(Float)
    predicted_outcome = Column(String(10))  # home, draw, away
    actual_outcome = Column(String(10), nullable=True)
    correct = Column(Boolean, nullable=True)


class FIFARanking(Base):
    """FIFA ranking history."""

    __tablename__ = "fifa_rankings"

    id = Column(Integer, primary_key=True, index=True)
    team_name = Column(String(100), index=True)
    ranking = Column(Integer)
    points = Column(Float)
    date = Column(DateTime)


class PageView(Base):
    """Page visit tracking."""

    __tablename__ = "page_views"

    id = Column(Integer, primary_key=True, index=True)
    visited_at = Column(DateTime, default=datetime.utcnow, index=True)


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
