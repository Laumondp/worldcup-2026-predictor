import { TEAMS, getTeam } from '../_data.js';

export default function handler(req, res) {
  const team = getTeam(req.query.name);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json({
    ...team,
    id: TEAMS.indexOf(team) + 1,
    qualified: true,
    form_points: 0,
    goals_scored_avg: 1.4,
    goals_conceded_avg: 1.0,
    quali_points: 0,
    quali_goal_diff: 0,
    stats: { matches: 0, wins: 0, draws: 0, losses: 0, goals_scored: 0, goals_conceded: 0, goal_difference: 0 },
    qualification: { points: 0, goal_diff: 0, played: 0 },
  });
}
