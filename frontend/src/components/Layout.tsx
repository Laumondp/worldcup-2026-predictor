import { Outlet, Link, useLocation } from 'react-router-dom'
import { Trophy, Users, BarChart3, Grid3X3, GitBranch, History } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Trophy },
  { path: '/predictions', label: 'Predictions', icon: BarChart3 },
  { path: '/teams', label: 'Teams', icon: Users },
  { path: '/groups', label: 'Groups', icon: Grid3X3 },
  { path: '/bracket', label: 'Bracket', icon: GitBranch },
  { path: '/history', label: 'History', icon: History },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-xl font-bold">
                World Cup 2026 <span className="text-blue-400">Predictor</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
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
      </footer>
    </div>
  )
}
