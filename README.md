# World Cup 2026 Predictor

Application de prédictions pour la Coupe du Monde 2026 (Mexique / USA / Canada), propulsée par un modèle de machine learning (Random Forest + XGBoost) et une simulation Monte Carlo du tournoi.

🌐 **[worldcup-2026-predictor.vercel.app](https://worldcup-2026-predictor.vercel.app)**

---

## Stack technique

### Frontend
- React 18 + TypeScript, Vite 5
- Tailwind CSS, Recharts, React Query v5, React Router v6

### Backend
- FastAPI (Python 3.11+), SQLAlchemy 2.0, SQLite / PostgreSQL
- scikit-learn + XGBoost (modèle ML)
- APScheduler (mise à jour automatique toutes les 24h)

### Déploiement
- Vercel (frontend statique + routes serverless Node.js)
- Docker Compose (développement local)

---

## Pages

| Route | Description |
|---|---|
| `/` | Accueil : prochains matchs + simulation du tournoi |
| `/predictions` | Prédire un match entre deux équipes |
| `/groups` | Classements en temps réel des 12 groupes |
| `/bracket` | Tableau éliminatoire + probabilités de progression |
| `/calendar` | Calendrier visuel complet (groupes + phases KO, qualifiés dynamiques) |
| `/rankings` | Classement FIFA des 48 équipes qualifiées |
| `/teams` | Fiche détaillée de chaque équipe |
| `/history` | Précision historique du modèle |

---

## Système de prédictions

### Modèle ML (ensemble voting)
Combine **Random Forest** (200 estimateurs) et **XGBoost** (200 estimateurs, vote soft).

**Features utilisées :**
- Classement FIFA + score ELO (calculé depuis le ranking)
- Forme récente (5 derniers matchs) : points, buts marqués/concédés
- Historique H2H (victoires, nuls, buts)
- Confédération, stats de qualification
- Contexte du match (phase de groupes vs élimination directe)

**Outputs :**
- Probabilités victoire / nul / défaite
- Score prédit (buts attendus par équipe)
- Score de confiance

### Simulation Monte Carlo
1 000 simulations complètes du tournoi :
1. Phase de groupes (round-robin, tous contre tous)
2. Qualification des 32 meilleurs (2 premiers + 8 meilleurs 3es)
3. Phases éliminatoires : 16es → 8es → Quarts → Demies → 3e place → Finale
4. Résultat : probabilité de victoire finale par équipe

---

## Architecture

```
worldcup-2026-predictor/
├── frontend/               # Application React
│   └── src/
│       ├── pages/          # 9 pages de l'application (dont Calendar)
│       ├── components/     # MatchCard, TeamSelector, ProbabilityChart…
│       ├── services/api.ts # Client Axios + types TypeScript
│       └── context/        # ThemeContext (dark/light)
│
├── backend/                # API FastAPI + ML
│   └── app/
│       ├── api/            # Endpoints predictions, teams, matches
│       ├── ml/             # Modèle, features, pipeline d'entraînement
│       └── data/           # ORM SQLAlchemy, collecteurs de données
│
└── api/                    # Routes serverless Vercel (Node.js)
    └── _data.js            # Données statiques + helpers ELO
```

---

## Endpoints API

### Prédictions
```
POST  /api/predictions/match                  Prédire un match
POST  /api/predictions/simulate-tournament    Simulation Monte Carlo
GET   /api/predictions/accuracy               Précision du modèle
```

### Équipes
```
GET   /api/teams                              Liste des 48 équipes
GET   /api/teams/{name}                       Détails d'une équipe
GET   /api/teams/h2h/{team1}/{team2}          Historique H2H
GET   /api/teams/rankings/top/{n}             Top N par ranking FIFA
GET   /api/teams/confederations/summary       Résumé par confédération
```

### Matchs
```
GET   /api/matches                            Tous les matchs
GET   /api/matches/upcoming/next/{n}          Prochains N matchs
GET   /api/matches/groups/standings           Classements des groupes
GET   /api/matches/knockout/bracket           Structure du tableau KO
PUT   /api/matches/{id}/result                Saisir un résultat
```

### Utilitaires
```
GET   /api/rankings                           Classement FIFA
GET   /api/stats/visitors                     Visites totales + actifs (5 min)
GET   /health                                 Health check
POST  /api/admin/retrain                      Réentraîner le modèle manuellement
```

---

## Page Calendrier (`/calendar`)

- 104 matchs affichés (80 de groupes + 24 éliminatoires) avec carte visuelle par phase
- Onglets : **Phase de groupes** (sélecteur de groupe A–L) et **Phases finales** (16es → Finale)
- Qualifiés dynamiques : les labels « 1er Gr. X / 2e Gr. X » se résolvent en temps réel depuis l'API standings dès qu'un groupe est joué
- Tableau KO : résolution des équipes via `/api/matches/knockout/bracket` par index de tour
- Carte nuit : fond sombre (`bg-[#06101f]`) pour les matchs après minuit heure de Paris
- Design responsive : grille 2 colonnes, hero banner, pills de navigation par round colorés

---

## Données

- **48 équipes** avec ranking FIFA (avril 2026), score ELO, confédération, groupe
- **112 matchs** : 80 de poules (11 juin → 27 juin) + 32 éliminatoires (→ 19 juillet 2026)
- **~300 matchs historiques** WC 2006–2022 pour l'entraînement du modèle
- Scraping automatique du classement FIFA officiel (fallback statique si indisponible)

---

## Installation locale

### Avec Docker

```bash
docker-compose up --build
# Frontend → http://localhost:3000
# Backend  → http://localhost:8000
# API docs → http://localhost:8000/docs
```

### Sans Docker

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate   # Windows : venv\Scripts\activate
pip install -r requirements.txt
python -m app.main         # http://localhost:8000

# Frontend
cd frontend
npm install
npm run dev                # http://localhost:5173
```

### Variables d'environnement (`backend/.env`)

```env
DATABASE_URL=sqlite:///./data/worldcup.db
API_FOOTBALL_KEY=...        # optionnel
FOOTBALL_DATA_ORG_KEY=...   # optionnel
DEBUG=true
DATA_REFRESH_INTERVAL=24
```

---

## Déploiement

Le projet se déploie automatiquement sur Vercel à chaque push sur `master`.

**`vercel.json`** — build du frontend + rewrites SPA :
```json
{
  "buildCommand": "cd frontend && npm install && npx vite build",
  "outputDirectory": "frontend/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
