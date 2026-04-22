"""FastAPI main application for World Cup 2026 Predictor."""

import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
import mimetypes
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Frontend build output directory (vite builds to backend/static/)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
STATIC_PATH = Path(STATIC_DIR)

from app.config import settings
from app.data.storage import init_db, SessionLocal, get_db
from app.data.processors.data_processor import DataProcessor
from app.ml.training import TrainingPipeline
from app.api import predictions, teams, matches

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Scheduler for periodic data updates
scheduler = AsyncIOScheduler()


async def update_data():
    """Periodic task to update data from sources."""
    logger.info("Running scheduled data update...")
    db = SessionLocal()
    try:
        processor = DataProcessor(db)
        await processor._load_fifa_rankings()
        logger.info("Data update complete")
    except Exception as e:
        logger.error(f"Data update failed: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting World Cup 2026 Predictor API...")

    # Initialize database
    init_db()
    logger.info("Database initialized")

    # Initialize data
    db = SessionLocal()
    try:
        processor = DataProcessor(db)
        await processor.initialize_database()
    except Exception as e:
        logger.error(f"Data initialization error: {e}")
    finally:
        db.close()

    # Train model if not exists
    try:
        pipeline = TrainingPipeline()
        pipeline.run(save_model=True)
        logger.info("Model training complete")
    except Exception as e:
        logger.error(f"Model training error: {e}")

    # Start scheduler
    scheduler.add_job(
        update_data,
        "interval",
        hours=settings.data_refresh_interval,
        id="data_update"
    )
    scheduler.start()
    logger.info("Scheduler started")

    yield

    # Shutdown
    scheduler.shutdown()
    logger.info("Application shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="Machine Learning-based World Cup 2026 match predictions",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predictions.router, prefix="/api")
app.include_router(teams.router, prefix="/api")
app.include_router(matches.router, prefix="/api")


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/api/rankings")
def get_fifa_rankings(db=Depends(get_db)):
    """Return FIFA world rankings (live from DB or static fallback)."""
    from app.data.storage import FIFARanking, Team
    from sqlalchemy import func

    # Get qualified teams set for WC 2026
    all_teams = db.query(Team).all()
    qualified_set = {t.name.lower() for t in all_teams if t.qualified}
    conf_map = {t.name.lower(): t.confederation for t in all_teams}

    # Try DB first
    latest_date = db.query(func.max(FIFARanking.date)).scalar()
    if latest_date:
        rows = (
            db.query(FIFARanking)
            .filter(FIFARanking.date == latest_date)
            .order_by(FIFARanking.ranking)
            .all()
        )
        if rows:
            rankings = [
                {
                    "rank": r.ranking,
                    "name": r.team_name,
                    "points": r.points,
                    "previousRank": r.ranking,
                    "countryCode": r.team_name,
                    "confederation": conf_map.get(r.team_name.lower(), ""),
                    "qualified": r.team_name.lower() in qualified_set,
                }
                for r in rows
            ]
            return {
                "date": latest_date.isoformat(),
                "dateId": "",
                "count": len(rankings),
                "rankings": rankings,
            }

    # Static fallback — classement FIFA avril 2026
    STATIC_RANKINGS = [
        ("France", 1, 1877.32, "UEFA"),
        ("Spain", 2, 1876.40, "UEFA"),
        ("Argentina", 3, 1862.15, "CONMEBOL"),
        ("England", 4, 1821.68, "UEFA"),
        ("Brazil", 5, 1815.43, "CONMEBOL"),
        ("Portugal", 6, 1798.22, "UEFA"),
        ("Netherlands", 7, 1789.54, "UEFA"),
        ("Belgium", 8, 1775.31, "UEFA"),
        ("Colombia", 9, 1762.88, "CONMEBOL"),
        ("Germany", 10, 1751.24, "UEFA"),
        ("Italy", 11, 1739.61, "UEFA"),
        ("Uruguay", 12, 1728.43, "CONMEBOL"),
        ("Croatia", 13, 1715.82, "UEFA"),
        ("Morocco", 14, 1703.57, "CAF"),
        ("USA", 15, 1695.12, "CONCACAF"),
        ("Switzerland", 16, 1683.44, "UEFA"),
        ("Mexico", 17, 1671.33, "CONCACAF"),
        ("Japan", 18, 1659.78, "AFC"),
        ("Senegal", 19, 1647.21, "CAF"),
        ("Iran", 20, 1635.64, "AFC"),
        ("Denmark", 21, 1623.87, "UEFA"),
        ("Austria", 22, 1612.43, "UEFA"),
        ("South Korea", 23, 1601.28, "AFC"),
        ("Australia", 24, 1590.14, "AFC"),
        ("Ukraine", 25, 1579.67, "UEFA"),
        ("Turkey", 26, 1568.32, "UEFA"),
        ("Poland", 27, 1557.44, "UEFA"),
        ("Serbia", 28, 1546.21, "UEFA"),
        ("Ecuador", 29, 1535.17, "CONMEBOL"),
        ("Cameroon", 30, 1524.33, "CAF"),
        ("Nigeria", 31, 1513.78, "CAF"),
        ("Egypt", 32, 1503.24, "CAF"),
        ("Algeria", 33, 1493.41, "CAF"),
        ("Canada", 34, 1483.67, "CONCACAF"),
        ("Tunisia", 35, 1474.12, "CAF"),
        ("Paraguay", 36, 1464.88, "CONMEBOL"),
        ("Ivory Coast", 37, 1455.33, "CAF"),
        ("Venezuela", 38, 1446.07, "CONMEBOL"),
        ("Saudi Arabia", 39, 1437.22, "AFC"),
        ("Ghana", 40, 1428.44, "CAF"),
        ("Bolivia", 41, 1419.71, "CONMEBOL"),
        ("Qatar", 42, 1411.03, "AFC"),
        ("Iraq", 43, 1402.54, "AFC"),
        ("New Zealand", 44, 1394.18, "OFC"),
        ("Jamaica", 45, 1386.43, "CONCACAF"),
        ("UAE", 46, 1378.27, "AFC"),
        ("Panama", 47, 1370.12, "CONCACAF"),
        ("Costa Rica", 48, 1362.08, "CONCACAF"),
    ]
    rankings = [
        {
            "rank": rank,
            "name": name,
            "points": pts,
            "previousRank": rank,
            "countryCode": name,
            "confederation": conf,
            "qualified": name.lower() in qualified_set or True,
        }
        for name, rank, pts, conf in STATIC_RANKINGS
    ]
    from datetime import datetime
    return {
        "date": datetime.utcnow().isoformat(),
        "dateId": "static",
        "count": len(rankings),
        "rankings": rankings,
    }


@app.post("/api/admin/retrain")
async def retrain_model():
    """Manually trigger model retraining."""
    try:
        pipeline = TrainingPipeline()
        results = pipeline.run(save_model=True)
        return {"status": "success", "results": results}
    except Exception as e:
        logger.error(f"Retraining failed: {e}")
        return {"status": "error", "message": str(e)}


@app.post("/api/admin/update-data")
async def trigger_data_update():
    """Manually trigger data update."""
    await update_data()
    return {"status": "success", "message": "Data update triggered"}


@app.post("/api/admin/refresh-friendlies")
async def refresh_friendly_stats():
    """Refresh international/friendly match stats and recalculate team form."""
    db = SessionLocal()
    try:
        processor = DataProcessor(db)
        result = await processor.refresh_friendly_matches()
        return {"status": "success", **result}
    except Exception as e:
        logger.error(f"Friendly refresh failed: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        db.close()


# ── Serve frontend (React SPA) ─────────────────────────────────────────────
# /assets/{filename} must be registered BEFORE the catch-all /{full_path:path}
# so that JS/CSS files are never mistaken for HTML pages.

@app.get("/assets/{filename}", include_in_schema=False)
async def serve_assets(filename: str):
    fp = STATIC_PATH / "assets" / filename
    if not fp.is_file():
        raise HTTPException(status_code=404)
    media_type, _ = mimetypes.guess_type(filename)
    return FileResponse(str(fp), media_type=media_type or "application/octet-stream")

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    index = STATIC_PATH / "index.html"
    if index.is_file():
        return FileResponse(str(index))
    return {"status": "API running", "frontend": "not built", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
