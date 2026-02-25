import { useQuery } from '@tanstack/react-query'
import { teamsApi, Team } from '../services/api'

interface TeamSelectorProps {
  value: string
  onChange: (team: string) => void
  label: string
  excludeTeam?: string
}

export default function TeamSelector({
  value,
  onChange,
  label,
  excludeTeam,
}: TeamSelectorProps) {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.getAll(),
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <div className="input w-full animate-pulse bg-gray-600">Loading...</div>
      </div>
    )
  }

  const availableTeams = teams?.data.filter((t: Team) => t.name !== excludeTeam) || []

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input w-full"
      >
        <option value="">Select a team</option>
        {availableTeams.map((team: Team) => (
          <option key={team.id} value={team.name}>
            {team.name} (#{team.fifa_ranking})
          </option>
        ))}
      </select>
    </div>
  )
}
