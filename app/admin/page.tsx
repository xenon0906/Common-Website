'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QuickStats } from '@/components/admin/dashboard/QuickStats'
import { QuickActions } from '@/components/admin/dashboard/QuickActions'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '@/components/admin/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface RecentBlog {
  title: string
  status: string
  views: number
  imageUrl?: string
  slug?: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatCurrentDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([])
  const [stats, setStats] = useState({
    publishedBlogs: 0,
    draftBlogs: 0,
    categories: 0,
    teamMembers: 0,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard', { signal: controller.signal })
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        const data = await res.json()

        setStats({
          publishedBlogs: data.publishedBlogs || 0,
          draftBlogs: data.draftBlogs || 0,
          categories: data.categories || 0,
          teamMembers: data.teamMembers || 0,
        })
        setRecentBlogs(data.recentBlogs || [])
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error fetching dashboard data:', err)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchDashboardData()
    return () => { controller.abort() }
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-8 h-8 text-primary mt-1" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {getGreeting()}
            </h1>
            <p className="text-gray-600 mt-1">
              {formatCurrentDate()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats — Real Firebase Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <QuickStats stats={stats} loading={loading} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Blog Posts - Spans 2 columns */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between w-full">
                <GlassCardTitle>Recent Blog Posts</GlassCardTitle>
                <Link
                  href="/admin/blogs"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  View all
                </Link>
              </div>
              <GlassCardDescription>
                {stats.publishedBlogs} published &bull; {stats.draftBlogs} drafts
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded" />
                  ))}
                </div>
              ) : recentBlogs.length > 0 ? (
                <div className="space-y-3">
                  {recentBlogs.map((blog) => (
                    <Link
                      key={blog.slug}
                      href={`/admin/blogs/${blog.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-gray-200/50 hover:bg-white/80 transition-colors"
                    >
                      {blog.imageUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-gray-900">
                          {blog.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {blog.views > 0 ? `${blog.views} views` : 'No views yet'}
                        </p>
                      </div>
                      <Badge
                        variant={blog.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {blog.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">
                    No blog posts yet.{' '}
                    <Link
                      href="/admin/blogs/create"
                      className="text-primary hover:underline font-medium"
                    >
                      Create your first post
                    </Link>
                  </p>
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>
      </div>
    </div>
  )
}
