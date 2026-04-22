export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  res.json({ status: 'success', source: 'static', matches_added: 0, matches_removed: 0, teams_updated: 0, last_updated: new Date().toISOString() });
}
