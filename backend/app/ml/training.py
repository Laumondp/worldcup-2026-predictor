"""Training pipeline for World Cup predictor."""

import logging
from typing import Dict
from sqlalchemy.orm import Session

from app.ml.model import WorldCupPredictor
from app.ml.features import FeatureEngineer
from app.data.storage import SessionLocal, init_db
from app.config import settings

logger = logging.getLogger(__name__)


class TrainingPipeline:
    """Pipeline for training the prediction model."""

    def __init__(self, db: Session = None):
        self.db = db or SessionLocal()
        self.feature_engineer = FeatureEngineer(self.db)
        self.model = WorldCupPredictor()

    def run(self, save_model: bool = True) -> Dict:
        """
        Run the full training pipeline.

        Args:
            save_model: Whether to save the trained model

        Returns:
            Dictionary with training results
        """
        logger.info("Starting training pipeline...")

        # Prepare training data
        logger.info("Preparing training data...")
        X, y = self.feature_engineer.prepare_training_data()

        if len(X) == 0:
            logger.error("No training data available")
            return {"error": "No training data available"}

        # Train model
        logger.info(f"Training model with {len(X)} samples...")
        metrics = self.model.train(X, y)

        # Save model
        if save_model:
            self.model.save()

        # Get feature importance
        feature_importance = self.model.get_feature_importance()
        top_features = list(feature_importance.items())[:10]

        results = {
            "status": "success",
            "metrics": metrics,
            "top_features": top_features,
        }

        logger.info("Training pipeline complete")
        return results

    def retrain_with_new_data(self) -> Dict:
        """Retrain model with updated data."""
        return self.run(save_model=True)

    def evaluate_model(self) -> Dict:
        """Evaluate model performance."""
        X, y = self.feature_engineer.prepare_training_data()

        if len(X) == 0:
            return {"error": "No data for evaluation"}

        # Make predictions on all data
        correct = 0
        total = len(X)

        for i, row in X.iterrows():
            features = row.to_dict()
            prediction = self.model.predict(features)
            predicted = ["home_win", "draw", "away_win"].index(prediction["predicted_outcome"])
            if predicted == y.iloc[i]:
                correct += 1

        return {
            "accuracy": correct / total if total > 0 else 0,
            "total_samples": total,
            "correct_predictions": correct,
        }


def train_model():
    """Standalone function to train the model."""
    init_db()
    pipeline = TrainingPipeline()
    return pipeline.run()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    results = train_model()
    print(f"Training results: {results}")
