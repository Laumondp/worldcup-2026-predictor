import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trophy, ChevronDown, ChevronUp, Wifi, Clock } from 'lucide-react'
import axios from 'axios'
import { matchesApi, GroupStanding } from '../services/api'
import { FlagImg, flagUrl } from '../utils/flags'

const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

interface KOFixture {
  id: string
  date: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  stage: string
  group: string
  venue: string
  city: string
  status: 'scheduled' | 'live' | 'finished'
}

function stageRank(stage: string): number {
  const s = (stage || '').toLowerCase()
  if (s.match(/32|seizi[eè]/)) return 1
  if (s.match(/16|huiti[eè]/)) return 2
  if (s.match(/quart/)) return 3
  if (s.match(/demi/)) return 4
  if (s.match(/3.{0,10}place|petit|troisi[eè]|third/)) return 5
  if (s.match(/final/)) return 6
  return 99
}

function stageFrenchLabel(stage: string): string {
  switch (stageRank(stage)) {
    case 1: return '32es de finale'
    case 2: return '16es de finale'
    case 3: return 'Quarts de finale'
    case 4: return 'Demi-finales'
    case 5: return 'Match pour la 3e place'
    case 6: return 'Finale'
    default: return stage || 'Phase éliminatoire'
  }
}

function KOStatusBadge({ status }: { status: KOFixture['status'] }) {
  if (status === 'live')
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-green-600 animate-pulse dark:text-green-400">
        <Wifi className="w-3 h-3" /> EN DIRECT
      </span>
    )
  if (status === 'finished')
    return <span className="text-xs text-gray-400 dark:text-gray-500">Terminé</span>
  return (
    <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
      <Clock className="w-3 h-3" /> À venir
    </span>
  )
}

function KOCard({ fix }: { fix: KOFixture }) {
  const hasScore = fix.home_score !== null && fix.away_score !== null
  return (
    <div className={`card flex flex-col gap-2 border ${
      fix.status === 'live'
        ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wide dark:text-gray-400">{fix.stage}</span>
        <KOStatusBadge status={fix.status} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 text-right font-semibold text-sm flex items-center justify-end gap-2">
          {fix.home_team
            ? flagUrl(fix.home_team)
              ? <>{fix.home_team}<FlagImg code={fix.home_team} size={24} /></>
              : <span className="text-gray-500 text-xs italic">{fix.home_team}</span>
            : <span className="text-gray-400 text-xs italic">À déterminer</span>
          }
        </span>
        <div className="text-center min-w-[60px]">
          {hasScore
            ? <span className="text-xl font-bold tabular-nums">{fix.home_score} – {fix.away_score}</span>
            : <span className="text-gray-400 text-sm dark:text-gray-500">vs</span>
          }
        </div>
        <span className="flex-1 font-semibold text-sm flex items-center gap-2">
          {fix.away_team
            ? flagUrl(fix.away_team)
              ? <><FlagImg code={fix.away_team} size={24} />{fix.away_team}</>
              : <span className="text-gray-500 text-xs italic">{fix.away_team}</span>
            : <span className="text-gray-400 text-xs italic">À déterminer</span>
          }
        </span>
      </div>
      <div className="text-xs text-gray-400 text-center dark:text-gray-500">
        {fix.date}{fix.city && ` · ${fix.city}`}
      </div>
    </div>
  )
}

function KnockoutSection({ fixtures, groupsComplete }: { fixtures: KOFixture[]; groupsComplete: boolean }) {
  const byStage: Record<string, KOFixture[]> = {}
  for (const fix of fixtures) {
    const key = fix.stage || 'Phase éliminatoire'
    ;(byStage[key] ??= []).push(fix)
  }
  const stages = Object.entries(byStage).sort(([a], [b]) => stageRank(a) - stageRank(b))

  if (stages.length === 0) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 flex-wrap">
        <Trophy className="w-7 h-7 text-yellow-500 flex-shrink-0" />
        <h2 className="text-2xl font-bold">Phases éliminatoires</h2>
        {!groupsComplete && (
          <span className="text-sm text-gray-500 italic dark:text-gray-400">Programme officiel FIFA</span>
        )}
      </div>
      {stages.map(([stage, matches]) => (
        <div key={stage}>
          <h3 className="font-bold text-base mb-4 text-yellow-600 dark:text-yellow-400 flex items-center gap-2 border-b border-yellow-100 dark:border-yellow-900/50 pb-2">
            🏆 {stageFrenchLabel(stage)}
            <span className="text-gray-400 font-normal text-sm dark:text-gray-500">
              · {matches.length} match{matches.length > 1 ? 's' : ''}
            </span>
          </h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {matches.map(fix => (
              <KOCard key={fix.id || `${fix.date}-${fix.home_team}-${fix.away_team}`} fix={fix} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Groups() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showGroups, setShowGroups] = useState(false)

  const { data: standings, isLoading } = useQuery({
    queryKey: ['groupStandings'],
    queryFn: () => matchesApi.getGroupStandings(),
  })

  const { data: groupMatches } = useQuery({
    queryKey: ['groupMatches', selectedGroup],
    queryFn: () => matchesApi.getGroupMatches(selectedGroup!),
    enabled: !!selectedGroup,
  })

  const { data: fixturesData } = useQuery({
    queryKey: ['fixtures'],
    queryFn: () => axios.get<{ count: number; fixtures: KOFixture[] }>('/api/fixtures'),
    staleTime: 90 * 1000,
  })

  const allFixtures: KOFixture[] = fixturesData?.data?.fixtures ?? []
  const groupFixtures = allFixtures.filter(f => !!f.group)
  const knockoutFixtures = allFixtures.filter(f => !f.group)

  const groupsComplete = groupFixtures.length > 0 && groupFixtures.every(f => f.status === 'finished')

  if (isLoading) {
    return (
      <div className="card text-center text-gray-500 dark:text-gray-400">
        Chargement des classements...
      </div>
    )
  }

  const groupStandingsSection = (
    <div className="space-y-6">
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

      {/* Group Standings Grid */}
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

      {/* Format info */}
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Phase de groupes</h1>
        <div className="text-gray-500 dark:text-gray-400">12 groupes de 4 équipes</div>
      </div>

      {groupsComplete ? (
        // PHASE ÉLIMINATOIRE : knockout en premier, groupes repliables
        <div className="space-y-8">
          <KnockoutSection fixtures={knockoutFixtures} groupsComplete={groupsComplete} />
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowGroups(v => !v)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              {showGroups ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showGroups ? 'Masquer la phase de groupes' : 'Voir la phase de groupes'}
            </button>
            {showGroups && <div className="mt-6">{groupStandingsSection}</div>}
          </div>
        </div>
      ) : (
        // PHASE DE GROUPES : groupes en premier, phases élim. en dessous
        <div className="space-y-10">
          {groupStandingsSection}
          <KnockoutSection fixtures={knockoutFixtures} groupsComplete={groupsComplete} />
        </div>
      )}
    </div>
  )
}
