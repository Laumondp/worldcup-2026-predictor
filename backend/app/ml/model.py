"""Machine Learning model for World Cup predictions."""

import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import xgboost as xgb
import joblib
import logging
import os

from app.config import settings

logger = logging.getLogger(__name__)


class WorldCupPredictor:
    """
    Ensemble model for World Cup match predictions.

    Uses Random Forest and XGBoost in a voting ensemble.
    """

    def __init__(self):
        self.scaler = StandardScaler()
        self.rf_model = None
        self.xgb_model = None
        self.ensemble = None
        self.is_trained = False
        self.feature_names = []

    def build_models(self):
        """Initialize the ML models."""
        # Random Forest - good baseline, handles non-linear relationships
        self.rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
        )

        # XGBoost - often superior performance
        self.xgb_model = xgb.XGBClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric="mlogloss",
        )

        # Ensemble - combines both models
        self.ensemble = VotingClassifier(
            estimators=[
                ("rf", self.rf_model),
                ("xgb", self.xgb_model),
            ],
            voting="soft",  # Use probability predictions
        )

    def train(self, X: pd.DataFrame, y: pd.Series) -> Dict[str, float]:
        """
        Train the prediction models.

        Args:
            X: Feature DataFrame
            y: Target Series (0=home win, 1=draw, 2=away win)

        Returns:
            Dictionary with training metrics
        """
        logger.info(f"Training on {len(X)} samples with {len(X.columns)} features")

        self.feature_names = list(X.columns)
        self.build_models()

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Cross-validation scores
        cv_scores_rf = cross_val_score(self.rf_model, X_scaled, y, cv=5, scoring="accuracy")
        cv_scores_xgb = cross_val_score(self.xgb_model, X_scaled, y, cv=5, scoring="accuracy")

        # Train final models on all data
        self.ensemble.fit(X_scaled, y)
        self.is_trained = True

        # VotingClassifier clones estimators — update refs to fitted versions
        self.rf_model = self.ensemble.named_estimators_.get("rf")
        self.xgb_model = self.ensemble.named_estimators_.get("xgb")

        metrics = {
            "rf_cv_accuracy": cv_scores_rf.mean(),
            "rf_cv_std": cv_scores_rf.std(),
            "xgb_cv_accuracy": cv_scores_xgb.mean(),
            "xgb_cv_std": cv_scores_xgb.std(),
            "samples": len(X),
            "features": len(X.columns),
        }

        logger.info(f"Training complete. RF CV: {metrics['rf_cv_accuracy']:.3f}, XGB CV: {metrics['xgb_cv_accuracy']:.3f}")

        return metrics

    def predict(self, features: Dict[str, float]) -> Dict[str, float]:
        """
        Make a prediction for a single match.

        Args:
            features: Dictionary of feature values

        Returns:
            Dictionary with probabilities for each outcome
        """
        if not self.is_trained:
            logger.warning("Model not trained, using baseline prediction")
            return self._baseline_prediction(features)

        # Create feature array in correct order
        X = np.array([[features.get(f, 0) for f in self.feature_names]])
        X_scaled = self.scaler.transform(X)

        # Get probabilities
        probs = self.ensemble.predict_proba(X_scaled)[0]

        return {
            "home_win": float(probs[0]),
            "draw": float(probs[1]),
            "away_win": float(probs[2]),
            "predicted_outcome": ["home_win", "draw", "away_win"][np.argmax(probs)],
            "confidence": float(np.max(probs)),
        }

    def _baseline_prediction(self, features: Dict[str, float]) -> Dict[str, float]:
        """
        Baseline prediction using ranking difference.

        Used when model is not trained.
        """
        ranking_diff = features.get("ranking_diff", 0)
        elo_diff = features.get("elo_diff", 0)

        # Simple logistic-like transformation
        home_advantage = 0.05  # Slight home advantage

        # Combine ranking and ELO difference
        combined_diff = (ranking_diff * 0.3 + elo_diff * 0.002) / 2

        # Convert to probabilities
        home_prob = 0.4 + combined_diff + home_advantage
        draw_prob = 0.25
        away_prob = 1 - home_prob - draw_prob

        # Normalize
        total = home_prob + draw_prob + away_prob
        home_prob /= total
        draw_prob /= total
        away_prob /= total

        # Clamp probabilities
        home_prob = max(0.1, min(0.8, home_prob))
        away_prob = max(0.1, min(0.8, away_prob))
        draw_prob = 1 - home_prob - away_prob

        probs = [home_prob, draw_prob, away_prob]

        return {
            "home_win": home_prob,
            "draw": draw_prob,
            "away_win": away_prob,
            "predicted_outcome": ["home_win", "draw", "away_win"][np.argmax(probs)],
            "confidence": max(probs),
        }

    def predict_score(self, features: Dict[str, float]) -> Tuple[float, float]:
        """
        Predict expected score for a match.

        Returns:
            Tuple of (home_score, away_score)
        """
        # Use average goals and form to predict scores
        home_goals_avg = features.get("goals_scored_avg_home", 1.2)
        away_goals_avg = features.get("goals_scored_avg_away", 1.0)
        home_conceded_avg = features.get("goals_conceded_avg_home", 0.8)
        away_conceded_avg = features.get("goals_conceded_avg_away", 1.0)

        # Expected goals based on attacking vs defending
        home_expected = (home_goals_avg + away_conceded_avg) / 2
        away_expected = (away_goals_avg + home_conceded_avg) / 2

        # Adjust based on ranking
        elo_diff = features.get("elo_diff", 0)
        home_expected += elo_diff * 0.001
        away_expected -= elo_diff * 0.001

        # Clamp to reasonable values
        home_expected = max(0.5, min(4.0, home_expected))
        away_expected = max(0.5, min(4.0, away_expected))

        return round(home_expected, 2), round(away_expected, 2)

    def save(self, path: Optional[str] = None):
        """Save the trained model to disk."""
        if path is None:
            path = settings.model_path

        os.makedirs(os.path.dirname(path), exist_ok=True)

        model_data = {
            "ensemble": self.ensemble,
            "scaler": self.scaler,
            "feature_names": self.feature_names,
            "is_trained": self.is_trained,
        }

        joblib.dump(model_data, path)
        logger.info(f"Model saved to {path}")

    def load(self, path: Optional[str] = None) -> bool:
        """Load a trained model from disk."""
        if path is None:
            path = settings.model_path

        if not os.path.exists(path):
            logger.warning(f"Model file not found: {path}")
            return False

        try:
            model_data = joblib.load(path)
            self.ensemble = model_data["ensemble"]
            self.scaler = model_data["scaler"]
            self.feature_names = model_data["feature_names"]
            self.is_trained = model_data["is_trained"]

            # Reconstruct individual models from ensemble
            self.rf_model = self.ensemble.named_estimators_.get("rf")
            self.xgb_model = self.ensemble.named_estimators_.get("xgb")

            logger.info(f"Model loaded from {path}")
            return True
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False

    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from the models."""
        if not self.is_trained or self.rf_model is None:
            return {}

        importances = {}
        rf_importance = self.rf_model.feature_importances_

        for name, imp in zip(self.feature_names, rf_importance):
            importances[name] = float(imp)

        # Sort by importance
        return dict(sorted(importances.items(), key=lambda x: x[1], reverse=True))
