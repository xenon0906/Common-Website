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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Save,
  X,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Info,
  Eye,
  Sparkles,
} from 'lucide-react'
import { PageSEO, calculateSEOScore } from '@/lib/types/seo'
import { SEOScoreCard } from './SEOScoreCard'

interface PageSEOEditorProps {
  page: PageSEO
  onSave: (pageSlug: string, data: Partial<PageSEO>) => Promise<boolean>
  onCancel: () => void
  onGenerateWithAI?: (page: PageSEO) => void
  isSaving: boolean
}

type FormData = {
  metaTitle: string
  metaDescription: string
  keywords: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  noIndex: boolean
  noFollow: boolean
  schemaType: string
  customSchema: string
}

export function PageSEOEditor({
  page,
  onSave,
  onCancel,
  onGenerateWithAI,
  isSaving,
}: PageSEOEditorProps) {
  const [previewScore, setPreviewScore] = useState(page.score)

  const { register, handleSubmit, watch, setValue, formState: { isDirty } } = useForm<FormData>({
    defaultValues: {
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      keywords: page.keywords.join(', '),
      canonicalUrl: page.canonicalUrl || '',
      ogTitle: page.ogTitle || '',
      ogDescription: page.ogDescription || '',
      ogImage: page.ogImage || '',
      noIndex: page.noIndex,
      noFollow: page.noFollow,
      schemaType: page.schemaType || 'WebPage',
      customSchema: page.customSchema || '',
    },
  })

  const watchedValues = watch()

  // Update preview score as user types
  useEffect(() => {
    const analysis = calculateSEOScore({
      metaTitle: watchedValues.metaTitle,
      metaDescription: watchedValues.metaDescription,
      keywords: watchedValues.keywords.split(',').map(k => k.trim()).filter(Boolean),
      ogImage: watchedValues.ogImage,
      schemaType: watchedValues.schemaType as PageSEO['schemaType'],
    })
    setPreviewScore(analysis.score)
  }, [watchedValues.metaTitle, watchedValues.metaDescription, watchedValues.keywords, watchedValues.ogImage, watchedValues.schemaType])

  const onSubmit = async (data: FormData) => {
    const success = await onSave(page.pageSlug, {
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords.split(',').map(k => k.trim()).filter(Boolean),
      canonicalUrl: data.canonicalUrl || undefined,
      ogTitle: data.ogTitle || undefined,
      ogDescription: data.ogDescription || undefined,
      ogImage: data.ogImage || undefined,
      noIndex: data.noIndex,
      noFollow: data.noFollow,
      schemaType: data.schemaType as PageSEO['schemaType'],
      customSchema: data.customSchema || undefined,
    })

    if (success) {
      onCancel()
    }
  }

  const getIssueIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const titleLength = watchedValues.metaTitle?.length || 0
  const descLength = watchedValues.metaDescription?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Edit: {page.pageName}
              <Badge variant="outline">{page.pageSlug}</Badge>
            </CardTitle>
            <CardDescription>Update SEO settings for this page</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <SEOScoreCard score={previewScore} size="sm" showLabel={false} />
            {onGenerateWithAI && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGenerateWithAI(page)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Page Title</Label>
              <Input
                id="metaTitle"
                {...register('metaTitle')}
                placeholder="Enter page title..."
              />
              <p className={`text-xs ${titleLength > 60 ? 'text-orange-500' : titleLength < 30 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                {titleLength}/60 characters (recommended: 50-60)
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                {...register('metaDescription')}
                rows={3}
                placeholder="Enter meta description..."
              />
              <p className={`text-xs ${descLength > 160 ? 'text-orange-500' : descLength < 120 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                {descLength}/160 characters (recommended: 150-160)
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                {...register('keywords')}
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of target keywords (3-8 recommended)
              </p>
            </div>

            {/* Open Graph Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Open Graph (Social Sharing)</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ogTitle">OG Title (optional)</Label>
                  <Input
                    id="ogTitle"
                    {...register('ogTitle')}
                    placeholder="Defaults to page title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    {...register('ogImage')}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG Description (optional)</Label>
                <Textarea
                  id="ogDescription"
                  {...register('ogDescription')}
                  rows={2}
                  placeholder="Defaults to meta description"
                />
              </div>
            </div>

            {/* Advanced Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Advanced Settings</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
                  <Input
                    id="canonicalUrl"
                    {...register('canonicalUrl')}
                    placeholder="https://snapgo.in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schemaType">Schema Type</Label>
                  <Select
                    value={watchedValues.schemaType}
                    onValueChange={(value) => setValue('schemaType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WebPage">WebPage</SelectItem>
                      <SelectItem value="Organization">Organization</SelectItem>
                      <SelectItem value="Article">Article</SelectItem>
                      <SelectItem value="FAQPage">FAQ Page</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="noIndex"
                    checked={watchedValues.noIndex}
                    onCheckedChange={(checked) => setValue('noIndex', checked)}
                  />
                  <Label htmlFor="noIndex" className="text-sm">No Index</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="noFollow"
                    checked={watchedValues.noFollow}
                    onCheckedChange={(checked) => setValue('noFollow', checked)}
                  />
                  <Label htmlFor="noFollow" className="text-sm">No Follow</Label>
                </div>
              </div>
            </div>

            {/* Issues Display */}
            {page.issues.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="font-medium text-orange-800 mb-2">Issues to fix:</p>
                <ul className="space-y-1">
                  {page.issues.map((issue, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-orange-700">
                      {getIssueIcon(issue.type)}
                      <span>{issue.message}</span>
                      {issue.field && (
                        <Badge variant="outline" className="text-xs">{issue.field}</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Google Preview */}
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Eye className="w-3 h-3" /> Google Search Preview
              </p>
              <div className="space-y-1">
                <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                  {watchedValues.metaTitle || 'Page Title'}
                </p>
                <p className="text-green-700 text-sm">
                  https://snapgo.in/{page.pageSlug === 'home' ? '' : page.pageSlug}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {watchedValues.metaDescription || 'Meta description will appear here...'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving || !isDirty}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
