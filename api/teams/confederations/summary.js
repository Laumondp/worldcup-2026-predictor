import { TEAMS } from '../../_data.js';

export default function handler(req, res) {
  const summary = {};
  for (const t of TEAMS) {
    if (!summary[t.confederation]) summary[t.confederation] = { confederation: t.confederation, team_count: 0, avg_ranking: 0, teams: [] };
    summary[t.confederation].team_count++;
    summary[t.confederation].teams.push(t.name);
  }
  for (const c of Object.values(summary)) {
    const conf = TEAMS.filter(t => t.confederation === c.confederation);
    c.avg_ranking = +(conf.reduce((s, t) => s + t.fifa_ranking, 0) / conf.length).toFixed(1);
  }
  res.json(Object.values(summary));
}
