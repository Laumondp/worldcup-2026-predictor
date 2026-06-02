import { RECENT_MATCHES, RECENT_MATCHES_DATE } from '../_data.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const played = RECENT_MATCHES.length;
  const upcoming = 0;
  res.json({
    status: 'success',
    source: 'static',
    matches_added: played,
    played,
    upcoming,
    rankings_date: RECENT_MATCHES_DATE,
    last_updated: new Date().toISOString(),
  });
}
