# World Cup 2026 Predictor

Machine Learning powered predictions for FIFA World Cup 2026 matches.

## Features

- **Match Predictions**: Get AI-powered predictions for any match with win probabilities
- **Tournament Simulation**: Monte Carlo simulation of the entire tournament
- **Team Statistics**: Detailed stats, FIFA rankings, ELO ratings
- **Group Standings**: Live group standings with qualification predictions
- **Knockout Bracket**: Interactive bracket visualization
- **Prediction History**: Track model accuracy over time

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM (SQLite/PostgreSQL)
- **scikit-learn + XGBoost** - Machine Learning
- **pandas + numpy** - Data processing
- **APScheduler** - Automated data updates

### Frontend
- **React + TypeScript** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **React Query** - API state management

### ML Model
- Ensemble model (Random Forest + XGBoost)
- Features: FIFA rankings, ELO ratings, recent form, head-to-head history
- Target accuracy: >50% (baseline random = 33%)

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (optional)

### Development Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the server
python -m app.main
```

Backend will be available at http://localhost:8000

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at http://localhost:3000

### Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Or run in background
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## API Endpoints

### Predictions
- `POST /api/predictions/match` - Predict single match
- `GET /api/predictions/match/{id}` - Get match prediction by ID
- `POST /api/predictions/simulate-tournament` - Run tournament simulation
- `GET /api/predictions/accuracy` - Get prediction accuracy stats

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/{name}` - Get team details
- `GET /api/teams/h2h/{team1}/{team2}` - Head-to-head stats
- `GET /api/teams/group/{letter}` - Teams in group

### Matches
- `GET /api/matches` - List all matches
- `GET /api/matches/{id}` - Get match details
- `GET /api/matches/groups/standings` - Group standings
- `GET /api/matches/knockout/bracket` - Knockout bracket

## Data Sources

| Source | Data | Free Tier |
|--------|------|-----------|
| [API-Football](https://www.api-football.com/) | Live matches, stats | 100 req/day |
| [Football-Data.org](https://www.football-data.org/) | Historical data | Free |
| FIFA Rankings | Official rankings | Scraped |
| Historical Data | World Cup history | Built-in |

## Configuration

Create a `.env` file in the backend directory:

```env
# API Keys (optional, for live data)
API_FOOTBALL_KEY=your_key_here
FOOTBALL_DATA_ORG_KEY=your_key_here

# Database
DATABASE_URL=sqlite:///./data/worldcup.db

# Settings
DEBUG=true
DATA_REFRESH_INTERVAL=24
```

## Project Structure

```
worldcup-2026-predictor/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI endpoints
│   │   ├── data/          # Data collectors & storage
│   │   ├── ml/            # Machine learning models
│   │   ├── config.py      # Configuration
│   │   └── main.py        # FastAPI app
│   ├── models/            # Trained ML models
│   ├── data/              # SQLite database
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── package.json
├── docker-compose.yml
└── README.md
```

## ML Model Details

### Features
- FIFA ranking (home/away)
- ELO rating (home/away)
- Recent form (last 5 matches)
- Goals scored/conceded averages
- Head-to-head history
- Confederation
- Qualification performance
- Match context (knockout vs group)

### Training
The model is automatically trained on startup using historical World Cup data. You can manually retrain:

```bash
# Via API
curl -X POST http://localhost:8000/api/admin/retrain
```

## License

MIT License - feel free to use and modify!

## Acknowledgments

- FIFA for official ranking data
- Football-Data.org for historical match data
- API-Football for live match statistics
