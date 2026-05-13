import { TEAMS, predictMatch } from '../_data.js';

function simulateOnce() {
  // Phase de groupes : les 2 premiers de chaque groupe passent
  const groups = {};
  for (const t of TEAMS) {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push({ ...t, pts: 0, gd: 0 });
  }

  for (const teams of Object.values(groups)) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const p = predictMatch(teams[i].elo, teams[j].elo);
        const r = Math.random();
        if (r < p.home_win_probability) {
          teams[i].pts += 3; teams[i].gd += 1; teams[j].gd -= 1;
        } else if (r < p.home_win_probability + p.draw_probability) {
          teams[i].pts += 1; teams[j].pts += 1;
        } else {
          teams[j].pts += 3; teams[j].gd += 1; teams[i].gd -= 1;
        }
      }
    }
    teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd);
  }

  // Qualifiés (top 2 + meilleurs 3èmes)
  let qualified = [];
  const thirds = [];
  for (const teams of Object.values(groups)) {
    qualified.push(teams[0], teams[1]);
    thirds.push(teams[2]);
  }
  thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd);
  qualified = [...qualified, ...thirds.slice(0, 8)];

  // Phase KO jusqu'à la finale
  let remaining = qualified;
  while (remaining.length > 1) {
    const next = [];
    for (let i = 0; i < remaining.length; i += 2) {
      const a = remaining[i], b = remaining[i + 1] || remaining[i];
      const p = predictMatch(a.elo, b.elo, true);
      const sum = p.home_win_probability + p.away_win_probability;
      next.push(Math.random() < (sum > 0 ? p.home_win_probability / sum : 0.5) ? a : b);
    }
    remaining = next;
  }
  return remaining[0]?.name || '';
}

export default function handler(req, res) {
  const n = parseInt(req.query.n) || 500;
  const capped = Math.min(n, 500);
  const wins = {};
  for (let i = 0; i < capped; i++) {
    const w = simulateOnce();
    wins[w] = (wins[w] || 0) + 1;
  }
  const probabilities = {};
  for (const [k, v] of Object.entries(wins)) probabilities[k] = +(v / capped).toFixed(4);
  const sorted = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  res.json({
    data: {
      winner: sorted[0]?.[0] || '',
      runner_up: sorted[1]?.[0] || '',
      semi_finalists: sorted.slice(0, 4).map(e => e[0]),
      simulations_run: capped,
      win_probabilities: Object.fromEntries(sorted),
    }
  });
}
