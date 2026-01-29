'use client'

import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Loader2, Globe, FileText, ExternalLink } from 'lucide-react'
import { GlobalSEO } from '@/lib/types/seo'

interface GlobalSEOSettingsProps {
  globalSEO: GlobalSEO
  onSave: (data: Partial<GlobalSEO>) => Promise<boolean>
  isSaving: boolean
}

type FormData = {
  siteName: string
  siteTagline: string
  defaultDescription: string
  defaultKeywords: string
  googleVerification: string
  bingVerification: string
  twitterHandle: string
  facebookAppId: string
  defaultOgImage: string
  googleAnalyticsId: string
  googleTagManagerId: string
  robotsTxt: string
}

export function GlobalSEOSettings({ globalSEO, onSave, isSaving }: GlobalSEOSettingsProps) {
  const { register, handleSubmit, formState: { isDirty } } = useForm<FormData>({
    defaultValues: {
      siteName: globalSEO.siteName,
      siteTagline: globalSEO.siteTagline,
      defaultDescription: globalSEO.defaultDescription,
      defaultKeywords: globalSEO.defaultKeywords.join(', '),
      googleVerification: globalSEO.googleVerification || '',
      bingVerification: globalSEO.bingVerification || '',
      twitterHandle: globalSEO.twitterHandle || '',
      facebookAppId: globalSEO.facebookAppId || '',
      defaultOgImage: globalSEO.defaultOgImage || '',
      googleAnalyticsId: globalSEO.googleAnalyticsId || '',
      googleTagManagerId: globalSEO.googleTagManagerId || '',
      robotsTxt: globalSEO.robotsTxt,
    },
  })

  const onSubmit = async (data: FormData) => {
    await onSave({
      siteName: data.siteName,
      siteTagline: data.siteTagline,
      defaultDescription: data.defaultDescription,
      defaultKeywords: data.defaultKeywords.split(',').map(k => k.trim()).filter(Boolean),
      googleVerification: data.googleVerification || undefined,
      bingVerification: data.bingVerification || undefined,
      twitterHandle: data.twitterHandle || undefined,
      facebookAppId: data.facebookAppId || undefined,
      defaultOgImage: data.defaultOgImage || undefined,
      googleAnalyticsId: data.googleAnalyticsId || undefined,
      googleTagManagerId: data.googleTagManagerId || undefined,
      robotsTxt: data.robotsTxt,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Global SEO Settings
          </CardTitle>
          <CardDescription>Site-wide SEO configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" {...register('siteName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteTagline">Site Tagline</Label>
                <Input id="siteTagline" {...register('siteTagline')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDescription">Default Meta Description</Label>
              <Textarea id="defaultDescription" {...register('defaultDescription')} rows={3} />
              <p className="text-xs text-muted-foreground">
                Used when pages don't have their own description
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultKeywords">Default Keywords</Label>
              <Input id="defaultKeywords" {...register('defaultKeywords')} />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of default keywords
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultOgImage">Default OG Image URL</Label>
              <Input id="defaultOgImage" {...register('defaultOgImage')} placeholder="https://..." />
            </div>

            {/* Social & Verification */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Social & Verification</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitterHandle">Twitter Handle</Label>
                  <Input id="twitterHandle" {...register('twitterHandle')} placeholder="@username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookAppId">Facebook App ID</Label>
                  <Input id="facebookAppId" {...register('facebookAppId')} placeholder="1234567890" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleVerification">Google Verification</Label>
                  <Input id="googleVerification" {...register('googleVerification')} placeholder="Verification code" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bingVerification">Bing Verification</Label>
                  <Input id="bingVerification" {...register('bingVerification')} placeholder="Verification code" />
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Analytics</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input id="googleAnalyticsId" {...register('googleAnalyticsId')} placeholder="G-XXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                  <Input id="googleTagManagerId" {...register('googleTagManagerId')} placeholder="GTM-XXXXXX" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Global Settings
            </Button>
          </form>
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

          <div className="space-y-2">
            <Label htmlFor="robotsTxt">Robots.txt Content</Label>
            <Textarea
              id="robotsTxt"
              {...register('robotsTxt')}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
