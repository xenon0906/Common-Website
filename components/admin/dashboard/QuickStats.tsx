'use client'

import { GlassCard } from '../GlassCard'
import { TrendingUp, TrendingDown, Eye, FileText, Instagram, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { animations } from '@/lib/design-tokens'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
}

function StatCard({ title, value, change, icon: Icon, trend = 'neutral' }: StatCardProps) {
  const trendColor = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <GlassCard
      hover
      className={cn('p-6 cursor-pointer', animations.hover)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </h3>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor[trend])}>
              {trendIcon && <trendIcon className="w-4 h-4" />}
              <span>{change > 0 ? '+' : ''}{change}%</span>
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-teal-500/10 rounded-xl">
          <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
      </div>
    </GlassCard>
  )
}

interface QuickStatsProps {
  stats?: {
    pageViews?: { value: number; change: number }
    blogs?: { value: number; change: number }
    instagram?: { value: number; change: number }
    users?: { value: number; change: number }
  }
  loading?: boolean
}

export function QuickStats({ stats, loading }: QuickStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" />
          </GlassCard>
        ))}
      </div>
    )
  }

  const defaultStats = {
    pageViews: stats?.pageViews || { value: 1247, change: 12.5 },
    blogs: stats?.blogs || { value: 12, change: 0 },
    instagram: stats?.instagram || { value: 8, change: 14.3 },
    users: stats?.users || { value: 324, change: 8.2 },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Page Views"
        value={defaultStats.pageViews.value.toLocaleString()}
        change={defaultStats.pageViews.change}
        trend={defaultStats.pageViews.change > 0 ? 'up' : 'down'}
        icon={Eye}
      />
      <StatCard
        title="Published Blogs"
        value={defaultStats.blogs.value}
        change={defaultStats.blogs.change}
        trend={defaultStats.blogs.change > 0 ? 'up' : defaultStats.blogs.change < 0 ? 'down' : 'neutral'}
        icon={FileText}
      />
      <StatCard
        title="Instagram Reels"
        value={defaultStats.instagram.value}
        change={defaultStats.instagram.change}
        trend={defaultStats.instagram.change > 0 ? 'up' : 'down'}
        icon={Instagram}
      />
      <StatCard
        title="Total Users"
        value={defaultStats.users.value.toLocaleString()}
        change={defaultStats.users.change}
        trend={defaultStats.users.change > 0 ? 'up' : 'down'}
        icon={Users}
      />
    </div>
  )
}
