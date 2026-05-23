import { Outlet, Link, useLocation } from 'react-router-dom'
import { Trophy, BarChart3, Grid3X3, GitBranch, RefreshCw, CheckCircle, XCircle, Award, Eye, Sun, Moon, ShoppingBag, Calendar as CalendarIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi, statsApi } from '../services/api'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { path: '/', label: 'Accueil', icon: Trophy },
  { path: '/predictions', label: 'Prédictions', icon: BarChart3 },
  { path: '/calendar', label: 'Calendrier', icon: CalendarIcon },
  { path: '/groups', label: 'Groupes', icon: Grid3X3 },
  { path: '/bracket', label: 'Tableau', icon: GitBranch },
  { path: '/rankings', label: 'FIFA', icon: Award },
]

type RefreshState = 'idle' | 'loading' | 'success' | 'error'

export default function Layout() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const [refreshState, setRefreshState] = useState<RefreshState>('idle')
  const [refreshInfo, setRefreshInfo] = useState<string>('')
  const { theme, toggleTheme } = useTheme()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 dark:border-gray-700 dark:bg-gray-900/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Left nav */}
            <nav className="hidden md:flex items-center gap-1 whitespace-nowrap overflow-x-auto">
              {/* Visitor counter */}
              <div
                title={`${visitors?.data?.total_visits?.toLocaleString('fr-FR') ?? '—'} visites au total · ${visitors?.data?.active_now ?? '—'} en ligne maintenant`}
                className="flex items-center gap-1.5 px-3 py-1.5 mr-1 rounded-lg bg-gray-100/80 border border-gray-200 text-xs text-gray-600 cursor-default dark:bg-gray-800/60 dark:border-gray-700 dark:text-gray-400"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="font-semibold text-gray-900 dark:text-white" title="Visites totales (cumulées)">
                  {visitors?.data?.total_visits?.toLocaleString('fr-FR') ?? '—'}
                </span>
                <span className="w-px h-3 bg-gray-300 mx-0.5 dark:bg-gray-600" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400" title="En ligne ces 2 dernières minutes">
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
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
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
                  title={refreshInfo || 'Actualiser les statistiques (matchs amicaux & tournois récents)'}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    refreshState === 'loading'
                      ? 'bg-blue-100 text-blue-700 cursor-wait dark:bg-blue-900 dark:text-blue-300'
                      : refreshState === 'success'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : refreshState === 'error'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
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
                     'Stats'}
                  </span>
                </button>

              </div>
            </nav>

            {/* Right side — share + theme toggle (always visible on desktop) */}
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
              <a
                href="https://cm2026-deploy.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                title="Ouvrir l'application de pronostics Valeo"
                className="flex items-center px-3 py-1.5 rounded-lg transition-all hover:opacity-75 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <img src="/valeo-logo.png" alt="Valeo" className="h-6 w-auto object-contain" />
              </a>
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                className="flex items-center px-2 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex justify-around py-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center px-1 py-1.5 ${
                location.pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-0.5 leading-tight text-center">{label}</span>
            </Link>
          ))}
          {/* Theme toggle mobile */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center px-1 py-1.5 text-gray-500 dark:text-gray-400"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-[9px] mt-0.5">Thème</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400 pb-24 md:pb-6">
        <p>World Cup 2026 Predictor - Powered by Machine Learning</p>
        <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">&copy; 2026 LAUMOND Philippe — Tous droits réservés</p>
        <div className="mt-3">
          <a
            href="https://store.fifa.com/fr-fr/collections/new-arrivals"
            target="_blank"
            rel="noopener noreferrer"
            title="Boutique officielle FIFA"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Boutique FIFA</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
