import { GROUP_SCHEDULE, KO_DATES, normalizeTeam, detectKOPhase } from './_schedule.js';

const FIFA_URL =
  'https://api.fifa.com/api/v3/calendar/matches' +
  '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

export default async function handler(req, res) {
  const n = parseInt(req.query.n) || 10;

  let fifaResults = [];
  try {
    const r = await fetch(FIFA_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }
    );
    const data = await r.json();
    fifaResults = data.Results ?? [];
  } catch {}

  const desc = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description || '' : '');

  // Lookup FIFA par paire d'équipes → noms officiels
  const fifaByTeams = new Map();
  for (const m of fifaResults) {
    const h = normalizeTeam(desc(m.Home?.TeamName) || '');
    const a = normalizeTeam(desc(m.Away?.TeamName) || '');
    if (h && a) fifaByTeams.set(`${h}|${a}`, m);
  }

  const now = new Date().toISOString();

  // Tous les matchs du planning statique, triés chronologiquement
  const allStatic = [
    ...GROUP_SCHEDULE.map(e => ({ ...e, phase: 'group' })),
    ...Object.entries(KO_DATES).flatMap(([phase, dates]) =>
      dates.map(date => ({ home: '', away: '', date, stage: phase, group: null, venue: '', city: '', phase }))
    ),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const upcoming = allStatic
    .filter(e => e.date >= now)
    .slice(0, n)
    .map(entry => {
      const key = `${normalizeTeam(entry.home)}|${normalizeTeam(entry.away)}`;
      const fifa = entry.home ? fifaByTeams.get(key) : null;
      return {
        id:         fifa ? fifa.IdMatch : null,
        home_team:  fifa ? (desc(fifa.Home?.TeamName) || entry.home) : entry.home,
        away_team:  fifa ? (desc(fifa.Away?.TeamName) || entry.away) : entry.away,
        date:       entry.date,   // ← toujours la date officielle
        stage:      entry.stage,
        venue:      fifa ? (desc(fifa.Stadium?.Name) || entry.venue || null) : (entry.venue || null),
        city:       fifa ? (desc(fifa.Stadium?.CityName) || entry.city || null) : (entry.city || null),
        played:     false,
        home_score: null,
        away_score: null,
      };
    });

  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
  return res.json(upcoming);
}
