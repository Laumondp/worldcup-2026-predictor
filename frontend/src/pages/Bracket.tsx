import { useQuery } from '@tanstack/react-query'
import { matchesApi, predictionsApi } from '../services/api'
import { Trophy, RefreshCw } from 'lucide-react'

export default function Bracket() {
  const { data: bracket, isLoading } = useQuery({
    queryKey: ['bracket'],
    queryFn: () => matchesApi.getBracket(),
  })

  const { data: simulation, refetch: refetchSimulation, isFetching } = useQuery({
    queryKey: ['tournamentSimulation'],
    queryFn: () => predictionsApi.simulateTournament(1000),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  if (isLoading) {
    return (
      <div className="card text-center text-gray-400">
        Loading bracket...
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Knockout Bracket</h1>
        <button
          onClick={() => refetchSimulation()}
          disabled={isFetching}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Run Simulation
        </button>
      </div>

      {/* Tournament Prediction */}
      {simulation?.data && (
        <div className="card bg-gradient-to-r from-yellow-900/30 to-orange-900/30">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold">Tournament Prediction</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Winner */}
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Predicted Winner</div>
              <div className="text-3xl font-bold text-yellow-400">
                {simulation.data.winner}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {((simulation.data.win_probabilities[simulation.data.winner] || 0) * 100).toFixed(1)}% chance
              </div>
            </div>

            {/* Runner-up */}
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Runner-up</div>
              <div className="text-2xl font-bold text-gray-300">
                {simulation.data.runner_up}
              </div>
            </div>

            {/* Semi-finalists */}
            <div className="text-center md:col-span-2">
              <div className="text-sm text-gray-400 mb-2">Semi-finalists</div>
              <div className="flex flex-wrap justify-center gap-2">
                {simulation.data.semi_finalists.map((team) => (
                  <span
                    key={team}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Based on {simulation.data.simulations_run.toLocaleString()} Monte Carlo simulations
          </div>
        </div>
      )}

      {/* Win Probabilities */}
      {simulation?.data && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Win Probabilities</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(simulation.data.win_probabilities)
              .slice(0, 16)
              .map(([team, prob], index) => (
                <div key={team} className="flex items-center gap-3">
                  <span className="w-6 text-gray-400 text-sm">{index + 1}.</span>
                  <span className="flex-1 font-medium">{team}</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(prob as number) * 100 * 5}%`,
                        backgroundColor: index < 4 ? '#F59E0B' : index < 8 ? '#3B82F6' : '#6B7280',
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm text-gray-400">
                    {((prob as number) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bracket Visualization */}
      <div className="card overflow-x-auto">
        <h3 className="text-xl font-bold mb-6">Knockout Stage Bracket</h3>

        <div className="min-w-[800px]">
          <div className="flex justify-around mb-4">
            {stages.map((stage) => (
              <div
                key={stage}
                className="text-center font-semibold text-gray-400"
              >
                {stage}
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
                        className={`bg-gray-700/50 rounded-lg p-3 text-sm ${
                          stage === 'Final' ? 'border-2 border-yellow-500' : ''
                        }`}
                      >
                        <div className={`flex justify-between ${match.played && match.home_score > match.away_score ? 'font-bold' : ''}`}>
                          <span>{match.home_team}</span>
                          {match.played && <span>{match.home_score}</span>}
                        </div>
                        <div className="border-t border-gray-600 my-1" />
                        <div className={`flex justify-between ${match.played && match.away_score > match.home_score ? 'font-bold' : ''}`}>
                          <span>{match.away_team}</span>
                          {match.played && <span>{match.away_score}</span>}
                        </div>
                        {match.predictions && !match.played && (
                          <div className="mt-2 text-xs text-gray-400 text-center">
                            {(match.predictions.home_win * 100).toFixed(0)}% - {(match.predictions.draw * 100).toFixed(0)}% - {(match.predictions.away_win * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-700/30 rounded-lg p-4 text-center text-gray-500 text-sm">
                      TBD
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Knockout Format Info */}
      <div className="card bg-blue-900/30">
        <h3 className="text-lg font-bold mb-3">Knockout Stage Format</h3>
        <ul className="space-y-2 text-gray-300">
          <li>- Round of 32: 32 teams (24 group winners/runners-up + 8 best 3rd place)</li>
          <li>- Round of 16: 16 winning teams</li>
          <li>- Quarter-finals: 8 teams</li>
          <li>- Semi-finals: 4 teams</li>
          <li>- Third Place Playoff + Final</li>
          <li>- All knockout matches decided by extra time and penalties if needed</li>
        </ul>
      </div>
    </div>
  )
}
