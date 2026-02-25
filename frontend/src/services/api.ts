import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Team {
  id: number
  name: string
  code: string
  confederation: string
  fifa_ranking: number
  elo_rating: number
  group: string | null
  qualified: boolean
  form_points: number
  goals_scored_avg: number
  goals_conceded_avg: number
  quali_points: number
  quali_goal_diff: number
}

export interface Match {
  id: number
  home_team: string
  home_team_code: string
  away_team: string
  away_team_code: string
  date: string
  stage: string
  venue: string | null
  city: string | null
  played: boolean
  home_score: number | null
  away_score: number | null
  pred_home_win: number | null
  pred_draw: number | null
  pred_away_win: number | null
  pred_home_score: number | null
  pred_away_score: number | null
}

export interface Prediction {
  home_team: string
  away_team: string
  home_win_probability: number
  draw_probability: number
  away_win_probability: number
  predicted_outcome: string
  confidence: number
  predicted_home_score: number
  predicted_away_score: number
}

export interface GroupStanding {
  group: string
  teams: {
    name: string
    code: string
    played: number
    wins: number
    draws: number
    losses: number
    goals_for: number
    goals_against: number
    goal_difference: number
    points: number
  }[]
}

export interface TournamentSimulation {
  winner: string
  runner_up: string
  semi_finalists: string[]
  simulations_run: number
  win_probabilities: Record<string, number>
}

// API calls
export const teamsApi = {
  getAll: (confederation?: string) =>
    api.get<Team[]>('/teams', { params: { confederation } }),

  getByName: (name: string) =>
    api.get<Team>(`/teams/${name}`),

  getGroup: (group: string) =>
    api.get<Team[]>(`/teams/group/${group}`),

  getTopTeams: (n: number = 20) =>
    api.get(`/teams/rankings/top/${n}`),

  getConfederationSummary: () =>
    api.get('/teams/confederations/summary'),

  getHeadToHead: (team1: string, team2: string) =>
    api.get(`/teams/h2h/${team1}/${team2}`),
}

export const matchesApi = {
  getAll: (stage?: string, played?: boolean) =>
    api.get<Match[]>('/matches', { params: { stage, played } }),

  getById: (id: number) =>
    api.get<Match>(`/matches/${id}`),

  getUpcoming: (n: number = 10) =>
    api.get(`/matches/upcoming/next/${n}`),

  getGroupStandings: () =>
    api.get<GroupStanding[]>('/matches/groups/standings'),

  getGroupMatches: (group: string) =>
    api.get(`/matches/groups/${group}/matches`),

  getBracket: () =>
    api.get('/matches/knockout/bracket'),
}

export const predictionsApi = {
  predictMatch: (homeTeam: string, awayTeam: string, isKnockout: boolean = false) =>
    api.post<Prediction>('/predictions/match', {
      home_team: homeTeam,
      away_team: awayTeam,
      is_knockout: isKnockout,
    }),

  getMatchPrediction: (matchId: number) =>
    api.get<Prediction>(`/predictions/match/${matchId}`),

  simulateTournament: (numSimulations: number = 1000) =>
    api.post<TournamentSimulation>('/predictions/simulate-tournament', null, {
      params: { num_simulations: numSimulations },
    }),

  getAccuracy: () =>
    api.get('/predictions/accuracy'),
}

export default api
