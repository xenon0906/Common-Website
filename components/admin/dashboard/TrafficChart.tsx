'use client'

import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '../GlassCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from 'next-themes'

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
  const { theme } = useTheme()

  const defaultData: TrafficData[] = data || [
    { date: 'Mon', views: 1200, users: 245 },
    { date: 'Tue', views: 1450, users: 298 },
    { date: 'Wed', views: 1100, users: 221 },
    { date: 'Thu', views: 1680, users: 342 },
    { date: 'Fri', views: 1890, users: 389 },
    { date: 'Sat', views: 2100, users: 421 },
    { date: 'Sun', views: 1750, users: 356 },
  ]

  const isDark = theme === 'dark'

  if (loading) {
    return (
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Traffic Analytics</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
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
          <LineChart data={defaultData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#374151' : '#e5e7eb'}
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: isDark ? '#f3f4f6' : '#111827', fontWeight: 600 }}
              itemStyle={{ color: isDark ? '#d1d5db' : '#374151' }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
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
