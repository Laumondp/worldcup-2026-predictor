// Données statiques WC 2026 — groupes alignés sur le tirage officiel FIFA

// ── Matchs amicaux récents (pré-CM2026) ──────────────────────────────────────
// ELO recalculé après chaque résultat (K=30 fenêtre pré-CM)
export const RECENT_MATCHES = [
  // 22 mai 2026
  { date:"2026-05-22", home:"Mexico",      away:"Ghana",               home_score:2, away_score:0, tournament:"Friendly" },
  // 26 mai 2026
  { date:"2026-05-26", home:"Morocco",     away:"Burundi",             home_score:5, away_score:0, tournament:"Friendly" },
  // 28 mai 2026
  { date:"2026-05-28", home:"Republic of Ireland", away:"Qatar",       home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-05-28", home:"Egypt",       away:"Russia",              home_score:1, away_score:0, tournament:"Friendly" },
  // 29 mai 2026
  { date:"2026-05-29", home:"Andorra",     away:"Iraq",                home_score:0, away_score:1, tournament:"Friendly" },
  { date:"2026-05-29", home:"Iran",        away:"Gambia",              home_score:3, away_score:1, tournament:"Friendly" },
  // 30 mai 2026
  { date:"2026-05-30", home:"Ecuador",     away:"Saudi Arabia",        home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-05-30", home:"South Korea", away:"Trinidad and Tobago", home_score:5, away_score:0, tournament:"Friendly" },
  { date:"2026-05-30", home:"Mexico",      away:"Australia",           home_score:1, away_score:0, tournament:"Friendly" },
  // 31 mai 2026
  { date:"2026-05-31", home:"USA",         away:"Senegal",             home_score:3, away_score:2, tournament:"Friendly" },
  { date:"2026-05-31", home:"Brazil",      away:"Panama",              home_score:6, away_score:2, tournament:"Friendly" },
  { date:"2026-05-31", home:"Germany",     away:"Finland",             home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Japan",       away:"Iceland",             home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Cape Verde",  away:"Serbia",              home_score:3, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Switzerland", away:"Jordan",              home_score:4, away_score:1, tournament:"Friendly" },
  // 1er juin 2026
  { date:"2026-06-01", home:"Norway",      away:"Sweden",              home_score:3, away_score:1, tournament:"Friendly" },
  { date:"2026-06-01", home:"Turkey",      away:"North Macedonia",     home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-06-01", home:"Austria",     away:"Tunisia",             home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-06-01", home:"Colombia",    away:"Costa Rica",          home_score:3, away_score:1, tournament:"Friendly" },
  { date:"2026-06-01", home:"Canada",      away:"Uzbekistan",          home_score:2, away_score:0, tournament:"Friendly" },
];

export const RECENT_MATCHES_DATE = "2026-06-02";

// ── 48 équipes qualifiées — groupes officiels FIFA ────────────────────────────
// ELO = base avril 2026 + ajustements amicaux 22 mai–1er juin 2026 (K=30)
export const TEAMS = [
  // ── Groupe A : Mexique, Afrique du Sud, Corée du Sud, Tchéquie ────────────
  { name:"Mexico",             code:"MEX", confederation:"CONCACAF", group:"A", fifa_ranking:16, elo:1759 },
  { name:"South Africa",       code:"RSA", confederation:"CAF",      group:"A", fifa_ranking:68, elo:1460 },
  { name:"South Korea",        code:"KOR", confederation:"AFC",      group:"A", fifa_ranking:23, elo:1661 },
  { name:"Czechia",            code:"CZE", confederation:"UEFA",     group:"A", fifa_ranking:35, elo:1570 },

  // ── Groupe B : Canada, Bosnie-Herzégovine, Qatar, Suisse ──────────────────
  { name:"Canada",             code:"CAN", confederation:"CONCACAF", group:"B", fifa_ranking:40, elo:1578 },
  { name:"Bosnia-Herzegovina", code:"BIH", confederation:"UEFA",     group:"B", fifa_ranking:57, elo:1480 },
  { name:"Qatar",              code:"QAT", confederation:"AFC",      group:"B", fifa_ranking:37, elo:1514 },
  { name:"Switzerland",        code:"SUI", confederation:"UEFA",     group:"B", fifa_ranking:19, elo:1717 },

  // ── Groupe C : Brésil, Maroc, Haïti, Écosse ──────────────────────────────
  { name:"Brazil",             code:"BRA", confederation:"CONMEBOL", group:"C", fifa_ranking:5,  elo:1906 },
  { name:"Morocco",            code:"MAR", confederation:"CAF",      group:"C", fifa_ranking:14, elo:1765 },
  { name:"Haiti",              code:"HAI", confederation:"CONCACAF", group:"C", fifa_ranking:83, elo:1380 },
  { name:"Scotland",           code:"SCO", confederation:"UEFA",     group:"C", fifa_ranking:39, elo:1600 },

  // ── Groupe D : États-Unis, Paraguay, Australie, Turquie ──────────────────
  { name:"USA",                code:"USA", confederation:"CONCACAF", group:"D", fifa_ranking:13, elo:1793 },
  { name:"Paraguay",           code:"PAR", confederation:"CONMEBOL", group:"D", fifa_ranking:47, elo:1510 },
  { name:"Australia",          code:"AUS", confederation:"AFC",      group:"D", fifa_ranking:23, elo:1649 },
  { name:"Turkey",             code:"TUR", confederation:"UEFA",     group:"D", fifa_ranking:29, elo:1638 },

  // ── Groupe E : Allemagne, Curaçao, Côte d'Ivoire, Équateur ───────────────
  { name:"Germany",            code:"GER", confederation:"UEFA",     group:"E", fifa_ranking:11, elo:1808 },
  { name:"Curaçao",            code:"CUW", confederation:"CONCACAF", group:"E", fifa_ranking:80, elo:1380 },
  { name:"Ivory Coast",        code:"CIV", confederation:"CAF",      group:"E", fifa_ranking:48, elo:1520 },
  { name:"Ecuador",            code:"ECU", confederation:"CONMEBOL", group:"E", fifa_ranking:33, elo:1615 },

  // ── Groupe F : Pays-Bas, Japon, Suède, Tunisie ───────────────────────────
  { name:"Netherlands",        code:"NED", confederation:"UEFA",     group:"F", fifa_ranking:7,  elo:1870 },
  { name:"Japan",              code:"JPN", confederation:"AFC",      group:"F", fifa_ranking:17, elo:1736 },
  { name:"Sweden",             code:"SWE", confederation:"UEFA",     group:"F", fifa_ranking:27, elo:1608 },
  { name:"Tunisia",            code:"TUN", confederation:"CAF",      group:"F", fifa_ranking:38, elo:1548 },

  // ── Groupe G : Belgique, Égypte, Iran, Nouvelle-Zélande ──────────────────
  { name:"Belgium",            code:"BEL", confederation:"UEFA",     group:"G", fifa_ranking:8,  elo:1850 },
  { name:"Egypt",              code:"EGY", confederation:"CAF",      group:"G", fifa_ranking:37, elo:1586 },
  { name:"Iran",               code:"IRN", confederation:"AFC",      group:"G", fifa_ranking:20, elo:1707 },
  { name:"New Zealand",        code:"NZL", confederation:"OFC",      group:"G", fifa_ranking:99, elo:1320 },

  // ── Groupe H : Espagne, Cap-Vert, Arabie saoudite, Uruguay ───────────────
  { name:"Spain",              code:"ESP", confederation:"UEFA",     group:"H", fifa_ranking:3,  elo:1940 },
  { name:"Cape Verde",         code:"CPV", confederation:"CAF",      group:"H", fifa_ranking:71, elo:1489 },
  { name:"Saudi Arabia",       code:"KSA", confederation:"AFC",      group:"H", fifa_ranking:56, elo:1465 },
  { name:"Uruguay",            code:"URU", confederation:"CONMEBOL", group:"H", fifa_ranking:12, elo:1790 },

  // ── Groupe I : France, Sénégal, Irak, Norvège ────────────────────────────
  { name:"France",             code:"FRA", confederation:"UEFA",     group:"I", fifa_ranking:2,  elo:1950 },
  { name:"Senegal",            code:"SEN", confederation:"CAF",      group:"I", fifa_ranking:18, elo:1707 },
  { name:"Iraq",               code:"IRQ", confederation:"AFC",      group:"I", fifa_ranking:63, elo:1446 },
  { name:"Norway",             code:"NOR", confederation:"UEFA",     group:"I", fifa_ranking:26, elo:1662 },

  // ── Groupe J : Argentine, Algérie, Autriche, Jordanie ────────────────────
  { name:"Argentina",          code:"ARG", confederation:"CONMEBOL", group:"J", fifa_ranking:1,  elo:2000 },
  { name:"Algeria",            code:"ALG", confederation:"CAF",      group:"J", fifa_ranking:36, elo:1575 },
  { name:"Austria",            code:"AUT", confederation:"UEFA",     group:"J", fifa_ranking:26, elo:1652 },
  { name:"Jordan",             code:"JOR", confederation:"AFC",      group:"J", fifa_ranking:97, elo:1373 },

  // ── Groupe K : Portugal, RD Congo, Ouzbékistan, Colombie ─────────────────
  { name:"Portugal",           code:"POR", confederation:"UEFA",     group:"K", fifa_ranking:6,  elo:1880 },
  { name:"DR Congo",           code:"COD", confederation:"CAF",      group:"K", fifa_ranking:52, elo:1460 },
  { name:"Uzbekistan",         code:"UZB", confederation:"AFC",      group:"K", fifa_ranking:53, elo:1472 },
  { name:"Colombia",           code:"COL", confederation:"CONMEBOL", group:"K", fifa_ranking:9,  elo:1836 },

  // ── Groupe L : Angleterre, Croatie, Ghana, Panama ────────────────────────
  { name:"England",            code:"ENG", confederation:"UEFA",     group:"L", fifa_ranking:4,  elo:1920 },
  { name:"Croatia",            code:"CRO", confederation:"UEFA",     group:"L", fifa_ranking:15, elo:1750 },
  { name:"Ghana",              code:"GHA", confederation:"CAF",      group:"L", fifa_ranking:60, elo:1452 },
  { name:"Panama",             code:"PAN", confederation:"CONCACAF", group:"L", fifa_ranking:43, elo:1534 },
];

export function getTeam(name) {
  if (!name) return undefined;
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const n = norm(name);
  return TEAMS.find(t => norm(t.name) === n || t.code.toLowerCase() === name.toLowerCase());
}

// Prédiction ELO simple
export function predictMatch(homeElo, awayElo, isKnockout = false) {
  const diff = homeElo - awayElo;
  const homeAdv = isKnockout ? 0 : 40;
  const adjustedDiff = diff + homeAdv;
  const homeWinProb = 1 / (1 + Math.pow(10, -adjustedDiff / 400));
  const drawProb = isKnockout ? 0 : Math.max(0.15, 0.28 - Math.abs(diff) / 2000);
  const adjHome = homeWinProb * (1 - drawProb);
  const adjAway = (1 - homeWinProb) * (1 - drawProb);

  const avgGoals = 2.6;
  const homeGoals = +(avgGoals * (0.5 + adjustedDiff / 2000)).toFixed(1);
  const awayGoals = +(avgGoals * (0.5 - adjustedDiff / 2000)).toFixed(1);

  return {
    home_win_probability: +adjHome.toFixed(3),
    draw_probability: +drawProb.toFixed(3),
    away_win_probability: +adjAway.toFixed(3),
    predicted_home_score: Math.max(0, Math.round(homeGoals * 10) / 10),
    predicted_away_score: Math.max(0, Math.round(awayGoals * 10) / 10),
    confidence: Math.round(Math.max(adjHome, adjAway) * 100),
    predicted_outcome: adjHome > adjAway + 0.05 ? 'home_win' : adjAway > adjHome + 0.05 ? 'away_win' : 'draw',
  };
}
