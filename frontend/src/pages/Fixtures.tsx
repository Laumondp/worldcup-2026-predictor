import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, RefreshCw, Wifi, Clock } from 'lucide-react'
import axios from 'axios'
import { FlagImg } from '../utils/flags'

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

function StatusBadge({ status }: { status: Fixture['status'] }) {
  if (status === 'live')
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-green-400 animate-pulse">
        <Wifi className="w-3 h-3" /> EN DIRECT
      </span>
    )
  if (status === 'finished')
    return <span className="text-xs text-gray-500">Terminé</span>
  return (
    <span className="flex items-center gap-1 text-xs text-blue-400">
      <Clock className="w-3 h-3" /> À venir
    </span>
  )
}

function FixtureCard({ fix }: { fix: Fixture }) {
  const hasScore = fix.home_score !== null && fix.away_score !== null
  return (
    <div className={`card flex flex-col gap-2 border ${fix.status === 'live' ? 'border-green-600 bg-green-900/20' : 'border-gray-700'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {fix.group ? `Groupe ${fix.group}` : fix.stage}
        </span>
        <StatusBadge status={fix.status} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 text-right font-semibold text-sm flex items-center justify-end gap-2">{fix.home_team || '?'}<FlagImg code={fix.home_team || ''} size={24} /></span>
        <div className="text-center min-w-[60px]">
          {hasScore
            ? <span className="text-xl font-bold tabular-nums">{fix.home_score} – {fix.away_score}</span>
            : <span className="text-gray-500 text-sm">vs</span>}
        </div>
        <span className="flex-1 font-semibold text-sm flex items-center gap-2"><FlagImg code={fix.away_team || ''} size={24} />{fix.away_team || '?'}</span>
      </div>

      <div className="text-xs text-gray-500 text-center">
        {fix.date}{fix.city && ` · ${fix.city}`}
      </div>
    </div>
  )
}

export default function Fixtures() {
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL')

  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['fixtures'],
    queryFn: () => axios.get<{ count: number; fixtures: Fixture[] }>('/api/fixtures'),
    refetchInterval: 2 * 60 * 1000,
    staleTime: 90 * 1000,
  })

  const all: Fixture[] = data?.data?.fixtures ?? []
  const filtered = activeFilter === 'ALL' ? all : all.filter(f => f.status === activeFilter)

  const counts = {
    ALL: all.length,
    live: all.filter(f => f.status === 'live').length,
    scheduled: all.filter(f => f.status === 'scheduled').length,
    finished: all.filter(f => f.status === 'finished').length,
  }

  const lastUpdate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold">Calendrier &amp; Résultats</h1>
            <p className="text-gray-400 text-sm flex items-center gap-2">
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
              activeFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {s === 'ALL' ? 'Tous' : s === 'live' ? 'En direct' : s === 'scheduled' ? 'À venir' : 'Terminés'}
            <span className="ml-1.5 text-xs opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-16 text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
          Chargement depuis FIFA…
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="card text-center text-gray-400 py-10">Aucun match trouvé.</div>
      )}

      {filtered.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(fix => (
            <FixtureCard key={fix.id || `${fix.date}-${fix.home_team}`} fix={fix} />
          ))}
        </div>
      )}
    </div>
  )
}
