import { useQuery } from '@tanstack/react-query'
import { matchesApi, predictionsApi } from '../services/api'
import { Trophy, RefreshCw } from 'lucide-react'
import { FlagImg } from '../utils/flags'

export default function Bracket() {
  const { data: bracket, isLoading } = useQuery({
    queryKey: ['bracket'],
    queryFn: () => matchesApi.getBracket(),
  })

  const { data: simulation, refetch: refetchSimulation, isFetching } = useQuery({
    queryKey: ['tournamentSimulation'],
    queryFn: () => predictionsApi.simulateTournament(1000),
    staleTime: 1000 * 60 * 10,
  })

  if (isLoading) {
    return (
      <div className="card text-center text-gray-500 dark:text-gray-400">
        Chargement du tableau...
      </div>
    )
  }

  const stages = [
    'Round of 32',
    'Round of 16',
    'Quarter-final',
    'Semi-final',
    'Final',
  ]

  const stageLabels: Record<string, string> = {
    'Round of 32': '32es de finale',
    'Round of 16': '16es de finale',
    'Quarter-final': 'Quart de finale',
    'Semi-final': 'Demi-finale',
    'Final': 'Finale',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Tableau éliminatoire</h1>
        <button
          onClick={() => refetchSimulation()}
          disabled={isFetching}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Lancer la simulation
        </button>
      </div>

      {/* Tournament Prediction */}
      {simulation?.data && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold">Prédiction du tournoi</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Winner */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">Vainqueur prédit</div>
              <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
                {simulation.data.winner}
              </div>
              <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                {((simulation.data.win_probabilities[simulation.data.winner] || 0) * 100).toFixed(1)}% de chances
              </div>
            </div>

            {/* Runner-up */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">Finaliste</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {simulation.data.runner_up}
              </div>
            </div>

            {/* Semi-finalists */}
            <div className="text-center md:col-span-2">
              <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">Demi-finalistes</div>
              <div className="flex flex-wrap justify-center gap-2">
                {simulation.data.semi_finalists.map((team) => (
                  <span
                    key={team}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm dark:bg-gray-700"
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400 text-center dark:text-gray-500">
            Basé sur {simulation.data.simulations_run.toLocaleString()} simulations Monte Carlo
          </div>
        </div>
      )}

      {/* Win Probabilities */}
      {simulation?.data && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Probabilités de victoire</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(simulation.data.win_probabilities)
              .slice(0, 16)
              .map(([team, prob], index) => (
                <div key={team} className="flex items-center gap-3">
                  <span className="w-6 text-gray-500 text-sm dark:text-gray-400">{index + 1}.</span>
                  <span className="flex-1 font-medium">{team}</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(prob as number) * 100 * 5}%`,
                        backgroundColor: index < 4 ? '#F59E0B' : index < 8 ? '#3B82F6' : '#6B7280',
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm text-gray-500 dark:text-gray-400">
                    {((prob as number) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bracket Visualization */}
      <div className="card overflow-x-auto">
        <h3 className="text-xl font-bold mb-6">Tableau des phases éliminatoires</h3>

        <div className="min-w-[800px]">
          <div className="flex justify-around mb-4">
            {stages.map((stage) => (
              <div
                key={stage}
                className="text-center font-semibold text-gray-500 dark:text-gray-400"
              >
                {stageLabels[stage] || stage}
              </div>
            ))}
          </div>

          <div className="flex justify-around gap-4">
            {stages.map((stage) => {
              const stageMatches = bracket?.data?.[stage] || []
              return (
                <div key={stage} className="flex-1 space-y-2">
                  {stageMatches.length > 0 ? (
                    stageMatches.map((match: any) => (
                      <div
                        key={match.id}
                        className={`bg-gray-100 rounded-lg p-3 text-sm dark:bg-gray-700/50 ${
                          stage === 'Final' ? 'border-2 border-yellow-500' : ''
                        }`}
                      >
                        <div className={`flex justify-between ${match.played && match.home_score > match.away_score ? 'font-bold' : ''}`}>
                          <span className="flex items-center gap-1"><FlagImg code={match.home_team} size={20} />{match.home_team}</span>
                          {match.played && <span>{match.home_score}</span>}
                        </div>
                        <div className="border-t border-gray-200 my-1 dark:border-gray-600" />
                        <div className={`flex justify-between ${match.played && match.away_score > match.home_score ? 'font-bold' : ''}`}>
                          <span className="flex items-center gap-1"><FlagImg code={match.away_team} size={20} />{match.away_team}</span>
                          {match.played && <span>{match.away_score}</span>}
                        </div>
                        {match.predictions && !match.played && (
                          <div className="mt-2 text-xs text-gray-500 text-center dark:text-gray-400">
                            {(match.predictions.home_win * 100).toFixed(0)}% - {(match.predictions.draw * 100).toFixed(0)}% - {(match.predictions.away_win * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-100/60 rounded-lg p-4 text-center text-gray-400 text-sm dark:bg-gray-700/30 dark:text-gray-500">
                      À définir
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Knockout Format Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/30">
        <h3 className="text-lg font-bold mb-3">Format des phases éliminatoires</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>- 32es de finale : 32 équipes (24 premiers/2es de groupe + 8 meilleurs 3es)</li>
          <li>- 16es de finale : 16 équipes</li>
          <li>- Quarts de finale : 8 équipes</li>
          <li>- Demi-finales : 4 équipes</li>
          <li>- Match pour la 3e place + Finale</li>
          <li>- Tous les matchs éliminatoires se décident aux prolongations et tirs au but si nécessaire</li>
        </ul>
      </div>
    </div>
  )
}
