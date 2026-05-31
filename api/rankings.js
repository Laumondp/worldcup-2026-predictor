import { TEAMS } from './_data.js'

// Classement FIFA avril 2026 (France #1 — 1877.32)
const RANKINGS = [
  { rank:1,  name:"France",        conf:"UEFA",      pts:1877.32 },
  { rank:2,  name:"Spain",         conf:"UEFA",      pts:1876.40 },
  { rank:3,  name:"Argentina",     conf:"CONMEBOL",  pts:1862.15 },
  { rank:4,  name:"England",       conf:"UEFA",      pts:1821.68 },
  { rank:5,  name:"Brazil",        conf:"CONMEBOL",  pts:1815.43 },
  { rank:6,  name:"Portugal",      conf:"UEFA",      pts:1798.22 },
  { rank:7,  name:"Netherlands",   conf:"UEFA",      pts:1789.54 },
  { rank:8,  name:"Belgium",       conf:"UEFA",      pts:1775.31 },
  { rank:9,  name:"Colombia",      conf:"CONMEBOL",  pts:1762.88 },
  { rank:10, name:"Germany",       conf:"UEFA",      pts:1751.24 },
  { rank:11, name:"Italy",         conf:"UEFA",      pts:1739.61 },
  { rank:12, name:"Uruguay",       conf:"CONMEBOL",  pts:1728.43 },
  { rank:13, name:"Croatia",       conf:"UEFA",      pts:1715.82 },
  { rank:14, name:"Morocco",       conf:"CAF",       pts:1703.57 },
  { rank:15, name:"USA",           conf:"CONCACAF",  pts:1695.12 },
  { rank:16, name:"Switzerland",   conf:"UEFA",      pts:1683.44 },
  { rank:17, name:"Mexico",        conf:"CONCACAF",  pts:1671.33 },
  { rank:18, name:"Japan",         conf:"AFC",       pts:1659.78 },
  { rank:19, name:"Senegal",       conf:"CAF",       pts:1647.21 },
  { rank:20, name:"Iran",          conf:"AFC",       pts:1635.64 },
  { rank:21, name:"Denmark",       conf:"UEFA",      pts:1623.87 },
  { rank:22, name:"Austria",       conf:"UEFA",      pts:1612.43 },
  { rank:23, name:"South Korea",   conf:"AFC",       pts:1601.28 },
  { rank:24, name:"Australia",     conf:"AFC",       pts:1590.14 },
  { rank:25, name:"Ukraine",       conf:"UEFA",      pts:1579.67 },
  { rank:26, name:"Turkey",        conf:"UEFA",      pts:1568.32 },
  { rank:27, name:"Poland",        conf:"UEFA",      pts:1557.44 },
  { rank:28, name:"Serbia",        conf:"UEFA",      pts:1546.21 },
  { rank:29, name:"Ecuador",       conf:"CONMEBOL",  pts:1535.17 },
  { rank:30, name:"Cameroon",      conf:"CAF",       pts:1524.33 },
  { rank:31, name:"Nigeria",       conf:"CAF",       pts:1513.78 },
  { rank:32, name:"Egypt",         conf:"CAF",       pts:1503.24 },
  { rank:33, name:"Algeria",       conf:"CAF",       pts:1493.41 },
  { rank:34, name:"Canada",        conf:"CONCACAF",  pts:1483.67 },
  { rank:35, name:"Tunisia",       conf:"CAF",       pts:1474.12 },
  { rank:36, name:"Paraguay",      conf:"CONMEBOL",  pts:1464.88 },
  { rank:37, name:"Ivory Coast",   conf:"CAF",       pts:1455.33 },
  { rank:38, name:"Venezuela",     conf:"CONMEBOL",  pts:1446.07 },
  { rank:39, name:"Saudi Arabia",  conf:"AFC",       pts:1437.22 },
  { rank:40, name:"Ghana",         conf:"CAF",       pts:1428.44 },
  { rank:41, name:"Bolivia",       conf:"CONMEBOL",  pts:1419.71 },
  { rank:42, name:"Qatar",         conf:"AFC",       pts:1411.03 },
  { rank:43, name:"Iraq",          conf:"AFC",       pts:1402.54 },
  { rank:44, name:"New Zealand",   conf:"OFC",       pts:1394.18 },
  { rank:45, name:"Jamaica",       conf:"CONCACAF",  pts:1386.43 },
  { rank:46, name:"UAE",           conf:"AFC",       pts:1378.27 },
  { rank:47, name:"Panama",        conf:"CONCACAF",  pts:1370.12 },
  { rank:48, name:"Costa Rica",    conf:"CONCACAF",  pts:1362.08 },
]

const qualifiedNames = new Set(TEAMS.map(t => t.name.toLowerCase()))

export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  const rankings = RANKINGS.map(r => ({
    rank: r.rank,
    name: r.name,
    points: r.pts,
    previousRank: r.prevRank ?? r.rank,
    countryCode: r.name,
    confederation: r.conf,
    qualified: qualifiedNames.has(r.name.toLowerCase()),
  }))
  res.json({
    date: '2026-04-03T00:00:00.000Z',
    dateId: 'static-2026-04',
    isStatic: true,
    nextUpdateNote: 'Prochain classement FIFA officiel : ~5 juin 2026',
    count: rankings.length,
    rankings,
  })
}
