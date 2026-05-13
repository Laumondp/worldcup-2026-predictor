export default async function handler(req, res) {
  const url =
    'https://api.fifa.com/api/v3/calendar/matches' +
    '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    const data = await r.json();
    const results = data.Results ?? [];

    const fixtures = results.map((m) => {
      const home = m.Home ?? {};
      const away = m.Away ?? {};
      const desc = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description ?? '' : '');
      const score = (t) => (t.Score !== null && t.Score !== undefined ? t.Score : null);

      const date = m.Date ?? '';

      const stadium = m.Stadium ?? {};
      const venue = desc(stadium.Name) || stadium.Name || '';
      const city  = desc(stadium.CityName) || stadium.CityName || '';

      const statusMap = { 0: 'scheduled', 1: 'scheduled', 3: 'live', 4: 'finished', 99: 'finished' };

      return {
        id:         String(m.IdMatch ?? ''),
        date,
        home_team:  desc(home.TeamName) || home.Name || '',
        away_team:  desc(away.TeamName) || away.Name || '',
        home_score: score(home),
        away_score: score(away),
        stage:      desc(m.StageName),
        group:      desc(m.GroupName),
        venue,
        city,
        status:     statusMap[m.MatchStatus ?? 0] ?? 'scheduled',
      };
    });

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    res.json({ count: fixtures.length, fixtures });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
