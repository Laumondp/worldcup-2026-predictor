// Données statiques WC 2026 — groupes alignés sur le tirage officiel FIFA

// ── Matchs amicaux récents (pré-CM2026) ──────────────────────────────────────
// ELO recalculé après chaque résultat (K=30 fenêtre pré-CM)
export const RECENT_MATCHES = [
  { date:"2026-05-22", home:"Mexico", away:"Ghana", home_score:2, away_score:0, tournament:"Friendly" },
  { date:"2026-05-26", home:"Morocco", away:"Burundi", home_score:5, away_score:0, tournament:"Friendly" },
  { date:"2026-05-28", home:"Republic of Ireland", away:"Qatar", home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-05-28", home:"Egypt", away:"Russia", home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-05-29", home:"Andorra", away:"Iraq", home_score:0, away_score:1, tournament:"Friendly" },
  { date:"2026-05-29", home:"Bosnia-Herzegovina", away:"North Macedonia", home_score:0, away_score:0, tournament:"Friendly" },
  { date:"2026-05-29", home:"Iran", away:"Gambia", home_score:3, away_score:1, tournament:"Friendly" },
  { date:"2026-05-29", home:"South Africa", away:"Nicaragua", home_score:0, away_score:0, tournament:"Friendly" },
  { date:"2026-05-30", home:"Ecuador", away:"Saudi Arabia", home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-05-30", home:"South Korea", away:"Trinidad and Tobago", home_score:5, away_score:0, tournament:"Friendly" },
  { date:"2026-05-30", home:"Mexico", away:"Australia", home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-05-30", home:"Scotland", away:"Curaçao", home_score:4, away_score:1, tournament:"Friendly" },
  { date:"2026-05-31", home:"Brazil", away:"Panama", home_score:6, away_score:2, tournament:"Friendly" },
  { date:"2026-05-31", home:"Cape Verde", away:"Serbia", home_score:3, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Czechia", away:"Kosovo", home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-05-31", home:"Germany", away:"Finland", home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-05-31", home:"Switzerland", away:"Jordan", home_score:4, away_score:1, tournament:"Friendly" },
  { date:"2026-05-31", home:"USA", away:"Senegal", home_score:3, away_score:2, tournament:"Friendly" },
  { date:"2026-05-31", home:"Japan", away:"Iceland", home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-06-01", home:"Austria", away:"Tunisia", home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-06-01", home:"Canada", away:"Uzbekistan", home_score:2, away_score:0, tournament:"Friendly" },
  { date:"2026-06-01", home:"Colombia", away:"Costa Rica", home_score:3, away_score:1, tournament:"Friendly" },
  { date:"2026-06-01", home:"Norway", away:"Sweden", home_score:3, away_score:1, tournament:"Friendly" },
  { date:"2026-06-01", home:"Turkey", away:"North Macedonia", home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-06-02", home:"Croatia", away:"Belgium", home_score:0, away_score:2, tournament:"Friendly" },
  { date:"2026-06-02", home:"Haiti", away:"New Zealand", home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-06-02", home:"Morocco", away:"Madagascar", home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-06-02", home:"Wales", away:"Ghana", home_score:1, away_score:1, tournament:"Friendly" },
  { date:"2026-06-03", home:"DR Congo", away:"Denmark", home_score:0, away_score:0, tournament:"Friendly" },
  { date:"2026-06-03", home:"South Korea", away:"El Salvador", home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-06-03", home:"Netherlands", away:"Algeria", home_score:0, away_score:1, tournament:"Friendly" },
  { date:"2026-06-03", home:"Panama", away:"Dominican Republic", home_score:4, away_score:2, tournament:"Friendly" },
  { date:"2026-06-04", home:"France", away:"Ivory Coast", home_score:1, away_score:2, tournament:"Friendly" },
  { date:"2026-06-04", home:"Guatemala", away:"Czechia", home_score:1, away_score:5, tournament:"Friendly" },
  { date:"2026-06-04", home:"Iran", away:"Mali", home_score:2, away_score:0, tournament:"Friendly" },
  { date:"2026-06-04", home:"Mexico", away:"Serbia", home_score:5, away_score:1, tournament:"Friendly" },
  { date:"2026-06-04", home:"Spain", away:"Iraq", home_score:1, away_score:1, tournament:"Friendly" },
  { date:"2026-06-04", home:"Sweden", away:"Greece", home_score:2, away_score:2, tournament:"Friendly" },
  { date:"2026-06-05", home:"Canada", away:"Republic of Ireland", home_score:1, away_score:1, tournament:"Friendly" },
  { date:"2026-06-05", home:"Haiti", away:"Peru", home_score:1, away_score:2, tournament:"Friendly" },
  { date:"2026-06-05", home:"Paraguay", away:"Nicaragua", home_score:4, away_score:0, tournament:"Friendly" },
  { date:"2026-06-05", home:"Puerto Rico", away:"Saudi Arabia", home_score:0, away_score:3, tournament:"Friendly" },
  { date:"2026-06-06", home:"Argentina", away:"Honduras", home_score:2, away_score:0, tournament:"Friendly" },
  { date:"2026-06-06", home:"Australia", away:"Switzerland", home_score:1, away_score:1, tournament:"Friendly" },
  { date:"2026-06-06", home:"Belgium", away:"Tunisia", home_score:5, away_score:0, tournament:"Friendly" },
  { date:"2026-06-06", home:"Bermuda", away:"Cape Verde", home_score:3, away_score:0, tournament:"Friendly" },
  { date:"2026-06-06", home:"Bolivia", away:"Scotland", home_score:0, away_score:4, tournament:"Friendly" },
  { date:"2026-06-06", home:"Brazil", away:"Egypt", home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-06-06", home:"England", away:"New Zealand", home_score:1, away_score:0, tournament:"Friendly" },
  { date:"2026-06-06", home:"Jamaica", away:"South Africa", home_score:0, away_score:1, tournament:"Friendly" },
  { date:"2026-06-06", home:"Panama", away:"Bosnia-Herzegovina", home_score:1, away_score:1, tournament:"Friendly" },
  { date:"2026-06-06", home:"Portugal", away:"Chile", home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-06-06", home:"Qatar", away:"El Salvador", home_score:0, away_score:0, tournament:"Friendly" },
  { date:"2026-06-06", home:"USA", away:"Germany", home_score:1, away_score:2, tournament:"Friendly" },
  { date:"2026-06-06", home:"Venezuela", away:"Turkey", home_score:1, away_score:2, tournament:"Friendly" },
  { date:"2026-06-07", home:"Croatia", away:"Slovenia", home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-06-07", home:"Ecuador", away:"Guatemala", home_score:3, away_score:0, tournament:"Friendly" },
  { date:"2026-06-07", home:"Jordan", away:"Colombia", home_score:0, away_score:2, tournament:"Friendly" },
  { date:"2026-06-07", home:"Morocco", away:"Norway", home_score:1, away_score:1, tournament:"Friendly" },
  { date:"2026-06-08", home:"France", away:"Northern Ireland", home_score:3, away_score:1, tournament:"Friendly" },
  { date:"2026-06-08", home:"Netherlands", away:"Uzbekistan", home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-06-08", home:"Peru", away:"Spain", home_score:1, away_score:3, tournament:"Friendly" },
  { date:"2026-06-09", home:"Argentina", away:"Iceland", home_score:3, away_score:0, tournament:"Friendly" },
  { date:"2026-06-09", home:"DR Congo", away:"Chile", home_score:1, away_score:2, tournament:"Friendly" },
  { date:"2026-06-09", home:"Saudi Arabia", away:"Senegal", home_score:0, away_score:0, tournament:"Friendly" },
  { date:"2026-06-09", home:"Iraq", away:"Venezuela", home_score:0, away_score:2, tournament:"Friendly" },
  { date:"2026-06-10", home:"Bolivia", away:"Algeria", home_score:0, away_score:4, tournament:"Friendly" },
  { date:"2026-06-10", home:"England", away:"Costa Rica", home_score:3, away_score:0, tournament:"Friendly" },
  { date:"2026-06-10", home:"Portugal", away:"Nigeria", home_score:2, away_score:1, tournament:"Friendly" },
  { date:"2026-06-11", home:"Mexico", away:"South Africa", home_score:2, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-11", home:"South Korea", away:"Czechia", home_score:2, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-12", home:"Canada", away:"Bosnia-Herzegovina", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-12", home:"USA", away:"Paraguay", home_score:4, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-13", home:"Qatar", away:"Switzerland", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-13", home:"Brazil", away:"Morocco", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-13", home:"Haiti", away:"Scotland", home_score:0, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-13", home:"Australia", away:"Turkey", home_score:2, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-14", home:"Germany", away:"Curaçao", home_score:7, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-14", home:"Ivory Coast", away:"Ecuador", home_score:1, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-14", home:"Netherlands", away:"Japan", home_score:2, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-14", home:"Sweden", away:"Tunisia", home_score:5, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-15", home:"Belgium", away:"Egypt", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-15", home:"Iran", away:"New Zealand", home_score:2, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-15", home:"Spain", away:"Cape Verde", home_score:0, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-15", home:"Saudi Arabia", away:"Uruguay", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-16", home:"France", away:"Senegal", home_score:3, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-16", home:"Iraq", away:"Norway", home_score:1, away_score:4, tournament:"FIFA World Cup" },
  { date:"2026-06-16", home:"Argentina", away:"Algeria", home_score:3, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-16", home:"Austria", away:"Jordan", home_score:3, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-17", home:"Portugal", away:"DR Congo", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-17", home:"Uzbekistan", away:"Colombia", home_score:1, away_score:3, tournament:"FIFA World Cup" },
  { date:"2026-06-17", home:"England", away:"Croatia", home_score:4, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-17", home:"Ghana", away:"Panama", home_score:1, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-18", home:"Czechia", away:"South Africa", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-18", home:"Mexico", away:"South Korea", home_score:1, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-18", home:"Switzerland", away:"Bosnia-Herzegovina", home_score:4, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-18", home:"Canada", away:"Qatar", home_score:6, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-19", home:"Scotland", away:"Morocco", home_score:0, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-19", home:"Brazil", away:"Haiti", home_score:3, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-19", home:"USA", away:"Australia", home_score:2, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-19", home:"Turkey", away:"Paraguay", home_score:0, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-20", home:"Germany", away:"Ivory Coast", home_score:2, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-20", home:"Ecuador", away:"Curaçao", home_score:0, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-20", home:"Netherlands", away:"Sweden", home_score:5, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-20", home:"Tunisia", away:"Japan", home_score:0, away_score:4, tournament:"FIFA World Cup" },
  { date:"2026-06-21", home:"Belgium", away:"Iran", home_score:0, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-21", home:"New Zealand", away:"Egypt", home_score:1, away_score:3, tournament:"FIFA World Cup" },
  { date:"2026-06-21", home:"Spain", away:"Saudi Arabia", home_score:4, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-21", home:"Uruguay", away:"Cape Verde", home_score:2, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-22", home:"France", away:"Iraq", home_score:3, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-22", home:"Norway", away:"Senegal", home_score:3, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-22", home:"Argentina", away:"Austria", home_score:2, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-22", home:"Jordan", away:"Algeria", home_score:1, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-23", home:"Portugal", away:"Uzbekistan", home_score:5, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-23", home:"Colombia", away:"DR Congo", home_score:1, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-23", home:"England", away:"Ghana", home_score:0, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-23", home:"Panama", away:"Croatia", home_score:0, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-24", home:"Mexico", away:"Czechia", home_score:3, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-24", home:"South Africa", away:"South Korea", home_score:1, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-24", home:"Canada", away:"Switzerland", home_score:1, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-24", home:"Bosnia-Herzegovina", away:"Qatar", home_score:3, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-24", home:"Scotland", away:"Brazil", home_score:0, away_score:3, tournament:"FIFA World Cup" },
  { date:"2026-06-24", home:"Morocco", away:"Haiti", home_score:4, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-25", home:"USA", away:"Turkey", home_score:2, away_score:3, tournament:"FIFA World Cup" },
  { date:"2026-06-25", home:"Paraguay", away:"Australia", home_score:0, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-25", home:"Curaçao", away:"Ivory Coast", home_score:0, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-25", home:"Ecuador", away:"Germany", home_score:2, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-25", home:"Japan", away:"Sweden", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-25", home:"Tunisia", away:"Netherlands", home_score:1, away_score:3, tournament:"FIFA World Cup" },
  { date:"2026-06-26", home:"Egypt", away:"Iran", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-26", home:"New Zealand", away:"Belgium", home_score:1, away_score:5, tournament:"FIFA World Cup" },
  { date:"2026-06-26", home:"Cape Verde", away:"Saudi Arabia", home_score:0, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-26", home:"Uruguay", away:"Spain", home_score:0, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-26", home:"Norway", away:"France", home_score:1, away_score:4, tournament:"FIFA World Cup" },
  { date:"2026-06-26", home:"Senegal", away:"Iraq", home_score:5, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-27", home:"Algeria", away:"Austria", home_score:3, away_score:3, tournament:"FIFA World Cup" },
  { date:"2026-06-27", home:"Jordan", away:"Argentina", home_score:1, away_score:3, tournament:"FIFA World Cup" },
  { date:"2026-06-27", home:"Colombia", away:"Portugal", home_score:0, away_score:0, tournament:"FIFA World Cup" },
  { date:"2026-06-27", home:"DR Congo", away:"Uzbekistan", home_score:3, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-27", home:"Panama", away:"England", home_score:0, away_score:2, tournament:"FIFA World Cup" },
  { date:"2026-06-27", home:"Croatia", away:"Ghana", home_score:2, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-28", home:"South Africa", away:"Canada", home_score:0, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-29", home:"Brazil", away:"Japan", home_score:2, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-29", home:"Germany", away:"Paraguay", home_score:1, away_score:1, tournament:"FIFA World Cup" },
  { date:"2026-06-29", home:"Netherlands", away:"Morocco", home_score:1, away_score:1, tournament:"FIFA World Cup" }
];

export const RECENT_MATCHES_DATE = "2026-06-30";

// ── 48 équipes qualifiées — groupes officiels FIFA ────────────────────────────
// fifa_ranking = classement FIFA live juin 2026 (source: inside.fifa.com/api/live-world-ranking)
// elo = base avril 2026 + K=30 ajustements amicaux 22 mai–9 juin 2026
export const TEAMS = [
  // ── Groupe A : Mexique, Afrique du Sud, Corée du Sud, Tchéquie ────────────
  { name:"Mexico",             code:"MEX", confederation:"CONCACAF", group:"A", fifa_ranking:15, elo:1826 },
  { name:"South Africa",       code:"RSA", confederation:"CAF",      group:"A", fifa_ranking:60, elo:1497 },
  { name:"South Korea",        code:"KOR", confederation:"AFC",      group:"A", fifa_ranking:25, elo:1629 },
  { name:"Czechia",            code:"CZE", confederation:"UEFA",     group:"A", fifa_ranking:40, elo:1548 },

  // ── Groupe B : Canada, Bosnie-Herzégovine, Qatar, Suisse ──────────────────
  { name:"Canada",             code:"CAN", confederation:"CONCACAF", group:"B", fifa_ranking:30, elo:1621 },
  { name:"Bosnia-Herzegovina", code:"BIH", confederation:"UEFA",     group:"B", fifa_ranking:51, elo:1513 },
  { name:"Qatar",              code:"QAT", confederation:"AFC",      group:"B", fifa_ranking:55, elo:1432 },
  { name:"Switzerland",        code:"SUI", confederation:"UEFA",     group:"B", fifa_ranking:19, elo:1744 },

  // ── Groupe C : Brésil, Maroc, Haïti, Écosse ──────────────────────────────
  { name:"Brazil",             code:"BRA", confederation:"CONMEBOL", group:"C", fifa_ranking:6,  elo:1939 },
  { name:"Morocco",            code:"MAR", confederation:"CAF",      group:"C", fifa_ranking:8,  elo:1816 },
  { name:"Haiti",              code:"HAI", confederation:"CONCACAF", group:"C", fifa_ranking:90, elo:1367 },
  { name:"Scotland",           code:"SCO", confederation:"UEFA",     group:"C", fifa_ranking:42, elo:1612 },

  // ── Groupe D : États-Unis, Paraguay, Australie, Turquie ──────────────────
  { name:"USA",                code:"USA", confederation:"CONCACAF", group:"D", fifa_ranking:16, elo:1782 },
  { name:"Paraguay",           code:"PAR", confederation:"CONMEBOL", group:"D", fifa_ranking:39, elo:1579 },
  { name:"Australia",          code:"AUS", confederation:"AFC",      group:"D", fifa_ranking:27, elo:1655 },
  { name:"Turkey",             code:"TUR", confederation:"UEFA",     group:"D", fifa_ranking:22, elo:1615 },

  // ── Groupe E : Allemagne, Curaçao, Côte d'Ivoire, Équateur ───────────────
  { name:"Germany",            code:"GER", confederation:"UEFA",     group:"E", fifa_ranking:10, elo:1781 },
  { name:"Curaçao",            code:"CUW", confederation:"CONCACAF", group:"E", fifa_ranking:96, elo:1380 },
  { name:"Ivory Coast",        code:"CIV", confederation:"CAF",      group:"E", fifa_ranking:34, elo:1610 },
  { name:"Ecuador",            code:"ECU", confederation:"CONMEBOL", group:"E", fifa_ranking:23, elo:1632 },

  // ── Groupe F : Pays-Bas, Japon, Suède, Tunisie ───────────────────────────
  { name:"Netherlands",        code:"NED", confederation:"UEFA",     group:"F", fifa_ranking:7,  elo:1870 },
  { name:"Japan",              code:"JPN", confederation:"AFC",      group:"F", fifa_ranking:18, elo:1737 },
  { name:"Sweden",             code:"SWE", confederation:"UEFA",     group:"F", fifa_ranking:37, elo:1632 },
  { name:"Tunisia",            code:"TUN", confederation:"CAF",      group:"F", fifa_ranking:43, elo:1466 },

  // ── Groupe G : Belgique, Égypte, Iran, Nouvelle-Zélande ──────────────────
  { name:"Belgium",            code:"BEL", confederation:"UEFA",     group:"G", fifa_ranking:9,  elo:1845 },
  { name:"Egypt",              code:"EGY", confederation:"CAF",      group:"G", fifa_ranking:28, elo:1622 },
  { name:"Iran",               code:"IRN", confederation:"AFC",      group:"G", fifa_ranking:21, elo:1701 },
  { name:"New Zealand",        code:"NZL", confederation:"OFC",      group:"G", fifa_ranking:65, elo:1302 },

  // ── Groupe H : Espagne, Cap-Vert, Arabie saoudite, Uruguay ───────────────
  { name:"Spain",              code:"ESP", confederation:"UEFA",     group:"H", fifa_ranking:2,  elo:1933 },
  { name:"Cape Verde",         code:"CPV", confederation:"CAF",      group:"H", fifa_ranking:72, elo:1502 },
  { name:"Saudi Arabia",       code:"KSA", confederation:"AFC",      group:"H", fifa_ranking:63, elo:1515 },
  { name:"Uruguay",            code:"URU", confederation:"CONMEBOL", group:"H", fifa_ranking:17, elo:1733 },

  // ── Groupe I : France, Sénégal, Irak, Norvège ────────────────────────────
  { name:"France",             code:"FRA", confederation:"UEFA",     group:"I", fifa_ranking:3,  elo:1972 },
  { name:"Senegal",            code:"SEN", confederation:"CAF",      group:"I", fifa_ranking:14, elo:1675 },
  { name:"Iraq",               code:"IRQ", confederation:"AFC",      group:"I", fifa_ranking:57, elo:1399 },
  { name:"Norway",             code:"NOR", confederation:"UEFA",     group:"I", fifa_ranking:31, elo:1697 },

  // ── Groupe J : Argentine, Algérie, Autriche, Jordanie ────────────────────
  { name:"Argentina",          code:"ARG", confederation:"CONMEBOL", group:"J", fifa_ranking:1,  elo:2028 },
  { name:"Algeria",            code:"ALG", confederation:"CAF",      group:"J", fifa_ranking:29, elo:1623 },
  { name:"Austria",            code:"AUT", confederation:"UEFA",     group:"J", fifa_ranking:24, elo:1653 },
  { name:"Jordan",             code:"JOR", confederation:"AFC",      group:"J", fifa_ranking:68, elo:1342 },

  // ── Groupe K : Portugal, RD Congo, Ouzbékistan, Colombie ─────────────────
  { name:"Portugal",           code:"POR", confederation:"UEFA",     group:"K", fifa_ranking:5,  elo:1869 },
  { name:"DR Congo",           code:"COD", confederation:"CAF",      group:"K", fifa_ranking:45, elo:1511 },
  { name:"Uzbekistan",         code:"UZB", confederation:"AFC",      group:"K", fifa_ranking:49, elo:1407 },
  { name:"Colombia",           code:"COL", confederation:"CONMEBOL", group:"K", fifa_ranking:13, elo:1856 },

  // ── Groupe L : Angleterre, Croatie, Ghana, Panama ────────────────────────
  { name:"England",            code:"ENG", confederation:"UEFA",     group:"L", fifa_ranking:4,  elo:1929 },
  { name:"Croatia",            code:"CRO", confederation:"UEFA",     group:"L", fifa_ranking:11, elo:1745 },
  { name:"Ghana",              code:"GHA", confederation:"CAF",      group:"L", fifa_ranking:58, elo:1505 },
  { name:"Panama",             code:"PAN", confederation:"CONCACAF", group:"L", fifa_ranking:33, elo:1492 },
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
