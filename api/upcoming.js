import { findGroupMatch, KO_DATES, detectKOPhase } from './_schedule.js';

export default async function handler(req, res) {
  try {
    const r = await fetch(
      'https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=200&language=fr-FR',
      { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }
    );
    const data = await r.json();
    const desc = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description || '' : '');
    const n = parseInt(req.query.n) || 10;

    const koCounters = { round32: 0, round16: 0, quarter: 0, semi: 0, third: 0, final: 0 };

    const upcoming = (data.Results || [])
      .filter((m) => m.Home?.Score === null && m.Away?.Score === null)
      .slice(0, n)
      .map((m) => {
        const homeTeam = desc(m.Home?.TeamName);
        const awayTeam = desc(m.Away?.TeamName);
        const stageName = desc(m.StageName);
        const groupName = desc(m.GroupName);
        const isGroup = /groupe\s+[a-l]/i.test(groupName);

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

        return {
          id:         m.IdMatch,
          home_team:  homeTeam,
          away_team:  awayTeam,
          date:       correctedDate,
          stage:      stageName,
          venue:      desc(m.Stadium?.Name) || null,
          city:       desc(m.Stadium?.CityName) || null,
          played:     false,
          home_score: null,
          away_score: null,
        };
      });

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    return res.json(upcoming);
  } catch {
    return res.json([]);
  }
}
