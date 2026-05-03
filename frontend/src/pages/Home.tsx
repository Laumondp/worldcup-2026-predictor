import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { matchesApi, predictionsApi, statsApi } from '../services/api'
import MatchCard from '../components/MatchCard'
import ShareButtons from '../components/ShareButtons'

export default function Home() {
  const detailsRef = useRef<HTMLDivElement>(null)

  const { data: upcomingMatches } = useQuery({
    queryKey: ['upcomingMatches'],
    queryFn: () => matchesApi.getUpcoming(6),
  })

  const { data: simulation } = useQuery({
    queryKey: ['simulation'],
    queryFn: () => predictionsApi.simulateTournament(500),
    staleTime: 1000 * 60 * 30,
  })

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      <Helmet>
        <title>FIFA World Cup 2026 — Prédictions IA, Groupes & Tableau éliminatoire</title>
        <meta name="description" content="Prédictions par intelligence artificielle pour la Coupe du Monde 2026 (USA, Mexique, Canada). Simulateur Monte Carlo, classements FIFA en direct et tableau éliminatoire interactif." />
      </Helmet>

      {/* Bandeau défilant Adrenalyn — tout en haut */}
      <a
        href="https://wc2026-doubles.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex overflow-hidden bg-blue-50 border border-blue-300/50 rounded-xl py-2 hover:bg-blue-100 transition-colors dark:bg-blue-500/10 dark:border-blue-500/25 dark:hover:bg-blue-500/20"
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 px-12 text-sm font-semibold text-blue-600 dark:text-blue-300">
              <img src="/panini-logo.png" alt="Panini" className="h-6 w-auto flex-shrink-0 rounded" />
              Gestion des cartes Adrenalyn XL FIFA World Cup 2026
              <span className="text-blue-400 mx-2 dark:text-blue-500">·</span>
              Retrouvez vos doubles, échangez et complétez votre collection !
              <span className="text-blue-400 mx-2 dark:text-blue-500">·</span>
              <img src="/panini-logo.png" alt="Panini" className="h-6 w-auto flex-shrink-0 rounded" />
              Gestion des cartes Adrenalyn XL FIFA World Cup 2026
              <span className="text-blue-400 mx-2 dark:text-blue-500">·</span>
              Retrouvez vos doubles, échangez et complétez votre collection !
              <span className="text-blue-400 mx-2 dark:text-blue-500">·</span>
            </span>
          ))}
        </div>
      </a>

      {/* Hero Section — pleine hauteur, cliquable */}
      <div
        onClick={scrollToDetails}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          backgroundImage: 'url(/logo_terrain.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
          style={{ minHeight: 'calc(100vh - 80px)' }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg text-white">
            FIFA World Cup 2026
          </h1>

          <p className="text-2xl text-gray-200 mb-4 drop-shadow">
            USA · Mexico · Canada
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto drop-shadow text-lg mb-10">
            Prédictions par Machine Learning · Statistiques · Simulation du tournoi
          </p>
          <div className="animate-bounce text-gray-300 flex flex-col items-center gap-1 text-sm">
            <span>Voir les détails</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Contenu détaillé */}
      <div ref={detailsRef} className="space-y-8 scroll-mt-4">
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upcoming Matches */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Prochains matchs</h2>
              <Link to="/predictions" className="text-blue-600 hover:underline dark:text-blue-400">Voir tout</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingMatches?.data?.slice(0, 4).map((match: any) => (
                <MatchCard
                  key={match.id}
                  homeTeam={match.home_team}
                  awayTeam={match.away_team}
                  homeCode={match.home_team}
                  awayCode={match.away_team}
                  date={match.date}
                  stage={match.stage}
                />
              )) || (
                <div className="col-span-2 card text-center text-gray-500 dark:text-gray-400">
                  Aucun match à venir planifié
                </div>
              )}
            </div>
          </div>

          {/* Tournament Simulation */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Favoris du tournoi</h2>
            <div className="card">
              {simulation?.data?.win_probabilities ? (
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 mb-1 dark:text-gray-400">Vainqueur prédit</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{simulation.data.winner}</div>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(simulation.data.win_probabilities).slice(0, 5).map(([team, prob]) => (
                      <div key={team} className="flex items-center gap-2 min-w-0">
                        <span className="flex-1 min-w-0 truncate text-sm">{team}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="w-16 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(prob as number) * 100}%` }} />
                          </div>
                          <span className="text-sm text-gray-500 w-10 text-right tabular-nums dark:text-gray-400">{((prob as number) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 text-center pt-2 dark:text-gray-500">
                    Basé sur {simulation.data.simulations_run} simulations Monte Carlo
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">Chargement de la simulation...</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/predictions" className="card hover:ring-2 hover:ring-blue-500 transition-all">
            <h3 className="text-xl font-bold mb-2">Prédictions de matchs</h3>
            <p className="text-gray-600 dark:text-gray-400">Prédictions IA pour n'importe quel match</p>
          </Link>
          <Link to="/groups" className="card hover:ring-2 hover:ring-green-500 transition-all">
            <h3 className="text-xl font-bold mb-2">Classement des groupes</h3>
            <p className="text-gray-600 dark:text-gray-400">12 groupes et simulation des résultats</p>
          </Link>
          <Link to="/bracket" className="card hover:ring-2 hover:ring-purple-500 transition-all">
            <h3 className="text-xl font-bold mb-2">Tableau éliminatoire</h3>
            <p className="text-gray-600 dark:text-gray-400">Tableau interactif avec prédictions</p>
          </Link>
        </div>

        {/* Mascottes */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-center">🎭 Les Mascottes officielles</h2>
          <p className="text-center text-gray-500 text-sm mb-6 dark:text-gray-400">Annoncées le 25 septembre 2025</p>

          {/* Photo officielle des 3 mascottes */}
          <div className="flex justify-center mb-8">
            <img
              src="/mascottes.jpg"
              alt="Maple, Zayu et Clutch — Mascottes FIFA World Cup 2026"
              className="rounded-2xl max-h-72 object-contain shadow-xl"
            />
          </div>

        </div>

        {/* Share buttons */}
        <div className="card text-center">
          <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">Tu aimes le site ? Partage-le ⚽</p>
          <ShareButtons />
        </div>


      </div>
    </div>
  )
}
