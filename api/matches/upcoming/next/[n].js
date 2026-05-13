import { TEAMS } from '../../../_data.js';

export default async function handler(req, res) {
  // Récupère les vrais matchs depuis l'API FIFA
  try {
    const r = await fetch('https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=200&language=fr-FR', {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    const data = await r.json();
    const desc = (lst) => Array.isArray(lst) && lst[0] ? lst[0].Description || '' : '';
    const n = parseInt(req.query.n) || 10;
    const upcoming = (data.Results || [])
      .filter(m => m.Home?.Score == null && m.Away?.Score == null)
      .slice(0, n)
      .map(m => ({
        id: m.IdMatch,
        home_team: desc(m.Home?.TeamName),
        away_team: desc(m.Away?.TeamName),
        date: m.Date,
        stage: desc(m.StageName),
        venue: desc(m.Stadium?.Name) || null,
        city: desc(m.Stadium?.CityName) || m.Stadium?.CityName || null,
        played: false,
        home_score: null, away_score: null,
      }));
    return res.json({ data: upcoming });
  } catch {
    return res.json({ data: [] });
  }
}
