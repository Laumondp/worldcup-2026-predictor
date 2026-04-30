import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from '../context/ThemeContext'

interface ProbabilityChartProps {
  homeWin: number
  draw: number
  awayWin: number
  homeTeam: string
  awayTeam: string
}

const COLORS = ['#3B82F6', '#6B7280', '#EF4444']

export default function ProbabilityChart({
  homeWin,
  draw,
  awayWin,
  homeTeam,
  awayTeam,
}: ProbabilityChartProps) {
  const { theme } = useTheme()
  const data = [
    { name: homeTeam, value: homeWin * 100 },
    { name: 'Draw', value: draw * 100 },
    { name: awayTeam, value: awayWin * 100 },
  ]

  const tooltipStyle = theme === 'dark'
    ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' }
    : { backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#111827' }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ value }) => `${value.toFixed(1)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={tooltipStyle}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
