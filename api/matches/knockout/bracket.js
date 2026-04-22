export default function handler(req, res) {
  // Bracket éliminatoire vide (matchs à définir après phase de groupes)
  const rounds = ['Huitièmes', 'Quarts', 'Demi-finales', 'Finale'];
  const bracket = rounds.map(r => ({ round: r, matches: [] }));
  res.json({ data: bracket });
}
