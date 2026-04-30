import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { matchesApi, GroupStanding } from '../services/api'
import { FlagImg } from '../utils/flags'

const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function Groups() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const { data: standings, isLoading } = useQuery({
    queryKey: ['groupStandings'],
    queryFn: () => matchesApi.getGroupStandings(),
  })

  const { data: groupMatches } = useQuery({
    queryKey: ['groupMatches', selectedGroup],
    queryFn: () => matchesApi.getGroupMatches(selectedGroup!),
    enabled: !!selectedGroup,
  })

  if (isLoading) {
    return (
      <div className="card text-center text-gray-500 dark:text-gray-400">
        Chargement des classements...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Phase de groupes</h1>
        <div className="text-gray-500 dark:text-gray-400">12 groupes de 4 équipes</div>
      </div>

      {/* Group Tabs */}
      <div className="flex flex-wrap gap-2">
        {groupLetters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedGroup(selectedGroup === letter ? null : letter)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedGroup === letter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Groupe {letter}
          </button>
        ))}
      </div>

      {/* Group Standings */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standings?.data
          ?.filter((g: GroupStanding) => !selectedGroup || g.group === selectedGroup)
          .map((group: GroupStanding) => (
            <div key={group.group} className="card !p-3">
              <h3 className="text-base font-bold mb-2 text-center">
                Groupe {group.group}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                      <th className="text-left py-1 pr-1">Équipe</th>
                      <th className="text-center py-1 px-1">J</th>
                      <th className="text-center py-1 px-1">V</th>
                      <th className="text-center py-1 px-1">N</th>
                      <th className="text-center py-1 px-1">D</th>
                      <th className="text-center py-1 px-1">DB</th>
                      <th className="text-center py-1 px-1 font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map((team, index) => (
                      <tr
                        key={team.name}
                        className={`border-b border-gray-100 dark:border-gray-700/50 ${
                          index < 2 ? 'bg-green-50 dark:bg-green-900/20' : ''
                        }`}
                      >
                        <td className="py-1 pr-1">
                          <span className="inline-flex items-center gap-1">
                            <FlagImg code={team.code} size={18} />
                            <span className="truncate max-w-[72px]">{team.name}</span>
                          </span>
                        </td>
                        <td className="text-center py-1 px-1">{team.played}</td>
                        <td className="text-center py-1 px-1 text-green-600 dark:text-green-400">{team.wins}</td>
                        <td className="text-center py-1 px-1 text-yellow-600 dark:text-yellow-400">{team.draws}</td>
                        <td className="text-center py-1 px-1 text-red-600 dark:text-red-400">{team.losses}</td>
                        <td className="text-center py-1 px-1">
                          <span className={team.goal_difference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {team.goal_difference >= 0 ? '+' : ''}{team.goal_difference}
                          </span>
                        </td>
                        <td className="text-center py-1 px-1 font-bold">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-[10px] text-gray-500 text-center dark:text-gray-400">
                Les 2 premiers qualifiés · 8 meilleurs 3es
              </div>
            </div>
          ))}
      </div>

      {/* Selected Group Matches */}
      {selectedGroup && groupMatches?.data && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Matchs du Groupe {selectedGroup}</h3>
          <div className="space-y-3">
            {groupMatches.data.map((match: any) => (
              <div
                key={match.id}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-4 dark:bg-gray-700/50"
              >
                <div className="flex-1 text-right">
                  <span className="font-medium">{match.home_team}</span>
                </div>
                <div className="px-6 text-center">
                  {match.played ? (
                    <span className="text-xl font-bold">
                      {match.home_score} - {match.away_score}
                    </span>
                  ) : (
                    <span className="text-gray-400">vs</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{match.away_team}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Stage Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/30">
        <h3 className="text-lg font-bold mb-3">Format de la Coupe du Monde 2026</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>- 48 équipes réparties en 12 groupes de 4</li>
          <li>- Chaque équipe dispute 3 matchs de phase de groupes</li>
          <li>- Les 2 premiers de chaque groupe avancent (24 équipes)</li>
          <li>- Les 8 meilleurs 3es se qualifient également</li>
          <li>- 32es de finale, puis élimination directe jusqu'en Finale</li>
        </ul>
      </div>
    </div>
  )
}
