import { useQuery } from '@tanstack/react-query'
import { predictionsApi, matchesApi } from '../services/api'
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function History() {
  const { data: accuracy } = useQuery({
    queryKey: ['accuracy'],
    queryFn: () => predictionsApi.getAccuracy(),
  })

  const { data: playedMatches } = useQuery({
    queryKey: ['playedMatches'],
    queryFn: () => matchesApi.getAll(undefined, true),
  })

  const accuracyData = accuracy?.data
  const hasData = accuracyData && accuracyData.total_predictions > 0

  const pieData = hasData
    ? [
        { name: 'Correct', value: accuracyData.correct_predictions },
        { name: 'Incorrect', value: accuracyData.total_predictions - accuracyData.correct_predictions },
      ]
    : []



  const COLORS = ['#10B981', '#EF4444']

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Historique des prédictions</h1>
        <div className="text-gray-400">Précision du modèle</div>
      </div>

      {/* Accuracy Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-blue-400">
            {hasData ? `${(accuracyData.accuracy * 100).toFixed(1)}%` : '--'}
          </div>
          <div className="text-gray-400 mt-2">Précision globale</div>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-green-400">
            {hasData ? accuracyData.correct_predictions : '--'}
          </div>
          <div className="text-gray-400 mt-2">Prédictions correctes</div>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-4xl font-bold">
            {hasData ? accuracyData.total_predictions : '--'}
          </div>
          <div className="text-gray-400 mt-2">Total des prédictions</div>
        </div>
      </div>

      {/* Accuracy Chart */}
      {hasData && (
        <div className="card">
          <h2 className="text-xl font-bold mb-6 text-center">Précision des prédictions</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Played Matches with Results */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Matchs terminés</h2>

        {playedMatches?.data && playedMatches.data.length > 0 ? (
          <div className="space-y-4">
            {playedMatches.data.map((match: any) => {
              const prediction = match.pred_home_win && match.pred_away_win
                ? (match.pred_home_win > match.pred_draw && match.pred_home_win > match.pred_away_win
                    ? 'home_win'
                    : match.pred_draw > match.pred_away_win
                    ? 'draw'
                    : 'away_win')
                : null

              const actual =
                match.home_score > match.away_score
                  ? 'home_win'
                  : match.home_score < match.away_score
                  ? 'away_win'
                  : 'draw'

              const isCorrect = prediction === actual

              return (
                <div
                  key={match.id}
                  className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex-shrink-0">
                    {prediction ? (
                      isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )
                    ) : (
                      <Clock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{match.home_team}</span>
                        <span className="text-gray-400 mx-2">vs</span>
                        <span className="font-medium">{match.away_team}</span>
                      </div>
                      <div className="text-xl font-bold">
                        {match.home_score} - {match.away_score}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {match.stage} | {new Date(match.date).toLocaleDateString()}
                    </div>
                  </div>

                  {prediction && (
                    <div className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun match terminé pour l'instant</p>
            <p className="text-sm mt-2">
              Les résultats apparaîtront ici une fois les matchs joués
            </p>
          </div>
        )}
      </div>

      {/* Model Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/30">
        <h3 className="text-lg font-bold mb-3">À propos de nos prédictions</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="text-gray-700 dark:text-gray-300">- Modèle combinant Random Forest et XGBoost</li>
          <li className="text-gray-700 dark:text-gray-300">- Critères : classement FIFA, cotes ELO, forme, historique des confrontations</li>
          <li className="text-gray-700 dark:text-gray-300">- Entraîné sur les matchs historiques de Coupes du Monde et internationaux</li>
          <li className="text-gray-700 dark:text-gray-300">- Les prédictions se mettent à jour à chaque nouvelle donnée</li>
          <li className="text-gray-700 dark:text-gray-300">- Précision cible : 50% (base aléatoire : 33%)</li>
        </ul>
      </div>
    </div>
  )
}
