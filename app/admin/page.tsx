'use client'

import { useState, useEffect } from 'react'
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
  Sparkles,
  Zap,
  UserPlus,
  Loader2,
  AlertCircle,
  Database,
  MessageSquare,
  HelpCircle,
} from 'lucide-react'
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
}

// Device Breakdown (static for now - GA4 requires different API call)
const deviceData = [
  { name: 'Mobile', value: 62, color: '#0066B3' },
  { name: 'Desktop', value: 32, color: '#0d9488' },
  { name: 'Tablet', value: 6, color: '#7c3aed' },
]

// Geographic Data (static for now)
const geoData = [
  { city: 'Greater Noida', visitors: 2840, percentage: 34 },
  { city: 'Delhi', visitors: 1680, percentage: 20 },
  { city: 'Mumbai', visitors: 1240, percentage: 15 },
  { city: 'Bangalore', visitors: 920, percentage: 11 },
  { city: 'Other', visitors: 1752, percentage: 20 },
]

// Recent Blogs
const recentBlogs = [
  { title: 'How to Save Rs 6000 Monthly on Your Commute', status: 'published', views: 1240 },
  { title: 'Top 5 Ride-Sharing Tips for College Students', status: 'draft', views: 0 },
  { title: 'Why Aadhaar Verification Makes Travel Safer', status: 'published', views: 890 },
]

// Recent Achievements
const recentAchievements = [
  { title: 'DPIIT Certificate', type: 'CERT', date: '2024' },
  { title: 'Startup India Recognition', type: 'CERT', date: '2024' },
  { title: '7000+ Downloads Milestone', type: 'POST', date: 'Dec 2025' },
]

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

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Firestore collection counts
  const { counts: firestoreCounts, loading: countsLoading } = useCollectionCounts(
    USE_FIREBASE ? ['blogs', 'team', 'testimonials', 'faq'] : []
  )

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics/data')
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please log in to view analytics')
          } else {
            throw new Error('Failed to fetch analytics')
          }
          return
        }
        const data = await res.json()
        setAnalytics(data)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
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

  // Transform daily visitors for chart
  const pageViewsData = analytics?.dailyVisitors.map(d => ({
    date: d.date,
    views: d.pageViews,
    visitors: d.visitors,
  })) || []

  // Transform traffic sources for pie chart
  const trafficSourcesData = analytics?.trafficSources.map((s, i) => ({
    name: s.source,
    value: s.percentage,
    color: trafficColors[i % trafficColors.length],
  })) || []

  // Transform top pages
  const topPagesData = analytics?.topPages.map(p => ({
    page: p.title || p.path,
    views: p.views,
    change: `${p.percentage}%`,
  })) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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
      {/* Header with gradient background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-teal to-purple p-8"
      >
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"
            animate={{ scale: [1.2, 1, 1.2], y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium text-white/80">Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Website Analytics</h1>
            <p className="text-white/80 max-w-lg">
              Monitor your website performance, track visitor insights, and manage your content.
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="hidden md:flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid with enhanced cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {websiteStats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.trend === 'up' && !stat.title.includes('Bounce') ||
                            stat.trend === 'down' && stat.title.includes('Bounce')
          const gradientColors = [
            'from-primary/10 to-teal/10 border-primary/20',
            'from-teal/10 to-purple/10 border-teal/20',
            'from-purple/10 to-primary/10 border-purple/20',
            'from-green-500/10 to-teal/10 border-green-500/20',
          ]
          const iconBgColors = [
            'bg-gradient-to-br from-primary to-teal',
            'bg-gradient-to-br from-teal to-purple',
            'bg-gradient-to-br from-purple to-primary',
            'bg-gradient-to-br from-green-500 to-teal',
          ]
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className={`relative overflow-hidden border bg-gradient-to-br ${gradientColors[index]} hover:shadow-lg transition-all duration-300`}>
                {/* Subtle glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl -translate-y-1/2 translate-x-1/2" />

                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${iconBgColors[index]} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
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
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-foreground">{stat.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Page Views & Visitors Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
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
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Page Views"
                      stroke="#0066B3"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Visitors"
                      stroke="#0d9488"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
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
                      <span className="text-muted-foreground">{page.views.toLocaleString()} views</span>
                      <Badge variant="outline" className="text-xs">{page.change}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Row - Traffic Sources, Devices, Geography */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourcesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceData.map((device) => (
                  <div key={device.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {device.name === 'Mobile' && <Smartphone className="w-4 h-4" />}
                        {device.name === 'Desktop' && <Monitor className="w-4 h-4" />}
                        {device.name === 'Tablet' && <Smartphone className="w-4 h-4" />}
                        <span>{device.name}</span>
                      </div>
                      <span className="font-medium">{device.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${device.value}%`, backgroundColor: device.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geoData.map((location) => (
                  <div key={location.city} className="flex items-center justify-between">
                    <span className="text-sm">{location.city}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {location.visitors.toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {location.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal" />
                Recent Blogs
              </CardTitle>
              <Link href="/admin/blogs" className="text-sm text-teal hover:underline flex items-center gap-1">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBlogs.map((blog) => (
                  <div key={blog.title} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{blog.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {blog.views > 0 ? `${blog.views.toLocaleString()} views` : 'Not published'}
                      </p>
                    </div>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Achievements
              </CardTitle>
              <Link href="/admin/achievements" className="text-sm text-teal hover:underline flex items-center gap-1">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.title} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.date}</p>
                    </div>
                    <Badge variant="outline">{achievement.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Firestore Database Stats */}
      {USE_FIREBASE && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.05 }}
        >
          <Card className="border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-500" />
                Firebase Database
              </CardTitle>
              <CardDescription>Real-time collection statistics from Firestore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'blogs', label: 'Blog Posts', icon: FileText, color: 'text-blue-600 bg-blue-100' },
                  { name: 'team', label: 'Team Members', icon: Users, color: 'text-green-600 bg-green-100' },
                  { name: 'testimonials', label: 'Testimonials', icon: MessageSquare, color: 'text-purple-600 bg-purple-100' },
                  { name: 'faq', label: 'FAQ Items', icon: HelpCircle, color: 'text-amber-600 bg-amber-100' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.name} className="bg-white rounded-lg p-4 border">
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
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions with enhanced design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.1 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-teal to-purple text-white border-0">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-white/5 blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium text-white/80">Quick Actions</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Manage Your Website</h3>
                <p className="text-white/80 max-w-md">
                  Create engaging content, customize your site settings, and track performance metrics.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/admin/blogs/create"
                  className="group flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <FileText className="w-5 h-5" />
                  New Blog Post
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/admin/team"
                  className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5" />
                  Manage Team
                </Link>
                <Link
                  href="/admin/content"
                  className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <FileText className="w-5 h-5" />
                  Content Manager
                </Link>
                <Link
                  href="/admin/settings"
                  className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
