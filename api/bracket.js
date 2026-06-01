const FIFA_URL =
  'https://api.fifa.com/api/v3/calendar/matches' +
  '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

const STAGE_TO_KEY = {
  'round of 32': 'Round of 32',
  '16e de finale': 'Round of 32',
  '16es de finale': 'Round of 32',
  'seizièmes de finale': 'Round of 32',
  'seizieme': 'Round of 32',
  'round of 16': 'Round of 16',
  '8e de finale': 'Round of 16',
  '8es de finale': 'Round of 16',
  'huitième de finale': 'Round of 16',
  'huitieme': 'Round of 16',
  'quarter-final': 'Quarter-final',
  'quart de finale': 'Quarter-final',
  'quarts de finale': 'Quarter-final',
  'semi-final': 'Semi-final',
  'demi-finale': 'Semi-final',
  'demi-finales': 'Semi-final',
  'third place': 'Third Place',
  'match pour la 3e place': 'Third Place',
  'troisième': 'Third Place',
  'final': 'Final',
  'finale': 'Final',
};

const NAME_TO_CODE = {
  'Mexique': 'MEX', 'Afrique du Sud': 'RSA', 'Corée du Sud': 'KOR', 'Tchéquie': 'CZE',
  'Canada': 'CAN', 'Bosnie-et-Herzégovine': 'BIH', 'Qatar': 'QAT', 'Suisse': 'SUI',
  'Brésil': 'BRA', 'Maroc': 'MAR', 'Haïti': 'HAI', 'Écosse': 'SCO',
  'États-Unis': 'USA', 'Australie': 'AUS', 'Turquie': 'TUR', 'Paraguay': 'PAR',
  'Allemagne': 'GER', "Côte d'Ivoire": 'CIV', 'Équateur': 'ECU', 'Curaçao': 'CUW',
  'Pays-Bas': 'NED', 'Suède': 'SWE', 'Japon': 'JPN', 'Tunisie': 'TUN',
  'Belgique': 'BEL', 'Égypte': 'EGY', 'Iran': 'IRN', 'Nouvelle-Zélande': 'NZL',
  'Espagne': 'ESP', 'Cap-Vert': 'CPV', 'Arabie saoudite': 'KSA', 'Uruguay': 'URU',
  'France': 'FRA', 'Sénégal': 'SEN', 'Irak': 'IRQ', 'Norvège': 'NOR',
  'Argentine': 'ARG', 'Algérie': 'ALG', 'Autriche': 'AUT', 'Jordanie': 'JOR',
  'Portugal': 'POR', 'RD Congo': 'COD', 'Ouzbékistan': 'UZB', 'Colombie': 'COL',
  'Angleterre': 'ENG', 'Croatie': 'CRO', 'Ghana': 'GHA', 'Panama': 'PAN',
};

function getCode(name) {
  if (!name) return null;
  const direct = NAME_TO_CODE[name];
  if (direct) return direct;
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const n = norm(name);
  const found = Object.entries(NAME_TO_CODE).find(([k]) => norm(k) === n);
  return found ? found[1] : null;
}

export default async function handler(req, res) {
  const bracket = {
    'Round of 32': [],
    'Round of 16': [],
    'Quarter-final': [],
    'Semi-final': [],
    'Third Place': [],
    'Final': [],
  };

  try {
    const r = await fetch(FIFA_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    const data = await r.json();
    const results = data.Results || [];
    const desc = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description || '' : '');
    const score = (t) => (t && t.Score !== null && t.Score !== undefined ? Number(t.Score) : null);

    let id = 0;
    for (const m of results) {
      const stageName = desc(m.StageName).toLowerCase();
      const key = Object.entries(STAGE_TO_KEY).find(([k]) => stageName.includes(k))?.[1];
      if (!key) continue;

      const homeName = desc(m.Home && m.Home.TeamName) || (m.Home && m.Home.Name) || '';
      const awayName = desc(m.Away && m.Away.TeamName) || (m.Away && m.Away.Name) || '';

      bracket[key].push({
        id: id++,
        home_team: homeName || 'TBD',
        home_team_code: getCode(homeName),
        away_team: awayName || 'TBD',
        away_team_code: getCode(awayName),
        date: m.Date || null,
        played: m.MatchStatus === 4 || m.MatchStatus === 99,
        home_score: score(m.Home),
        away_score: score(m.Away),
      });
    }

    for (const key of Object.keys(bracket)) {
      bracket[key].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }
  } catch (_) {}

  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
  res.json(bracket);
}
