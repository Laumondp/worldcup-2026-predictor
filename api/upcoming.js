// Dates from official FIFA WC2026 schedule — UTC (Paris CEST = UTC+2)
// Inlined to avoid cross-file import bundling issues on Vercel

const FIFA_URL =
  'https://api.fifa.com/api/v3/calendar/matches' +
  '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

// ── Team name normalisation ───────────────────────────────────────────────────
function norm(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}
const ALIASES = {
  'etatsunis':  'etatsunis', 'unitedstates': 'etatsunis', 'usa': 'etatsunis',
  'rdcongo':    'rdcongo',   'congordc': 'rdcongo',
  'republiquedemocratiqueducongo': 'rdcongo',
  'arabie':     'arabiesaoudite',
  'coreedelud': 'coreedusud',
  'republicdecoree': 'coreedusud',
  'coreedelasud': 'coreedusud',
};
function normalizeTeam(name) { const n = norm(name); return ALIASES[n] || n; }

// ── PHASE DE GROUPES (72 matchs) — dates UTC ──────────────────────────────────
const GROUP_SCHEDULE = [
  // Groupe A
  { home: 'Mexique',        away: 'Afrique du Sud',       date: '2026-06-11T19:00:00Z', stage: 'Phase de groupes', group: 'A', venue: 'Estadio Azteca',         city: 'Mexico'        },
  { home: 'Corée du Sud',   away: 'Tchéquie',             date: '2026-06-12T02:00:00Z', stage: 'Phase de groupes', group: 'A', venue: 'Estadio Akron',          city: 'Guadalajara'   },
  { home: 'Tchéquie',       away: 'Afrique du Sud',       date: '2026-06-18T16:00:00Z', stage: 'Phase de groupes', group: 'A', venue: 'Estadio Akron',          city: 'Guadalajara'   },
  { home: 'Mexique',        away: 'Corée du Sud',         date: '2026-06-19T01:00:00Z', stage: 'Phase de groupes', group: 'A', venue: 'Estadio Azteca',         city: 'Mexico'        },
  { home: 'Tchéquie',       away: 'Mexique',              date: '2026-06-25T01:00:00Z', stage: 'Phase de groupes', group: 'A', venue: 'Estadio Azteca',         city: 'Mexico'        },
  { home: 'Afrique du Sud', away: 'Corée du Sud',         date: '2026-06-25T01:00:00Z', stage: 'Phase de groupes', group: 'A', venue: 'Estadio Akron',          city: 'Guadalajara'   },
  // Groupe B
  { home: 'Canada',              away: 'Bosnie-Herzégovine', date: '2026-06-12T19:00:00Z', stage: 'Phase de groupes', group: 'B', venue: 'BMO Field',    city: 'Toronto'       },
  { home: 'Qatar',               away: 'Suisse',              date: '2026-06-13T19:00:00Z', stage: 'Phase de groupes', group: 'B', venue: 'BC Place',     city: 'Vancouver'     },
  { home: 'Suisse',              away: 'Bosnie-Herzégovine', date: '2026-06-18T19:00:00Z', stage: 'Phase de groupes', group: 'B', venue: 'BC Place',     city: 'Vancouver'     },
  { home: 'Canada',              away: 'Qatar',               date: '2026-06-18T22:00:00Z', stage: 'Phase de groupes', group: 'B', venue: 'BMO Field',    city: 'Toronto'       },
  { home: 'Suisse',              away: 'Canada',              date: '2026-06-24T19:00:00Z', stage: 'Phase de groupes', group: 'B', venue: 'BC Place',     city: 'Vancouver'     },
  { home: 'Bosnie-Herzégovine',  away: 'Qatar',               date: '2026-06-24T19:00:00Z', stage: 'Phase de groupes', group: 'B', venue: 'BMO Field',    city: 'Toronto'       },
  // Groupe C
  { home: 'Brésil',  away: 'Maroc',   date: '2026-06-13T22:00:00Z', stage: 'Phase de groupes', group: 'C', venue: 'Hard Rock Stadium',       city: 'Miami'         },
  { home: 'Haïti',   away: 'Écosse',  date: '2026-06-14T01:00:00Z', stage: 'Phase de groupes', group: 'C', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Écosse',  away: 'Maroc',   date: '2026-06-19T22:00:00Z', stage: 'Phase de groupes', group: 'C', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Brésil',  away: 'Haïti',   date: '2026-06-20T00:30:00Z', stage: 'Phase de groupes', group: 'C', venue: 'Hard Rock Stadium',       city: 'Miami'         },
  { home: 'Écosse',  away: 'Brésil',  date: '2026-06-24T22:00:00Z', stage: 'Phase de groupes', group: 'C', venue: 'Hard Rock Stadium',       city: 'Miami'         },
  { home: 'Maroc',   away: 'Haïti',   date: '2026-06-24T22:00:00Z', stage: 'Phase de groupes', group: 'C', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  // Groupe D
  { home: 'États-Unis',  away: 'Paraguay',   date: '2026-06-13T01:00:00Z', stage: 'Phase de groupes', group: 'D', venue: 'SoFi Stadium',   city: 'Los Angeles'   },
  { home: 'Australie',   away: 'Turquie',    date: '2026-06-14T04:00:00Z', stage: 'Phase de groupes', group: 'D', venue: 'AT&T Stadium',   city: 'Dallas'        },
  { home: 'États-Unis',  away: 'Australie',  date: '2026-06-19T19:00:00Z', stage: 'Phase de groupes', group: 'D', venue: 'SoFi Stadium',   city: 'Los Angeles'   },
  { home: 'Turquie',     away: 'Paraguay',   date: '2026-06-20T03:00:00Z', stage: 'Phase de groupes', group: 'D', venue: 'AT&T Stadium',   city: 'Dallas'        },
  { home: 'Turquie',     away: 'États-Unis', date: '2026-06-26T02:00:00Z', stage: 'Phase de groupes', group: 'D', venue: 'AT&T Stadium',   city: 'Dallas'        },
  { home: 'Paraguay',    away: 'Australie',  date: '2026-06-26T02:00:00Z', stage: 'Phase de groupes', group: 'D', venue: 'SoFi Stadium',   city: 'Los Angeles'   },
  // Groupe E
  { home: 'Allemagne',     away: "Curaçao",         date: '2026-06-14T17:00:00Z', stage: 'Phase de groupes', group: 'E', venue: 'Estadio BBVA',  city: 'Monterrey'     },
  { home: "Côte d'Ivoire", away: 'Équateur',        date: '2026-06-14T23:00:00Z', stage: 'Phase de groupes', group: 'E', venue: 'NRG Stadium',   city: 'Houston'       },
  { home: 'Allemagne',     away: "Côte d'Ivoire",   date: '2026-06-20T20:00:00Z', stage: 'Phase de groupes', group: 'E', venue: 'Estadio BBVA',  city: 'Monterrey'     },
  { home: 'Équateur',      away: 'Curaçao',         date: '2026-06-21T00:00:00Z', stage: 'Phase de groupes', group: 'E', venue: 'NRG Stadium',   city: 'Houston'       },
  { home: 'Curaçao',       away: "Côte d'Ivoire",   date: '2026-06-25T20:00:00Z', stage: 'Phase de groupes', group: 'E', venue: 'NRG Stadium',   city: 'Houston'       },
  { home: 'Équateur',      away: 'Allemagne',       date: '2026-06-25T20:00:00Z', stage: 'Phase de groupes', group: 'E', venue: 'Estadio BBVA',  city: 'Monterrey'     },
  // Groupe F
  { home: 'Pays-Bas', away: 'Japon',     date: '2026-06-14T20:00:00Z', stage: 'Phase de groupes', group: 'F', venue: 'MetLife Stadium',          city: 'New York'      },
  { home: 'Suède',    away: 'Tunisie',   date: '2026-06-15T02:00:00Z', stage: 'Phase de groupes', group: 'F', venue: 'Lincoln Financial Field',  city: 'Philadelphie'  },
  { home: 'Pays-Bas', away: 'Suède',     date: '2026-06-20T17:00:00Z', stage: 'Phase de groupes', group: 'F', venue: 'MetLife Stadium',          city: 'New York'      },
  { home: 'Tunisie',  away: 'Japon',     date: '2026-06-21T04:00:00Z', stage: 'Phase de groupes', group: 'F', venue: 'Lincoln Financial Field',  city: 'Philadelphie'  },
  { home: 'Japon',    away: 'Suède',     date: '2026-06-25T23:00:00Z', stage: 'Phase de groupes', group: 'F', venue: 'MetLife Stadium',          city: 'New York'      },
  { home: 'Tunisie',  away: 'Pays-Bas',  date: '2026-06-25T23:00:00Z', stage: 'Phase de groupes', group: 'F', venue: 'Lincoln Financial Field',  city: 'Philadelphie'  },
  // Groupe G
  { home: 'Belgique',         away: 'Égypte',           date: '2026-06-15T19:00:00Z', stage: 'Phase de groupes', group: 'G', venue: "Levi's Stadium",  city: 'San Francisco' },
  { home: 'Iran',             away: 'Nouvelle-Zélande', date: '2026-06-16T01:00:00Z', stage: 'Phase de groupes', group: 'G', venue: 'Lumen Field',     city: 'Seattle'       },
  { home: 'Belgique',         away: 'Iran',             date: '2026-06-21T19:00:00Z', stage: 'Phase de groupes', group: 'G', venue: "Levi's Stadium",  city: 'San Francisco' },
  { home: 'Nouvelle-Zélande', away: 'Égypte',           date: '2026-06-22T01:00:00Z', stage: 'Phase de groupes', group: 'G', venue: 'Lumen Field',     city: 'Seattle'       },
  { home: 'Égypte',           away: 'Iran',             date: '2026-06-27T03:00:00Z', stage: 'Phase de groupes', group: 'G', venue: 'Lumen Field',     city: 'Seattle'       },
  { home: 'Nouvelle-Zélande', away: 'Belgique',         date: '2026-06-27T03:00:00Z', stage: 'Phase de groupes', group: 'G', venue: "Levi's Stadium",  city: 'San Francisco' },
  // Groupe H
  { home: 'Espagne',         away: 'Cap-Vert',         date: '2026-06-15T16:00:00Z', stage: 'Phase de groupes', group: 'H', venue: 'Estadio Azteca',  city: 'Mexico'        },
  { home: 'Arabie saoudite', away: 'Uruguay',          date: '2026-06-15T22:00:00Z', stage: 'Phase de groupes', group: 'H', venue: 'Estadio BBVA',   city: 'Monterrey'     },
  { home: 'Espagne',         away: 'Arabie saoudite',  date: '2026-06-21T16:00:00Z', stage: 'Phase de groupes', group: 'H', venue: 'Estadio Azteca',  city: 'Mexico'        },
  { home: 'Uruguay',         away: 'Cap-Vert',         date: '2026-06-21T22:00:00Z', stage: 'Phase de groupes', group: 'H', venue: 'Estadio BBVA',   city: 'Monterrey'     },
  { home: 'Cap-Vert',        away: 'Arabie saoudite',  date: '2026-06-27T00:00:00Z', stage: 'Phase de groupes', group: 'H', venue: 'Estadio BBVA',   city: 'Monterrey'     },
  { home: 'Uruguay',         away: 'Espagne',          date: '2026-06-27T00:00:00Z', stage: 'Phase de groupes', group: 'H', venue: 'Estadio Azteca',  city: 'Mexico'        },
  // Groupe I
  { home: 'France',   away: 'Sénégal', date: '2026-06-16T19:00:00Z', stage: 'Phase de groupes', group: 'I', venue: 'AT&T Stadium',      city: 'Dallas'        },
  { home: 'Irak',     away: 'Norvège', date: '2026-06-16T22:00:00Z', stage: 'Phase de groupes', group: 'I', venue: 'Arrowhead Stadium', city: 'Kansas City'   },
  { home: 'France',   away: 'Irak',    date: '2026-06-22T21:00:00Z', stage: 'Phase de groupes', group: 'I', venue: 'AT&T Stadium',      city: 'Dallas'        },
  { home: 'Norvège',  away: 'Sénégal', date: '2026-06-23T00:00:00Z', stage: 'Phase de groupes', group: 'I', venue: 'Arrowhead Stadium', city: 'Kansas City'   },
  { home: 'Norvège',  away: 'France',  date: '2026-06-26T19:00:00Z', stage: 'Phase de groupes', group: 'I', venue: 'Arrowhead Stadium', city: 'Kansas City'   },
  { home: 'Sénégal',  away: 'Irak',    date: '2026-06-26T19:00:00Z', stage: 'Phase de groupes', group: 'I', venue: 'AT&T Stadium',      city: 'Dallas'        },
  // Groupe J
  { home: 'Argentine', away: 'Algérie',  date: '2026-06-17T01:00:00Z', stage: 'Phase de groupes', group: 'J', venue: 'MetLife Stadium',  city: 'New York'      },
  { home: 'Autriche',  away: 'Jordanie', date: '2026-06-17T04:00:00Z', stage: 'Phase de groupes', group: 'J', venue: 'Gillette Stadium', city: 'Boston'        },
  { home: 'Argentine', away: 'Autriche', date: '2026-06-22T17:00:00Z', stage: 'Phase de groupes', group: 'J', venue: 'MetLife Stadium',  city: 'New York'      },
  { home: 'Jordanie',  away: 'Algérie',  date: '2026-06-23T03:00:00Z', stage: 'Phase de groupes', group: 'J', venue: 'Gillette Stadium', city: 'Boston'        },
  { home: 'Algérie',   away: 'Autriche', date: '2026-06-28T02:00:00Z', stage: 'Phase de groupes', group: 'J', venue: 'MetLife Stadium',  city: 'New York'      },
  { home: 'Jordanie',  away: 'Argentine',date: '2026-06-28T02:00:00Z', stage: 'Phase de groupes', group: 'J', venue: 'Gillette Stadium', city: 'Boston'        },
  // Groupe K
  { home: 'Portugal',    away: 'RD Congo',    date: '2026-06-17T17:00:00Z', stage: 'Phase de groupes', group: 'K', venue: 'Hard Rock Stadium', city: 'Miami'         },
  { home: 'Ouzbékistan', away: 'Colombie',    date: '2026-06-18T02:00:00Z', stage: 'Phase de groupes', group: 'K', venue: 'SoFi Stadium',      city: 'Los Angeles'   },
  { home: 'Portugal',    away: 'Ouzbékistan', date: '2026-06-23T17:00:00Z', stage: 'Phase de groupes', group: 'K', venue: 'Hard Rock Stadium', city: 'Miami'         },
  { home: 'Colombie',    away: 'RD Congo',    date: '2026-06-24T02:00:00Z', stage: 'Phase de groupes', group: 'K', venue: 'SoFi Stadium',      city: 'Los Angeles'   },
  { home: 'Colombie',    away: 'Portugal',    date: '2026-06-27T23:30:00Z', stage: 'Phase de groupes', group: 'K', venue: 'SoFi Stadium',      city: 'Los Angeles'   },
  { home: 'RD Congo',    away: 'Ouzbékistan', date: '2026-06-27T23:30:00Z', stage: 'Phase de groupes', group: 'K', venue: 'Hard Rock Stadium', city: 'Miami'         },
  // Groupe L
  { home: 'Angleterre', away: 'Croatie',     date: '2026-06-17T20:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Gillette Stadium',        city: 'Boston'        },
  { home: 'Ghana',       away: 'Panama',     date: '2026-06-17T23:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Angleterre', away: 'Ghana',       date: '2026-06-23T20:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Gillette Stadium',        city: 'Boston'        },
  { home: 'Panama',      away: 'Croatie',    date: '2026-06-23T23:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Panama',      away: 'Angleterre', date: '2026-06-27T21:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Croatie',     away: 'Ghana',      date: '2026-06-27T21:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Gillette Stadium',        city: 'Boston'        },
];

// ── PHASES ÉLIMINATOIRES — dates UTC ─────────────────────────────────────────
const KO_DATES = {
  round32: [
    '2026-06-28T19:00:00Z', '2026-06-29T17:00:00Z', '2026-06-29T20:30:00Z', '2026-06-30T01:00:00Z',
    '2026-06-30T17:00:00Z', '2026-06-30T21:00:00Z', '2026-07-01T01:00:00Z', '2026-07-01T16:00:00Z',
    '2026-07-01T20:00:00Z', '2026-07-02T00:00:00Z', '2026-07-02T19:00:00Z', '2026-07-02T23:00:00Z',
    '2026-07-03T03:00:00Z', '2026-07-03T18:00:00Z', '2026-07-03T22:00:00Z', '2026-07-04T01:30:00Z',
  ],
  round16: [
    '2026-07-04T17:00:00Z', '2026-07-04T21:00:00Z', '2026-07-05T20:00:00Z', '2026-07-06T00:00:00Z',
    '2026-07-06T19:00:00Z', '2026-07-07T00:00:00Z', '2026-07-07T16:00:00Z', '2026-07-07T20:00:00Z',
  ],
  quarter: ['2026-07-09T20:00:00Z', '2026-07-10T19:00:00Z', '2026-07-11T21:00:00Z', '2026-07-12T01:00:00Z'],
  semi:    ['2026-07-14T19:00:00Z', '2026-07-15T19:00:00Z'],
  third:   ['2026-07-18T21:00:00Z'],
  final:   ['2026-07-19T19:00:00Z'],
};

export default async function handler(req, res) {
  const n = parseInt(req.query.n) || 10;

  let fifaResults = [];
  try {
    const r = await fetch(FIFA_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    const data = await r.json();
    fifaResults = data.Results || [];
  } catch (_) {}

  const desc = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description || '' : '');

  // Lookup FIFA data by normalised team name pair
  const fifaByTeams = new Map();
  for (let i = 0; i < fifaResults.length; i++) {
    const m = fifaResults[i];
    const h = normalizeTeam(desc(m.Home && m.Home.TeamName) || (m.Home && m.Home.Name) || '');
    const a = normalizeTeam(desc(m.Away && m.Away.TeamName) || (m.Away && m.Away.Name) || '');
    if (h && a) fifaByTeams.set(h + '|' + a, m);
  }

  const now = new Date().toISOString();

  // Merge group + KO entries, sorted chronologically
  const allStatic = [];
  for (let i = 0; i < GROUP_SCHEDULE.length; i++) {
    allStatic.push({ type: 'group', entry: GROUP_SCHEDULE[i] });
  }
  const koPhaseKeys = Object.keys(KO_DATES);
  for (let p = 0; p < koPhaseKeys.length; p++) {
    const phase = koPhaseKeys[p];
    const dates = KO_DATES[phase];
    for (let i = 0; i < dates.length; i++) {
      allStatic.push({ type: 'ko', phase: phase, date: dates[i] });
    }
  }
  allStatic.sort(function(a, b) {
    const da = a.type === 'group' ? a.entry.date : a.date;
    const db = b.type === 'group' ? b.entry.date : b.date;
    return da < db ? -1 : da > db ? 1 : 0;
  });

  const upcoming = [];
  for (let i = 0; i < allStatic.length && upcoming.length < n; i++) {
    const item = allStatic[i];
    if (item.type === 'group') {
      const entry = item.entry;
      if (entry.date < now) continue;
      const key = normalizeTeam(entry.home) + '|' + normalizeTeam(entry.away);
      const fifa = fifaByTeams.get(key) || null;
      upcoming.push({
        id:         fifa ? fifa.IdMatch : null,
        home_team:  fifa ? (desc(fifa.Home && fifa.Home.TeamName) || entry.home) : entry.home,
        away_team:  fifa ? (desc(fifa.Away && fifa.Away.TeamName) || entry.away) : entry.away,
        date:       entry.date,
        stage:      entry.stage,
        venue:      fifa ? (desc(fifa.Stadium && fifa.Stadium.Name) || entry.venue || null) : (entry.venue || null),
        city:       fifa ? (desc(fifa.Stadium && fifa.Stadium.CityName) || entry.city || null) : (entry.city || null),
        played:     false,
        home_score: null,
        away_score: null,
      });
    } else {
      if (item.date < now) continue;
      upcoming.push({
        id:         null,
        home_team:  '',
        away_team:  '',
        date:       item.date,
        stage:      item.phase,
        venue:      null,
        city:       null,
        played:     false,
        home_score: null,
        away_score: null,
      });
    }
  }

  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
  return res.json(upcoming);
}
