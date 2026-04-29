import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { predictionsApi } from '../services/api'
import { FlagImg } from '../utils/flags'
import ProbabilityChart from './ProbabilityChart'

interface MatchCardProps {
  homeTeam: string
  awayTeam: string
  homeCode: string
  awayCode: string
  date: string
  stage: string
  played?: boolean
  homeScore?: number | null
  awayScore?: number | null
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeCode,
  awayCode,
  date,
  stage,
  played = false,
  homeScore,
  awayScore,
}: MatchCardProps) {
  const [showPrediction, setShowPrediction] = useState(false)

  const { data: prediction, isLoading, isError } = useQuery({
    queryKey: ['prediction', homeTeam, awayTeam],
    queryFn: () => predictionsApi.predictMatch(homeTeam, awayTeam, !(stage ?? '').toLowerCase().includes('group')),
    enabled: showPrediction && !played,
    retry: 1,
  })

  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="card hover:ring-2 hover:ring-blue-500 transition-all">
      <div className="text-sm text-gray-400 mb-3 flex justify-between">
        <span>{stage}</span>
        <span>{formattedDate}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* Home Team */}
        <div className="flex-1 text-center">
          <div className="flex justify-center mb-2"><FlagImg code={homeCode} size={48} /></div>
          <div className="text-sm text-gray-300">{homeTeam}</div>
        </div>

        {/* Score or VS */}
        <div className="px-6">
          {played ? (
            <div className="text-3xl font-bold">
              <span className={homeScore! > awayScore! ? 'text-green-400' : ''}>
                {homeScore}
              </span>
              <span className="text-gray-500 mx-2">-</span>
              <span className={awayScore! > homeScore! ? 'text-green-400' : ''}>
                {awayScore}
              </span>
            </div>
          ) : (
            <span className="text-2xl text-gray-500 font-bold">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 text-center">
          <div className="flex justify-center mb-2"><FlagImg code={awayCode} size={48} /></div>
          <div className="text-sm text-gray-300">{awayTeam}</div>
        </div>
      </div>

      {/* Prediction section */}
      {!played && (
        <>
          <button
            onClick={() => setShowPrediction(!showPrediction)}
            className="w-full btn-secondary text-sm"
          >
            {showPrediction ? 'Masquer la prédiction' : 'Voir la prédiction'}
          </button>

          {showPrediction && (
            <div className="mt-4">
              {isLoading ? (
                <div className="text-center text-gray-400">Chargement...</div>
              ) : isError ? (
                <div className="text-center text-red-400 text-sm py-2">Prédiction indisponible pour ce match</div>
              ) : prediction ? (
                <div>
                  <ProbabilityChart
                    homeWin={prediction.data.home_win_probability}
                    draw={prediction.data.draw_probability}
                    awayWin={prediction.data.away_win_probability}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                  />
                  <div className="text-center mt-4">
                    <div className="text-sm text-gray-400 mb-1">Score prédit</div>
                    <div className="text-xl font-bold">
                      {prediction.data.predicted_home_score.toFixed(1)} - {prediction.data.predicted_away_score.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      Confiance : {(prediction.data.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  )
}
