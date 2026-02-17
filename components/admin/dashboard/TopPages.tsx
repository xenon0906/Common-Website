'use client'

import Link from 'next/link'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '../GlassCard'
import { ExternalLink, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { animations } from '@/lib/design-tokens'

interface PageData {
  path: string
  views: number
  change: number
}

interface TopPagesProps {
  pages?: PageData[]
  loading?: boolean
}

export function TopPages({ pages, loading }: TopPagesProps) {
  const defaultPages: PageData[] = pages || [
    { path: '/', views: 342, change: 12 },
    { path: '/features', views: 287, change: 8 },
    { path: '/blog', views: 234, change: -3 },
    { path: '/about', views: 189, change: 15 },
    { path: '/contact', views: 156, change: 5 },
  ]

  if (loading) {
    return (
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Top Pages</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <GlassCardHeader>
        <GlassCardTitle>Top Pages</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <div className="space-y-3">
          {defaultPages.map((page, index) => (
            <Link
              key={page.path}
              href={page.path}
              target="_blank"
              className={cn(
                'flex items-center justify-between p-4 rounded-lg',
                'bg-white/50 dark:bg-gray-800/50',
                'border border-gray-200/50 dark:border-gray-700/50',
                'hover:bg-white/80 dark:hover:bg-gray-800/80',
                'group cursor-pointer',
                animations.smooth
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {page.path}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {page.views.toLocaleString()} views
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  page.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}>
                  <TrendingUp className={cn('w-4 h-4', page.change < 0 && 'rotate-180')} />
                  <span>{page.change > 0 ? '+' : ''}{page.change}%</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}
