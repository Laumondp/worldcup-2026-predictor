import { getTeam } from '../../_data.js';

export default function handler(req, res) {
  const parts = (req.query.teams || '').split('/');
  const team1 = getTeam(parts[0] || '');
  const team2 = getTeam(parts[1] || '');
  if (!team1 || !team2) return res.status(404).json({ error: 'Team not found' });
  // Données h2h simulées basées sur ELO
  const diff = team1.elo - team2.elo;
  const t1Wins = Math.round(10 + diff / 80);
  const t2Wins = Math.round(10 - diff / 80);
  const draws = Math.max(2, 20 - t1Wins - t2Wins);
  res.json({
    team1: team1.name, team2: team2.name,
    total_matches: t1Wins + t2Wins + draws,
    team1_wins: Math.max(0, t1Wins),
    team2_wins: Math.max(0, t2Wins),
    draws,
    team1_goals: Math.round((t1Wins * 2.1 + draws * 1.1)),
    team2_goals: Math.round((t2Wins * 2.1 + draws * 1.1)),
  });
}
