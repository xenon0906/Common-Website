'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Globe,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  RefreshCw,
  ExternalLink,
  Eye,
  Sparkles,
  Target,
  BarChart3,
} from 'lucide-react'

interface PageSEO {
  page: string
  title: string
  description: string
  keywords: string
  score: number
  issues: string[]
}

const defaultPagesSEO: PageSEO[] = [
  {
    page: 'Home',
    title: 'Snapgo - Share Rides, Save Money, Travel Together',
    description: 'Join thousands of verified users sharing cab rides across India. Save up to 75% on your daily commute with Snapgo ride-sharing.',
    keywords: 'snapgo, ride sharing, cab sharing, carpool india, save money commute',
    score: 92,
    issues: [],
  },
  {
    page: 'About',
    title: 'About Snapgo - Our Story & Mission',
    description: 'Learn about Snapgo, the DPIIT certified startup revolutionizing urban mobility in India through safe and affordable ride-sharing.',
    keywords: 'snapgo about, ride sharing startup, dpiit certified, indian startup',
    score: 88,
    issues: ['Add more unique keywords'],
  },
  {
    page: 'Features',
    title: 'Snapgo Features - Safe & Affordable Ride Sharing',
    description: 'Discover Snapgo features: KYC verification, female-only rides, SOS alerts, real-time matching, and up to 75% savings.',
    keywords: 'snapgo features, kyc verification, female only rides, sos alert',
    score: 95,
    issues: [],
  },
  {
    page: 'Safety',
    title: 'Safety First - Snapgo Verified Ride Sharing',
    description: 'Your safety is our priority. 100% KYC verified users, SOS alerts, female-only option, and 24/7 support.',
    keywords: 'safe ride sharing, verified users, sos alert, women safety',
    score: 90,
    issues: [],
  },
  {
    page: 'How It Works',
    title: 'How Snapgo Works - Easy Ride Sharing Guide',
    description: 'Learn how to use Snapgo for real-time and scheduled rides. Match with verified users and save up to 75%.',
    keywords: 'how snapgo works, ride sharing guide, carpool tutorial',
    score: 85,
    issues: ['Description could be longer'],
  },
  {
    page: 'Blog',
    title: 'Snapgo Blog - Ride Sharing Tips & News',
    description: 'Read the latest tips, stories, and insights about ride-sharing, saving money, and sustainable travel in India.',
    keywords: 'snapgo blog, ride sharing tips, carpool news, travel stories',
    score: 82,
    issues: ['Add more keywords'],
  },
  {
    page: 'Contact',
    title: 'Contact Snapgo - Get in Touch',
    description: 'Have questions? Contact Snapgo support team for help with ride-sharing, partnerships, or feedback.',
    keywords: 'contact snapgo, snapgo support, ride sharing help',
    score: 78,
    issues: ['Add local keywords'],
  },
]

function SEOScoreIndicator({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 90) return 'text-green-500 bg-green-100'
    if (score >= 70) return 'text-yellow-500 bg-yellow-100'
    return 'text-red-500 bg-red-100'
  }

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${getColor()}`}>
      {score >= 90 ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {score}/100
    </div>
  )
}

export default function SEOSettingsPage() {
  const [pages, setPages] = useState<PageSEO[]>(defaultPagesSEO)
  const [selectedPage, setSelectedPage] = useState<PageSEO | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const averageScore = Math.round(pages.reduce((sum, p) => sum + p.score, 0) / pages.length)
  const pagesWithIssues = pages.filter(p => p.issues.length > 0).length

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate SEO analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary-800 p-8"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium text-white/80">SEO & Optimization</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">SEO Settings</h1>
            <p className="text-white/80 max-w-lg">
              Optimize your website for search engines and AI assistants.
            </p>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-white text-primary hover:bg-white/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze Site
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Average SEO Score',
            value: `${averageScore}/100`,
            icon: Target,
            color: averageScore >= 85 ? 'text-green-500' : 'text-yellow-500',
            bg: averageScore >= 85 ? 'bg-green-100' : 'bg-yellow-100',
          },
          {
            title: 'Pages Optimized',
            value: `${pages.length}`,
            icon: FileText,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            title: 'Issues Found',
            value: `${pagesWithIssues}`,
            icon: AlertCircle,
            color: pagesWithIssues > 0 ? 'text-orange-500' : 'text-green-500',
            bg: pagesWithIssues > 0 ? 'bg-orange-100' : 'bg-green-100',
          },
          {
            title: 'Sitemap Status',
            value: 'Active',
            icon: Globe,
            color: 'text-green-500',
            bg: 'bg-green-100',
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pages">Page SEO</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="ai">AI Optimization</TabsTrigger>
        </TabsList>

        {/* Page SEO Tab */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Page-by-Page SEO
              </CardTitle>
              <CardDescription>
                Optimize meta tags and descriptions for each page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pages.map((page, index) => (
                  <motion.div
                    key={page.page}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center gap-4">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{page.page}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {page.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {page.issues.length > 0 && (
                        <Badge variant="outline" className="text-orange-500 border-orange-300">
                          {page.issues.length} issue{page.issues.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                      <SEOScoreIndicator score={page.score} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edit Selected Page */}
          {selectedPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Edit: {selectedPage.page}</CardTitle>
                  <CardDescription>
                    Update SEO settings for this page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input defaultValue={selectedPage.title} />
                    <p className="text-xs text-muted-foreground">
                      {selectedPage.title.length}/60 characters (recommended: 50-60)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea defaultValue={selectedPage.description} rows={3} />
                    <p className="text-xs text-muted-foreground">
                      {selectedPage.description.length}/160 characters (recommended: 150-160)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input defaultValue={selectedPage.keywords} />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of target keywords
                    </p>
                  </div>

                  {selectedPage.issues.length > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="font-medium text-orange-800 mb-2">Issues to fix:</p>
                      <ul className="list-disc list-inside text-sm text-orange-700">
                        {selectedPage.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedPage(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Global Settings Tab */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Global SEO Settings
              </CardTitle>
              <CardDescription>
                Site-wide SEO configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input defaultValue="Snapgo" />
                </div>
                <div className="space-y-2">
                  <Label>Site Tagline</Label>
                  <Input defaultValue="Share Rides, Save Money, Travel Together" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Meta Description</Label>
                <Textarea
                  defaultValue="Snapgo is India's trusted ride-sharing platform. Join verified users, save up to 75% on cab fares, and travel safely with KYC-verified co-riders."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Default Keywords</Label>
                <Input defaultValue="snapgo, ride sharing, cab sharing, carpool india, save money, verified rides, safe travel" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Google Analytics ID</Label>
                  <Input placeholder="G-XXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Google Search Console</Label>
                  <Input placeholder="Verification code" />
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Global Settings
              </Button>
            </CardContent>
          </Card>

          {/* Sitemap & Robots */}
          <Card>
            <CardHeader>
              <CardTitle>Sitemap & Robots.txt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Sitemap.xml</p>
                    <p className="text-sm text-muted-foreground">Auto-generated, includes all pages and blogs</p>
                  </div>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  View <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Robots.txt</p>
                    <p className="text-sm text-muted-foreground">Configured for optimal crawling</p>
                  </div>
                </div>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  View <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Optimization Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI SEO Optimization
              </CardTitle>
              <CardDescription>
                Optimize your content for AI assistants and search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI-friendly features */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Structured Data (JSON-LD)',
                    status: 'Active',
                    description: 'Organization and Article schemas implemented',
                    active: true,
                  },
                  {
                    title: 'Semantic HTML',
                    status: 'Active',
                    description: 'Proper heading hierarchy and landmarks',
                    active: true,
                  },
                  {
                    title: 'Alt Text for Images',
                    status: 'Review Needed',
                    description: '12 images may need alt text updates',
                    active: false,
                  },
                  {
                    title: 'Mobile Optimization',
                    status: 'Active',
                    description: 'Fully responsive design',
                    active: true,
                  },
                  {
                    title: 'Page Speed',
                    status: 'Good',
                    description: 'Core Web Vitals passing',
                    active: true,
                  },
                  {
                    title: 'Content Readability',
                    status: 'Active',
                    description: 'Clear and concise content structure',
                    active: true,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      feature.active ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{feature.title}</p>
                      <Badge variant={feature.active ? 'default' : 'outline'}>
                        {feature.status}
                      </Badge>
                    </div>
                    <p className={`text-sm ${feature.active ? 'text-green-700' : 'text-orange-700'}`}>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* AI Content Tips */}
              <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI SEO Best Practices
                </h3>
                <ul className="space-y-3">
                  {[
                    'Use clear, descriptive headings (H1, H2, H3)',
                    'Include relevant keywords naturally in content',
                    'Add comprehensive alt text to all images',
                    'Structure content with bullet points and lists',
                    'Keep paragraphs short and scannable',
                    'Include FAQ sections for voice search optimization',
                    'Use schema markup for rich snippets',
                    'Ensure fast page load times',
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
