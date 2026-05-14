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
    <div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={56}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              contentStyle={tooltipStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-around text-center mt-1">
        <div className="flex-1 min-w-0 px-1">
          <div className="text-sm font-bold text-blue-500">{(homeWin * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{homeTeam}</div>
        </div>
        <div className="flex-1 min-w-0 px-1">
          <div className="text-sm font-bold text-gray-500 dark:text-gray-400">{(draw * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Nul</div>
        </div>
        <div className="flex-1 min-w-0 px-1">
          <div className="text-sm font-bold text-red-400">{(awayWin * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{awayTeam}</div>
        </div>
      </div>
    </div>
  )
}
