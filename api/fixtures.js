import { GROUP_SCHEDULE, KO_DATES, normalizeTeam, detectKOPhase } from './_schedule.js';

const FIFA_URL =
  'https://api.fifa.com/api/v3/calendar/matches' +
  '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

const STAGE_LABELS = {
  round32: '16e de finale',
  round16: '8e de finale',
  quarter: 'Quarts de finale',
  semi:    'Demi-finales',
  third:   'Match pour la 3e place',
  final:   'Finale',
};

export default async function handler(req, res) {
  // Fetch FIFA API (scores + statuts)
  let fifaResults = [];
  try {
    const r = await fetch(FIFA_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    const data = await r.json();
    fifaResults = data.Results ?? [];
  } catch {}

  const desc  = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description ?? '' : '');
  const score = (t)   => (t?.Score !== null && t?.Score !== undefined ? t.Score : null);
  const statusMap = { 0: 'scheduled', 1: 'scheduled', 3: 'live', 4: 'finished', 99: 'finished' };

  // ── Lookup FIFA par paire d'équipes (normalisée) → données live ──────────────
  const fifaByTeams = new Map();
  for (const m of fifaResults) {
    const h = normalizeTeam(desc(m.Home?.TeamName) || m.Home?.Name || '');
    const a = normalizeTeam(desc(m.Away?.TeamName) || m.Away?.Name || '');
    if (h && a) fifaByTeams.set(`${h}|${a}`, m);
  }

  // ── Lookup FIFA KO par phase, trié chronologiquement ─────────────────────────
  const fifaKO = {};
  for (const m of fifaResults) {
    const phase = detectKOPhase(desc(m.StageName));
    if (phase) {
      (fifaKO[phase] ??= []).push(m);
    }
  }
  for (const arr of Object.values(fifaKO)) {
    arr.sort((a, b) => new Date(a.Date ?? 0) - new Date(b.Date ?? 0));
  }

  const fixtures = [];

  // ── Phase de groupes : 72 matchs, date TOUJOURS depuis le planning statique ──
  for (const entry of GROUP_SCHEDULE) {
    const key = `${normalizeTeam(entry.home)}|${normalizeTeam(entry.away)}`;
    const fifa = fifaByTeams.get(key);
    fixtures.push({
      id:         fifa ? String(fifa.IdMatch ?? '') : `${entry.home}_${entry.away}`,
      date:       entry.date,               // ← date officielle, jamais de l'API FIFA
      home_team:  fifa ? (desc(fifa.Home?.TeamName) || entry.home) : entry.home,
      away_team:  fifa ? (desc(fifa.Away?.TeamName) || entry.away) : entry.away,
      home_score: fifa ? score(fifa.Home) : null,
      away_score: fifa ? score(fifa.Away) : null,
      stage:      entry.stage,
      group:      `Groupe ${entry.group}`,
      venue:      entry.venue,
      city:       entry.city,
      status:     fifa ? (statusMap[fifa.MatchStatus ?? 0] ?? 'scheduled') : 'scheduled',
    });
  }

  // ── Phases éliminatoires : date TOUJOURS depuis KO_DATES ─────────────────────
  for (const [phase, dates] of Object.entries(KO_DATES)) {
    const phaseFifa = (fifaKO[phase] ?? []);
    for (let i = 0; i < dates.length; i++) {
      const fifa = phaseFifa[i] ?? null;
      fixtures.push({
        id:         fifa ? String(fifa.IdMatch ?? '') : `${phase}_${i}`,
        date:       dates[i],               // ← date officielle, jamais de l'API FIFA
        home_team:  fifa ? (desc(fifa.Home?.TeamName) || '') : '',
        away_team:  fifa ? (desc(fifa.Away?.TeamName) || '') : '',
        home_score: fifa ? score(fifa.Home) : null,
        away_score: fifa ? score(fifa.Away) : null,
        stage:      STAGE_LABELS[phase] ?? phase,
        group:      '',
        venue:      fifa ? (desc(fifa.Stadium?.Name) || '') : '',
        city:       fifa ? (desc(fifa.Stadium?.CityName) || '') : '',
        status:     fifa ? (statusMap[fifa.MatchStatus ?? 0] ?? 'scheduled') : 'scheduled',
      });
    }
  }

  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
  res.json({ count: fixtures.length, fixtures });
}
