import { getTeam, predictMatch } from './_data.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { home_team, away_team, is_knockout } = req.body;
  const home = getTeam(home_team);
  const away = getTeam(away_team);
  if (!home || !away) return res.status(404).json({ error: 'Team not found' });
  const pred = predictMatch(home.elo, away.elo, is_knockout || false);
  res.json({ ...pred, home_team: home.name, away_team: away.name });
}
