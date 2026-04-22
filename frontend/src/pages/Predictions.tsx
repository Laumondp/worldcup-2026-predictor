import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { predictionsApi, teamsApi } from '../services/api'
import TeamSelector from '../components/TeamSelector'
import ProbabilityChart from '../components/ProbabilityChart'
import { Sparkles } from 'lucide-react'

export default function Predictions() {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [isKnockout, setIsKnockout] = useState(false)

  const { data: prediction, isLoading, refetch } = useQuery({
    queryKey: ['prediction', homeTeam, awayTeam, isKnockout],
    queryFn: () => predictionsApi.predictMatch(homeTeam, awayTeam, isKnockout),
    enabled: false,
  })

  const { data: h2h } = useQuery({
    queryKey: ['h2h', homeTeam, awayTeam],
    queryFn: () => teamsApi.getHeadToHead(homeTeam, awayTeam),
    enabled: !!homeTeam && !!awayTeam,
  })

  const handlePredict = () => {
    if (homeTeam && awayTeam) {
      refetch()
    }
  }

  const getOutcomeLabel = (outcome: string) => {
    switch (outcome) {
      case 'home_win':
        return `Victoire ${homeTeam}`
      case 'draw':
        return 'Match nul'
      case 'away_win':
        return `Victoire ${awayTeam}`
      default:
        return outcome
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Prédictions de matchs</h1>
        <p className="text-gray-400">
          Sélectionnez deux équipes pour des prédictions IA
        </p>
      </div>

      {/* Team Selection */}
      <div className="card">
        <div className="grid md:grid-cols-2 gap-6">
          <TeamSelector
            label="Équipe à domicile"
            value={homeTeam}
            onChange={setHomeTeam}
            excludeTeam={awayTeam}
          />
          <TeamSelector
            label="Équipe à l'extérieur"
            value={awayTeam}
            onChange={setAwayTeam}
            excludeTeam={homeTeam}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={isKnockout}
              onChange={(e) => setIsKnockout(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600"
            />
            Match à élimination directe
          </label>

          <button
            onClick={handlePredict}
            disabled={!homeTeam || !awayTeam || isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Calcul en cours...'
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Obtenir la prédiction
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prediction Results */}
      {prediction?.data && (
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6">
            {homeTeam} vs {awayTeam}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Probability Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">Probabilités de victoire</h3>
              <ProbabilityChart
                homeWin={prediction.data.home_win_probability}
                draw={prediction.data.draw_probability}
                awayWin={prediction.data.away_win_probability}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />
            </div>

            {/* Prediction Details */}
            <div className="space-y-6">
              <div className="bg-gray-700/50 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Résultat prédit</div>
                <div className="text-2xl font-bold text-green-400">
                  {getOutcomeLabel(prediction.data.predicted_outcome)}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Confiance : {(prediction.data.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Score prédit</div>
                <div className="text-3xl font-bold">
                  <span className="text-blue-400">{prediction.data.predicted_home_score.toFixed(1)}</span>
                  <span className="text-gray-500 mx-3">-</span>
                  <span className="text-red-400">{prediction.data.predicted_away_score.toFixed(1)}</span>
                </div>
              </div>

              {/* Probability Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{homeTeam}</span>
                    <span>{(prediction.data.home_win_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${prediction.data.home_win_probability * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Match nul</span>
                    <span>{(prediction.data.draw_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 rounded-full transition-all"
                      style={{ width: `${prediction.data.draw_probability * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{awayTeam}</span>
                    <span>{(prediction.data.away_win_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${prediction.data.away_win_probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Head to Head */}
      {h2h?.data && h2h.data.total_matches > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Historique des confrontations</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">{h2h.data.team1_wins}</div>
              <div className="text-sm text-gray-400">Victoires {homeTeam}</div>
            </div>
            <div className="bg-gray-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-gray-400">{h2h.data.draws}</div>
              <div className="text-sm text-gray-400">Nuls</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-400">{h2h.data.team2_wins}</div>
              <div className="text-sm text-gray-400">Victoires {awayTeam}</div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400">
            {h2h.data.total_matches} matchs disputés | Buts : {h2h.data.team1_goals} - {h2h.data.team2_goals}
          </div>
        </div>
      )}
    </div>
  )
}
