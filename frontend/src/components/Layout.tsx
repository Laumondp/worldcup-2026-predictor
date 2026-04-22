import { Outlet, Link, useLocation } from 'react-router-dom'
import { Trophy, BarChart3, Grid3X3, GitBranch, RefreshCw, CheckCircle, XCircle, Calendar, Award } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../services/api'

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
            <Link to="/" className="flex items-center">
              <img src="/logo_cup.png" alt="FIFA World Cup 2026" className="h-12 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-1 whitespace-nowrap">
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
