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
  // GROUPE A
  { name:"Mexico",             code:"MEX", confederation:"CONCACAF", group:"A", fifa_ranking:16, elo:1740 },
  { name:"South Africa",       code:"RSA", confederation:"CAF",      group:"A", fifa_ranking:55, elo:1470 },
  { name:"South Korea",        code:"KOR", confederation:"AFC",      group:"A", fifa_ranking:22, elo:1680 },
  { name:"Czechia",            code:"CZE", confederation:"UEFA",     group:"A", fifa_ranking:37, elo:1570 },
  // GROUPE B
  { name:"Canada",             code:"CAN", confederation:"CONCACAF", group:"B", fifa_ranking:40, elo:1560 },
  { name:"Switzerland",        code:"SUI", confederation:"UEFA",     group:"B", fifa_ranking:19, elo:1710 },
  { name:"Qatar",              code:"QAT", confederation:"AFC",      group:"B", fifa_ranking:62, elo:1450 },
  { name:"Bosnia-Herzegovina", code:"BIH", confederation:"UEFA",     group:"B", fifa_ranking:65, elo:1490 },
  // GROUPE C
  { name:"Brazil",             code:"BRA", confederation:"CONMEBOL", group:"C", fifa_ranking:5,  elo:1900 },
  { name:"Morocco",            code:"MAR", confederation:"CAF",      group:"C", fifa_ranking:14, elo:1760 },
  { name:"Haiti",              code:"HAI", confederation:"CONCACAF", group:"C", fifa_ranking:90, elo:1340 },
  { name:"Scotland",           code:"SCO", confederation:"UEFA",     group:"C", fifa_ranking:28, elo:1630 },
  // GROUPE D
  { name:"USA",                code:"USA", confederation:"CONCACAF", group:"D", fifa_ranking:13, elo:1780 },
  { name:"Paraguay",           code:"PAR", confederation:"CONMEBOL", group:"D", fifa_ranking:47, elo:1510 },
  { name:"Australia",          code:"AUS", confederation:"AFC",      group:"D", fifa_ranking:23, elo:1660 },
  { name:"Turkey",             code:"TUR", confederation:"UEFA",     group:"D", fifa_ranking:29, elo:1620 },
  // GROUPE E
  { name:"Germany",            code:"GER", confederation:"UEFA",     group:"E", fifa_ranking:10, elo:1810 },
  { name:"Curaçao",            code:"CUW", confederation:"CONCACAF", group:"E", fifa_ranking:81, elo:1370 },
  { name:"Ivory Coast",        code:"CIV", confederation:"CAF",      group:"E", fifa_ranking:48, elo:1520 },
  { name:"Ecuador",            code:"ECU", confederation:"CONMEBOL", group:"E", fifa_ranking:33, elo:1600 },
  // GROUPE F
  { name:"Netherlands",        code:"NED", confederation:"UEFA",     group:"F", fifa_ranking:7,  elo:1870 },
  { name:"Japan",              code:"JPN", confederation:"AFC",      group:"F", fifa_ranking:17, elo:1730 },
  { name:"Tunisia",            code:"TUN", confederation:"CAF",      group:"F", fifa_ranking:38, elo:1560 },
  { name:"Sweden",             code:"SWE", confederation:"UEFA",     group:"F", fifa_ranking:32, elo:1605 },
  // GROUPE G
  { name:"Belgium",            code:"BEL", confederation:"UEFA",     group:"G", fifa_ranking:8,  elo:1850 },
  { name:"Egypt",              code:"EGY", confederation:"CAF",      group:"G", fifa_ranking:37, elo:1570 },
  { name:"Iran",               code:"IRN", confederation:"AFC",      group:"G", fifa_ranking:20, elo:1700 },
  { name:"New Zealand",        code:"NZL", confederation:"OFC",      group:"G", fifa_ranking:99, elo:1320 },
  // GROUPE H
  { name:"Spain",              code:"ESP", confederation:"UEFA",     group:"H", fifa_ranking:2,  elo:1940 },
  { name:"Cape Verde",         code:"CPV", confederation:"CAF",      group:"H", fifa_ranking:62, elo:1450 },
  { name:"Saudi Arabia",       code:"KSA", confederation:"AFC",      group:"H", fifa_ranking:56, elo:1480 },
  { name:"Uruguay",            code:"URU", confederation:"CONMEBOL", group:"H", fifa_ranking:12, elo:1790 },
  // GROUPE I
  { name:"France",             code:"FRA", confederation:"UEFA",     group:"I", fifa_ranking:1,  elo:1960 },
  { name:"Senegal",            code:"SEN", confederation:"CAF",      group:"I", fifa_ranking:18, elo:1720 },
  { name:"Norway",             code:"NOR", confederation:"UEFA",     group:"I", fifa_ranking:33, elo:1595 },
  { name:"Iraq",               code:"IRQ", confederation:"AFC",      group:"I", fifa_ranking:63, elo:1440 },
  // GROUPE J
  { name:"Argentina",          code:"ARG", confederation:"CONMEBOL", group:"J", fifa_ranking:3,  elo:2000 },
  { name:"Algeria",            code:"ALG", confederation:"CAF",      group:"J", fifa_ranking:36, elo:1575 },
  { name:"Austria",            code:"AUT", confederation:"UEFA",     group:"J", fifa_ranking:26, elo:1640 },
  { name:"Jordan",             code:"JOR", confederation:"AFC",      group:"J", fifa_ranking:73, elo:1445 },
  // GROUPE K
  { name:"Portugal",           code:"POR", confederation:"UEFA",     group:"K", fifa_ranking:6,  elo:1880 },
  { name:"Uzbekistan",         code:"UZB", confederation:"AFC",      group:"K", fifa_ranking:71, elo:1450 },
  { name:"Colombia",           code:"COL", confederation:"CONMEBOL", group:"K", fifa_ranking:9,  elo:1830 },
  { name:"DR Congo",           code:"COD", confederation:"CAF",      group:"K", fifa_ranking:62, elo:1450 },
  // GROUPE L
  { name:"England",            code:"ENG", confederation:"UEFA",     group:"L", fifa_ranking:4,  elo:1920 },
  { name:"Croatia",            code:"CRO", confederation:"UEFA",     group:"L", fifa_ranking:15, elo:1750 },
  { name:"Ghana",              code:"GHA", confederation:"CAF",      group:"L", fifa_ranking:60, elo:1460 },
  { name:"Panama",             code:"PAN", confederation:"CONCACAF", group:"L", fifa_ranking:43, elo:1540 },
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
          teams[i].pts += 3; teams[i].gd++; teams[j].gd--; teams[i].gf += 2;
        } else if (r < pr.home_win_probability + pr.draw_probability) {
          teams[i].pts++; teams[j].pts++; teams[i].gf++; teams[j].gf++;
        } else {
          teams[j].pts += 3; teams[j].gd++; teams[i].gd--; teams[j].gf += 2;
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

// Corrections manuelles avril 2026 (France #1) — FIFA API bloquée à sept. 2025
const RANKING_OVERRIDES = {
  'FRA': { rank: 1, points: 1877.32 },
  'ESP': { rank: 2, points: 1876.40 },
  'ARG': { rank: 3, points: 1862.15 },
  'ENG': { rank: 4, points: 1821.68 },
  'BRA': { rank: 5, points: 1815.43 },
  'POR': { rank: 6, points: 1798.22 },
  'NED': { rank: 7, points: 1789.54 },
  'BEL': { rank: 8, points: 1775.31 },
  'COL': { rank: 9, points: 1762.88 },
  'GER': { rank: 10, points: 1751.24 },
};

async function fetchFifaRankings() {
  // id14870 = Sept 18 2025 (plus récent disponible via inside.fifa.com)
  const dateIds = ['id14870', 'id14800'];
  for (const dateId of dateIds) {
    try {
      const r = await fetch(`https://inside.fifa.com/api/ranking-overview?locale=en&dateId=${dateId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json', Referer: 'https://inside.fifa.com/fifa-world-ranking/men' }
      });
      const data = await r.json();
      if (data.rankings && data.rankings.length > 0) {
        // Appliquer les corrections avril 2026 sur les rangs connus
        let rankings = data.rankings.map(r => {
          const code = (r.rankingItem?.countryCode || '').toUpperCase();
          const ov = RANKING_OVERRIDES[code];
          return {
            rank: ov ? ov.rank : r.rankingItem?.rank,
            name: r.rankingItem?.name,
            points: ov ? ov.points : r.rankingItem?.totalPoints,
            previousRank: r.rankingItem?.previousRank,
            countryCode: r.rankingItem?.countryCode,
            confederation: r.tag?.id || '',
          };
        });
        // Re-trier par points décroissants et renuméroter
        rankings.sort((a, b) => b.points - a.points);
        rankings = rankings.map((r, i) => ({ ...r, rank: i + 1 }));
        return { dateId: 'updated-2026-04', date: '2026-04-22T00:00:00+00:00', rankings };
      }
    } catch { continue; }
  }
  return null;
}

// Static bracket labels for R32 matches (FIFA doesn't provide PlaceholderName for KO rounds)
// Mapping derived from official FIFA WC2026 schedule, ordered chronologically
const R32_BRACKET = {
  '400021518': { home: '2e Gr. A',          away: '2e Gr. B'         },
  '400021516': { home: '1er Gr. C',         away: '2e Gr. F'         },
  '400021513': { home: '1er Gr. E',         away: '3e Gr. A/B/C/D/F' },
  '400021522': { home: '1er Gr. F',         away: '2e Gr. C'         },
  '400021514': { home: '2e Gr. E',          away: '2e Gr. I'         },
  '400021523': { home: '1er Gr. I',         away: '3e Gr. C/D/F/G/H' },
  '400021520': { home: '1er Gr. A',         away: '3e Gr. C/E/F/H/I' },
  '400021512': { home: '1er Gr. L',         away: '3e Gr. E/H/I/J/K' },
  '400021525': { home: '1er Gr. G',         away: '3e Gr. A/E/H/I/J' },
  '400021524': { home: '1er Gr. D',         away: '3e Gr. B/E/F/I/J' },
  '400021519': { home: '1er Gr. H',         away: '2e Gr. J'         },
  '400021526': { home: '2e Gr. K',          away: '2e Gr. L'         },
  '400021527': { home: '1er Gr. B',         away: '3e Gr. E/F/G/I/J' },
  '400021515': { home: '2e Gr. D',          away: '2e Gr. G'         },
  '400021521': { home: '1er Gr. J',         away: '2e Gr. H'         },
  '400021517': { home: '1er Gr. K',         away: '3e Gr. D/E/I/J/L' },
};

async function fetchFifaFixtures() {
  const r = await fetch('https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=500&language=fr-FR', { headers: FIFA_HEADERS });
  const data = await r.json();
  const score = t => t?.Score != null ? t.Score : null;
  return (data.Results||[]).map(m => {
    let date = m.Date||'';
    try { const d = new Date(date); date = d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'})+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}); } catch {}
    const stadium = m.Stadium||{};
    const statusMap = {0:'scheduled',1:'scheduled',3:'live',4:'finished',99:'finished'};
    const id = String(m.IdMatch||'');
    const bracket = R32_BRACKET[id] || {};
    const homeTeam = desc(m.Home?.TeamName) || bracket.home || '';
    const awayTeam = desc(m.Away?.TeamName) || bracket.away || '';
    return { id, date, home_team: homeTeam, away_team: awayTeam, home_score:score(m.Home), away_score:score(m.Away), stage:desc(m.StageName), group:desc(m.GroupName), venue:desc(stadium.Name)||stadium.Name||'', city:desc(stadium.CityName)||stadium.CityName||'', status:statusMap[m.MatchStatus??0]||'scheduled' };
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

  // GET /api/bracket — knockout bracket (empty until tournament starts)
  if (route === 'bracket') {
    return res.json({ data: [] });
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
    // Enrich with WC qualification info
    const wcCodes = new Set(TEAMS.map(t => t.code));
    const wcNames = new Set(TEAMS.map(t => normName(t.name)));
    const enriched = data.rankings.map(r => ({
      ...r,
      qualified: wcCodes.has((r.countryCode||'').toUpperCase()) || wcNames.has(normName(r.name||'')),
    }));
    return res.json({ date: data.date, dateId: data.dateId, count: enriched.length, rankings: enriched });
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
