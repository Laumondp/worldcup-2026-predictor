import { TEAMS } from './_data.js';

export default function handler(req, res) {
  const { confederation } = req.query;
  let teams = TEAMS.map((t, i) => ({
    id: i + 1,
    name: t.name,
    code: t.code,
    confederation: t.confederation,
    fifa_ranking: t.fifa_ranking,
    elo_rating: t.elo,
    group: t.group,
    qualified: true,
    form_points: 0,
    goals_scored_avg: 1.4,
    goals_conceded_avg: 1.0,
    quali_points: 0,
    quali_goal_diff: 0,
  }));

  if (confederation) {
    teams = teams.filter(t => t.confederation === confederation);
  }

  teams.sort((a, b) => a.fifa_ranking - b.fifa_ranking);
  res.json(teams);
}
