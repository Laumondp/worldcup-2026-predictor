import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, RefreshCw, Wifi, Clock, Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'
import { FlagImg, flagUrl } from '../utils/flags'
import { formatMatchTime } from '../utils/timezone'

interface Fixture {
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

type Filter = 'ALL' | 'live' | 'scheduled' | 'finished'

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

function StatusBadge({ status }: { status: Fixture['status'] }) {
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

function FixtureCard({ fix }: { fix: Fixture }) {
  const hasScore = fix.home_score !== null && fix.away_score !== null
  const mt = formatMatchTime(fix.date, fix.city)
  return (
    <div className={`card flex flex-col gap-2 border ${
      fix.status === 'live'
        ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wide dark:text-gray-400">
          {fix.group ? `Groupe ${fix.group}` : fix.stage}
        </span>
        <StatusBadge status={fix.status} />
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
            : <span className="text-gray-400 text-sm dark:text-gray-500">vs</span>}
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
        {mt.day}{mt.parisTime && <> · 🇫🇷 {mt.parisTime}</>}
        {fix.city && ` · ${fix.city}`}
      </div>
    </div>
  )
}

function KnockoutStages({ fixtures, groupsComplete }: { fixtures: Fixture[]; groupsComplete: boolean }) {
  const byStage: Record<string, Fixture[]> = {}
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
              <FixtureCard key={fix.id || `${fix.date}-${fix.home_team}-${fix.away_team}`} fix={fix} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Fixtures() {
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL')
  const [showGroups, setShowGroups] = useState(false)

  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['fixtures'],
    queryFn: () => axios.get<{ count: number; fixtures: Fixture[] }>('/api/fixtures'),
    refetchInterval: 2 * 60 * 1000,
    staleTime: 90 * 1000,
  })

  const all: Fixture[] = data?.data?.fixtures ?? []
  // A group match has a GroupName like "Groupe A"…"Groupe L" — robust against FIFA putting stage names in GroupName for KO rounds
  const isGroupMatch = (f: Fixture) => /groupe\s+[a-l]/i.test(f.group || '')
  const groupMatches = all.filter(isGroupMatch)
  const knockoutMatches = all.filter(f => !isGroupMatch(f))

  // Groups are complete when all group matches are finished
  const groupsComplete = groupMatches.length > 0 && groupMatches.every(f => f.status === 'finished')

  const applyFilter = (matches: Fixture[]) =>
    activeFilter === 'ALL' ? matches : matches.filter(f => f.status === activeFilter)

  const filteredGroup = applyFilter(groupMatches)
  const filteredKnockout = applyFilter(knockoutMatches)

  const counts = {
    ALL: all.length,
    live: all.filter(f => f.status === 'live').length,
    scheduled: all.filter(f => f.status === 'scheduled').length,
    finished: all.filter(f => f.status === 'finished').length,
  }

  const lastUpdate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null

  const hasContent = filteredGroup.length > 0 || filteredKnockout.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold">Calendrier &amp; Résultats</h1>
            <p className="text-gray-500 text-sm flex items-center gap-2 dark:text-gray-400">
              {isFetching && <RefreshCw className="w-3 h-3 animate-spin" />}
              Source officielle FIFA · Actualisation auto toutes les 2 min
              {lastUpdate && <span>· Mis à jour à {lastUpdate}</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'live', 'scheduled', 'finished'] as Filter[]).map(s => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {s === 'ALL' ? 'Tous' : s === 'live' ? 'En direct' : s === 'scheduled' ? 'À venir' : 'Terminés'}
            <span className="ml-1.5 text-xs opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
          Chargement depuis FIFA…
        </div>
      )}

      {!isLoading && !hasContent && (
        <div className="card text-center text-gray-500 py-10 dark:text-gray-400">Aucun match trouvé.</div>
      )}

      {!isLoading && hasContent && (
        groupsComplete ? (
          // PHASE ÉLIMINATOIRE : knockout en premier, groupes repliables en dessous
          <div className="space-y-8">
            {filteredKnockout.length > 0 && (
              <KnockoutStages fixtures={filteredKnockout} groupsComplete={groupsComplete} />
            )}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => setShowGroups(v => !v)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors"
              >
                {showGroups ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showGroups ? 'Masquer la phase de groupes' : 'Voir la phase de groupes'}
                <span className="ml-1.5 text-xs opacity-60">({filteredGroup.length} matchs)</span>
              </button>
              {showGroups && (
                <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredGroup.map(fix => (
                    <FixtureCard key={fix.id || `${fix.date}-${fix.home_team}`} fix={fix} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // PHASE DE GROUPES : matchs de poules en premier, phases élim. en dessous
          <div className="space-y-10">
            {filteredGroup.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredGroup.map(fix => (
                  <FixtureCard key={fix.id || `${fix.date}-${fix.home_team}`} fix={fix} />
                ))}
              </div>
            )}
            {filteredKnockout.length > 0 && (
              <KnockoutStages fixtures={filteredKnockout} groupsComplete={groupsComplete} />
            )}
          </div>
        )
      )}
    </div>
  )
}
