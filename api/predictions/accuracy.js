export default function handler(req, res) {
  res.json({ data: { accuracy: null, total_predictions: 0, correct_predictions: 0, message: 'Aucun match joué pour le moment' } });
}
