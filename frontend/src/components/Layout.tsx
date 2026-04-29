import { Outlet, Link, useLocation } from 'react-router-dom'
import { Trophy, BarChart3, Grid3X3, GitBranch, RefreshCw, CheckCircle, XCircle, Calendar, Award, Eye } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi, statsApi } from '../services/api'
import ShareButtons from './ShareButtons'

const navItems = [
  { path: '/', label: 'Accueil', icon: Trophy },
  { path: '/predictions', label: 'Prédictions', icon: BarChart3 },
  { path: '/groups', label: 'Groupes', icon: Grid3X3 },
  { path: '/bracket', label: 'Tableau', icon: GitBranch },
  { path: '/fixtures', label: 'Calendrier FIFA', icon: Calendar },
  { path: '/rankings', label: 'Classement FIFA', icon: Award },
]

type RefreshState = 'idle' | 'loading' | 'success' | 'error'

export default function Layout() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const [refreshState, setRefreshState] = useState<RefreshState>('idle')
  const [refreshInfo, setRefreshInfo] = useState<string>('')

  const visitRecorded = useRef(false)
  const sessionVisitId = useRef<string | null>(null)

  const { data: visitors, refetch: refetchVisitors } = useQuery({
    queryKey: ['visitors'],
    queryFn: () => statsApi.getVisitors(),
    refetchInterval: 10_000,
  })

  // Enregistre la visite une seule fois par session (ID stable dans sessionStorage)
  useEffect(() => {
    if (visitRecorded.current) return
    visitRecorded.current = true
    let id = sessionStorage.getItem('wc_visit_id')
    if (!id) {
      id = Date.now() + ':' + Math.random().toString(36).slice(2)
      sessionStorage.setItem('wc_visit_id', id)
    }
    sessionVisitId.current = id
    statsApi.recordVisit(id, true)
      .then(() => refetchVisitors())
      .catch(() => {})
  }, [])

  // Heartbeat toutes les 90s pour maintenir le compteur "en ligne" actif
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionVisitId.current) {
        statsApi.recordVisit(sessionVisitId.current, false).catch(() => {})
      }
    }, 90_000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setRefreshState('loading')
    setRefreshInfo('')
    try {
      const res = await adminApi.refreshFriendlies()
      const d = res.data
      if (d.status === 'success') {
        setRefreshState('success')
        const rankInfo = d.rankings_date ? ` · Classement FIFA ${d.rankings_date}` : ''
        setRefreshInfo(`${d.matches_added} matchs · ${d.played} joués · ${d.upcoming} à venir${rankInfo}`)
        // Invalidate all queries so UI reflects new stats
        await queryClient.invalidateQueries()
      } else {
        setRefreshState('error')
        setRefreshInfo(d.message || 'Erreur inconnue')
      }
    } catch {
      setRefreshState('error')
      setRefreshInfo('Serveur inaccessible')
    } finally {
      setTimeout(() => setRefreshState('idle'), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            <nav className="hidden md:flex items-center gap-1 whitespace-nowrap">
              {/* Visitor counter */}
              <div
                title={`${visitors?.data?.total_visits?.toLocaleString('fr-FR') ?? '—'} visites au total · ${visitors?.data?.active_now ?? '—'} en ligne maintenant`}
                className="flex items-center gap-1.5 px-3 py-1.5 mr-1 rounded-lg bg-gray-800/60 border border-gray-700 text-xs text-gray-400 cursor-default"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="font-semibold text-white" title="Visites totales (cumulées)">
                  {visitors?.data?.total_visits?.toLocaleString('fr-FR') ?? '—'}
                </span>
                <span className="w-px h-3 bg-gray-600 mx-0.5" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="font-semibold text-green-400" title="En ligne ces 2 dernières minutes">
                  {visitors?.data?.active_now ?? '—'}
                </span>
              </div>

              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* Refresh button */}
              <div className="ml-2 flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshState === 'loading'}
                  title="Actualiser les statistiques (matchs amicaux & tournois récents)"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    refreshState === 'loading'
                      ? 'bg-blue-900 text-blue-300 cursor-wait'
                      : refreshState === 'success'
                      ? 'bg-green-900 text-green-300'
                      : refreshState === 'error'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {refreshState === 'loading' && <RefreshCw className="w-4 h-4 animate-spin shrink-0" />}
                  {refreshState === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
                  {refreshState === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
                  {refreshState === 'idle' && <RefreshCw className="w-4 h-4 shrink-0" />}
                  <span>
                    {refreshState === 'loading' ? 'Actualisation…' :
                     refreshState === 'success' ? 'Mis à jour' :
                     refreshState === 'error' ? 'Erreur' :
                     'Actualiser Stats'}
                  </span>
                </button>

                {/* Scrolling ticker for refresh result */}
                {refreshInfo && (
                  <div className={`overflow-hidden w-40 text-xs ${refreshState === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                    <span className="inline-block animate-ticker whitespace-nowrap">
                      {refreshInfo}
                    </span>
                  </div>
                )}
              </div>

              {/* Share buttons — compact icons only */}
              <div className="ml-2 pl-2 border-l border-gray-700">
                <ShareButtons compact />
              </div>

              {/* Lien doubles */}
              <div className="ml-2 pl-2 border-l border-gray-700">
                <a
                  href="https://wc2026-doubles.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap"
                >
                  🌐 Doubles
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === path ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-gray-700 py-6 text-center text-gray-400">
        <p>World Cup 2026 Predictor - Powered by Machine Learning</p>
        <p className="text-sm mt-1 text-gray-500">&copy; 2026 LAUMOND Philippe — Tous droits réservés</p>
      </footer>
    </div>
  )
}
