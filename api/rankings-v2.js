import { TEAMS } from './_data.js'

const FIFA_LIVE_URL =
  'https://inside.fifa.com/api/live-world-ranking/get-rankings' +
  '?mode=live&gender=1&locale=en&rankingType=football&count=211'

const FIFA_SCHEDULE_URL =
  'https://inside.fifa.com/api/live-world-ranking/get-rankings' +
  '?mode=schedule&gender=1&locale=en&rankingType=football&count=211' +
  '&scheduleId=FRS_Male_Football_20260119'

// Fallback — classement officiel FIFA avril 2026 (snapshot FRS_Male_Football_20260119)
const RANKINGS_FALLBACK = [
  { rank:1,  name:"Argentina",          conf:"CONMEBOL",  pts:1877.27, prevRank:3  },
  { rank:2,  name:"Spain",              conf:"UEFA",      pts:1874.71, prevRank:2  },
  { rank:3,  name:"France",             conf:"UEFA",      pts:1870.70, prevRank:1  },
  { rank:4,  name:"England",            conf:"UEFA",      pts:1827.05, prevRank:4  },
  { rank:5,  name:"Portugal",           conf:"UEFA",      pts:1766.18, prevRank:5  },
  { rank:6,  name:"Brazil",             conf:"CONMEBOL",  pts:1761.16, prevRank:6  },
  { rank:7,  name:"Netherlands",        conf:"UEFA",      pts:1757.87, prevRank:7  },
  { rank:8,  name:"Morocco",            conf:"CAF",       pts:1756.22, prevRank:14 },
  { rank:9,  name:"Belgium",            conf:"UEFA",      pts:1734.71, prevRank:8  },
  { rank:10, name:"Germany",            conf:"UEFA",      pts:1730.37, prevRank:10 },
  { rank:11, name:"Croatia",            conf:"UEFA",      pts:1717.07, prevRank:13 },
  { rank:12, name:"Italy",              conf:"UEFA",      pts:1700.37, prevRank:11 },
  { rank:13, name:"Colombia",           conf:"CONMEBOL",  pts:1693.09, prevRank:9  },
  { rank:14, name:"Senegal",            conf:"CAF",       pts:1688.99, prevRank:19 },
  { rank:15, name:"Mexico",             conf:"CONCACAF",  pts:1682.11, prevRank:17 },
  { rank:16, name:"USA",                conf:"CONCACAF",  pts:1673.13, prevRank:15 },
  { rank:17, name:"Uruguay",            conf:"CONMEBOL",  pts:1673.07, prevRank:12 },
  { rank:18, name:"Japan",              conf:"AFC",       pts:1660.43, prevRank:18 },
  { rank:19, name:"Switzerland",        conf:"UEFA",      pts:1649.40, prevRank:16 },
  { rank:20, name:"Denmark",            conf:"UEFA",      pts:1620.81, prevRank:21 },
  { rank:21, name:"Iran",               conf:"AFC",       pts:1616.04, prevRank:20 },
  { rank:22, name:"Turkey",             conf:"UEFA",      pts:1599.04, prevRank:26 },
  { rank:23, name:"Ecuador",            conf:"CONMEBOL",  pts:1594.78, prevRank:29 },
  { rank:24, name:"Austria",            conf:"UEFA",      pts:1593.45, prevRank:22 },
  { rank:25, name:"South Korea",        conf:"AFC",       pts:1588.66, prevRank:23 },
  { rank:26, name:"Nigeria",            conf:"CAF",       pts:1585.80, prevRank:31 },
  { rank:27, name:"Australia",          conf:"AFC",       pts:1580.67, prevRank:24 },
  { rank:28, name:"Egypt",              conf:"CAF",       pts:1565.56, prevRank:32 },
  { rank:29, name:"Algeria",            conf:"CAF",       pts:1564.26, prevRank:33 },
  { rank:30, name:"Canada",             conf:"CONCACAF",  pts:1556.48, prevRank:34 },
  { rank:31, name:"Norway",             conf:"UEFA",      pts:1550.94, prevRank:40 },
  { rank:32, name:"Ukraine",            conf:"UEFA",      pts:1546.88, prevRank:25 },
  { rank:33, name:"Panama",             conf:"CONCACAF",  pts:1540.64, prevRank:47 },
  { rank:34, name:"Ivory Coast",        conf:"CAF",       pts:1532.98, prevRank:37 },
  { rank:35, name:"Poland",             conf:"UEFA",      pts:1528.00, prevRank:27 },
  { rank:36, name:"Wales",              conf:"UEFA",      pts:1524.29, prevRank:41 },
  { rank:37, name:"Sweden",             conf:"UEFA",      pts:1514.77, prevRank:43 },
  { rank:38, name:"Serbia",             conf:"UEFA",      pts:1508.65, prevRank:28 },
  { rank:39, name:"Paraguay",           conf:"CONMEBOL",  pts:1503.50, prevRank:36 },
  { rank:40, name:"Czechia",            conf:"UEFA",      pts:1501.38, prevRank:51 },
  { rank:41, name:"Hungary",            conf:"UEFA",      pts:1500.58, prevRank:52 },
  { rank:42, name:"Scotland",           conf:"UEFA",      pts:1498.35, prevRank:53 },
  { rank:43, name:"Tunisia",            conf:"CAF",       pts:1483.05, prevRank:35 },
  { rank:44, name:"Cameroon",           conf:"CAF",       pts:1481.24, prevRank:30 },
  { rank:11, name:"Croatia",             conf:"UEFA",      pts:1717.07, prevRank:13 },
  { rank:45, name:"DR Congo",           conf:"CAF",       pts:1478.35, prevRank:55 },
  { rank:46, name:"Greece",             conf:"UEFA",      pts:1475.82, prevRank:57 },
  { rank:47, name:"Slovakia",           conf:"UEFA",      pts:1473.94, prevRank:59 },
  { rank:48, name:"Venezuela",          conf:"CONMEBOL",  pts:1468.05, prevRank:38 },
  { rank:49, name:"Uzbekistan",         conf:"AFC",       pts:1465.34, prevRank:62 },
  { rank:51, name:"Bosnia",             conf:"UEFA",      pts:1459.00, prevRank:56 },
  { rank:55, name:"Qatar",              conf:"AFC",       pts:1454.00, prevRank:42 },
  { rank:57, name:"Iraq",               conf:"AFC",       pts:1447.00, prevRank:43 },
  { rank:58, name:"Ghana",              conf:"CAF",       pts:1445.00, prevRank:40 },
  { rank:60, name:"South Africa",       conf:"CAF",       pts:1429.00, prevRank:54 },
  { rank:63, name:"Saudi Arabia",       conf:"AFC",       pts:1410.00, prevRank:39 },
  { rank:65, name:"New Zealand",        conf:"OFC",       pts:1398.00, prevRank:44 },
  { rank:68, name:"Jordan",             conf:"AFC",       pts:1382.00, prevRank:65 },
  { rank:72, name:"Cape Verde",         conf:"CAF",       pts:1358.00, prevRank:70 },
  { rank:90, name:"Haiti",              conf:"CONCACAF",  pts:1205.00, prevRank:88 },
  { rank:96, name:"Curacao",            conf:"CONCACAF",  pts:1168.00, prevRank:94 },
]

// Normalise team name for "qualified" lookup
function normName(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

const TEAM_ALIASES = {
  'unitedstates': 'usa',
  'republicofkorea': 'southkorea',
  'korea': 'southkorea',
  'cotedivoire': 'ivorycoast',
  'democraticrepublicofthecongo': 'drcongo',
  'congodrc': 'drcongo',
  'congord': 'drcongo',
  'bosniaandherzegovina': 'bosniaherzegovina',
  'bosniaherzegovina': 'bosniaherzegovina',
}

const qualifiedNormed = new Set(TEAMS.map(t => normName(t.name)))

function isQualified(teamName) {
  const n = normName(teamName)
  return qualifiedNormed.has(TEAM_ALIASES[n] || n)
}

// Confederation name → short code
function normConf(name) {
  if (!name) return ''
  const u = name.toUpperCase()
  if (u.includes('UEFA'))     return 'UEFA'
  if (u.includes('CONMEBOL')) return 'CONMEBOL'
  if (u.includes('CONCACAF')) return 'CONCACAF'
  if (u.includes('CAF'))      return 'CAF'
  if (u.includes('AFC'))      return 'AFC'
  if (u.includes('OFC'))      return 'OFC'
  return name
}

function mapFifaEntry(r) {
  return {
    rank:          r.rank,
    name:          r.teamName || r.name,
    points:        r.totalPoints ?? r.points ?? 0,
    previousRank:  r.previousRank ?? r.rank,
    countryCode:   r.countryCode || r.teamName || r.name,
    confederation: normConf(r.confederationName || r.confederation || ''),
    qualified:     isQualified(r.teamName || r.name || ''),
  }
}

async function fetchFifa(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://inside.fifa.com/fifa-world-ranking/men',
      },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    // API may return array directly or wrapped in { rankings: [...] }
    const arr = Array.isArray(data) ? data : (data.rankings || data.items || data.data || [])
    if (!arr.length) throw new Error('empty')
    return arr
  } finally {
    clearTimeout(timer)
  }
}

export default async function handler(req, res) {
  // Pas de cache CDN — toujours fraîche pour éviter données périmées
  res.setHeader('Cache-Control', 'no-store')

  // 1. Try live endpoint (inclut les matchs amicaux en cours)
  try {
    const arr = await fetchFifa(FIFA_LIVE_URL)
    const rankings = arr.map(mapFifaEntry)
    return res.json({
      date: new Date().toISOString(),
      dateId: 'live',
      isStatic: false,
      source: 'fifa-live',
      count: rankings.length,
      rankings,
    })
  } catch (_) {}

  // 2. Fallback statique — classement live juin 2026 (Argentina #1)
  const rankings = RANKINGS_FALLBACK.map(r => ({
    rank:          r.rank,
    name:          r.name,
    points:        r.pts,
    previousRank:  r.prevRank,
    countryCode:   r.name,
    confederation: r.conf,
    qualified:     isQualified(r.name),
  }))
  res.json({
    date: '2026-06-10T00:00:00.000Z',
    dateId: 'live-fallback-2026-06',
    isStatic: true,
    source: 'fallback',
    count: rankings.length,
    rankings,
  })
}
