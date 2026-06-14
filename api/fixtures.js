// Dates from official FIFA WC2026 schedule — UTC (Paris CEST = UTC+2)
// Inlined to avoid cross-file import bundling issues on Vercel

const FIFA_URL =
  'https://api.fifa.com/api/v3/calendar/matches' +
  '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

// ── Nom français → code 3 lettres (même codes que Calendar.tsx) ──────────────
const NAME_TO_CODE = {
  'Mexique':'MEX', 'Afrique du Sud':'RSA', 'Corée du Sud':'KOR', 'Tchéquie':'CZE',
  'Canada':'CAN', 'Bosnie-Herzégovine':'BIH', 'Qatar':'QAT', 'Suisse':'SUI',
  'Brésil':'BRA', 'Maroc':'MAR', 'Haïti':'HAI', 'Écosse':'SCO',
  'États-Unis':'USA', 'Australie':'AUS', 'Turquie':'TUR', 'Paraguay':'PAR',
  'Allemagne':'GER', "Côte d'Ivoire":'CIV', 'Équateur':'ECU', 'Curaçao':'CUW',
  'Pays-Bas':'NED', 'Suède':'SWE', 'Japon':'JPN', 'Tunisie':'TUN',
  'Belgique':'BEL', 'Égypte':'EGY', 'Iran':'IRN', 'Nouvelle-Zélande':'NZL',
  'Espagne':'ESP', 'Cap-Vert':'CPV', 'Arabie saoudite':'KSA', 'Arabie Saoudite':'KSA',
  'Uruguay':'URU', 'France':'FRA', 'Sénégal':'SEN', 'Irak':'IRQ', 'Norvège':'NOR',
  'Argentine':'ARG', 'Algérie':'ALG', 'Autriche':'AUT', 'Jordanie':'JOR',
  'Portugal':'POR', 'RD Congo':'COD', 'Ouzbékistan':'UZB', 'Colombie':'COL',
  'Angleterre':'ENG', 'Croatie':'CRO', 'Ghana':'GHA', 'Panama':'PAN',
  // alias FIFA
  'Türkiye':'TUR', 'République de Corée':'KOR', 'Corée':'KOR',
  'Bosnie':'BIH', 'Congo RD':'COD',
};

// ── Team name normalisation ───────────────────────────────────────────────────
function norm(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}
const ALIASES = {
  // USA
  'etatsunis':   'etatsunis', 'unitedstates': 'etatsunis', 'usa': 'etatsunis',
  // Congo
  'rdcongo':     'rdcongo', 'congordc': 'rdcongo',
  'republiquedemocratiqueducongo': 'rdcongo',
  // Arabie Saoudite
  'arabie':      'arabiesaoudite',
  // Corée du Sud — FIFA fr retourne "République de Corée"
  'coreedusud':       'coreedusud',
  'coreedelasud':     'coreedusud',
  'republicdecoree':  'coreedusud',
  'republiquedecoree':'coreedusud',
  // Tchéquie — FIFA peut retourner "République tchèque"
  'tchequie':          'tchequie',
  'republiquetcheque': 'tchequie',
  // Bosnie
  'bosnie':               'bosnieherzegovine',
  'bosniaherzegovine':    'bosnieherzegovine',
  'bosnieetherzegovine':  'bosnieherzegovine',  // FIFA fr: "Bosnie-et-Herzégovine"
};
function normalizeTeam(name) { const n = norm(name); return ALIASES[n] || n; }

// ── KO phase detection ────────────────────────────────────────────────────────
function detectKOPhase(stage) {
  const s = (stage || '').toLowerCase();
  if (s.match(/32|seizi[eè]/))  return 'round32';
  if (s.match(/16|huiti[eè]/))  return 'round16';
  if (s.match(/quart/))         return 'quarter';
  if (s.match(/demi/))          return 'semi';
  if (s.match(/3.{0,10}place|troisi[eè]|third/)) return 'third';
  if (s.match(/final/))         return 'final';
  return null;
}

const STAGE_LABELS = {
  round32: '16e de finale',
  round16: '8e de finale',
  quarter: 'Quarts de finale',
  semi:    'Demi-finales',
  third:   'Match pour la 3e place',
  final:   'Finale',
};

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
  { home: 'Angleterre', away: 'Croatie',    date: '2026-06-17T20:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Gillette Stadium',        city: 'Boston'        },
  { home: 'Ghana',       away: 'Panama',    date: '2026-06-17T23:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Angleterre', away: 'Ghana',      date: '2026-06-23T20:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Gillette Stadium',        city: 'Boston'        },
  { home: 'Panama',      away: 'Croatie',   date: '2026-06-23T23:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Panama',      away: 'Angleterre',date: '2026-06-27T21:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta'       },
  { home: 'Croatie',     away: 'Ghana',     date: '2026-06-27T21:00:00Z', stage: 'Phase de groupes', group: 'L', venue: 'Gillette Stadium',        city: 'Boston'        },
];

// ── PHASES ÉLIMINATOIRES — dates UTC ─────────────────────────────────────────
const KO_DATES = {
  round32: [
    '2026-06-28T19:00:00Z', // 28/06 21:00 Paris
    '2026-06-29T17:00:00Z', // 29/06 19:00 Paris
    '2026-06-29T20:30:00Z', // 29/06 22:30 Paris
    '2026-06-30T01:00:00Z', // 30/06 03:00 Paris
    '2026-06-30T17:00:00Z', // 30/06 19:00 Paris
    '2026-06-30T21:00:00Z', // 30/06 23:00 Paris
    '2026-07-01T01:00:00Z', // 01/07 03:00 Paris
    '2026-07-01T16:00:00Z', // 01/07 18:00 Paris
    '2026-07-01T20:00:00Z', // 01/07 22:00 Paris
    '2026-07-02T00:00:00Z', // 02/07 02:00 Paris
    '2026-07-02T19:00:00Z', // 02/07 21:00 Paris
    '2026-07-02T23:00:00Z', // 03/07 01:00 Paris
    '2026-07-03T03:00:00Z', // 03/07 05:00 Paris
    '2026-07-03T18:00:00Z', // 03/07 20:00 Paris
    '2026-07-03T22:00:00Z', // 04/07 00:00 Paris
    '2026-07-04T01:30:00Z', // 04/07 03:30 Paris
  ],
  round16: [
    '2026-07-04T17:00:00Z', // 04/07 19:00 Paris
    '2026-07-04T21:00:00Z', // 04/07 23:00 Paris
    '2026-07-05T20:00:00Z', // 05/07 22:00 Paris
    '2026-07-06T00:00:00Z', // 06/07 02:00 Paris
    '2026-07-06T19:00:00Z', // 06/07 21:00 Paris
    '2026-07-07T00:00:00Z', // 07/07 02:00 Paris
    '2026-07-07T16:00:00Z', // 07/07 18:00 Paris
    '2026-07-07T20:00:00Z', // 07/07 22:00 Paris
  ],
  quarter: [
    '2026-07-09T20:00:00Z', // 09/07 22:00 Paris
    '2026-07-10T19:00:00Z', // 10/07 21:00 Paris
    '2026-07-11T21:00:00Z', // 11/07 23:00 Paris
    '2026-07-12T01:00:00Z', // 12/07 03:00 Paris
  ],
  semi:  ['2026-07-14T19:00:00Z', '2026-07-15T19:00:00Z'],
  third: ['2026-07-18T21:00:00Z'],
  final: ['2026-07-19T19:00:00Z'],
};

export default async function handler(req, res) {
  let fifaResults = [];
  try {
    const r = await fetch(FIFA_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    const data = await r.json();
    fifaResults = data.Results || [];
  } catch (_) {}

  const desc  = (lst) => (Array.isArray(lst) && lst[0] ? lst[0].Description || '' : '');
  const score = (t)   => (t && t.Score !== null && t.Score !== undefined ? t.Score : null);
  const statusMap = { 0: 'scheduled', 1: 'scheduled', 3: 'live', 4: 'finished', 99: 'finished' };

  // Lookup FIFA data by normalised team name pair
  const fifaByTeams = new Map();
  for (let i = 0; i < fifaResults.length; i++) {
    const m = fifaResults[i];
    const h = normalizeTeam(desc(m.Home && m.Home.TeamName) || (m.Home && m.Home.Name) || '');
    const a = normalizeTeam(desc(m.Away && m.Away.TeamName) || (m.Away && m.Away.Name) || '');
    if (h && a) fifaByTeams.set(h + '|' + a, m);
  }

  // Lookup FIFA KO matches by phase, sorted chronologically
  const fifaKO = {};
  for (let i = 0; i < fifaResults.length; i++) {
    const m = fifaResults[i];
    const phase = detectKOPhase(desc(m.StageName));
    if (phase) {
      if (!fifaKO[phase]) fifaKO[phase] = [];
      fifaKO[phase].push(m);
    }
  }
  const koPhases = Object.keys(fifaKO);
  for (let p = 0; p < koPhases.length; p++) {
    fifaKO[koPhases[p]].sort(function(a, b) {
      return new Date(a.Date || 0) - new Date(b.Date || 0);
    });
  }

  const fixtures = [];

  // Group stage: date ALWAYS from static schedule
  for (let i = 0; i < GROUP_SCHEDULE.length; i++) {
    const entry = GROUP_SCHEDULE[i];
    const key = normalizeTeam(entry.home) + '|' + normalizeTeam(entry.away);
    const fifa = fifaByTeams.get(key) || null;
    fixtures.push({
      id:             fifa ? String(fifa.IdMatch || '') : entry.home + '_' + entry.away,
      date:           entry.date,
      home_team:      fifa ? (desc(fifa.Home && fifa.Home.TeamName) || entry.home) : entry.home,
      away_team:      fifa ? (desc(fifa.Away && fifa.Away.TeamName) || entry.away) : entry.away,
      home_team_code: NAME_TO_CODE[entry.home] || '',
      away_team_code: NAME_TO_CODE[entry.away] || '',
      home_score:     fifa ? score(fifa.Home) : null,
      away_score:     fifa ? score(fifa.Away) : null,
      stage:          entry.stage,
      group:          'Groupe ' + entry.group,
      venue:          entry.venue,
      city:           entry.city,
      status:         fifa ? (statusMap[fifa.MatchStatus || 0] || 'scheduled') : 'scheduled',
    });
  }

  // KO rounds: date ALWAYS from static schedule
  const koPhaseKeys = Object.keys(KO_DATES);
  for (let p = 0; p < koPhaseKeys.length; p++) {
    const phase = koPhaseKeys[p];
    const dates = KO_DATES[phase];
    const phaseFifa = fifaKO[phase] || [];
    for (let i = 0; i < dates.length; i++) {
      const fifa = phaseFifa[i] || null;
      fixtures.push({
        id:         fifa ? String(fifa.IdMatch || '') : phase + '_' + i,
        date:       dates[i],
        home_team:  fifa ? (desc(fifa.Home && fifa.Home.TeamName) || '') : '',
        away_team:  fifa ? (desc(fifa.Away && fifa.Away.TeamName) || '') : '',
        home_score: fifa ? score(fifa.Home) : null,
        away_score: fifa ? score(fifa.Away) : null,
        stage:      STAGE_LABELS[phase] || phase,
        group:      '',
        venue:      fifa ? (desc(fifa.Stadium && fifa.Stadium.Name) || '') : '',
        city:       fifa ? (desc(fifa.Stadium && fifa.Stadium.CityName) || '') : '',
        status:     fifa ? (statusMap[fifa.MatchStatus || 0] || 'scheduled') : 'scheduled',
      });
    }
  }

  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
  res.setHeader('X-Schedule-Source', 'static-v2');
  res.json({ count: fixtures.length, fixtures });
}
