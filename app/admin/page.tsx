'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QuickStats } from '@/components/admin/dashboard/QuickStats'
import { TrafficChart } from '@/components/admin/dashboard/TrafficChart'
import { TopPages } from '@/components/admin/dashboard/TopPages'
import { QuickActions } from '@/components/admin/dashboard/QuickActions'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '@/components/admin/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { USE_FIREBASE } from '@/lib/config'

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
  const [blogCount, setBlogCount] = useState({ total: 0, published: 0 })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function fetchRecentBlogs() {
      if (!USE_FIREBASE) {
        setLoading(false)
        return
      }
      try {
        const { getFirebaseDb, getAppId, collection, getDocs, query, orderBy, limit } = await import('@/lib/firebase')
        if (signal.aborted) return
        const db = getFirebaseDb()
        const appId = getAppId()
        const blogsRef = collection(db, 'artifacts', appId, 'public', 'data', 'blogs')
        const blogsQuery = query(blogsRef, orderBy('createdAt', 'desc'), limit(5))
        const snapshot = await getDocs(blogsQuery)
        if (signal.aborted) return

        let published = 0
        const blogs = snapshot.docs.map((d) => {
          const data = d.data()
          if (data.published) published++
          return {
            title: data.title || 'Untitled',
            status: data.published ? 'published' : 'draft',
            views: data.views || 0,
            imageUrl: data.imageUrl || '',
            slug: data.slug || '',
          }
        })

        setRecentBlogs(blogs)
        setBlogCount({ total: snapshot.docs.length, published })
      } catch (err) {
        if (!signal.aborted) console.error('Error fetching recent blogs:', err)
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }

    fetchRecentBlogs()
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
          <Sparkles className="w-8 h-8 text-teal-600 dark:text-teal-400 mt-1" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {formatCurrentDate()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <QuickStats loading={loading} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Chart - Spans 2 columns */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <TrafficChart loading={loading} />
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

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <TopPages loading={loading} />
        </motion.div>

        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between w-full">
                <GlassCardTitle>Recent Blog Posts</GlassCardTitle>
                <Link
                  href="/admin/blogs"
                  className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View all
                </Link>
              </div>
              <GlassCardDescription>
                {blogCount.published} published • {blogCount.total - blogCount.published} drafts
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
                  ))}
                </div>
              ) : recentBlogs.length > 0 ? (
                <div className="space-y-3">
                  {recentBlogs.map((blog) => (
                    <Link
                      key={blog.slug}
                      href={`/admin/blogs/${blog.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
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
                        <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                          {blog.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No blog posts yet.{' '}
                    <Link
                      href="/admin/blogs/create"
                      className="text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Create your first post
                    </Link>
                  </p>
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
