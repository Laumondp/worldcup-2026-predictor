import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { predictionsApi } from '../services/api'
import type { RoundProbabilities } from '../services/api'
import { Trophy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { FlagImg } from '../utils/flags'
import { Helmet } from 'react-helmet-async'

const ROUND_LABELS: Record<keyof RoundProbabilities, string> = {
  qualify:  'Qualification',
  r16:      '16es',
  qf:       'Quarts',
  sf:       'Demies',
  final:    'Finale',
  champion: 'Champion',
}


function ProbBar({ value, color }: { value: number; color: string }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-9 text-right text-xs tabular-nums text-gray-600 dark:text-gray-400">
        {pct}%
      </span>
    </div>
  )
}

export default function Bracket() {
  const [showAnalytical, setShowAnalytical] = useState(false)
  const [sortRound, setSortRound] = useState<keyof RoundProbabilities>('champion')

  const { data: simulation, refetch, isFetching } = useQuery({
    queryKey: ['tournamentSimulation'],
    queryFn: () => predictionsApi.simulateTournament(2000),
    staleTime: 1000 * 60 * 10,
  })

  const sim = simulation?.data

  // Build sorted teams table
  const teams = sim?.round_probabilities
    ? Object.entries(sim.round_probabilities)
        .map(([name, probs]) => ({ name, ...probs }))
        .sort((a, b) => b[sortRound] - a[sortRound])
    : []

  const roundKeys: (keyof RoundProbabilities)[] = ['qualify', 'r16', 'qf', 'sf', 'final', 'champion']

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Tableau éliminatoire — FIFA World Cup 2026</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Simulation du tournoi</h1>
          {sim?.model && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Modèle : <span className="font-medium text-blue-600 dark:text-blue-400">{sim.model}</span>
              {' · '}{sim.simulations_run.toLocaleString()} simulations Monte Carlo
            </p>
          )}
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Simulation en cours…' : 'Relancer la simulation'}
        </button>
      </div>

      {/* ── Podium prédit ── */}
      {sim && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-3 mb-5">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-xl font-bold">Prédiction du tournoi</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">🥇 Vainqueur</div>
              <div className="flex items-center justify-center gap-2">
                <FlagImg code={sim.winner} size={24} />
                <span className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{sim.winner}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {((sim.win_probabilities[sim.winner] || 0) * 100).toFixed(1)}% de chances
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">🥈 Finaliste</div>
              <div className="flex items-center justify-center gap-2">
                <FlagImg code={sim.runner_up} size={24} />
                <span className="text-xl font-bold text-gray-700 dark:text-gray-300">{sim.runner_up}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {sim.round_probabilities?.[sim.runner_up]?.final != null
                  ? `${(sim.round_probabilities[sim.runner_up].final * 100).toFixed(1)}% finale`
                  : `${((sim.win_probabilities[sim.runner_up] || 0) * 100).toFixed(1)}%`}
              </div>
            </div>
            <div className="text-center md:col-span-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">🥉 Demi-finalistes</div>
              <div className="flex flex-wrap justify-center gap-2">
                {sim.semi_finalists.map((team) => (
                  <span key={team} className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full text-sm font-medium">
                    <FlagImg code={team} size={16} />
                    {team}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Probabilités par tour (toutes les 48 équipes) ── */}
      {teams.length > 0 && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold">Probabilités d'avancement par tour</h3>
            <div className="flex flex-wrap gap-1">
              {roundKeys.map((r) => (
                <button
                  key={r}
                  onClick={() => setSortRound(r)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    sortRound === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {ROUND_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 pr-3 font-medium w-6">#</th>
                  <th className="pb-2 pr-4 font-medium">Équipe</th>
                  {roundKeys.map((r) => (
                    <th key={r} className={`pb-2 px-2 font-medium text-center ${sortRound === r ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {ROUND_LABELS[r]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {teams.map((team, idx) => (
                  <tr key={team.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-2 pr-3 text-gray-400 dark:text-gray-500 text-xs">{idx + 1}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <FlagImg code={team.name} size={20} />
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </td>
                    {roundKeys.map((r) => {
                      const val = team[r] as number
                      const pct = Math.round(val * 100)
                      const isSort = r === sortRound
                      return (
                        <td key={r} className={`py-2 px-2 text-center tabular-nums text-xs ${
                          isSort ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          <span className={`inline-block px-2 py-0.5 rounded-full ${
                            pct >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                            pct >= 40 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                            pct >= 15 ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' :
                            'text-gray-400 dark:text-gray-600'
                          }`}>
                            {pct}%
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Top 16 — probabilités de victoire ── */}
      {sim?.win_probabilities && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Top 16 — probabilités de remporter le tournoi</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(sim.win_probabilities).slice(0, 16).map(([team, prob], index) => (
              <div key={team} className="flex items-center gap-3">
                <span className="w-6 text-gray-400 dark:text-gray-500 text-xs text-right">{index + 1}.</span>
                <FlagImg code={team} size={20} />
                <span className="flex-1 font-medium text-sm">{team}</span>
                <ProbBar
                  value={prob as number}
                  color={index < 4 ? 'bg-yellow-500' : index < 8 ? 'bg-blue-500' : 'bg-gray-400'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Calcul analytique des groupes ── */}
      {sim?.analytical_groups && (
        <div className="card">
          <button
            onClick={() => setShowAnalytical(v => !v)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h3 className="text-xl font-bold">Probabilités analytiques de groupes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Calcul exact par énumération des 729 résultats possibles par groupe (sans aléatoire)
              </p>
            </div>
            {showAnalytical
              ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
              : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
            }
          </button>

          {showAnalytical && (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(sim.analytical_groups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([group, groupTeams]) => (
                  <div key={group} className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4">
                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3">Groupe {group}</h4>
                    <div className="space-y-3">
                      {[...groupTeams].sort((a, b) => b.p_qualify - a.p_qualify).map((t) => (
                        <div key={t.name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <FlagImg code={t.code} size={16} />
                              <span className="text-sm font-medium">{t.name}</span>
                            </div>
                            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="text-green-600 dark:text-green-400 font-semibold">
                                {Math.round(t.p_qualify * 100)}% qual.
                              </span>
                              <span>1er: {Math.round(t.p_1st * 100)}%</span>
                              <span>3e: {Math.round(t.p_3rd * 100)}%</span>
                            </div>
                          </div>
                          <ProbBar value={t.p_qualify} color={t.p_qualify >= 0.5 ? 'bg-green-500' : 'bg-orange-400'} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ── Info format ── */}
      <div className="card bg-blue-50 dark:bg-blue-900/20">
        <h3 className="text-lg font-bold mb-3">Format de la Coupe du Monde 2026</h3>
        <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
          <li>• 48 équipes réparties en 12 groupes de 4 — 72 matchs de poule</li>
          <li>• 32 qualifiés : 2 premiers de chaque groupe + 8 meilleurs 3es</li>
          <li>• 16es → 8es → Quarts → Demies → Finale (+ match 3e place)</li>
          <li>• Prolongations et tirs au but si nécessaire en phase éliminatoire</li>
        </ul>
      </div>
    </div>
  )
}
