'use client'

import { GlassCard } from '../GlassCard'
import { FileText, FileEdit, FolderOpen, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { animations } from '@/lib/design-tokens'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  color: string
  iconBg: string
}

function StatCard({ title, value, description, icon: Icon, color, iconBg }: StatCardProps) {
  return (
    <GlassCard
      hover
      className={cn('p-6', animations.hover)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {value}
          </h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconBg)}>
          <Icon className={cn('w-6 h-6', color)} />
        </div>
      </div>
    </GlassCard>
  )
}

interface QuickStatsProps {
  stats: {
    publishedBlogs: number
    draftBlogs: number
    categories: number
    teamMembers: number
  }
  loading?: boolean
}

export function QuickStats({ stats, loading }: QuickStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-gray-200 rounded" />
          </GlassCard>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Published Blogs"
        value={stats.publishedBlogs}
        description="Live on website"
        icon={FileText}
        color="text-primary"
        iconBg="bg-primary/10"
      />
      <StatCard
        title="Draft Blogs"
        value={stats.draftBlogs}
        description="In progress"
        icon={FileEdit}
        color="text-amber-600"
        iconBg="bg-amber-500/10"
      />
      <StatCard
        title="Categories"
        value={stats.categories}
        description="Blog categories"
        icon={FolderOpen}
        color="text-teal"
        iconBg="bg-teal/10"
      />
      <StatCard
        title="Team Members"
        value={stats.teamMembers}
        description="Active members"
        icon={Users}
        color="text-purple"
        iconBg="bg-purple/10"
      />
    </div>
  )
}
