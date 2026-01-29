'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  RefreshCw,
  Target,
} from 'lucide-react'
import { useSEOData } from './hooks/useSEOData'
import {
  SEOScoreCard,
  SEOScoreIndicator,
  PageSEOEditor,
  GlobalSEOSettings,
  KeywordAnalyzer,
} from './components'
import { PageSEO } from '@/lib/types/seo'
import { useToast } from '@/components/ui/use-toast'
import { StatCardSkeleton, SEOCardSkeleton } from '@/components/ui/skeleton'

export default function SEOSettingsPage() {
  const {
    pages,
    globalSEO,
    isLoading,
    isSaving,
    error,
    saveGlobalSEO,
    savePageSEO,
    analyzeAllPages,
    clearError,
  } = useSEOData()

  const [selectedPage, setSelectedPage] = useState<PageSEO | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const averageScore = pages.length > 0
    ? Math.round(pages.reduce((sum, p) => sum + p.score, 0) / pages.length)
    : 0
  const pagesWithIssues = pages.filter(p => p.issues.length > 0).length

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      await analyzeAllPages()
      toast({
        title: 'Analysis complete',
        description: `All ${pages.length} pages have been analyzed.`,
      })
    } catch (err) {
      toast({
        title: 'Analysis failed',
        description: 'Could not analyze all pages. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-8">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-10 w-48 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-80 bg-white/20 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SEOCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Error Toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <Button variant="ghost" size="sm" onClick={clearError}>
            Dismiss
          </Button>
        </motion.div>
      )}

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
                Analyze All
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
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="pages">Page SEO</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
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
                    key={page.pageSlug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center gap-4">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{page.pageName}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {page.metaTitle}
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
            <PageSEOEditor
              page={selectedPage}
              onSave={savePageSEO}
              onCancel={() => setSelectedPage(null)}
              isSaving={isSaving}
            />
          )}
        </TabsContent>

        {/* Global Settings Tab */}
        <TabsContent value="global" className="space-y-6">
          <GlobalSEOSettings
            globalSEO={globalSEO}
            onSave={saveGlobalSEO}
            isSaving={isSaving}
          />
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          <KeywordAnalyzer />
        </TabsContent>

      </Tabs>
    </div>
  )
}
