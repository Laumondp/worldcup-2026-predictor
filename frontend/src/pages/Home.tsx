import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, Eye } from 'lucide-react'
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

  const { data: visitors } = useQuery({
    queryKey: ['visitors'],
    queryFn: () => statsApi.getVisitors(),
    refetchInterval: 30_000,
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
        className="flex overflow-hidden bg-blue-500/10 border border-blue-500/25 rounded-xl py-2 hover:bg-blue-500/20 transition-colors"
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 px-12 text-sm font-semibold text-blue-300">
              🃏 Gestion des cartes Adrenalyn 2026
              <span className="text-blue-500 mx-2">·</span>
              Retrouvez vos doubles, échangez et complétez votre collection !
              <span className="text-blue-500 mx-2">·</span>
              🃏 Gestion des cartes Adrenalyn 2026
              <span className="text-blue-500 mx-2">·</span>
              Retrouvez vos doubles, échangez et complétez votre collection !
              <span className="text-blue-500 mx-2">·</span>
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
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
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
        {/* Live visitor counter */}
        <div className="flex flex-wrap items-center justify-center gap-6 bg-gray-800/70 border border-gray-700 rounded-xl px-5 py-3 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="font-bold text-white">
              {visitors?.data?.total_visits?.toLocaleString('fr-FR') ?? '—'}
            </span>
            <span>visites totales</span>
          </div>
          <div className="w-px h-4 bg-gray-600 hidden sm:block" />
          <div className="flex items-center gap-2 text-gray-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="font-bold text-green-400">
              {visitors?.data?.active_now ?? '—'}
            </span>
            <span>en ligne maintenant</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upcoming Matches */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Prochains matchs</h2>
              <Link to="/predictions" className="text-blue-400 hover:underline">Voir tout</Link>
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
                <div className="col-span-2 card text-center text-gray-400">
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
                  <div className="text-center pb-4 border-b border-gray-700">
                    <div className="text-sm text-gray-400 mb-1">Vainqueur prédit</div>
                    <div className="text-2xl font-bold text-blue-500">{simulation.data.winner}</div>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(simulation.data.win_probabilities).slice(0, 5).map(([team, prob]) => (
                      <div key={team} className="flex items-center justify-between">
                        <span>{team}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(prob as number) * 100}%` }} />
                          </div>
                          <span className="text-sm text-gray-400 w-12 text-right">{((prob as number) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-center pt-2">
                    Basé sur {simulation.data.simulations_run} simulations Monte Carlo
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">Chargement de la simulation...</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/predictions" className="card hover:ring-2 hover:ring-blue-500 transition-all">
            <h3 className="text-xl font-bold mb-2">Prédictions de matchs</h3>
            <p className="text-gray-400">Prédictions IA pour n'importe quel match</p>
          </Link>
          <Link to="/groups" className="card hover:ring-2 hover:ring-green-500 transition-all">
            <h3 className="text-xl font-bold mb-2">Classement des groupes</h3>
            <p className="text-gray-400">12 groupes et simulation des résultats</p>
          </Link>
          <Link to="/bracket" className="card hover:ring-2 hover:ring-purple-500 transition-all">
            <h3 className="text-xl font-bold mb-2">Tableau éliminatoire</h3>
            <p className="text-gray-400">Tableau interactif avec prédictions</p>
          </Link>
        </div>

        {/* Mascottes */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-center">🎭 Les Mascottes officielles</h2>
          <p className="text-center text-gray-400 text-sm mb-6">Annoncées le 25 septembre 2025</p>

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
          <p className="text-gray-400 text-sm mb-4">Tu aimes le site ? Partage-le ⚽</p>
          <ShareButtons />
        </div>


      </div>
    </div>
  )
}
