import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api`,
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

export interface TeamDetails extends Team {
  stats: {
    matches: number
    wins: number
    draws: number
    losses: number
    goals_scored: number
    goals_conceded: number
    goal_difference: number
  }
  qualification: {
    points: number
    goal_diff: number
    played: number
  }
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

export interface BracketEntry {
  id: number
  home_team: string
  home_team_code: string | null
  away_team: string
  away_team_code: string | null
  date: string
  played: boolean
  home_score: number | null
  away_score: number | null
}

export type KOBracket = Record<string, BracketEntry[]>

export interface RoundProbabilities {
  qualify: number
  r16: number
  qf: number
  sf: number
  final: number
  champion: number
}

export interface AnalyticalGroupTeam {
  name: string
  code: string
  p_qualify: number
  p_1st: number
  p_3rd: number
}

export interface TournamentSimulation {
  winner: string
  runner_up: string
  semi_finalists: string[]
  simulations_run: number
  model?: string
  win_probabilities: Record<string, number>
  round_probabilities?: Record<string, RoundProbabilities>
  analytical_groups?: Record<string, AnalyticalGroupTeam[]>
}

export const teamsApi = {
  getAll: (confederation?: string) =>
    api.get<Team[]>('/teams', { params: { confederation } }),

  getByName: (name: string) =>
    api.get<TeamDetails>(`/teams/${encodeURIComponent(name)}`),

  getGroup: (group: string) =>
    api.get<Team[]>('/teams', { params: { group } }),

  getTopTeams: (n: number = 20) =>
    api.get('/top-teams', { params: { n } }),

  getConfederationSummary: () =>
    api.get('/confederations'),

  getHeadToHead: (team1: string, team2: string) =>
    api.get('/h2h', { params: { team1, team2 } }),
}

export const matchesApi = {
  getAll: (stage?: string, played?: boolean) =>
    api.get<Match[]>('/matches', { params: { stage, played } }),

  getById: (id: number) =>
    api.get<Match>('/match', { params: { id } }),

  getUpcoming: (n: number = 10) =>
    api.get('/upcoming', { params: { n } }),

  getGroupStandings: () =>
    api.get<GroupStanding[]>('/matches/groups/standings'),

  getGroupMatches: (group: string) =>
    api.get('/group-matches', { params: { group } }),

  getBracket: () =>
    api.get<KOBracket>('/matches/knockout/bracket'),
}

export const predictionsApi = {
  predictMatch: (homeTeam: string, awayTeam: string, isKnockout: boolean = false) =>
    api.post<Prediction>('/predictions/match', {
      home_team: homeTeam,
      away_team: awayTeam,
      is_knockout: isKnockout,
    }),

  getMatchPrediction: (matchId: number) =>
    api.get<Prediction>('/predictions/match', { params: { match_id: matchId } }),

  simulateTournament: (numSimulations: number = 1000) =>
    api.get<TournamentSimulation>('/predictions/simulate-tournament', {
      params: { n: numSimulations },
    }),

  getAccuracy: () =>
    api.get('/predictions/accuracy'),
}

export const adminApi = {
  refreshFriendlies: () =>
    api.post<{
      status: string
      source: string
      matches_added: number
      matches_removed: number
      teams_updated: number
      played: number
      upcoming: number
      live: number
      rankings_date: string | null
      last_updated: string
      message?: string
    }>('/admin'),
}

export const statsApi = {
  recordVisit: (visitId?: string, isNew: boolean = true) =>
    api.post('/visit', { visit_id: visitId, is_new: isNew }),
  getVisitors: () => api.get<{ total_visits: number; active_now: number }>('/visitors'),
}

export default api
