// Données statiques WC 2026 partagées entre toutes les fonctions

// ── Matchs amicaux récents (pré-CM2026) ──────────────────────────────────────
// ELO mis à jour après chaque résultat (K=20 amicaux, K×1.75 si écart ≥ 4 buts)
export const RECENT_MATCHES = [
  // 31 mai 2026
  { date:"2026-05-31", home:"USA",         away:"Senegal",  home_score:3, away_score:2, tournament:"Friendly" },
  { date:"2026-05-31", home:"Brazil",      away:"Panama",   home_score:6, away_score:2, tournament:"Friendly" },
  { date:"2026-05-31", home:"Germany",     away:"Finland",  home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Japan",       away:"Iceland",  home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Ukraine",     away:"Poland",   home_score:2, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Cape Verde",  away:"Serbia",   home_score:3, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Switzerland", away:"Jordan",   home_score:4, away_score:1, tournament:"Friendly" },
  // 1er juin 2026
  { date:"2026-06-01", home:"Turkey",      away:"North Macedonia", home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-06-01", home:"Austria",     away:"Tunisia",  home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-06-01", home:"Colombia",    away:"Costa Rica", home_score:3, away_score:1, tournament:"Friendly" },
  { date:"2026-06-01", home:"Canada",      away:"Uzbekistan", home_score:2, away_score:0, tournament:"Friendly" },
];

export const RECENT_MATCHES_DATE = "2026-06-02";

export const TEAMS = [
  { name:"USA",          code:"USA", confederation:"CONCACAF", group:"A", fifa_ranking:13, elo:1793 },
  { name:"France",       code:"FRA", confederation:"UEFA",     group:"A", fifa_ranking:2,  elo:1950 },
  { name:"Poland",       code:"POL", confederation:"UEFA",     group:"A", fifa_ranking:24, elo:1638 },
  { name:"Morocco",      code:"MAR", confederation:"CAF",      group:"A", fifa_ranking:14, elo:1760 },

  { name:"Mexico",       code:"MEX", confederation:"CONCACAF", group:"B", fifa_ranking:16, elo:1740 },
  { name:"Spain",        code:"ESP", confederation:"UEFA",     group:"B", fifa_ranking:3,  elo:1940 },
  { name:"Serbia",       code:"SRB", confederation:"UEFA",     group:"B", fifa_ranking:27, elo:1594 },
  { name:"Senegal",      code:"SEN", confederation:"CAF",      group:"B", fifa_ranking:18, elo:1707 },

  { name:"Canada",       code:"CAN", confederation:"CONCACAF", group:"C", fifa_ranking:40, elo:1579 },
  { name:"England",      code:"ENG", confederation:"UEFA",     group:"C", fifa_ranking:4,  elo:1920 },
  { name:"Ukraine",      code:"UKR", confederation:"UEFA",     group:"C", fifa_ranking:22, elo:1692 },
  { name:"Nigeria",      code:"NGA", confederation:"CAF",      group:"C", fifa_ranking:35, elo:1590 },

  { name:"Argentina",    code:"ARG", confederation:"CONMEBOL", group:"D", fifa_ranking:1,  elo:2000 },
  { name:"Germany",      code:"GER", confederation:"UEFA",     group:"D", fifa_ranking:11, elo:1808 },
  { name:"Turkey",       code:"TUR", confederation:"UEFA",     group:"D", fifa_ranking:29, elo:1638 },
  { name:"Cameroon",     code:"CMR", confederation:"CAF",      group:"D", fifa_ranking:34, elo:1580 },

  { name:"Brazil",       code:"BRA", confederation:"CONMEBOL", group:"E", fifa_ranking:5,  elo:1906 },
  { name:"Portugal",     code:"POR", confederation:"UEFA",     group:"E", fifa_ranking:6,  elo:1880 },
  { name:"Japan",        code:"JPN", confederation:"AFC",      group:"E", fifa_ranking:17, elo:1736 },
  { name:"Egypt",        code:"EGY", confederation:"CAF",      group:"E", fifa_ranking:37, elo:1570 },

  { name:"Colombia",     code:"COL", confederation:"CONMEBOL", group:"F", fifa_ranking:9,  elo:1836 },
  { name:"Netherlands",  code:"NED", confederation:"UEFA",     group:"F", fifa_ranking:7,  elo:1870 },
  { name:"South Korea",  code:"KOR", confederation:"AFC",      group:"F", fifa_ranking:25, elo:1650 },
  { name:"Algeria",      code:"ALG", confederation:"CAF",      group:"F", fifa_ranking:36, elo:1575 },

  { name:"Uruguay",      code:"URU", confederation:"CONMEBOL", group:"G", fifa_ranking:12, elo:1790 },
  { name:"Belgium",      code:"BEL", confederation:"UEFA",     group:"G", fifa_ranking:8,  elo:1850 },
  { name:"Australia",    code:"AUS", confederation:"AFC",      group:"G", fifa_ranking:23, elo:1660 },
  { name:"Tunisia",      code:"TUN", confederation:"CAF",      group:"G", fifa_ranking:38, elo:1548 },

  { name:"Ecuador",      code:"ECU", confederation:"CONMEBOL", group:"H", fifa_ranking:33, elo:1600 },
  { name:"Italy",        code:"ITA", confederation:"UEFA",     group:"H", fifa_ranking:10, elo:1810 },
  { name:"Iran",         code:"IRN", confederation:"AFC",      group:"H", fifa_ranking:20, elo:1700 },
  { name:"Ivory Coast",  code:"CIV", confederation:"CAF",      group:"H", fifa_ranking:48, elo:1520 },

  { name:"Paraguay",     code:"PAR", confederation:"CONMEBOL", group:"I", fifa_ranking:47, elo:1510 },
  { name:"Croatia",      code:"CRO", confederation:"UEFA",     group:"I", fifa_ranking:15, elo:1750 },
  { name:"Saudi Arabia", code:"KSA", confederation:"AFC",      group:"I", fifa_ranking:56, elo:1480 },
  { name:"Ghana",        code:"GHA", confederation:"CAF",      group:"I", fifa_ranking:60, elo:1460 },

  { name:"Switzerland",  code:"SUI", confederation:"UEFA",     group:"J", fifa_ranking:19, elo:1722 },
  { name:"Qatar",        code:"QAT", confederation:"AFC",      group:"J", fifa_ranking:37, elo:1530 },
  { name:"Costa Rica",   code:"CRC", confederation:"CONCACAF", group:"J", fifa_ranking:49, elo:1504 },
  { name:"Venezuela",    code:"VEN", confederation:"CONMEBOL", group:"J", fifa_ranking:55, elo:1490 },

  { name:"Denmark",      code:"DEN", confederation:"UEFA",     group:"K", fifa_ranking:21, elo:1690 },
  { name:"Iraq",         code:"IRQ", confederation:"AFC",      group:"K", fifa_ranking:63, elo:1440 },
  { name:"Panama",       code:"PAN", confederation:"CONCACAF", group:"K", fifa_ranking:43, elo:1534 },
  { name:"Bolivia",      code:"BOL", confederation:"CONMEBOL", group:"K", fifa_ranking:83, elo:1380 },

  { name:"Austria",      code:"AUT", confederation:"UEFA",     group:"L", fifa_ranking:26, elo:1652 },
  { name:"UAE",          code:"UAE", confederation:"AFC",      group:"L", fifa_ranking:68, elo:1420 },
  { name:"Jamaica",      code:"JAM", confederation:"CONCACAF", group:"L", fifa_ranking:47, elo:1500 },
  { name:"New Zealand",  code:"NZL", confederation:"OFC",      group:"L", fifa_ranking:99, elo:1320 },
];

export function getTeam(name) {
  return TEAMS.find(t =>
    t.name.toLowerCase() === name.toLowerCase() ||
    t.code.toLowerCase() === name.toLowerCase()
  );
}

// Prédiction ELO simple
export function predictMatch(homeElo, awayElo, isKnockout = false) {
  const diff = homeElo - awayElo;
  const homeAdv = isKnockout ? 0 : 40; // avantage terrain en phase de groupes
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
