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
          <h2 className="text-2xl font-bold mb-2 text-center">🎭 Les Mascottes officielles</h2>
          <p className="text-center text-gray-400 text-sm mb-6">Annoncées le 25 septembre 2025</p>

          {/* Photo officielle des 3 mascottes */}
          <div className="flex justify-center mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Maple-Zayu-Clutch_%28mascot%29.jpeg/800px-Maple-Zayu-Clutch_%28mascot%29.jpeg"
              alt="Maple, Zayu et Clutch — Mascottes FIFA World Cup 2026"
              className="rounded-2xl max-h-72 object-contain shadow-xl"
            />
          </div>

          {/* Fiches individuelles */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: 'Maple',
                animal: 'Orignal (Moose)',
                country: '🇨🇦 Canada',
                role: 'Gardien de but',
                desc: 'Créatif et résilient, il incarne les valeurs canadiennes avec sa tenue rouge.',
                color: 'border-red-600',
                emoji: '🦌',
              },
              {
                name: 'Zayu',
                animal: 'Jaguar',
                country: '🇲🇽 Mexique',
                role: 'Attaquant · N°9',
                desc: 'Symbole du pouvoir mésoaméricain, agile et fougueux en vert mexicain.',
                color: 'border-green-600',
                emoji: '🐆',
              },
              {
                name: 'Clutch',
                animal: 'Aigle chauve',
                country: '🇺🇸 États-Unis',
                role: 'Milieu de terrain',
                desc: 'Intrépide et optimiste, il inspire le courage et l\'unité en bleu américain.',
                color: 'border-blue-600',
                emoji: '🦅',
              },
            ].map((m) => (
              <div key={m.name} className={`bg-gray-700/50 rounded-xl p-4 border-l-4 ${m.color} flex flex-col gap-2`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{m.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold">{m.name}</h3>
                    <p className="text-sm text-gray-300">{m.country} · {m.animal}</p>
                  </div>
                </div>
                <span className="text-xs font-medium bg-gray-600 rounded-full px-2 py-0.5 w-fit">{m.role}</span>
                <p className="text-xs text-gray-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
