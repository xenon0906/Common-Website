'use client'

import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '../GlassCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrafficData {
  date: string
  views: number
  users: number
}

interface TrafficChartProps {
  data?: TrafficData[]
  loading?: boolean
}

export function TrafficChart({ data, loading }: TrafficChartProps) {
  if (loading) {
    return (
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Traffic Analytics</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="h-80 bg-gray-200 rounded animate-pulse" />
        </GlassCardContent>
      </GlassCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Traffic Analytics</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="flex items-center justify-center h-80 text-gray-500">
            <p className="text-sm">No analytics data available. Configure Google Analytics to see traffic data.</p>
          </div>
        </GlassCardContent>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <GlassCardHeader>
        <GlassCardTitle>Traffic Analytics (Last 7 Days)</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: '#111827', fontWeight: 600 }}
              itemStyle={{ color: '#374151' }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#0e4493"
              strokeWidth={3}
              dot={{ fill: '#0e4493', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Page Views"
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCardContent>
    </GlassCard>
  )
}
