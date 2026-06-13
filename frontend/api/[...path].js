// Routeur unique — toutes les routes /api/* sont gérées ici

import Redis from 'ioredis';
let _redis = null;
function getRedis() {
  if (!_redis && process.env.REDIS_URL) {
    _redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2, connectTimeout: 3000, commandTimeout: 2000 });
    _redis.on('error', () => {});
  }
  return _redis;
}

const TEAMS = [
  // GROUPE A — classement FIFA live 10/06/2026
  { name:"Mexico",             code:"MEX", confederation:"CONCACAF", group:"A", fifa_ranking:14, elo:1768 },
  { name:"South Africa",       code:"RSA", confederation:"CAF",      group:"A", fifa_ranking:60, elo:1479 },
  { name:"South Korea",        code:"KOR", confederation:"AFC",      group:"A", fifa_ranking:25, elo:1674 },
  { name:"Czechia",            code:"CZE", confederation:"UEFA",     group:"A", fifa_ranking:40, elo:1603 },
  // GROUPE B
  { name:"Canada",             code:"CAN", confederation:"CONCACAF", group:"B", fifa_ranking:30, elo:1575 },
  { name:"Switzerland",        code:"SUI", confederation:"UEFA",     group:"B", fifa_ranking:19, elo:1714 },
  { name:"Qatar",              code:"QAT", confederation:"AFC",      group:"B", fifa_ranking:56, elo:1513 },
  { name:"Bosnia-Herzegovina", code:"BIH", confederation:"UEFA",     group:"B", fifa_ranking:64, elo:1484 },
  // GROUPE C
  { name:"Brazil",             code:"BRA", confederation:"CONMEBOL", group:"C", fifa_ranking:6,  elo:1910 },
  { name:"Morocco",            code:"MAR", confederation:"CAF",      group:"C", fifa_ranking:7,  elo:1774 },
  { name:"Haiti",              code:"HAI", confederation:"CONCACAF", group:"C", fifa_ranking:83, elo:1391 },
  { name:"Scotland",           code:"SCO", confederation:"UEFA",     group:"C", fifa_ranking:42, elo:1637 },
  // GROUPE D
  { name:"USA",                code:"USA", confederation:"CONCACAF", group:"D", fifa_ranking:17, elo:1778 },
  { name:"Paraguay",           code:"PAR", confederation:"CONMEBOL", group:"D", fifa_ranking:41, elo:1536 },
  { name:"Australia",          code:"AUS", confederation:"AFC",      group:"D", fifa_ranking:27, elo:1652 },
  { name:"Turkey",             code:"TUR", confederation:"UEFA",     group:"D", fifa_ranking:22, elo:1647 },
  // GROUPE E
  { name:"Germany",            code:"GER", confederation:"UEFA",     group:"E", fifa_ranking:10, elo:1822 },
  { name:"Curaçao",            code:"CUW", confederation:"CONCACAF", group:"E", fifa_ranking:82, elo:1380 },
  { name:"Ivory Coast",        code:"CIV", confederation:"CAF",      group:"E", fifa_ranking:33, elo:1548 },
  { name:"Ecuador",            code:"ECU", confederation:"CONMEBOL", group:"E", fifa_ranking:23, elo:1628 },
  // GROUPE F
  { name:"Netherlands",        code:"NED", confederation:"UEFA",     group:"F", fifa_ranking:8,  elo:1848 },
  { name:"Japan",              code:"JPN", confederation:"AFC",      group:"F", fifa_ranking:18, elo:1736 },
  { name:"Tunisia",            code:"TUN", confederation:"CAF",      group:"F", fifa_ranking:45, elo:1540 },
  { name:"Sweden",             code:"SWE", confederation:"UEFA",     group:"F", fifa_ranking:38, elo:1603 },
  // GROUPE G
  { name:"Belgium",            code:"BEL", confederation:"UEFA",     group:"G", fifa_ranking:9,  elo:1874 },
  { name:"Egypt",              code:"EGY", confederation:"CAF",      group:"G", fifa_ranking:29, elo:1578 },
  { name:"Iran",               code:"IRN", confederation:"AFC",      group:"G", fifa_ranking:20, elo:1721 },
  { name:"New Zealand",        code:"NZL", confederation:"OFC",      group:"G", fifa_ranking:85, elo:1297 },
  // GROUPE H
  { name:"Spain",              code:"ESP", confederation:"UEFA",     group:"H", fifa_ranking:2,  elo:1931 },
  { name:"Cape Verde",         code:"CPV", confederation:"CAF",      group:"H", fifa_ranking:67, elo:1455 },
  { name:"Saudi Arabia",       code:"KSA", confederation:"AFC",      group:"H", fifa_ranking:61, elo:1507 },
  { name:"Uruguay",            code:"URU", confederation:"CONMEBOL", group:"H", fifa_ranking:16, elo:1790 },
  // GROUPE I
  { name:"France",             code:"FRA", confederation:"UEFA",     group:"I", fifa_ranking:3,  elo:1926 },
  { name:"Senegal",            code:"SEN", confederation:"CAF",      group:"I", fifa_ranking:15, elo:1700 },
  { name:"Norway",             code:"NOR", confederation:"UEFA",     group:"I", fifa_ranking:31, elo:1667 },
  { name:"Iraq",               code:"IRQ", confederation:"AFC",      group:"I", fifa_ranking:57, elo:1450 },
  // GROUPE J
  { name:"Argentina",          code:"ARG", confederation:"CONMEBOL", group:"J", fifa_ranking:1,  elo:2005 },
  { name:"Algeria",            code:"ALG", confederation:"CAF",      group:"J", fifa_ranking:28, elo:1600 },
  { name:"Austria",            code:"AUT", confederation:"UEFA",     group:"J", fifa_ranking:24, elo:1652 },
  { name:"Jordan",             code:"JOR", confederation:"AFC",      group:"J", fifa_ranking:63, elo:1370 },
  // GROUPE K
  { name:"Portugal",           code:"POR", confederation:"UEFA",     group:"K", fifa_ranking:5,  elo:1883 },
  { name:"Uzbekistan",         code:"UZB", confederation:"AFC",      group:"K", fifa_ranking:50, elo:1469 },
  { name:"Colombia",           code:"COL", confederation:"CONMEBOL", group:"K", fifa_ranking:13, elo:1839 },
  { name:"DR Congo",           code:"COD", confederation:"CAF",      group:"K", fifa_ranking:46, elo:1449 },
  // GROUPE L
  { name:"England",            code:"ENG", confederation:"UEFA",     group:"L", fifa_ranking:4,  elo:1921 },
  { name:"Croatia",            code:"CRO", confederation:"UEFA",     group:"L", fifa_ranking:11, elo:1740 },
  { name:"Ghana",              code:"GHA", confederation:"CAF",      group:"L", fifa_ranking:73, elo:1455 },
  { name:"Panama",             code:"PAN", confederation:"CONCACAF", group:"L", fifa_ranking:33, elo:1551 },
];

function getTeam(name) {
  return TEAMS.find(t =>
    t.name.toLowerCase() === (name||'').toLowerCase() ||
    t.code.toLowerCase() === (name||'').toLowerCase()
  );
}

function predictMatch(homeElo, awayElo, isKnockout = false) {
  const diff = homeElo - awayElo;
  const homeAdv = isKnockout ? 0 : 40;
  const adjustedDiff = diff + homeAdv;
  const homeWinProb = 1 / (1 + Math.pow(10, -adjustedDiff / 400));
  const drawProb = isKnockout ? 0 : Math.max(0.15, 0.28 - Math.abs(diff) / 2000);
  const adjHome = homeWinProb * (1 - drawProb);
  const adjAway = (1 - homeWinProb) * (1 - drawProb);
  const avgGoals = 2.6;
  const homeGoals = Math.max(0, +(avgGoals * (0.5 + adjustedDiff / 2000)).toFixed(1));
  const awayGoals = Math.max(0, +(avgGoals * (0.5 - adjustedDiff / 2000)).toFixed(1));
  return {
    home_win_probability: +adjHome.toFixed(3),
    draw_probability: +drawProb.toFixed(3),
    away_win_probability: +adjAway.toFixed(3),
    predicted_home_score: homeGoals,
    predicted_away_score: awayGoals,
    confidence: Math.round(Math.max(adjHome, adjAway) * 100),
    predicted_outcome: adjHome > adjAway + 0.05 ? 'home_win' : adjAway > adjHome + 0.05 ? 'away_win' : 'draw',
  };
}

// ── MODÈLE DE POISSON ───────────────────────────────────────────────
// Simule les buts marqués comme variables aléatoires de Poisson
function poissonPMF(k, lambda) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda;
  for (let i = 1; i <= k; i++) logP += Math.log(lambda / i);
  return Math.exp(logP);
}

function predictMatchPoisson(homeElo, awayElo, isKnockout = false) {
  const diff = homeElo - awayElo + (isKnockout ? 0 : 40);
  const lH = Math.max(0.2, 1.3 * Math.exp(0.0012 * diff));
  const lA = Math.max(0.2, 1.3 * Math.exp(-0.0012 * diff));
  let homeWin = 0, draw = 0, awayWin = 0;
  for (let h = 0; h <= 8; h++) {
    const ph = poissonPMF(h, lH);
    for (let a = 0; a <= 8; a++) {
      const p = ph * poissonPMF(a, lA);
      if (h > a) homeWin += p;
      else if (h === a) draw += p;
      else awayWin += p;
    }
  }
  if (isKnockout) { homeWin += draw * 0.5; awayWin += draw * 0.5; draw = 0; }
  return {
    home_win_probability: +homeWin.toFixed(3),
    draw_probability: +draw.toFixed(3),
    away_win_probability: +awayWin.toFixed(3),
    predicted_home_score: +lH.toFixed(1),
    predicted_away_score: +lA.toFixed(1),
  };
}

// ── MODÈLE ENSEMBLE (ELO 50% + Poisson 50%) ─────────────────────────
function predictMatchEnsemble(homeElo, awayElo, isKnockout = false) {
  const e = predictMatch(homeElo, awayElo, isKnockout);
  const p = predictMatchPoisson(homeElo, awayElo, isKnockout);
  return {
    home_win_probability: +((e.home_win_probability + p.home_win_probability) / 2).toFixed(3),
    draw_probability:     +((e.draw_probability     + p.draw_probability)     / 2).toFixed(3),
    away_win_probability: +((e.away_win_probability + p.away_win_probability) / 2).toFixed(3),
    predicted_home_score: +((e.predicted_home_score + p.predicted_home_score) / 2).toFixed(1),
    predicted_away_score: +((e.predicted_away_score + p.predicted_away_score) / 2).toFixed(1),
  };
}

// ── CALCUL ANALYTIQUE EXACT DES GROUPES ─────────────────────────────
// Énumération des 3^6 = 729 combinaisons de résultats possibles (4 équipes, 6 matchs)
// Donne les probabilités exactes de qualification sans Monte Carlo
function computeGroupProbs(groupTeams) {
  const n = groupTeams.length;
  const games = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) games.push([i, j]);
  const precomp = games.map(([i, j]) => predictMatchEnsemble(groupTeams[i].elo, groupTeams[j].elo));
  const pQualify = new Array(n).fill(0);
  const p1st     = new Array(n).fill(0);
  const p3rd     = new Array(n).fill(0);
  const pts = new Array(n).fill(0);
  const gd  = new Array(n).fill(0);

  function enumerate(gIdx, prob) {
    if (gIdx === games.length) {
      const order = [0, 1, 2, 3].sort((a, b) => pts[b] - pts[a] || gd[b] - gd[a]);
      let s = 0;
      while (s < n) {
        let e = s;
        while (e + 1 < n && pts[order[e + 1]] === pts[order[s]] && gd[order[e + 1]] === gd[order[s]]) e++;
        const cnt  = e - s + 1;
        const qpos = Math.max(0, Math.min(e + 1, 2) - s); // nb positions qualificatives dans ce groupe
        const has1 = s === 0 ? 1 : 0;
        const has3 = (s <= 2 && e >= 2) ? 1 : 0;
        for (let k = s; k <= e; k++) {
          pQualify[order[k]] += prob * qpos / cnt;
          p1st[order[k]]     += prob * has1 / cnt;
          p3rd[order[k]]     += prob * has3 / cnt;
        }
        s = e + 1;
      }
      return;
    }
    const [i, j] = games[gIdx];
    const pr = precomp[gIdx];
    // Victoire domicile
    pts[i] += 3; gd[i]++; gd[j]--;
    enumerate(gIdx + 1, prob * pr.home_win_probability);
    pts[i] -= 3; gd[i]--; gd[j]++;
    // Match nul
    pts[i]++; pts[j]++;
    enumerate(gIdx + 1, prob * pr.draw_probability);
    pts[i]--; pts[j]--;
    // Victoire extérieur
    pts[j] += 3; gd[j]++; gd[i]--;
    enumerate(gIdx + 1, prob * pr.away_win_probability);
    pts[j] -= 3; gd[j]--; gd[i]++;
  }

  enumerate(0, 1.0);
  return groupTeams.map((t, i) => ({
    name: t.name, code: t.code,
    p_qualify: +Math.min(1, pQualify[i]).toFixed(4),
    p_1st:     +p1st[i].toFixed(4),
    p_3rd:     +p3rd[i].toFixed(4),
  }));
}

// ── SIMULATION MONTE CARLO (modèle Ensemble, suivi par tour) ────────
function simulateOnce() {
  const reached = {};
  for (const t of TEAMS) reached[t.name] = 0; // 0 = éliminé en phase de groupes

  const groups = {};
  for (const t of TEAMS) {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push({ ...t, pts: 0, gd: 0, gf: 0 });
  }

  for (const teams of Object.values(groups)) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const pr = predictMatchEnsemble(teams[i].elo, teams[j].elo);
        const r = Math.random();
        if (r < pr.home_win_probability) {
          teams[i].pts += 3; teams[i].gd++; teams[j].gd--; teams[i].gf += 2; teams[j].gf += 1;
        } else if (r < pr.home_win_probability + pr.draw_probability) {
          teams[i].pts++; teams[j].pts++; teams[i].gf++; teams[j].gf++;
        } else {
          teams[j].pts += 3; teams[j].gd++; teams[i].gd--; teams[j].gf += 2; teams[i].gf += 1;
        }
      }
    }
    teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || Math.random() - 0.5);
  }

  // Top 2 de chaque groupe + 8 meilleurs 3es
  const qualified = [];
  const thirds = [];
  for (const teams of Object.values(groups)) {
    reached[teams[0].name] = 1; // r32
    reached[teams[1].name] = 1;
    qualified.push(teams[0], teams[1]);
    thirds.push(teams[2]);
  }
  thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || Math.random() - 0.5);
  for (const t of thirds.slice(0, 8)) {
    reached[t.name] = 1; // r32
    qualified.push(t);
  }

  // Tours à élimination : r16=2, qf=3, sf=4, finale=5, champion=6
  let surviving = qualified;
  for (let roundIdx = 2; roundIdx <= 6; roundIdx++) {
    const next = [];
    for (let i = 0; i < surviving.length; i += 2) {
      const a = surviving[i], b = surviving[i + 1] || surviving[i];
      const pr = predictMatchEnsemble(a.elo, b.elo, true);
      const winner = Math.random() < pr.home_win_probability / (pr.home_win_probability + pr.away_win_probability) ? a : b;
      reached[winner.name] = roundIdx;
      next.push(winner);
    }
    surviving = next;
  }

  return { winner: surviving[0]?.name || '', reached };
}

const FIFA_HEADERS = { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' };
const desc = lst => Array.isArray(lst) && lst[0] ? lst[0].Description||'' : '';

function normConf(name) {
  if (!name) return '';
  const u = name.toUpperCase();
  if (u.includes('UEFA'))     return 'UEFA';
  if (u.includes('CONMEBOL')) return 'CONMEBOL';
  if (u.includes('CONCACAF')) return 'CONCACAF';
  if (u.includes('CAF'))      return 'CAF';
  if (u.includes('AFC'))      return 'AFC';
  if (u.includes('OFC'))      return 'OFC';
  return name;
}

// Classement FIFA live 10/06/2026 (Argentine #1) — source: inside.fifa.com
const RANKING_OVERRIDES_2026_06 = {
  'ARG': { rank:1,  pts:1877.27 }, 'ESP': { rank:2,  pts:1874.71 },
  'FRA': { rank:3,  pts:1870.70 }, 'ENG': { rank:4,  pts:1827.05 },
  'POR': { rank:5,  pts:1766.18 }, 'BRA': { rank:6,  pts:1765.86 },
  'MAR': { rank:7,  pts:1755.10 }, 'NED': { rank:8,  pts:1753.57 },
  'BEL': { rank:9,  pts:1742.24 }, 'GER': { rank:10, pts:1735.77 },
  'CRO': { rank:11, pts:1714.87 }, 'COL': { rank:13, pts:1698.35 },
  'MEX': { rank:14, pts:1687.48 }, 'SEN': { rank:15, pts:1684.07 },
  'URU': { rank:16, pts:1673.07 }, 'USA': { rank:17, pts:1671.23 },
  'JPN': { rank:18, pts:1661.58 }, 'SUI': { rank:19, pts:1650.06 },
  'IRN': { rank:20, pts:1619.58 }, 'TUR': { rank:22, pts:1605.73 },
  'ECU': { rank:23, pts:1598.52 }, 'AUT': { rank:24, pts:1597.40 },
  'KOR': { rank:25, pts:1591.63 }, 'AUS': { rank:27, pts:1579.34 },
  'ALG': { rank:28, pts:1571.03 }, 'EGY': { rank:29, pts:1562.37 },
  'CAN': { rank:30, pts:1559.48 }, 'NOR': { rank:31, pts:1557.44 },
  'CIV': { rank:33, pts:1540.87 }, 'PAN': { rank:34, pts:1539.16 },
  'SWE': { rank:38, pts:1509.79 }, 'CZE': { rank:40, pts:1505.74 },
  'PAR': { rank:41, pts:1505.35 }, 'SCO': { rank:42, pts:1503.34 },
  'CMR': { rank:44, pts:1481.24 }, 'TUN': { rank:45, pts:1476.41 },
  'COD': { rank:46, pts:1474.43 }, 'UZB': { rank:50, pts:1458.73 },
  'QAT': { rank:56, pts:1450.31 }, 'IRQ': { rank:57, pts:1446.28 },
  'RSA': { rank:60, pts:1428.38 }, 'KSA': { rank:61, pts:1423.88 },
  'JOR': { rank:63, pts:1387.74 }, 'BIH': { rank:64, pts:1387.22 },
  'CPV': { rank:67, pts:1371.11 }, 'GHA': { rank:73, pts:1346.88 },
  'CUW': { rank:82, pts:1294.77 }, 'HAI': { rank:83, pts:1293.10 },
  'NZL': { rank:85, pts:1275.58 },
};

const FIFA_LIVE_RANKING_URL =
  'https://inside.fifa.com/api/live-world-ranking/get-rankings' +
  '?mode=live&gender=1&locale=en&rankingType=football&count=211';

async function fetchFifaRankings() {
  // 1. API live FIFA (inclut les amicaux du jour)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(FIFA_LIVE_RANKING_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json', Referer: 'https://inside.fifa.com/fifa-world-ranking/men' },
        signal: ctrl.signal,
      });
      if (r.ok) {
        const data = await r.json();
        const arr = Array.isArray(data) ? data : (data.rankings || data.items || data.data || []);
        if (arr.length > 0) {
          const rankings = arr.map(e => ({
            rank: e.rank,
            name: e.teamName || e.name,
            points: e.totalPoints ?? e.points ?? 0,
            previousRank: e.previousRank ?? e.rank,
            countryCode: e.countryCode,
            confederation: normConf(e.confederationName || e.confederation || ''),
          }));
          return { dateId: 'live', date: new Date().toISOString(), source: 'fifa-live', isStatic: false, rankings };
        }
      }
    } finally { clearTimeout(timer); }
  } catch {}

  // 2. ranking-overview API avec corrections juin 2026
  const dateIds = ['id14870', 'id14800'];
  for (const dateId of dateIds) {
    try {
      const r = await fetch(`https://inside.fifa.com/api/ranking-overview?locale=en&dateId=${dateId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json', Referer: 'https://inside.fifa.com/fifa-world-ranking/men' }
      });
      const data = await r.json();
      if (data.rankings && data.rankings.length > 0) {
        let rankings = data.rankings.map(e => {
          const code = (e.rankingItem?.countryCode || '').toUpperCase();
          const ov = RANKING_OVERRIDES_2026_06[code];
          return {
            rank: e.rankingItem?.rank,
            name: e.rankingItem?.name,
            points: ov ? ov.pts : e.rankingItem?.totalPoints,
            previousRank: e.rankingItem?.previousRank,
            countryCode: e.rankingItem?.countryCode,
            confederation: normConf(e.tag?.id || ''),
          };
        });
        rankings.sort((a, b) => b.points - a.points);
        rankings = rankings.map((e, i) => ({ ...e, rank: i + 1 }));
        return { dateId: 'live-2026-06-10', date: '2026-06-10T20:00:00+00:00', source: 'fallback', isStatic: true, rankings };
      }
    } catch { continue; }
  }
  return null;
}

// Static bracket labels for all KO matches (FIFA API doesn't populate PlaceholderName for KO rounds)
// IDs mapped chronologically from official FIFA WC2026 schedule
const KO_BRACKET = {
  // ── 32es de finale ──
  '400021518': { home: '2e Gr. A',                away: '2e Gr. B'                },
  '400021516': { home: '1er Gr. C',               away: '2e Gr. F'                },
  '400021513': { home: '1er Gr. E',               away: '3e Gr. A/B/C/D/F'        },
  '400021522': { home: '1er Gr. F',               away: '2e Gr. C'                },
  '400021514': { home: '2e Gr. E',                away: '2e Gr. I'                },
  '400021523': { home: '1er Gr. I',               away: '3e Gr. C/D/F/G/H'        },
  '400021520': { home: '1er Gr. A',               away: '3e Gr. C/E/F/H/I'        },
  '400021512': { home: '1er Gr. L',               away: '3e Gr. E/H/I/J/K'        },
  '400021525': { home: '1er Gr. G',               away: '3e Gr. A/E/H/I/J'        },
  '400021524': { home: '1er Gr. D',               away: '3e Gr. B/E/F/I/J'        },
  '400021519': { home: '1er Gr. H',               away: '2e Gr. J'                },
  '400021526': { home: '2e Gr. K',                away: '2e Gr. L'                },
  '400021527': { home: '1er Gr. B',               away: '3e Gr. E/F/G/I/J'        },
  '400021515': { home: '2e Gr. D',                away: '2e Gr. G'                },
  '400021521': { home: '1er Gr. J',               away: '2e Gr. H'                },
  '400021517': { home: '1er Gr. K',               away: '3e Gr. D/E/I/J/L'        },
  // ── 16es de finale ──
  '400021530': { home: 'V. (2e A / 2e B)',        away: 'V. (1er F / 2e C)'       },
  '400021533': { home: 'V. (1er E / 3e ABCDF)',   away: 'V. (1er I / 3e CDFGH)'   },
  '400021532': { home: 'V. (1er C / 2e F)',       away: 'V. (2e E / 2e I)'         },
  '400021531': { home: 'V. (1er A / 3e CEFHI)',   away: 'V. (1er L / 3e EHIJK)'   },
  '400021529': { home: 'V. (2e K / 2e L)',        away: 'V. (1er H / 2e J)'        },
  '400021534': { home: 'V. (1er D / 3e BEFIJ)',   away: 'V. (1er G / 3e AEHIJ)'   },
  '400021528': { home: 'V. (1er J / 2e H)',       away: 'V. (2e D / 2e G)'         },
  '400021535': { home: 'V. (1er B / 3e EFGIJ)',   away: 'V. (1er K / 3e DEIJL)'   },
  // ── Quarts de finale ──
  '400021536': { home: 'V. 8e Philadelphie',      away: 'V. 8e Houston'            },
  '400021538': { home: 'V. 8e Dallas',            away: 'V. 8e Seattle'            },
  '400021539': { home: 'V. 8e New York/NJ',       away: 'V. 8e Mexico'             },
  '400021537': { home: 'V. 8e Atlanta',           away: 'V. 8e Vancouver'          },
  // ── Demi-finales ──
  '400021541': { home: 'V. QF Boston',            away: 'V. QF Los Angeles'        },
  '400021540': { home: 'V. QF Miami',             away: 'V. QF Kansas City'        },
  // ── Petite finale ──
  '400021542': { home: 'Perdant DF Dallas',       away: 'Perdant DF Atlanta'       },
  // ── Finale ──
  '400021543': { home: 'Vainqueur DF Dallas',     away: 'Vainqueur DF Atlanta'     },
};

async function fetchFifaFixtures() {
  const r = await fetch('https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=500&language=fr-FR', { headers: FIFA_HEADERS });
  const data = await r.json();
  const score = t => t?.Score != null ? t.Score : null;
  return (data.Results||[]).map(m => {
    let date = m.Date||'';
    try { const d = new Date(date); date = d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'})+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}); } catch {}
    const stadium = m.Stadium||{};
    const statusMap = {0:'scheduled',1:'scheduled',3:'live',4:'finished',5:'finished',6:'finished',99:'finished'};
    const id = String(m.IdMatch||'');
    const bracket = KO_BRACKET[id] || {};
    const homeTeam = desc(m.Home?.TeamName) || bracket.home || '';
    const awayTeam = desc(m.Away?.TeamName) || bracket.away || '';
    const hScore = score(m.Home);
    const aScore = score(m.Away);
    const rawStatus = statusMap[m.MatchStatus??0]||'scheduled';
    // Si les deux scores sont présents et la date est passée → match terminé (robuste aux codes FIFA inconnus)
    const matchMs = m.Date ? new Date(m.Date).getTime() : 0;
    const status = (hScore != null && aScore != null && matchMs > 0 && matchMs < Date.now()) ? 'finished' : rawStatus;
    return { id, date, home_team: homeTeam, away_team: awayTeam, home_score:hScore, away_score:aScore, stage:desc(m.StageName), group:desc(m.GroupName), venue:desc(stadium.Name)||stadium.Name||'', city:desc(stadium.CityName)||stadium.CityName||'', status };
  });
}

async function fetchFifaMatches() {
  const r = await fetch('https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=500&language=en-GB', { headers: FIFA_HEADERS });
  const data = await r.json();
  return (data.Results||[]).map(m => ({
    id: String(m.IdMatch||''),
    date: m.Date||'',
    home_team: desc(m.Home?.TeamName),
    away_team: desc(m.Away?.TeamName),
    home_score: m.Home?.Score ?? null,
    away_score: m.Away?.Score ?? null,
    status: [4,99].includes(m.MatchStatus) ? 'finished' : m.MatchStatus === 3 ? 'live' : 'scheduled',
    group: desc(m.GroupName),
    stage: desc(m.StageName),
  }));
}

// Alias de noms (français, variantes FIFA officielles, etc.) -> nom anglais du tableau TEAMS
const NAME_ALIASES = {
  // Français
  'etatsuns':'USA','etatsunis':'USA','etatsunisdamerique':'USA',
  'france':'France','pologne':'Poland','maroc':'Morocco',
  'mexique':'Mexico','espagne':'Spain','serbie':'Serbia','senegal':'Senegal',
  'canada':'Canada','angleterre':'England','ukraine':'Ukraine','nigeria':'Nigeria',
  'argentine':'Argentina','allemagne':'Germany','turquie':'Turkey','cameroun':'Cameroon',
  'bresil':'Brazil','portugal':'Portugal','japon':'Japan','egypte':'Egypt',
  'colombie':'Colombia','paysbas':'Netherlands','coreedusud':'South Korea',
  'coreedurepublique':'South Korea',
  'algerie':'Algeria','uruguay':'Uruguay','belgique':'Belgium','australie':'Australia',
  'tunisie':'Tunisia','equateur':'Ecuador','italie':'Italy','iran':'Iran',
  'cotedivoire':'Ivory Coast','coteivoire':'Ivory Coast',
  'paraguay':'Paraguay','croatie':'Croatia',
  'arabiesaoudite':'Saudi Arabia','ghana':'Ghana','suisse':'Switzerland',
  'qatar':'Qatar','costarica':'Costa Rica','venezuela':'Venezuela',
  'danemark':'Denmark','irak':'Iraq','panama':'Panama','bolivie':'Bolivia',
  'autriche':'Austria','emiratsarabesunis':'UAE','eau':'UAE',
  'jamaique':'Jamaica','nouvellezelande':'New Zealand',
  'afriquedusud':'South Africa','suede':'Sweden',
  'norvege':'Norway','norvège':'Norway',
  'ecosse':'Scotland','galles':'Wales','chili':'Chile','perou':'Peru','chine':'China',
  'capvert':'Cape Verde','capverde':'Cape Verde','caboverde':'Cape Verde',
  'haiti':'Haiti','haïti':'Haiti',
  'bosnieherzégovine':'Bosnia-Herzegovina','bosnie':'Bosnia-Herzegovina',
  'bosnieherzegovina':'Bosnia-Herzegovina',
  'ouzbékistan':'Uzbekistan','ouzbekistan':'Uzbekistan',
  'curacao':'Curaçao','curao':'Curaçao',
  'congodr':'DR Congo','rdcongo':'DR Congo','congord':'DR Congo',
  'democraticrepublicofcongo':'DR Congo',
  'jordanie':'Jordan',
  'tchequie':'Czechia','tcheque':'Czechia','republiquetcheque':'Czechia',
  // Variantes FIFA anglaises officielles
  'korearepublic':'South Korea','republicofkorea':'South Korea',
  'unitedstates':'USA','unitedstatesofamerica':'USA',
  'unitedarabemirates':'UAE',
  'iriran':'Iran','islamicrepublicofiran':'Iran',
  'bosniaherzegovina':'Bosnia-Herzegovina',
  'czechia':'Czechia',
  'capeverde':'Cape Verde',
  'drcongo':'DR Congo','democraticrepublicofthecongo':'DR Congo',
  'coted\'ivoire':'Ivory Coast','côted\'ivoire':'Ivory Coast',
};

// Equipes non qualifiees WC2026 pouvant apparaitre dans les calendriers FIFA
const EXTRA_TEAMS = [
  { name:'Italy',              code:'ITA', confederation:'UEFA',     group:null, fifa_ranking:11,  elo:1800 },
  { name:'Poland',             code:'POL', confederation:'UEFA',     group:null, fifa_ranking:24,  elo:1660 },
  { name:'Serbia',             code:'SRB', confederation:'UEFA',     group:null, fifa_ranking:27,  elo:1630 },
  { name:'Ukraine',            code:'UKR', confederation:'UEFA',     group:null, fifa_ranking:22,  elo:1670 },
  { name:'Denmark',            code:'DEN', confederation:'UEFA',     group:null, fifa_ranking:21,  elo:1690 },
  { name:'Wales',              code:'WAL', confederation:'UEFA',     group:null, fifa_ranking:31,  elo:1610 },
  { name:'Romania',            code:'ROU', confederation:'UEFA',     group:null, fifa_ranking:46,  elo:1520 },
  { name:'Greece',             code:'GRE', confederation:'UEFA',     group:null, fifa_ranking:50,  elo:1510 },
  { name:'Hungary',            code:'HUN', confederation:'UEFA',     group:null, fifa_ranking:44,  elo:1530 },
  { name:'Slovakia',           code:'SVK', confederation:'UEFA',     group:null, fifa_ranking:48,  elo:1515 },
  { name:'Slovenia',           code:'SVN', confederation:'UEFA',     group:null, fifa_ranking:57,  elo:1485 },
  { name:'Finland',            code:'FIN', confederation:'UEFA',     group:null, fifa_ranking:58,  elo:1480 },
  { name:'Iceland',            code:'ISL', confederation:'UEFA',     group:null, fifa_ranking:72,  elo:1450 },
  { name:'Albania',            code:'ALB', confederation:'UEFA',     group:null, fifa_ranking:66,  elo:1470 },
  { name:'North Macedonia',    code:'MKD', confederation:'UEFA',     group:null, fifa_ranking:67,  elo:1465 },
  { name:'Montenegro',         code:'MNE', confederation:'UEFA',     group:null, fifa_ranking:70,  elo:1455 },
  { name:'Georgia',            code:'GEO', confederation:'UEFA',     group:null, fifa_ranking:74,  elo:1445 },
  { name:'Nigeria',            code:'NGA', confederation:'CAF',      group:null, fifa_ranking:35,  elo:1590 },
  { name:'Cameroon',           code:'CMR', confederation:'CAF',      group:null, fifa_ranking:34,  elo:1580 },
  { name:'Chile',              code:'CHI', confederation:'CONMEBOL', group:null, fifa_ranking:34,  elo:1580 },
  { name:'Peru',               code:'PER', confederation:'CONMEBOL', group:null, fifa_ranking:39,  elo:1555 },
  { name:'Venezuela',          code:'VEN', confederation:'CONMEBOL', group:null, fifa_ranking:55,  elo:1490 },
  { name:'Bolivia',            code:'BOL', confederation:'CONMEBOL', group:null, fifa_ranking:83,  elo:1380 },
  { name:'Costa Rica',         code:'CRC', confederation:'CONCACAF', group:null, fifa_ranking:49,  elo:1510 },
  { name:'Jamaica',            code:'JAM', confederation:'CONCACAF', group:null, fifa_ranking:47,  elo:1500 },
  { name:'UAE',                code:'UAE', confederation:'AFC',      group:null, fifa_ranking:68,  elo:1420 },
  { name:'China',              code:'CHN', confederation:'AFC',      group:null, fifa_ranking:88,  elo:1360 },
];

const ALL_TEAMS = [...TEAMS, ...EXTRA_TEAMS];

function normName(s) {
  return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
}

function findTeam(name) {
  if (!name) return null;
  const n = normName(name);
  const direct = ALL_TEAMS.find(t => normName(t.name) === n || normName(t.code) === n);
  if (direct) return direct;
  const alias = NAME_ALIASES[n];
  if (alias) {
    const found = ALL_TEAMS.find(t => t.name === alias);
    if (found) return found;
  }
  const partial = ALL_TEAMS.find(t => n.includes(normName(t.name)) || normName(t.name).includes(n));
  if (partial) return partial;
  // Fallback : équipe inconnue avec ELO moyen
  return { name: name.trim(), code: name.slice(0,3).toUpperCase(), confederation:'Unknown', group:null, fifa_ranking:100, elo:1500 };
}

export default async function handler(req, res) {
  // Parse route from req.url — all routes are flat single-segment paths
  const urlPath = req.url ? req.url.split('?')[0] : '';
  const parts = urlPath.split('/').filter(Boolean);
  const apiIdx = parts.indexOf('api');
  const route = apiIdx >= 0 ? (parts[apiIdx + 1] || '') : '';
  const method = req.method;
  const q = req.query || {};

  // Pas de cache pour les endpoints temps-réel
  if (route === 'visitors' || route === 'visit') {
    res.setHeader('Cache-Control', 'no-store');
  } else {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
  }

  // GET /api/teams — list all teams (optional ?confederation= or ?group=)
  if (route === 'teams') {
    let teams = TEAMS.map((t, i) => ({ id:i+1, name:t.name, code:t.code, confederation:t.confederation, fifa_ranking:t.fifa_ranking, elo_rating:t.elo, group:t.group, qualified:true, form_points:0, goals_scored_avg:1.4, goals_conceded_avg:1.0, quali_points:0, quali_goal_diff:0 }));
    if (q.confederation) teams = teams.filter(t => t.confederation === q.confederation);
    if (q.group) teams = teams.filter(t => t.group === q.group);
    return res.json(teams.sort((a,b) => a.fifa_ranking - b.fifa_ranking));
  }

  // GET /api/team?name=Brazil — specific team
  if (route === 'team') {
    const team = getTeam(q.name);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    return res.json({ ...team, id:TEAMS.indexOf(team)+1, qualified:true, form_points:0, goals_scored_avg:1.4, goals_conceded_avg:1.0, quali_points:0, quali_goal_diff:0, stats:{matches:0,wins:0,draws:0,losses:0,goals_scored:0,goals_conceded:0,goal_difference:0}, qualification:{points:0,goal_diff:0,played:0} });
  }

  // GET /api/top-teams?n=10 — top N teams by ELO
  if (route === 'top-teams') {
    const n = parseInt(q.n) || 20;
    const top = [...TEAMS].sort((a,b) => a.fifa_ranking - b.fifa_ranking).slice(0, n).map((t,i) => ({ id:i+1, name:t.name, code:t.code, elo_rating:t.elo, fifa_ranking:t.fifa_ranking, confederation:t.confederation }));
    return res.json(top);
  }

  // GET /api/confederations — confederation summary
  if (route === 'confederations') {
    const summary = {};
    for (const t of TEAMS) {
      if (!summary[t.confederation]) summary[t.confederation] = { confederation:t.confederation, team_count:0, teams:[] };
      summary[t.confederation].team_count++;
      summary[t.confederation].teams.push(t.name);
    }
    for (const c of Object.values(summary)) {
      c.avg_ranking = +(TEAMS.filter(t => t.confederation===c.confederation).reduce((s,t) => s+t.fifa_ranking,0)/c.team_count).toFixed(1);
    }
    return res.json(Object.values(summary));
  }

  // GET /api/h2h?team1=Brazil&team2=Argentina
  if (route === 'h2h') {
    const t1 = getTeam(q.team1), t2 = getTeam(q.team2);
    if (!t1 || !t2) return res.status(404).json({ error: 'Team not found' });
    const diff = t1.elo - t2.elo;
    const t1w = Math.max(0, Math.round(10+diff/80)), t2w = Math.max(0, Math.round(10-diff/80));
    const draws = Math.max(2, 20-t1w-t2w);
    return res.json({ team1:t1.name, team2:t2.name, total_matches:t1w+t2w+draws, team1_wins:t1w, team2_wins:t2w, draws, team1_goals:Math.round(t1w*2.1+draws*1.1), team2_goals:Math.round(t2w*2.1+draws*1.1) });
  }

  // GET /api/standings — group standings (live from FIFA API)
  if (route === 'standings') {
    const groups = {};
    const byName = {};
    for (const t of TEAMS) {
      if (!groups[t.group]) groups[t.group] = [];
      const s = { name:t.name, code:t.code, played:0, wins:0, draws:0, losses:0, goals_for:0, goals_against:0, goal_difference:0, points:0 };
      groups[t.group].push(s);
      byName[t.name] = s;
    }
    try {
      const matches = await fetchFifaMatches();
      for (const m of matches) {
        if (m.status !== 'finished' || m.home_score == null || m.away_score == null || !m.group) continue;
        const ht = findTeam(m.home_team), at = findTeam(m.away_team);
        if (!ht || !at) continue;
        const h = byName[ht.name], a = byName[at.name];
        if (!h || !a) continue;
        h.played++; a.played++;
        h.goals_for += m.home_score; h.goals_against += m.away_score;
        a.goals_for += m.away_score; a.goals_against += m.home_score;
        h.goal_difference = h.goals_for - h.goals_against;
        a.goal_difference = a.goals_for - a.goals_against;
        if (m.home_score > m.away_score) { h.wins++; h.points += 3; a.losses++; }
        else if (m.away_score > m.home_score) { a.wins++; a.points += 3; h.losses++; }
        else { h.draws++; a.draws++; h.points++; a.points++; }
      }
    } catch { /* fall back to zeros if FIFA API unavailable */ }
    for (const teams of Object.values(groups))
      teams.sort((a,b) => b.points-a.points || b.goal_difference-a.goal_difference || b.goals_for-a.goals_for);
    return res.json(Object.entries(groups).sort(([a],[b]) => a.localeCompare(b)).map(([group, teams]) => ({ group, teams })));
  }

  // GET /api/upcoming?n=6 — upcoming matches from FIFA
  if (route === 'upcoming') {
    const n = parseInt(q.n) || 10;
    try {
      const r = await fetch('https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=200&language=en-GB', { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } });
      const data = await r.json();
      const desc = lst => Array.isArray(lst) && lst[0] ? lst[0].Description||'' : '';
      const upcoming = (data.Results||[]).filter(m => m.Home?.Score == null).slice(0, n).map(m => ({ id:m.IdMatch, home_team:desc(m.Home?.TeamName), away_team:desc(m.Away?.TeamName), date:m.Date, stage:desc(m.StageName), venue:null, city:null, played:false, home_score:null, away_score:null }));
      return res.json(upcoming);
    } catch { return res.json([]); }
  }

  // GET /api/group-matches?group=A
  if (route === 'group-matches') {
    const group = (q.group || '').toUpperCase();
    try {
      const matches = await fetchFifaMatches();
      const live = matches.filter(m => m.group && normName(m.group).includes(`group${group.toLowerCase()}`));
      if (live.length > 0)
        return res.json(live.map(m => ({ id:m.id, home_team:m.home_team, away_team:m.away_team, date:m.date, played:m.status==='finished', home_score:m.home_score, away_score:m.away_score, stage:m.stage })));
    } catch { /* fallback */ }
    const groupTeams = TEAMS.filter(t => t.group === group);
    const matches = [];
    for (let i = 0; i < groupTeams.length; i++)
      for (let j = i+1; j < groupTeams.length; j++)
        matches.push({ home_team:groupTeams[i].name, away_team:groupTeams[j].name, stage:`Group ${group}`, played:false, home_score:null, away_score:null });
    return res.json(matches);
  }

  // GET /api/bracket — knockout bracket from FIFA API
  if (route === 'bracket') {
    const STAGE_TO_KEY = {
      'round of 32':'Round of 32','16e de finale':'Round of 32','16es de finale':'Round of 32','seizièmes de finale':'Round of 32',
      'round of 16':'Round of 16','8e de finale':'Round of 16','8es de finale':'Round of 16','huitième de finale':'Round of 16','huitieme':'Round of 16',
      'quarter-final':'Quarter-final','quart de finale':'Quarter-final','quarts de finale':'Quarter-final',
      'semi-final':'Semi-final','demi-finale':'Semi-final','demi-finales':'Semi-final',
      'third place':'Third Place','match pour la 3e place':'Third Place',
      'final':'Final','finale':'Final',
    };
    const bracket = {'Round of 32':[],'Round of 16':[],'Quarter-final':[],'Semi-final':[],'Third Place':[],'Final':[]};
    try {
      const r = await fetch('https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=200&language=fr-FR', { headers:{'User-Agent':'Mozilla/5.0',Accept:'application/json'} });
      const data = await r.json();
      const desc = lst => Array.isArray(lst) && lst[0] ? lst[0].Description||'' : '';
      const score = t => (t && t.Score != null ? Number(t.Score) : null);
      let id = 0;
      for (const m of (data.Results||[])) {
        const stageName = desc(m.StageName).toLowerCase();
        const key = Object.entries(STAGE_TO_KEY).find(([k]) => stageName.includes(k))?.[1];
        if (!key) continue;
        const homeName = desc(m.Home&&m.Home.TeamName)||(m.Home&&m.Home.Name)||'';
        const awayName = desc(m.Away&&m.Away.TeamName)||(m.Away&&m.Away.Name)||'';
        const getCode = n => { const t = findTeam(n); return t ? t.code : null; };
        bracket[key].push({ id:id++, home_team:homeName||'TBD', home_team_code:getCode(homeName), away_team:awayName||'TBD', away_team_code:getCode(awayName), date:m.Date||null, played:m.MatchStatus===4||m.MatchStatus===99, home_score:score(m.Home), away_score:score(m.Away) });
      }
      for (const key of Object.keys(bracket)) bracket[key].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    } catch { /* return empty bracket if FIFA API unavailable */ }
    res.setHeader('Cache-Control','s-maxage=120,stale-while-revalidate=60');
    return res.json(bracket);
  }

  // POST /api/predict — match prediction
  if (route === 'predict' && method === 'POST') {
    const { home_team, away_team, is_knockout } = req.body || {};
    const home = findTeam(home_team), away = findTeam(away_team);
    if (!home || !away) return res.status(404).json({ error: 'Team not found: ' + (!home ? home_team : away_team) });
    return res.json({ ...predictMatch(home.elo, away.elo, is_knockout||false), home_team:home.name, away_team:away.name });
  }

  // POST /api/simulate?n=2000 — simulation Monte Carlo multi-modèles
  if (route === 'simulate' && method === 'POST') {
    const N = Math.min(parseInt(q.n) || 2000, 2000);

    // Monte Carlo : suivi par tour pour chaque équipe
    // reached[team][i] = nb de simulations où l'équipe a atteint le tour i (cumulatif)
    // Tours : 0=groupes, 1=32e, 2=16e, 3=QF, 4=SF, 5=Finale, 6=Champion
    const reachCounts = {};
    const winCounts   = {};

    for (let sim = 0; sim < N; sim++) {
      const { winner, reached } = simulateOnce();
      winCounts[winner] = (winCounts[winner] || 0) + 1;
      for (const [team, idx] of Object.entries(reached)) {
        if (!reachCounts[team]) reachCounts[team] = [0, 0, 0, 0, 0, 0, 0];
        for (let r = 0; r <= idx; r++) reachCounts[team][r]++;
      }
    }

    // Probabilités analytiques exactes (groupes)
    const analyticalGroups = {};
    const groupMap = {};
    for (const t of TEAMS) {
      if (!groupMap[t.group]) groupMap[t.group] = [];
      groupMap[t.group].push(t);
    }
    for (const [g, teams] of Object.entries(groupMap)) {
      analyticalGroups[g] = computeGroupProbs(teams);
    }

    const sorted = Object.entries(winCounts)
      .map(([k, v]) => [k, +(v / N).toFixed(4)])
      .sort((a, b) => b[1] - a[1]);

    const win_probabilities = Object.fromEntries(sorted);

    const round_probabilities = {};
    for (const [team, counts] of Object.entries(reachCounts)) {
      round_probabilities[team] = {
        qualify:  +(counts[1] / N).toFixed(4),
        r16:      +(counts[2] / N).toFixed(4),
        qf:       +(counts[3] / N).toFixed(4),
        sf:       +(counts[4] / N).toFixed(4),
        final:    +(counts[5] / N).toFixed(4),
        champion: +(counts[6] / N).toFixed(4),
      };
    }

    return res.json({
      winner:          sorted[0]?.[0] || '',
      runner_up:       sorted[1]?.[0] || '',
      semi_finalists:  sorted.slice(0, 4).map(e => e[0]),
      simulations_run: N,
      model:           'Ensemble (ELO + Poisson)',
      win_probabilities,
      round_probabilities,
      analytical_groups: analyticalGroups,
    });
  }

  // GET /api/accuracy
  if (route === 'accuracy') {
    return res.json({ accuracy:null, total_predictions:0, correct_predictions:0 });
  }

  // GET /api/rankings — FIFA World Rankings
  if (route === 'rankings') {
    const data = await fetchFifaRankings();
    if (!data) return res.status(503).json({ error: 'Rankings unavailable' });
    const wcCodes = new Set(TEAMS.map(t => t.code));
    const wcNames = new Set(TEAMS.map(t => normName(t.name)));
    const enriched = data.rankings.map(r => ({
      ...r,
      qualified: wcCodes.has((r.countryCode||'').toUpperCase()) || wcNames.has(normName(r.name||'')),
    }));
    return res.json({ date: data.date, dateId: data.dateId, source: data.source, isStatic: data.isStatic, count: enriched.length, rankings: enriched });
  }

  // GET /api/fixtures — FIFA live fixtures
  if (route === 'fixtures') {
    try {
      const fixtures = await fetchFifaFixtures();
      return res.json({ count:fixtures.length, fixtures });
    } catch(e) { return res.status(500).json({ error:String(e) }); }
  }

  // POST /api/admin — admin refresh (live FIFA data)
  if (route === 'admin') {
    try {
      const [matches, rankingsData] = await Promise.all([fetchFifaMatches(), fetchFifaRankings()]);
      const played = matches.filter(m => m.status === 'finished').length;
      const upcoming = matches.filter(m => m.status === 'scheduled').length;
      const live = matches.filter(m => m.status === 'live').length;
      const rankings_date = rankingsData?.date ? new Date(rankingsData.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : null;
      return res.json({ status:'success', source:'fifa-api', matches_added:matches.length, matches_removed:0, teams_updated:TEAMS.length, played, upcoming, live, rankings_date, last_updated:new Date().toISOString() });
    } catch(e) {
      return res.status(500).json({ status:'error', message:String(e) });
    }
  }

  // POST /api/visit — enregistre ou rafraîchit une visite
  if (route === 'visit' && method === 'POST') {
    const r = getRedis();
    const now = Date.now();
    const body = req.body || {};
    // visit_id stable par session ; is_new=false pour les heartbeats (pas d'incr du total)
    const visitId = body.visit_id || (now + ':' + Math.random().toString(36).slice(2));
    const isNew = body.is_new !== false;
    const fiveMinAgo = now - 5 * 60 * 1000;
    let total = 0;
    if (r) {
      const pipe = r.pipeline();
      if (isNew) pipe.incr('wc:total');
      pipe.zadd('wc:recent', now, visitId); // met à jour le score si l'ID existe déjà
      pipe.zremrangebyscore('wc:recent', 0, fiveMinAgo);
      const results = await pipe.exec();
      if (isNew) {
        total = results[0][1] || 0;
      } else {
        const t = await r.get('wc:total');
        total = parseInt(t) || 0;
      }
    }
    return res.json({ status: 'ok', total_visits: total, visit_id: visitId });
  }

  if (route === 'visitors') {
    const r = getRedis();
    if (r) {
      const now = Date.now();
      const threeMinAgo = now - 3 * 60 * 1000;
      const [total, active] = await Promise.all([r.get('wc:total'), r.zcount('wc:recent', threeMinAgo, '+inf')]);
      return res.json({ total_visits: parseInt(total) || 0, active_now: active || 0 });
    }
    return res.json({ total_visits: 0, active_now: 0 });
  }

  return res.status(404).json({ error:`Route not found: /api/${route}`, url:req.url });
}
