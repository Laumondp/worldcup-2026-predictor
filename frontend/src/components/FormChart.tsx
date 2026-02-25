import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface FormChartProps {
  data: { team: string; value: number }[]
  title: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function FormChart({ data, title }: FormChartProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 'auto']} />
            <YAxis type="category" dataKey="team" width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
