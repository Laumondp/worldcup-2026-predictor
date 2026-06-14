import { TEAMS, predictMatch } from './_data.js';

const FIFA_URL =
  'https://api.fifa.com/api/v3/calendar/matches' +
  '?idCompetition=17&idSeason=285023&count=200&language=fr-FR';

// ── Noms FIFA (fr) → noms anglais utilisés dans TEAMS ────────────────────────
const FR_TO_EN = {
  'mexique':'Mexico','afrique du sud':'South Africa','coree du sud':'South Korea',
  'tcheque':'Czechia','tchequia':'Czechia','republique tcheque':'Czechia',
  'canada':'Canada','bosnie-herzegovine':'Bosnia-Herzegovina','bosnie':'Bosnia-Herzegovina',
  'qatar':'Qatar','suisse':'Switzerland',
  'bresil':'Brazil','maroc':'Morocco','haiti':'Haiti','ecosse':'Scotland',
  'etats-unis':'USA','etats unis':'USA','usa':'USA',
  'australie':'Australia','turquie':'Turkey','turkiye':'Turkey',
  'paraguay':'Paraguay','allemagne':'Germany',
  "cote d'ivoire":'Ivory Coast','cote divoire':'Ivory Coast',
  'equateur':'Ecuador','curacao':'Curaçao',
  'pays-bas':'Netherlands','pays bas':'Netherlands','japon':'Japan',
  'suede':'Sweden','tunisie':'Tunisia','belgique':'Belgium',
  'egypte':'Egypt','iran':'Iran','nouvelle-zelande':'New Zealand','nouvelle zelande':'New Zealand',
  'espagne':'Spain','cap-vert':'Cape Verde','cap vert':'Cape Verde',
  'arabie saoudite':'Saudi Arabia','arabie saoudite':'Saudi Arabia',
  'uruguay':'Uruguay','france':'France','senegal':'Senegal',
  'irak':'Iraq','norvege':'Norway','argentine':'Argentina',
  'algerie':'Algeria','autriche':'Austria','jordanie':'Jordan',
  'portugal':'Portugal','rd congo':'DR Congo','congo rd':'DR Congo',
  'republique democratique du congo':'DR Congo',
  'ouzbekistan':'Uzbekistan','colombie':'Colombia',
  'angleterre':'England','croatie':'Croatia','ghana':'Ghana','panama':'Panama',
  'coree du sud':'South Korea','republique de coree':'South Korea',
};

function normFR(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function frToEn(frName) { return FR_TO_EN[normFR(frName)] || null; }

// ── 72 matchs de phase de groupes (noms anglais = TEAMS) ─────────────────────
const GROUP_MATCHES = [
  // A
  {g:'A',h:'Mexico',a:'South Africa'}, {g:'A',h:'South Korea',a:'Czechia'},
  {g:'A',h:'Czechia',a:'South Africa'}, {g:'A',h:'Mexico',a:'South Korea'},
  {g:'A',h:'Czechia',a:'Mexico'}, {g:'A',h:'South Africa',a:'South Korea'},
  // B
  {g:'B',h:'Canada',a:'Bosnia-Herzegovina'}, {g:'B',h:'Qatar',a:'Switzerland'},
  {g:'B',h:'Switzerland',a:'Bosnia-Herzegovina'}, {g:'B',h:'Canada',a:'Qatar'},
  {g:'B',h:'Switzerland',a:'Canada'}, {g:'B',h:'Bosnia-Herzegovina',a:'Qatar'},
  // C
  {g:'C',h:'Brazil',a:'Morocco'}, {g:'C',h:'Haiti',a:'Scotland'},
  {g:'C',h:'Scotland',a:'Morocco'}, {g:'C',h:'Brazil',a:'Haiti'},
  {g:'C',h:'Scotland',a:'Brazil'}, {g:'C',h:'Morocco',a:'Haiti'},
  // D
  {g:'D',h:'USA',a:'Paraguay'}, {g:'D',h:'Australia',a:'Turkey'},
  {g:'D',h:'USA',a:'Australia'}, {g:'D',h:'Turkey',a:'Paraguay'},
  {g:'D',h:'Turkey',a:'USA'}, {g:'D',h:'Paraguay',a:'Australia'},
  // E
  {g:'E',h:'Germany',a:'Curaçao'}, {g:'E',h:'Ivory Coast',a:'Ecuador'},
  {g:'E',h:'Germany',a:'Ivory Coast'}, {g:'E',h:'Ecuador',a:'Curaçao'},
  {g:'E',h:'Curaçao',a:'Ivory Coast'}, {g:'E',h:'Ecuador',a:'Germany'},
  // F
  {g:'F',h:'Netherlands',a:'Japan'}, {g:'F',h:'Sweden',a:'Tunisia'},
  {g:'F',h:'Netherlands',a:'Sweden'}, {g:'F',h:'Tunisia',a:'Japan'},
  {g:'F',h:'Japan',a:'Sweden'}, {g:'F',h:'Tunisia',a:'Netherlands'},
  // G
  {g:'G',h:'Belgium',a:'Egypt'}, {g:'G',h:'Iran',a:'New Zealand'},
  {g:'G',h:'Belgium',a:'Iran'}, {g:'G',h:'New Zealand',a:'Egypt'},
  {g:'G',h:'Egypt',a:'Iran'}, {g:'G',h:'New Zealand',a:'Belgium'},
  // H
  {g:'H',h:'Spain',a:'Cape Verde'}, {g:'H',h:'Saudi Arabia',a:'Uruguay'},
  {g:'H',h:'Spain',a:'Saudi Arabia'}, {g:'H',h:'Uruguay',a:'Cape Verde'},
  {g:'H',h:'Cape Verde',a:'Saudi Arabia'}, {g:'H',h:'Uruguay',a:'Spain'},
  // I
  {g:'I',h:'France',a:'Senegal'}, {g:'I',h:'Iraq',a:'Norway'},
  {g:'I',h:'France',a:'Iraq'}, {g:'I',h:'Norway',a:'Senegal'},
  {g:'I',h:'Norway',a:'France'}, {g:'I',h:'Senegal',a:'Iraq'},
  // J
  {g:'J',h:'Argentina',a:'Algeria'}, {g:'J',h:'Austria',a:'Jordan'},
  {g:'J',h:'Argentina',a:'Austria'}, {g:'J',h:'Jordan',a:'Algeria'},
  {g:'J',h:'Algeria',a:'Austria'}, {g:'J',h:'Jordan',a:'Argentina'},
  // K
  {g:'K',h:'Portugal',a:'DR Congo'}, {g:'K',h:'Uzbekistan',a:'Colombia'},
  {g:'K',h:'Portugal',a:'Uzbekistan'}, {g:'K',h:'Colombia',a:'DR Congo'},
  {g:'K',h:'Colombia',a:'Portugal'}, {g:'K',h:'DR Congo',a:'Uzbekistan'},
  // L
  {g:'L',h:'England',a:'Croatia'}, {g:'L',h:'Ghana',a:'Panama'},
  {g:'L',h:'England',a:'Ghana'}, {g:'L',h:'Panama',a:'Croatia'},
  {g:'L',h:'Panama',a:'England'}, {g:'L',h:'Croatia',a:'Ghana'},
];

// ── Fetch vrais résultats CM2026 depuis FIFA ──────────────────────────────────
async function fetchPlayedMatches() {
  try {
    const r = await fetch(FIFA_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    const data = await r.json();
    const results = data.Results || [];
    const played = {};

    for (const m of results) {
      // Seulement matchs de poule terminés
      const stage = (m.StageName?.[0]?.Description || '').toLowerCase();
      if (!stage.includes('group') && !stage.includes('groupe')) continue;
      if (m.MatchStatus !== 4 && m.MatchStatus !== 99) continue;

      const homeRaw = m.Home?.TeamName?.[0]?.Description || m.Home?.Name || '';
      const awayRaw = m.Away?.TeamName?.[0]?.Description || m.Away?.Name || '';
      const homeEn = frToEn(homeRaw);
      const awayEn = frToEn(awayRaw);
      const hs = m.Home?.Score ?? null;
      const as = m.Away?.Score ?? null;

      if (homeEn && awayEn && hs !== null && as !== null) {
        played[homeEn + '|' + awayEn] = { h: Number(hs), a: Number(as) };
      }
    }
    return played;
  } catch { return {}; }
}

// ── Simulation d'un tournoi ───────────────────────────────────────────────────
function simulateOnce(playedMatches) {
  // Initialise les groupes
  const groups = {};
  for (const t of TEAMS) {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push({ ...t, pts: 0, gd: 0, gf: 0 });
  }

  // Phase de groupes : vrais résultats ou simulation
  for (const m of GROUP_MATCHES) {
    const groupTeams = groups[m.g];
    const home = groupTeams.find(t => t.name === m.h);
    const away = groupTeams.find(t => t.name === m.a);
    if (!home || !away) continue;

    const actual = playedMatches[m.h + '|' + m.a];
    let hs, as;

    if (actual !== undefined) {
      hs = actual.h; as = actual.a;
    } else {
      // Simule
      const p = predictMatch(home.elo, away.elo);
      const r = Math.random();
      if (r < p.home_win_probability)                              { hs = 1; as = 0; }
      else if (r < p.home_win_probability + p.draw_probability)    { hs = 0; as = 0; }
      else                                                          { hs = 0; as = 1; }
    }

    const diff = hs - as;
    if (diff > 0)      { home.pts += 3; }
    else if (diff < 0) { away.pts += 3; }
    else               { home.pts += 1; away.pts += 1; }
    home.gd += diff; away.gd -= diff;
    home.gf += hs;   away.gf += as;
  }

  // Classement de chaque groupe
  const thirds = [];
  let qualified = [];
  for (const teams of Object.values(groups)) {
    teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    qualified.push(teams[0], teams[1]);
    thirds.push(teams[2]);
  }

  // 8 meilleurs 3es
  thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  qualified = [...qualified, ...thirds.slice(0, 8)];

  const qualSet = new Set(qualified.map(t => t.name));

  // Phases éliminatoires — suivi par tour
  const reached = {};
  for (const t of TEAMS) reached[t.name] = { qualify: 0, r16: 0, qf: 0, sf: 0, final: 0, champion: 0 };
  for (const t of qualified) reached[t.name].qualify = 1;

  const roundKeys = ['r16', 'qf', 'sf', 'final', 'champion'];
  let remaining = [...qualified];

  for (let ri = 0; remaining.length > 1; ri++) {
    const next = [];
    for (let i = 0; i < remaining.length; i += 2) {
      const a = remaining[i], b = remaining[i + 1] || remaining[i];
      const p = predictMatch(a.elo, b.elo, true);
      const sum = p.home_win_probability + p.away_win_probability;
      const winner = Math.random() < (sum > 0 ? p.home_win_probability / sum : 0.5) ? a : b;
      next.push(winner);
    }
    const key = roundKeys[ri] || 'champion';
    for (const t of next) reached[t.name][key] = 1;
    remaining = next;
  }

  return { winner: remaining[0]?.name || '', reached, qualSet };
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');

  const n = Math.min(parseInt(req.query.n) || 500, 500);
  const playedMatches = await fetchPlayedMatches();

  const wins = {};
  const counts = {};
  for (const t of TEAMS) {
    wins[t.name] = 0;
    counts[t.name] = { qualify: 0, r16: 0, qf: 0, sf: 0, final: 0, champion: 0 };
  }

  for (let i = 0; i < n; i++) {
    const { winner, reached } = simulateOnce(playedMatches);
    wins[winner] = (wins[winner] || 0) + 1;
    for (const [name, rc] of Object.entries(reached)) {
      if (!counts[name]) continue;
      for (const k of Object.keys(rc)) counts[name][k] += rc[k];
    }
  }

  // Probabilités de victoire finale
  const probabilities = {};
  for (const [k, v] of Object.entries(wins)) probabilities[k] = +(v / n).toFixed(4);
  const sorted = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

  // Probabilités par tour
  const round_probabilities = {};
  for (const [name, rc] of Object.entries(counts)) {
    round_probabilities[name] = {
      qualify:  +(rc.qualify  / n).toFixed(4),
      r16:      +(rc.r16      / n).toFixed(4),
      qf:       +(rc.qf       / n).toFixed(4),
      sf:       +(rc.sf       / n).toFixed(4),
      final:    +(rc.final    / n).toFixed(4),
      champion: +(rc.champion / n).toFixed(4),
    };
  }

  res.json({
    data: {
      winner:           sorted[0]?.[0] || '',
      runner_up:        sorted[1]?.[0] || '',
      semi_finalists:   sorted.slice(0, 4).map(e => e[0]),
      simulations_run:  n,
      win_probabilities: Object.fromEntries(sorted),
      round_probabilities,
      played_matches_count: Object.keys(playedMatches).length,
    }
  });
}
