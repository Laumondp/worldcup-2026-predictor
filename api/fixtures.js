import { findGroupMatch, KO_DATES, detectKOPhase } from './_schedule.js';

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

    // Compteurs pour assigner les dates KO par position chronologique
    const koCounters = { round32: 0, round16: 0, quarter: 0, semi: 0, third: 0, final: 0 };

    const fixtures = results.map((m) => {
      const home = m.Home ?? {};
      const away = m.Away ?? {};
      const desc = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description ?? '' : '');
      const score = (t) => (t.Score !== null && t.Score !== undefined ? t.Score : null);

      const homeTeam = desc(home.TeamName) || home.Name || '';
      const awayTeam = desc(away.TeamName) || away.Name || '';
      const stageName = desc(m.StageName);
      const groupName = desc(m.GroupName);
      const isGroup = /groupe\s+[a-l]/i.test(groupName);

      // Cherche la date correcte dans le planning statique
      let correctedDate = m.Date ?? '';
      if (isGroup) {
        const entry = findGroupMatch(homeTeam, awayTeam);
        if (entry) correctedDate = entry.date;
      } else {
        const phase = detectKOPhase(stageName);
        if (phase && KO_DATES[phase]) {
          const idx = koCounters[phase]++;
          if (idx < KO_DATES[phase].length) correctedDate = KO_DATES[phase][idx];
        }
      }

      const stadium = m.Stadium ?? {};
      const venue = desc(stadium.Name) || '';
      const city  = desc(stadium.CityName) || '';

      const statusMap = { 0: 'scheduled', 1: 'scheduled', 3: 'live', 4: 'finished', 99: 'finished' };

      return {
        id:         String(m.IdMatch ?? ''),
        date:       correctedDate,
        home_team:  homeTeam,
        away_team:  awayTeam,
        home_score: score(home),
        away_score: score(away),
        stage:      stageName,
        group:      groupName,
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
