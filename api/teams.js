import { TEAMS, RECENT_MATCHES } from './_data.js';

function computeForm(teamName) {
  const matches = RECENT_MATCHES.filter(
    m => m.home === teamName || m.away === teamName
  ).slice(-5);

  let pts = 0, gf = 0, ga = 0;
  for (const m of matches) {
    if (m.home === teamName) {
      gf += m.home_score; ga += m.away_score;
      if (m.home_score > m.away_score) pts += 3;
      else if (m.home_score === m.away_score) pts += 1;
    } else {
      gf += m.away_score; ga += m.home_score;
      if (m.away_score > m.home_score) pts += 3;
      else if (m.away_score === m.home_score) pts += 1;
    }
  }
  const n = matches.length || 1;
  return { form_points: pts, goals_scored_avg: +(gf / n).toFixed(2), goals_conceded_avg: +(ga / n).toFixed(2) };
}

export default function handler(req, res) {
  const { confederation } = req.query;
  let teams = TEAMS.map((t, i) => {
    const form = computeForm(t.name);
    return {
      id: i + 1,
      name: t.name,
      code: t.code,
      confederation: t.confederation,
      fifa_ranking: t.fifa_ranking,
      elo_rating: t.elo,
      group: t.group,
      qualified: true,
      form_points: form.form_points,
      goals_scored_avg: form.goals_scored_avg || 1.4,
      goals_conceded_avg: form.goals_conceded_avg || 1.0,
      quali_points: 0,
      quali_goal_diff: 0,
    };
  });

  if (confederation) {
    teams = teams.filter(t => t.confederation === confederation);
  }

  teams.sort((a, b) => a.fifa_ranking - b.fifa_ranking);
  res.json(teams);
}
