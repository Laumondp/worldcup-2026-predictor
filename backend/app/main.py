"""FastAPI main application for World Cup 2026 Predictor."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import settings
from app.data.storage import init_db, SessionLocal
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


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "predictions": "/api/predictions",
            "teams": "/api/teams",
            "matches": "/api/matches",
            "docs": "/docs",
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
