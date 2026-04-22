import { TEAMS } from '../../../_data.js';

export default function handler(req, res) {
  const n = parseInt(req.query.n) || 20;
  const top = [...TEAMS]
    .sort((a, b) => a.fifa_ranking - b.fifa_ranking)
    .slice(0, n)
    .map((t, i) => ({ id: i + 1, name: t.name, code: t.code, elo_rating: t.elo, fifa_ranking: t.fifa_ranking, confederation: t.confederation }));
  res.json(top);
}
