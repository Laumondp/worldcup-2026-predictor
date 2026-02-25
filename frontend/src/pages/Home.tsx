import { useQuery } from '@tanstack/react-query'
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { matchesApi, teamsApi, predictionsApi } from '../services/api'
import MatchCard from '../components/MatchCard'
import FormChart from '../components/FormChart'

export default function Home() {
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
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  const statsCards = [
    { icon: Users, label: 'Qualified Teams', value: '48', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Matches', value: '104', color: 'bg-green-500' },
    { icon: Trophy, label: 'Host Nations', value: '3', color: 'bg-yellow-500' },
    { icon: TrendingUp, label: 'Groups', value: '12', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          FIFA World Cup 2026
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          USA - Mexico - Canada
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Machine Learning powered predictions for every match.
          Analyze team statistics, simulate tournaments, and track prediction accuracy.
        </p>
      </div>

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
            <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            <Link to="/predictions" className="text-blue-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingMatches?.data?.slice(0, 4).map((match: any) => (
              <MatchCard
                key={match.id}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                homeCode={match.home_team.slice(0, 3).toUpperCase()}
                awayCode={match.away_team.slice(0, 3).toUpperCase()}
                date={match.date}
                stage={match.stage}
              />
            )) || (
              <div className="col-span-2 card text-center text-gray-400">
                No upcoming matches scheduled yet
              </div>
            )}
          </div>
        </div>

        {/* Tournament Simulation */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tournament Favorites</h2>
          <div className="card">
            {simulation?.data ? (
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Predicted Winner</div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {simulation.data.winner}
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(simulation.data.win_probabilities)
                    .slice(0, 5)
                    .map(([team, prob]) => (
                      <div key={team} className="flex items-center justify-between">
                        <span>{team}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(prob as number) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-12 text-right">
                            {((prob as number) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="text-xs text-gray-500 text-center pt-2">
                  Based on {simulation.data.simulations_run} Monte Carlo simulations
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">Loading simulation...</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Teams */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Top Ranked Teams</h2>
        {topTeams?.data ? (
          <FormChart
            data={topTeams.data.map((t: any) => ({
              team: t.name,
              value: t.elo_rating,
            }))}
            title="ELO Ratings"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Loading teams...
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/predictions" className="card hover:ring-2 hover:ring-blue-500 transition-all">
          <h3 className="text-xl font-bold mb-2">Match Predictions</h3>
          <p className="text-gray-400">Get AI-powered predictions for any match</p>
        </Link>
        <Link to="/groups" className="card hover:ring-2 hover:ring-green-500 transition-all">
          <h3 className="text-xl font-bold mb-2">Group Standings</h3>
          <p className="text-gray-400">View all 12 groups and simulate outcomes</p>
        </Link>
        <Link to="/bracket" className="card hover:ring-2 hover:ring-purple-500 transition-all">
          <h3 className="text-xl font-bold mb-2">Knockout Bracket</h3>
          <p className="text-gray-400">Interactive bracket with predictions</p>
        </Link>
      </div>
    </div>
  )
}
