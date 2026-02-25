import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { matchesApi, GroupStanding } from '../services/api'

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
      <div className="card text-center text-gray-400">
        Loading group standings...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Group Stage</h1>
        <div className="text-gray-400">12 groups of 4 teams</div>
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
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Group {letter}
          </button>
        ))}
      </div>

      {/* Group Standings */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standings?.data
          ?.filter((g: GroupStanding) => !selectedGroup || g.group === selectedGroup)
          .map((group: GroupStanding) => (
            <div key={group.group} className="card">
              <h3 className="text-xl font-bold mb-4 text-center">
                Group {group.group}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="text-left py-2">Team</th>
                      <th className="text-center py-2">P</th>
                      <th className="text-center py-2">W</th>
                      <th className="text-center py-2">D</th>
                      <th className="text-center py-2">L</th>
                      <th className="text-center py-2">GD</th>
                      <th className="text-center py-2 font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map((team, index) => (
                      <tr
                        key={team.name}
                        className={`border-b border-gray-700/50 ${
                          index < 2 ? 'bg-green-900/20' : ''
                        }`}
                      >
                        <td className="py-2">
                          <span className="font-medium">{team.code}</span>
                          <span className="text-gray-400 ml-2 hidden md:inline">
                            {team.name}
                          </span>
                        </td>
                        <td className="text-center py-2">{team.played}</td>
                        <td className="text-center py-2 text-green-400">{team.wins}</td>
                        <td className="text-center py-2 text-yellow-400">{team.draws}</td>
                        <td className="text-center py-2 text-red-400">{team.losses}</td>
                        <td className="text-center py-2">
                          <span className={team.goal_difference >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {team.goal_difference >= 0 ? '+' : ''}{team.goal_difference}
                          </span>
                        </td>
                        <td className="text-center py-2 font-bold">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-xs text-gray-400 text-center">
                Top 2 teams qualify for Round of 32
              </div>
            </div>
          ))}
      </div>

      {/* Selected Group Matches */}
      {selectedGroup && groupMatches?.data && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Group {selectedGroup} Matches</h3>
          <div className="space-y-3">
            {groupMatches.data.map((match: any) => (
              <div
                key={match.id}
                className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4"
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
      <div className="card bg-blue-900/30">
        <h3 className="text-lg font-bold mb-3">World Cup 2026 Format</h3>
        <ul className="space-y-2 text-gray-300">
          <li>- 48 teams divided into 12 groups of 4</li>
          <li>- Each team plays 3 group stage matches</li>
          <li>- Top 2 from each group advance (24 teams)</li>
          <li>- 8 best third-placed teams also qualify</li>
          <li>- Round of 32, then knockout stages to Final</li>
        </ul>
      </div>
    </div>
  )
}
