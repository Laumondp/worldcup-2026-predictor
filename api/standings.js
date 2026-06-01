const FIFA_URL =
  'https://api.fifa.com/api/v3/calendar/matches' +
  '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

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

const GROUPS = {
  A: ['Mexique', 'Afrique du Sud', 'Corée du Sud', 'Tchéquie'],
  B: ['Canada', 'Bosnie-et-Herzégovine', 'Qatar', 'Suisse'],
  C: ['Brésil', 'Maroc', 'Haïti', 'Écosse'],
  D: ['États-Unis', 'Australie', 'Turquie', 'Paraguay'],
  E: ['Allemagne', "Côte d'Ivoire", 'Équateur', 'Curaçao'],
  F: ['Pays-Bas', 'Suède', 'Japon', 'Tunisie'],
  G: ['Belgique', 'Égypte', 'Iran', 'Nouvelle-Zélande'],
  H: ['Espagne', 'Cap-Vert', 'Arabie saoudite', 'Uruguay'],
  I: ['France', 'Sénégal', 'Irak', 'Norvège'],
  J: ['Argentine', 'Algérie', 'Autriche', 'Jordanie'],
  K: ['Portugal', 'RD Congo', 'Ouzbékistan', 'Colombie'],
  L: ['Angleterre', 'Croatie', 'Ghana', 'Panama'],
};

function norm(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export default async function handler(req, res) {
  const standings = {};
  for (const [group, teams] of Object.entries(GROUPS)) {
    standings[group] = teams.map(name => ({
      name,
      code: NAME_TO_CODE[name] || name.slice(0, 3).toUpperCase(),
      played: 0, wins: 0, draws: 0, losses: 0,
      goals_for: 0, goals_against: 0, goal_difference: 0, points: 0,
    }));
  }

  try {
    const r = await fetch(FIFA_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    const data = await r.json();
    const results = data.Results || [];
    const desc = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description || '' : '');
    const score = (t) => (t && t.Score !== null && t.Score !== undefined ? Number(t.Score) : null);

    for (const m of results) {
      const stageName = desc(m.StageName).toLowerCase();
      if (!stageName.includes('group') && !stageName.includes('groupe')) continue;
      const hs = score(m.Home);
      const as = score(m.Away);
      if (hs === null || as === null) continue;

      const homeName = desc(m.Home && m.Home.TeamName) || (m.Home && m.Home.Name) || '';
      const awayName = desc(m.Away && m.Away.TeamName) || (m.Away && m.Away.Name) || '';

      for (const groupTeams of Object.values(standings)) {
        const homeEntry = groupTeams.find(t => norm(homeName) === norm(t.name));
        const awayEntry = groupTeams.find(t => norm(awayName) === norm(t.name));
        if (!homeEntry || !awayEntry) continue;

        homeEntry.played++; awayEntry.played++;
        homeEntry.goals_for += hs;  homeEntry.goals_against += as;
        awayEntry.goals_for += as;  awayEntry.goals_against += hs;
        homeEntry.goal_difference = homeEntry.goals_for - homeEntry.goals_against;
        awayEntry.goal_difference = awayEntry.goals_for - awayEntry.goals_against;

        if (hs > as) {
          homeEntry.wins++; homeEntry.points += 3; awayEntry.losses++;
        } else if (hs < as) {
          awayEntry.wins++; awayEntry.points += 3; homeEntry.losses++;
        } else {
          homeEntry.draws++; homeEntry.points++;
          awayEntry.draws++; awayEntry.points++;
        }
        break;
      }
    }
  } catch (_) {}

  const result = Object.entries(standings)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, teams]) => ({
      group,
      teams: [...teams].sort((a, b) =>
        b.points - a.points ||
        b.goal_difference - a.goal_difference ||
        b.goals_for - a.goals_for ||
        a.name.localeCompare(b.name)
      ),
    }));

  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
  res.json(result);
}
