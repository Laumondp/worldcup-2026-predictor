import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react'
import axios from 'axios'
import { FlagImg } from '../utils/flags'

interface RankingEntry {
  rank: number
  name: string
  points: number
  previousRank: number
  countryCode: string
  confederation: string
  qualified: boolean
}

interface RankingsData {
  date: string
  dateId: string
  count: number
  rankings: RankingEntry[]
}

const CONF_LABELS: Record<string, string> = {
  UEFA: 'UEFA', CONMEBOL: 'CONMEBOL', CONCACAF: 'CONCACAF',
  CAF: 'CAF', AFC: 'AFC', OFC: 'OFC',
}

function RankTrend({ rank, prev }: { rank: number; prev: number }) {
  const diff = prev - rank
  if (diff > 0) return <span className="text-green-400 text-xs flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{diff}</span>
  if (diff < 0) return <span className="text-red-400 text-xs flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{diff}</span>
  return <span className="text-gray-500 text-xs flex items-center gap-0.5"><Minus className="w-3 h-3" /></span>
}

export default function Rankings() {
  const [showAll, setShowAll] = useState(false)
  const [filterConf, setFilterConf] = useState<string>('ALL')
  const [filterWC, setFilterWC] = useState(true)

  const { data, isLoading } = useQuery({
    queryKey: ['rankings'],
    queryFn: () => axios.get<RankingsData>('/api/rankings'),
    staleTime: 1000 * 60 * 60,
  })

  const rankings = data?.data?.rankings ?? []
  const date = data?.data?.date
    ? new Date(data.data.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  const confs = ['ALL', ...Array.from(new Set(rankings.map(r => r.confederation))).filter(Boolean).sort()]

  const filtered = rankings
    .filter(r => filterWC ? r.qualified : true)
    .filter(r => filterConf === 'ALL' || r.confederation === filterConf)
    .slice(0, showAll ? 999 : 48)

  if (isLoading) {
    return <div className="card text-center text-gray-400 py-16">Chargement du classement FIFA…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold">Classement FIFA</h1>
            {date && <p className="text-gray-400 text-sm">Mis à jour le {date}</p>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setFilterWC(!filterWC)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterWC ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          Équipes qualifiées CM 2026
        </button>
        {confs.map(c => (
          <button
            key={c}
            onClick={() => setFilterConf(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterConf === c ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {c === 'ALL' ? 'Toutes' : CONF_LABELS[c] || c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700 text-left">
              <th className="py-3 pr-3 w-12">Rang</th>
              <th className="py-3 flex-1">Équipe</th>
              <th className="py-3 text-right w-24">Points</th>
              <th className="py-3 text-right w-20">Évolution</th>
              <th className="py-3 text-right w-24 hidden md:table-cell">Confédération</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={r.countryCode || r.name}
                className={`border-b border-gray-700/40 hover:bg-gray-700/30 transition-colors ${r.qualified ? '' : 'opacity-60'}`}
              >
                <td className="py-2.5 pr-3">
                  <span className={`font-bold text-base ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                    #{r.rank}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="flex items-center gap-2">
                    <FlagImg code={r.countryCode || r.name} size={24} />
                    <span className={r.qualified ? 'font-semibold' : ''}>{r.name}</span>
                    {r.qualified && <span className="text-xs bg-yellow-900/50 text-yellow-400 px-1.5 py-0.5 rounded hidden md:inline">CM 2026</span>}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono font-medium">{r.points?.toFixed(2)}</td>
                <td className="py-2.5 text-right">
                  <RankTrend rank={r.rank} prev={r.previousRank} />
                </td>
                <td className="py-2.5 text-right text-gray-400 hidden md:table-cell">{CONF_LABELS[r.confederation] || r.confederation}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!showAll && rankings.filter(r => filterWC ? r.qualified : true).filter(r => filterConf === 'ALL' || r.confederation === filterConf).length > 48 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Voir tout le classement ({rankings.length} équipes)
          </button>
        )}
      </div>
    </div>
  )
}
