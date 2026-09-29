'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

// Spread across the color wheel, not just green shades, so adjacent
// slices are always visually distinguishable regardless of count.
const COLORS = [
  '#39ff14', '#3dd6ff', '#ff6b6b', '#ffd93d', '#a78bfa',
  '#ff9f43', '#4dd8b0', '#f472b6', '#60a5fa', '#facc15',
]

export function GenrePieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, value }) => `${name} (${value})`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#1c2030', border: '1px solid #2a2f42', borderRadius: '8px' }}
          itemStyle={{ color: '#f1eee6' }}
          formatter={(value, name) => [`${value ?? 0} movies`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}