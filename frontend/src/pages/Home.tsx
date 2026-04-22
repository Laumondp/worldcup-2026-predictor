import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trophy, Users, Calendar, TrendingUp, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { matchesApi, teamsApi, predictionsApi } from '../services/api'
import MatchCard from '../components/MatchCard'
import FormChart from '../components/FormChart'

export default function Home() {
  const detailsRef = useRef<HTMLDivElement>(null)

  const { data: upcomingMatches } = useQuery({
    queryKey: ['upcomingMatches'],
    queryFn: () => matchesApi.getUpcoming(6),
  })

  const { data: topTeams } = useQuery({
    queryKey: ['topTeams'],
    queryFn: () => teamsApi.getTopTeams(10),
  })

  const { data: simulation } = useQuery({
    queryKey: ['simulation'],
    queryFn: () => predictionsApi.simulateTournament(500),
    staleTime: 1000 * 60 * 30,
  })

  const statsCards = [
    { icon: Users, label: 'Équipes qualifiées', value: '48', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Matchs', value: '104', color: 'bg-green-500' },
    { icon: Trophy, label: 'Nations hôtes', value: '3', color: 'bg-yellow-500' },
    { icon: TrendingUp, label: 'Groupes', value: '12', color: 'bg-purple-500' },
  ]

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card text-center">
              <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
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
                    <div className="text-2xl font-bold text-yellow-500">{simulation.data.winner}</div>
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

        {/* Top Teams */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Meilleures équipes classées</h2>
          {topTeams?.data ? (
            <FormChart
              data={topTeams.data.map((t: any) => ({ team: t.name, value: t.elo_rating }))}
              title="ELO Ratings"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">Chargement des équipes...</div>
          )}
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
          <h2 className="text-2xl font-bold mb-6 text-center">🎭 Les Mascottes officielles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Cachanilla',
                country: '🇲🇽 Mexique',
                desc: 'Mascotte représentant la culture et la chaleur du Mexique',
                color: 'from-green-800 to-red-900',
                img: '/mascot_mexico.png',
              },
              {
                name: 'Striker',
                country: '🇺🇸 États-Unis',
                desc: 'Mascotte symbole de l\'énergie et du sport américain',
                color: 'from-blue-800 to-red-900',
                img: '/mascot_usa.png',
              },
              {
                name: 'Poutine',
                country: '🇨🇦 Canada',
                desc: 'Mascotte représentant la nature et l\'esprit canadien',
                color: 'from-red-900 to-gray-800',
                img: '/mascot_canada.png',
              },
            ].map((m) => (
              <div key={m.name} className={`rounded-xl overflow-hidden bg-gradient-to-b ${m.color} p-1`}>
                <div className="bg-gray-800/80 rounded-lg p-4 h-full flex flex-col items-center text-center gap-3">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.currentTarget
                        t.style.display = 'none'
                        const p = t.parentElement
                        if (p) p.innerHTML = '<span class="text-5xl">⚽</span>'
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{m.name}</h3>
                    <p className="text-sm text-gray-300 mt-0.5">{m.country}</p>
                    <p className="text-xs text-gray-400 mt-2">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Ajoutez les images officielles dans /public/mascot_mexico.png · mascot_usa.png · mascot_canada.png
          </p>
        </div>
      </div>
    </div>
  )
}
