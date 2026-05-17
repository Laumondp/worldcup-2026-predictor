import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { teamsApi, Team } from '../services/api'
import { Search, Filter } from 'lucide-react'

const confederations = [
  { value: '', label: 'Toutes les confédérations' },
  { value: 'UEFA', label: 'UEFA (Europe)' },
  { value: 'CONMEBOL', label: 'CONMEBOL (Amérique du Sud)' },
  { value: 'CONCACAF', label: 'CONCACAF (Amérique du Nord/Centrale)' },
  { value: 'AFC', label: 'AFC (Asie)' },
  { value: 'CAF', label: 'CAF (Afrique)' },
  { value: 'OFC', label: 'OFC (Océanie)' },
]

export default function Teams() {
  const [search, setSearch] = useState('')
  const [confederation, setConfederation] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams', confederation],
    queryFn: () => teamsApi.getAll(confederation || undefined),
  })

  const { data: teamDetails } = useQuery({
    queryKey: ['teamDetails', selectedTeam],
    queryFn: () => teamsApi.getByName(selectedTeam!),
    enabled: !!selectedTeam,
  })

  const filteredTeams = teams?.data.filter((team: Team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  const getRankingBadge = (ranking: number) => {
    if (ranking <= 10) return 'bg-yellow-500'
    if (ranking <= 25) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Équipes qualifiées</h1>
        <div className="text-gray-400">48 équipes en compétition</div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une équipe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={confederation}
              onChange={(e) => setConfederation(e.target.value)}
              className="input w-full pl-10 appearance-none"
            >
              {confederations.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="md:col-span-2 space-y-4">
          {isLoading ? (
            <div className="card text-center text-gray-400">Chargement des équipes...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTeams.map((team: Team) => (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team.name)}
                  className={`card cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 ${
                    selectedTeam === team.name ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{team.name}</h3>
                      <div className="text-sm text-gray-400">{team.confederation}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getRankingBadge(team.fifa_ranking)}`}
                    >
                      #{team.fifa_ranking}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Groupe : </span>
                      <span className="font-semibold">{team.group || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">ELO : </span>
                      <span className="font-semibold">{team.elo_rating.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Details Panel */}
        <div className="space-y-4">
          {selectedTeam && teamDetails?.data ? (
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold mb-4">{teamDetails.data.name}</h2>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      #{teamDetails.data.fifa_ranking}
                    </div>
                    <div className="text-xs text-gray-400">Classement FIFA</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {teamDetails.data.elo_rating.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">Cote ELO</div>
                  </div>
                </div>

                {/* Confederation & Group */}
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confédération</span>
                    <span className="font-semibold">{teamDetails.data.confederation}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-400">Groupe</span>
                    <span className="font-semibold">{teamDetails.data.group || '-'}</span>
                  </div>
                </div>

                {/* Stats */}
                {teamDetails.data.stats && (
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Statistiques historiques</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Matchs</span>
                        <span>{teamDetails.data.stats.matches}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Victoires</span>
                        <span className="text-green-400">{teamDetails.data.stats.wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nuls</span>
                        <span className="text-yellow-400">{teamDetails.data.stats.draws}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Défaites</span>
                        <span className="text-red-400">{teamDetails.data.stats.losses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Buts</span>
                        <span>
                          {teamDetails.data.stats.goals_scored} - {teamDetails.data.stats.goals_conceded}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Qualification */}
                {teamDetails.data.qualification && (
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Statistiques de qualification</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Points</span>
                        <span>{teamDetails.data.qualification.points}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Différence de buts</span>
                        <span className={teamDetails.data.qualification.goal_diff >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {teamDetails.data.qualification.goal_diff >= 0 ? '+' : ''}{teamDetails.data.qualification.goal_diff}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center text-gray-400">
              Sélectionnez une équipe pour voir les détails
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
