import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { predictionsApi, teamsApi } from '../services/api'
import TeamSelector from '../components/TeamSelector'
import ProbabilityChart from '../components/ProbabilityChart'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

export default function Predictions() {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [isKnockout, setIsKnockout] = useState(false)
  const [showPrediction, setShowPrediction] = useState(true)

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

  useEffect(() => {
    if (prediction?.data) setShowPrediction(true)
  }, [prediction?.data])

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
      <Helmet>
        <title>Prédictions de matchs — FIFA World Cup 2026</title>
        <meta name="description" content="Prédictions IA pour n'importe quel match de la Coupe du Monde 2026. Probabilités de victoire, score prédit et historique des confrontations entre équipes." />
      </Helmet>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Prédictions de matchs</h1>
        <p className="text-gray-500 dark:text-gray-400">
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
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={isKnockout}
              onChange={(e) => setIsKnockout(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
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
        <>
          <button
            onClick={() => setShowPrediction(v => !v)}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all font-semibold text-lg dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
          >
            {showPrediction ? (
              <>
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Masquer la prédiction
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-yellow-600 font-bold text-base dark:text-yellow-400">
                  {getOutcomeLabel(prediction.data?.predicted_outcome ?? '')}
                </span>
                <span className="text-sm text-gray-700 flex items-center gap-2 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-300">{homeTeam}</span>
                  <span className="font-bold">
                    {(prediction.data?.predicted_home_score ?? 0).toFixed(1)}
                    {' – '}
                    {(prediction.data?.predicted_away_score ?? 0).toFixed(1)}
                  </span>
                  <span className="text-red-600 dark:text-red-300">{awayTeam}</span>
                </span>
                <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 dark:text-gray-500">
                  <ChevronDown className="w-3 h-3" /> Afficher les détails
                </span>
              </div>
            )}
          </button>

          {showPrediction && (
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
              <div className="bg-gray-100 rounded-xl p-6 text-center dark:bg-gray-700/50">
                <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">Résultat prédit</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {getOutcomeLabel(prediction.data.predicted_outcome)}
                </div>
                <div className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                  Confiance : {(prediction.data.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-6 text-center dark:bg-gray-700/50">
                <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">Score prédit</div>
                <div className="text-3xl font-bold">
                  <span className="text-blue-600 dark:text-blue-400">{prediction.data.predicted_home_score.toFixed(1)}</span>
                  <span className="text-gray-400 mx-3 dark:text-gray-500">-</span>
                  <span className="text-red-600 dark:text-red-400">{prediction.data.predicted_away_score.toFixed(1)}</span>
                </div>
              </div>

              {/* Probability Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{homeTeam}</span>
                    <span>{(prediction.data.home_win_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
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
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
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
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
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
        </>
      )}

      {/* Mascots banner */}
      <div className="rounded-2xl overflow-hidden">
        <img
          src="/mascottes-figurines.jpg"
          alt="Maple, Zayu et Clutch — FIFA World Cup 2026"
          className="w-full object-contain"
        />
      </div>

      {/* Amazon link */}
      <a
        href="https://www.amazon.fr/s?k=coupe+du+monde+2026&crid=24PG4PM056YSN&sprefix=coupe+du+monde+2026+%2Caps%2C233&ref=nb_sb_ss_mvt-t11-ranker_1_14"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-white hover:bg-gray-50 transition-colors px-6 py-4 text-center shadow-lg border border-gray-200 dark:bg-white/95 dark:hover:bg-white dark:border-transparent"
      >
        <p className="text-gray-500 text-sm mb-2">Retrouvez les produits officiels</p>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon — Produits Coupe du Monde 2026"
          className="h-10 mx-auto"
        />
      </a>

      {/* Head to Head */}
      {h2h?.data && h2h.data.total_matches > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Historique des confrontations</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{h2h.data.team1_wins}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Victoires {homeTeam}</div>
            </div>
            <div className="bg-gray-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{h2h.data.draws}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Nuls</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{h2h.data.team2_wins}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Victoires {awayTeam}</div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
            {h2h.data.total_matches} matchs disputés | Buts : {h2h.data.team1_goals} - {h2h.data.team2_goals}
          </div>
        </div>
      )}
    </div>
  )
}
