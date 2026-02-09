'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Eye,
  Users,
  Clock,
  MousePointerClick,
  Globe,
  Smartphone,
  Monitor,
  FileText,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Settings,
  Loader2,
  AlertCircle,
  Database,
  MessageSquare,
  HelpCircle,
  Image as ImageIcon,
  Search,
  Plus,
  LayoutGrid,
  Upload,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { USE_FIREBASE } from '@/lib/config'
import { useCollectionCounts } from '@/lib/hooks/useFirestore'

interface AnalyticsData {
  overview: {
    totalVisitors: number
    totalPageViews: number
    avgSessionDuration: number
    bounceRate: number
    visitorChange: number
    pageViewChange: number
    durationChange: number
    bounceChange: number
    isError?: boolean
    errorMessage?: string
  }
  dailyVisitors: Array<{
    date: string
    visitors: number
    pageViews: number
  }>
  topPages: Array<{
    path: string
    title: string
    views: number
    percentage: number
  }>
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  deviceBreakdown?: Array<{
    name: string
    value: number
    color: string
  }>
  geoData?: Array<{
    city: string
    visitors: number
    percentage: number
  }>
}

interface RecentBlog {
  title: string
  status: string
  views: number
  imageUrl?: string
  slug?: string
  createdAt?: string
  excerpt?: string
}

// Traffic source colors
const trafficColors = ['#0066B3', '#0d9488', '#7c3aed', '#3399CC', '#f59e0b']

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}m ${secs}s`
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatCurrentDate(): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
}

// Skeleton loader for cards
function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="h-4 bg-muted rounded w-1/3 mb-4" />
        <div className="h-8 bg-muted rounded w-1/2 mb-2" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([])
  const [blogStats, setBlogStats] = useState({ total: 0, published: 0, drafts: 0, noImage: 0, noMeta: 0 })

  // Firestore collection counts
  const { counts: firestoreCounts, loading: countsLoading } = useCollectionCounts(
    USE_FIREBASE ? ['blogs', 'team', 'testimonials', 'faq'] : []
  )

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics/data', { signal })
        if (signal.aborted) return
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please log in to view analytics')
          } else {
            throw new Error('Failed to fetch analytics')
          }
          return
        }
        const data = await res.json()
        if (signal.aborted) return
        setAnalytics(data)
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error('Error fetching analytics:', err)
        if (!signal.aborted) setError('Failed to load analytics data')
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }

    async function fetchRecentBlogs() {
      if (!USE_FIREBASE) return
      try {
        const { getFirebaseDb, getAppId, collection, getDocs, query, orderBy } = await import('@/lib/firebase')
        if (signal.aborted) return
        const db = getFirebaseDb()
        const appId = getAppId()
        const blogsRef = collection(db, 'artifacts', appId, 'public', 'data', 'blogs')
        const blogsQuery = query(blogsRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(blogsQuery)
        if (signal.aborted) return

        let published = 0, drafts = 0, noImage = 0, noMeta = 0
        const blogs = snapshot.docs.slice(0, 5).map(d => {
          const data = d.data()
          return {
            title: data.title || 'Untitled',
            status: data.published ? 'published' : 'draft',
            views: data.views || 0,
            imageUrl: data.imageUrl || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
          }
        })

        snapshot.docs.forEach(d => {
          const data = d.data()
          if (data.published) published++
          else drafts++
          if (!data.imageUrl) noImage++
          if (!data.metaDesc && !data.excerpt) noMeta++
        })

        setRecentBlogs(blogs)
        setBlogStats({ total: snapshot.docs.length, published, drafts, noImage, noMeta })
      } catch (err) {
        if (!signal.aborted) console.error('Error fetching recent blogs:', err)
      }
    }

    fetchAnalytics()
    fetchRecentBlogs()

    return () => { controller.abort() }
  }, [])

  // Build stats from analytics data
  const websiteStats = analytics ? [
    {
      title: 'Page Views',
      value: formatNumber(analytics.overview.totalPageViews),
      change: `${analytics.overview.pageViewChange > 0 ? '+' : ''}${analytics.overview.pageViewChange}%`,
      trend: analytics.overview.pageViewChange >= 0 ? 'up' : 'down',
      icon: Eye,
      description: 'Last 30 days',
    },
    {
      title: 'Unique Visitors',
      value: formatNumber(analytics.overview.totalVisitors),
      change: `${analytics.overview.visitorChange > 0 ? '+' : ''}${analytics.overview.visitorChange}%`,
      trend: analytics.overview.visitorChange >= 0 ? 'up' : 'down',
      icon: Users,
      description: 'Last 30 days',
    },
    {
      title: 'Avg. Session',
      value: formatDuration(analytics.overview.avgSessionDuration),
      change: `${analytics.overview.durationChange > 0 ? '+' : ''}${analytics.overview.durationChange}%`,
      trend: analytics.overview.durationChange >= 0 ? 'up' : 'down',
      icon: Clock,
      description: 'Duration',
    },
    {
      title: 'Bounce Rate',
      value: `${analytics.overview.bounceRate}%`,
      change: `${analytics.overview.bounceChange > 0 ? '+' : ''}${analytics.overview.bounceChange}%`,
      trend: analytics.overview.bounceChange >= 0 ? 'up' : 'down',
      icon: MousePointerClick,
      description: 'Lower is better',
    },
  ] : []

  const pageViewsData = analytics?.dailyVisitors.map(d => ({
    date: d.date,
    views: d.pageViews,
    visitors: d.visitors,
  })) || []

  const trafficSourcesData = analytics?.trafficSources.map((s, i) => ({
    name: s.source,
    value: s.percentage,
    color: trafficColors[i % trafficColors.length],
  })) || []

  const topPagesData = analytics?.topPages.map(p => ({
    page: p.title || p.path,
    views: p.views,
    change: `${p.percentage}%`,
  })) || []

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-lg text-muted-foreground">{error}</p>
        <Link href="/admin/login" className="text-primary hover:underline">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{getGreeting()}</h1>
          <p className="text-muted-foreground mt-1">{formatCurrentDate()}</p>
          <p className="text-sm text-muted-foreground mt-0.5">Here&apos;s what&apos;s happening with your website</p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'New Blog Post', icon: Plus, href: '/admin/blogs/create', color: 'bg-primary/10 text-primary' },
            { label: 'Manage Team', icon: UserPlus, href: '/admin/team', color: 'bg-teal/10 text-teal' },
            { label: 'Content', icon: LayoutGrid, href: '/admin/content', color: 'bg-purple-500/10 text-purple-600' },
            { label: 'Media Library', icon: Upload, href: '/admin/media', color: 'bg-orange-500/10 text-orange-600' },
            { label: 'SEO Tools', icon: Search, href: '/admin/seo', color: 'bg-blue-500/10 text-blue-600' },
            { label: 'Settings', icon: Settings, href: '/admin/settings', color: 'bg-gray-500/10 text-gray-600' },
          ].map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <Card className="hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Content Overview Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal" />
                  Recent Blog Posts
                </CardTitle>
                <CardDescription>Latest articles from your blog</CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/blogs/create" className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  New Post
                </Link>
                <Link href="/admin/blogs" className="text-xs text-teal hover:underline flex items-center gap-1 px-2 py-1.5">
                  View all <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentBlogs.length > 0 ? (
                <div className="space-y-3">
                  {recentBlogs.map((blog) => (
                    <div key={blog.title} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                      {/* Thumbnail */}
                      <div className="relative w-12 h-9 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {blog.imageUrl ? (
                          <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{blog.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {blog.views > 0 ? `${blog.views.toLocaleString()} views` : 'No views yet'}
                        </p>
                      </div>
                      <Badge variant={blog.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                        {blog.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No blog posts yet. <Link href="/admin/blogs/create" className="text-primary hover:underline">Create one</Link>.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Content Health
              </CardTitle>
              <CardDescription>Overview of your content status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Published vs Drafts */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Published vs Drafts</span>
                  <span className="font-medium">{blogStats.published} / {blogStats.drafts}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                  {blogStats.total > 0 && (
                    <>
                      <div
                        className="h-full bg-green-500 rounded-l-full transition-all duration-500"
                        style={{ width: `${(blogStats.published / blogStats.total) * 100}%` }}
                      />
                      <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${(blogStats.drafts / blogStats.total) * 100}%` }}
                      />
                    </>
                  )}
                </div>
                <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Published</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Drafts</span>
                </div>
              </div>

              {/* Warnings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {blogStats.noImage > 0 ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-sm">Posts without images</span>
                  </div>
                  <Badge variant={blogStats.noImage > 0 ? 'secondary' : 'outline'} className="text-xs">
                    {blogStats.noImage}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {blogStats.noMeta > 0 ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-sm">Posts without meta descriptions</span>
                  </div>
                  <Badge variant={blogStats.noMeta > 0 ? 'secondary' : 'outline'} className="text-xs">
                    {blogStats.noMeta}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm">Total blog posts</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{blogStats.total}</Badge>
                </div>
              </div>

              {blogStats.noImage > 0 && (
                <Link href="/admin/blogs" className="block text-xs text-primary hover:underline text-center">
                  Go to Blog Manager to fix issues
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics error banner */}
      {analytics?.overview.isError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Analytics unavailable</p>
            <p className="text-sm text-amber-600">
              {analytics.overview.errorMessage || 'Could not load analytics data. Showing placeholder values.'}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : websiteStats.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {websiteStats.map((stat, index) => {
            const Icon = stat.icon
            const isPositive = stat.trend === 'up' && !stat.title.includes('Bounce') ||
                              stat.trend === 'down' && stat.title.includes('Bounce')
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {stat.change}
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.title} &middot; {stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Charts Section */}
      {!loading && analytics && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Traffic Overview Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-teal" />
                  Traffic Overview
                </CardTitle>
                <CardDescription>Page views and unique visitors (last 7 days)</CardDescription>
              </CardHeader>
              <CardContent>
                {pageViewsData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={pageViewsData}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0066B3" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0066B3" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="views" name="Page Views" stroke="#0066B3" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                        <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                    <BarChart3 className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm">No traffic data available</p>
                    <p className="text-xs mt-1">Configure Google Analytics to see traffic data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages this month</CardDescription>
              </CardHeader>
              <CardContent>
                {topPagesData.length > 0 ? (
                  <div className="space-y-4">
                    {topPagesData.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium truncate max-w-[180px]">{page.page}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground text-sm">{page.views.toLocaleString()} views</span>
                          <Badge variant="outline" className="text-xs">{page.change}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="text-sm">No page data available</p>
                    <p className="text-xs mt-1">Configure Google Analytics to see top pages</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Traffic Sources & Devices Row */}
      {!loading && analytics && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="w-5 h-5 text-teal" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trafficSourcesData.length > 0 ? (
                  <>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={trafficSourcesData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                            {trafficSourcesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-2">
                      {trafficSourcesData.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{entry.name}</span>
                          </div>
                          <span className="font-medium">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No source data available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.deviceBreakdown && analytics.deviceBreakdown.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.deviceBreakdown.map((device) => (
                      <div key={device.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {device.name.toLowerCase() === 'mobile' && <Smartphone className="w-4 h-4" />}
                            {device.name.toLowerCase() === 'desktop' && <Monitor className="w-4 h-4" />}
                            {device.name.toLowerCase() === 'tablet' && <Smartphone className="w-4 h-4" />}
                            <span>{device.name}</span>
                          </div>
                          <span className="font-medium">{device.value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${device.value}%`, backgroundColor: device.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No device data available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="w-5 h-5 text-green-600" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.geoData && analytics.geoData.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.geoData.map((location) => (
                      <div key={location.city} className="flex items-center justify-between">
                        <span className="text-sm">{location.city}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{location.visitors.toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">{location.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No location data available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Firebase Database Stats */}
      {USE_FIREBASE && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-500" />
                Firebase Database
              </CardTitle>
              <CardDescription>Real-time collection counts from Firestore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'blogs', label: 'Blog Posts', icon: FileText, color: 'text-blue-600 bg-blue-100', href: '/admin/blogs' },
                  { name: 'team', label: 'Team Members', icon: Users, color: 'text-green-600 bg-green-100', href: '/admin/team' },
                  { name: 'testimonials', label: 'Testimonials', icon: MessageSquare, color: 'text-purple-600 bg-purple-100', href: '/admin/content/testimonials' },
                  { name: 'faq', label: 'FAQ Items', icon: HelpCircle, color: 'text-amber-600 bg-amber-100', href: '/admin/faq' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.name} href={item.href}>
                      <div className="bg-muted/50 rounded-lg p-4 border hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {countsLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          ) : (
                            firestoreCounts[item.name] || 0
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
