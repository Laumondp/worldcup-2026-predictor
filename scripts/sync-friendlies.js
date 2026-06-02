#!/usr/bin/env node
// Fetches recent international results from martj42/international_results (CSV public, no API key)
// Recalculates ELO for WC 2026 teams and updates api/_data.js

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '../api/_data.js');

// ELO baseline as of 2026-04-01 (before pre-WC international window)
const BASE_ELOS = {
  'USA': 1780, 'France': 1950, 'Poland': 1660, 'Morocco': 1760,
  'Mexico': 1740, 'Spain': 1940, 'Serbia': 1630, 'Senegal': 1720,
  'Canada': 1560, 'England': 1920, 'Ukraine': 1670, 'Nigeria': 1590,
  'Argentina': 2000, 'Germany': 1800, 'Turkey': 1620, 'Cameroon': 1580,
  'Brazil': 1900, 'Portugal': 1880, 'Japan': 1730, 'Egypt': 1570,
  'Colombia': 1830, 'Netherlands': 1870, 'South Korea': 1650, 'Algeria': 1575,
  'Uruguay': 1790, 'Belgium': 1850, 'Australia': 1660, 'Tunisia': 1560,
  'Ecuador': 1600, 'Italy': 1810, 'Iran': 1700, 'Ivory Coast': 1520,
  'Paraguay': 1510, 'Croatia': 1750, 'Saudi Arabia': 1480, 'Ghana': 1460,
  'Switzerland': 1710, 'Qatar': 1530, 'Costa Rica': 1510, 'Venezuela': 1490,
  'Denmark': 1690, 'Iraq': 1440, 'Panama': 1540, 'Bolivia': 1380,
  'Austria': 1640, 'UAE': 1420, 'Jamaica': 1500, 'New Zealand': 1320,
};

// CSV team names → our names
const NAME_MAP = {
  'United States':       'USA',
  'Korea Republic':      'South Korea',
  'IR Iran':             'Iran',
  "Côte d'Ivoire":       'Ivory Coast',
  'Cote d\'Ivoire':      'Ivory Coast',
  'United Arab Emirates':'UAE',
  'Saudi Arabia':        'Saudi Arabia',
  'New Zealand':         'New Zealand',
  'Costa Rica':          'Costa Rica',
  'South Korea':         'South Korea',
  'Ivory Coast':         'Ivory Coast',
  'Bolivia':             'Bolivia',
};

const WINDOW_START = '2026-04-01';

function mapName(n) { return NAME_MAP[n] ?? n; }
function isWC(n)    { return n in BASE_ELOS; }

// K factor by competition
// K=30 pour les amicaux pré-CM (fenêtre juin 2026) — reflète mieux la forme réelle
function kFactor(tournament) {
  if (/world cup/i.test(tournament) && !/qualifier/i.test(tournament)) return 60;
  if (/euro |copa america|gold cup|afcon|asian cup|nations cup/i.test(tournament)) return 40;
  if (/nations league/i.test(tournament)) return 30;
  return 30; // amicaux pré-CM : K=30 (forme récente très significative)
}

// Goal margin multiplier
function marginMult(gd) {
  if (gd <= 1) return 1;
  if (gd === 2) return 1.5;
  if (gd === 3) return 1.75;
  return 1.75 + (gd - 3) * 0.05;
}

function applyElo(elos, home, away, hs, as_, k) {
  const he = elos[home] ?? 1500;
  const ae = elos[away] ?? 1500;
  const expected = 1 / (1 + Math.pow(10, (ae - he) / 400));
  const actual = hs > as_ ? 1 : hs === as_ ? 0.5 : 0;
  const delta = Math.round(k * marginMult(Math.abs(hs - as_)) * (actual - expected));
  if (isWC(home)) elos[home] = he + delta;
  if (isWC(away)) elos[away] = ae - delta;
}

// Robust CSV line parser (handles quoted fields)
function parseLine(line) {
  const fields = [];
  let cur = '', inQ = false;
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { fields.push(cur); cur = ''; }
    else { cur += ch; }
  }
  fields.push(cur);
  return fields;
}

async function main() {
  console.log('Fetching martj42/international_results...');
  const res = await fetch(
    'https://raw.githubusercontent.com/martj42/international_results/master/results.csv',
    { headers: { 'User-Agent': 'worldcup-2026-predictor-sync' } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();

  const lines = text.trim().split('\n');
  const headers = parseLine(lines[0]);
  const idx = Object.fromEntries(headers.map((h, i) => [h.trim(), i]));

  const elos = { ...BASE_ELOS };
  const recent = [];

  for (const raw of lines.slice(1)) {
    const f = parseLine(raw);
    const date       = f[idx['date']]?.trim() ?? '';
    const homeCsv    = f[idx['home_team']]?.trim() ?? '';
    const awayCsv    = f[idx['away_team']]?.trim() ?? '';
    const hScoreRaw  = f[idx['home_score']]?.trim() ?? '';
    const aScoreRaw  = f[idx['away_score']]?.trim() ?? '';
    const tournament = f[idx['tournament']]?.trim() ?? 'Friendly';

    if (!date || date < WINDOW_START) continue;
    if (hScoreRaw === '' || aScoreRaw === '') continue; // not played yet

    const home = mapName(homeCsv);
    const away = mapName(awayCsv);
    const hs   = parseInt(hScoreRaw, 10);
    const as_  = parseInt(aScoreRaw, 10);
    if (isNaN(hs) || isNaN(as_)) continue;
    if (!isWC(home) && !isWC(away)) continue;

    applyElo(elos, home, away, hs, as_, kFactor(tournament));
    recent.push({ date, home, away, home_score: hs, away_score: as_, tournament });
  }

  recent.sort((a, b) => a.date.localeCompare(b.date));
  console.log(`${recent.length} match(es) depuis ${WINDOW_START}`);
  for (const [n, e] of Object.entries(elos)) {
    if (e !== BASE_ELOS[n]) console.log(`  ${n}: ${BASE_ELOS[n]} → ${e}`);
  }

  const today = new Date().toISOString().slice(0, 10);

  // Read and patch _data.js
  let src = readFileSync(DATA_FILE, 'utf8');

  // Replace RECENT_MATCHES block
  const matchesStr = '[\n' + recent.map(m =>
    `  { date:"${m.date}", home:"${m.home}", away:"${m.away}", home_score:${m.home_score}, away_score:${m.away_score}, tournament:"${m.tournament}" }`
  ).join(',\n') + '\n]';
  src = src.replace(
    /export const RECENT_MATCHES = \[[\s\S]*?\];/,
    `export const RECENT_MATCHES = ${matchesStr};`
  );

  // Replace RECENT_MATCHES_DATE
  src = src.replace(
    /export const RECENT_MATCHES_DATE = "[^"]*";/,
    `export const RECENT_MATCHES_DATE = "${today}";`
  );

  // Replace ELO for each team (line-level substitution)
  const srcLines = src.split('\n');
  for (let i = 0; i < srcLines.length; i++) {
    for (const [name, elo] of Object.entries(elos)) {
      if (srcLines[i].includes(`name:"${name}"`) && srcLines[i].includes('elo:')) {
        srcLines[i] = srcLines[i].replace(/elo:\d+/, `elo:${elo}`);
      }
    }
    // Remove manual ELO comment if present
    if (/\/\/ ELO post-amicaux/.test(srcLines[i])) {
      srcLines[i] = '';
    }
  }
  src = srcLines.filter((l, i, arr) => !(l === '' && arr[i-1] === '')).join('\n');

  writeFileSync(DATA_FILE, src, 'utf8');
  console.log('api/_data.js mis à jour.');
}

main().catch(e => { console.error(e); process.exit(1); });
