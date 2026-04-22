import { TEAMS } from '../../_data.js';

export default function handler(req, res) {
  const groups = {};
  for (const t of TEAMS) {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push({
      name: t.name, code: t.code,
      played: 0, wins: 0, draws: 0, losses: 0,
      goals_for: 0, goals_against: 0, goal_difference: 0, points: 0,
    });
  }
  const result = Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, teams]) => ({ group, teams }));
  res.json(result);
}
