'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Home,
  Info,
  Users,
  Shield,
  HelpCircle,
  Mail,
  Star,
  BookOpen,
  FileQuestion,
  Scale,
  Lock,
  Edit,
  Eye,
  ExternalLink,
  Search,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe,
  Smartphone,
  ArrowUpRight,
} from 'lucide-react'

interface PageInfo {
  id: string
  title: string
  path: string
  icon: any
  status: 'published' | 'draft' | 'scheduled'
  lastModified: string
  views: number
  description: string
  seoScore: number
}

const pages: PageInfo[] = [
  {
    id: '1',
    title: 'Home',
    path: '/',
    icon: Home,
    status: 'published',
    lastModified: '2024-12-20',
    views: 12450,
    description: 'Main landing page with hero, features, testimonials',
    seoScore: 95,
  },
  {
    id: '2',
    title: 'Features',
    path: '/features',
    icon: Star,
    status: 'published',
    lastModified: '2024-12-18',
    views: 3240,
    description: 'Detailed feature showcase and benefits',
    seoScore: 88,
  },
  {
    id: '3',
    title: 'How It Works',
    path: '/how-it-works',
    icon: HelpCircle,
    status: 'published',
    lastModified: '2024-12-15',
    views: 4120,
    description: 'Step-by-step guide to using Snapgo',
    seoScore: 92,
  },
  {
    id: '4',
    title: 'Safety',
    path: '/safety',
    icon: Shield,
    status: 'published',
    lastModified: '2024-12-14',
    views: 2890,
    description: 'Safety features and verification process',
    seoScore: 90,
  },
  {
    id: '5',
    title: 'About Us',
    path: '/about',
    icon: Info,
    status: 'published',
    lastModified: '2024-12-12',
    views: 1560,
    description: 'Company story, mission, and values',
    seoScore: 85,
  },
  {
    id: '6',
    title: 'Team',
    path: '/team',
    icon: Users,
    status: 'published',
    lastModified: '2024-12-20',
    views: 980,
    description: 'Meet the team behind Snapgo',
    seoScore: 82,
  },
  {
    id: '7',
    title: 'Blog',
    path: '/blog',
    icon: BookOpen,
    status: 'published',
    lastModified: '2024-12-19',
    views: 5670,
    description: 'Articles, tips, and news',
    seoScore: 94,
  },
  {
    id: '8',
    title: 'Contact',
    path: '/contact',
    icon: Mail,
    status: 'published',
    lastModified: '2024-12-10',
    views: 1240,
    description: 'Contact form and information',
    seoScore: 78,
  },
  {
    id: '9',
    title: 'FAQ',
    path: '/faq',
    icon: FileQuestion,
    status: 'published',
    lastModified: '2024-12-18',
    views: 2340,
    description: 'Frequently asked questions',
    seoScore: 91,
  },
  {
    id: '10',
    title: 'Privacy Policy',
    path: '/privacy',
    icon: Lock,
    status: 'published',
    lastModified: '2024-11-01',
    views: 890,
    description: 'Privacy policy and data handling',
    seoScore: 75,
  },
  {
    id: '11',
    title: 'Terms of Service',
    path: '/terms',
    icon: Scale,
    status: 'published',
    lastModified: '2024-11-01',
    views: 720,
    description: 'Terms and conditions',
    seoScore: 72,
  },
]

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function getSeoColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

function getSeoLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  return 'Needs Work'
}

export default function PagesOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || page.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalViews = pages.reduce((acc, p) => acc + p.views, 0)
  const avgSeoScore = Math.round(pages.reduce((acc, p) => acc + p.seoScore, 0) / pages.length)
  const publishedCount = pages.filter((p) => p.status === 'published').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Pages Overview
          </h1>
          <p className="text-muted-foreground">Manage and monitor all website pages</p>
        </div>
        <Link href="/admin/seo">
          <Button variant="gradient" size="lg">
            <BarChart3 className="w-4 h-4 mr-2" />
            SEO Settings
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pages.length}</p>
                <p className="text-sm text-muted-foreground">Total Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgSeoScore}%</p>
                <p className="text-sm text-muted-foreground">Avg SEO Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  !statusFilter ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'published' ? 'bg-green-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <CheckCircle className="w-3 h-3" />
                Published
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'draft' ? 'bg-yellow-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Draft
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPages.map((page, index) => {
          const Icon = page.icon
          return (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all hover:border-primary/30 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge
                      variant={page.status === 'published' ? 'default' : 'secondary'}
                      className={page.status === 'published' ? 'bg-green-600' : ''}
                    >
                      {page.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg mb-1">{page.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{page.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(page.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {page.lastModified}
                    </span>
                  </div>

                  {/* SEO Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">SEO Score</span>
                      <span className={`text-xs font-medium ${getSeoColor(page.seoScore)}`}>
                        {page.seoScore}% - {getSeoLabel(page.seoScore)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          page.seoScore >= 90
                            ? 'bg-green-500'
                            : page.seoScore >= 70
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${page.seoScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={page.path} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/content${page.path === '/' ? '/hero' : ''}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Links */}
      <Card className="bg-gradient-to-r from-primary/10 via-teal/10 to-purple/10 border-primary/20">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common page management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/content/hero">
              <div className="p-4 rounded-xl bg-background hover:shadow-md transition-all border hover:border-primary/30 text-center">
                <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">Edit Hero</p>
              </div>
            </Link>
            <Link href="/admin/content/features">
              <div className="p-4 rounded-xl bg-background hover:shadow-md transition-all border hover:border-primary/30 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-teal" />
                <p className="font-medium text-sm">Edit Features</p>
              </div>
            </Link>
            <Link href="/admin/content/testimonials">
              <div className="p-4 rounded-xl bg-background hover:shadow-md transition-all border hover:border-primary/30 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-purple" />
                <p className="font-medium text-sm">Testimonials</p>
              </div>
            </Link>
            <Link href="/admin/seo">
              <div className="p-4 rounded-xl bg-background hover:shadow-md transition-all border hover:border-primary/30 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="font-medium text-sm">SEO Settings</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
            Top Performing Pages
          </CardTitle>
          <CardDescription>Pages with the highest views this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((page, index) => {
                const Icon = page.icon
                return (
                  <div key={page.id} className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{page.title}</p>
                      <p className="text-xs text-muted-foreground">{page.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatNumber(page.views)}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
