'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUpload } from '@/components/ui/FileUpload'
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ImageIcon,
  QrCode,
  Smartphone,
  Globe,
  Sparkles,
  BadgeCheck,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'
import { DEFAULT_IMAGES } from '@/lib/types/images'
import type { SiteImagesConfig } from '@/lib/types/images'

export default function ImagesConfigPage() {
  const [images, setImages] = useState<SiteImagesConfig>(DEFAULT_IMAGES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('logos')

  useEffect(() => {
    fetchImagesConfig()
  }, [])

  const fetchImagesConfig = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'images', 'config')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<SiteImagesConfig>
        // Deep merge with defaults
        setImages({
          logos: { ...DEFAULT_IMAGES.logos, ...data.logos },
          qrCodes: { ...DEFAULT_IMAGES.qrCodes, ...data.qrCodes },
          mockups: { ...DEFAULT_IMAGES.mockups, ...data.mockups },
          appStoreBadges: { ...DEFAULT_IMAGES.appStoreBadges, ...data.appStoreBadges },
          seo: { ...DEFAULT_IMAGES.seo, ...data.seo },
          hero: { ...DEFAULT_IMAGES.hero, ...data.hero },
        })
      } else {
        setImages(DEFAULT_IMAGES)
      }
    } catch (error) {
      console.error('Error fetching images config:', error)
      setMessage({ type: 'error', text: 'Failed to load images configuration' })
      setImages(DEFAULT_IMAGES)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'images', 'config')
      await setDoc(docRef, images)
      setMessage({ type: 'success', text: 'Images configuration saved!' })
    } catch (error) {
      console.error('Error saving images config:', error)
      setMessage({ type: 'error', text: 'Failed to save images configuration' })
    } finally {
      setSaving(false)
    }
  }

  const updateNestedValue = (category: keyof SiteImagesConfig, key: string, value: string) => {
    setImages(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, string>),
        [key]: value,
      },
    }))
  }

  const handleUploadComplete = (category: keyof SiteImagesConfig, key: string) => (url: string) => {
    updateNestedValue(category, key, url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Images & Assets</h1>
            <p className="text-muted-foreground">Manage all website images from one place</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchImagesConfig}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/" target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} variant="gradient">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-600'
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-muted/50">
          <TabsTrigger value="logos" className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4" /> Logos
          </TabsTrigger>
          <TabsTrigger value="qrCodes" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" /> QR Codes
          </TabsTrigger>
          <TabsTrigger value="mockups" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> App Mockups
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Store Badges
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="w-4 h-4" /> SEO Images
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Hero Section
          </TabsTrigger>
        </TabsList>

        {/* Logos Tab */}
        <TabsContent value="logos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-teal" />
                Logo Images
              </CardTitle>
              <CardDescription>
                Upload or specify URLs for your brand logos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* White Logo */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">White Logo</Label>
                    <span className="text-xs text-muted-foreground">For dark backgrounds</span>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center h-24">
                    {images.logos.white && (
                      <Image
                        src={images.logos.white}
                        alt="White Logo"
                        width={120}
                        height={60}
                        className="object-contain max-h-16"
                      />
                    )}
                  </div>
                  <Input
                    value={images.logos.white}
                    onChange={(e) => updateNestedValue('logos', 'white', e.target.value)}
                    placeholder="/images/logo/logo-white.png"
                  />
                  <FileUpload
                    category="logo"
                    label=""
                    description="Upload white logo"
                    currentImage={images.logos.white}
                    onUploadComplete={handleUploadComplete('logos', 'white')}
                  />
                </div>

                {/* Blue Logo */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Blue Logo</Label>
                    <span className="text-xs text-muted-foreground">For light backgrounds</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 border">
                    {images.logos.blue && (
                      <Image
                        src={images.logos.blue}
                        alt="Blue Logo"
                        width={120}
                        height={60}
                        className="object-contain max-h-16"
                      />
                    )}
                  </div>
                  <Input
                    value={images.logos.blue}
                    onChange={(e) => updateNestedValue('logos', 'blue', e.target.value)}
                    placeholder="/images/logo/logo-blue.png"
                  />
                  <FileUpload
                    category="logo"
                    label=""
                    description="Upload blue logo"
                    currentImage={images.logos.blue}
                    onUploadComplete={handleUploadComplete('logos', 'blue')}
                  />
                </div>
              </div>

              {/* Favicon */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Favicon</Label>
                  <span className="text-xs text-muted-foreground">Browser tab icon</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                    {images.logos.favicon && (
                      <Image
                        src={images.logos.favicon}
                        alt="Favicon"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      value={images.logos.favicon}
                      onChange={(e) => updateNestedValue('logos', 'favicon', e.target.value)}
                      placeholder="/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Codes Tab */}
        <TabsContent value="qrCodes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-teal" />
                QR Codes
              </CardTitle>
              <CardDescription>
                QR codes for app store downloads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Android QR */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#3DDC84]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#3DDC84]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.6 11.4c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m-11.2 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5M18.1 7l1.8-3.2c.1-.2 0-.4-.2-.5s-.4 0-.5.2l-1.8 3.3C15.7 5.7 13.9 5 12 5s-3.7.7-5.4 1.8L4.8 3.5c-.1-.2-.3-.3-.5-.2s-.3.3-.2.5L5.9 7C3.1 8.8 1.3 11.5 1 14.5h22c-.3-3-2.1-5.7-4.9-7.5"/>
                      </svg>
                    </div>
                    <Label className="text-base font-semibold">Android (Play Store)</Label>
                  </div>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-40 border">
                    {images.qrCodes.android && (
                      <Image
                        src={images.qrCodes.android}
                        alt="Android QR Code"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <Input
                    value={images.qrCodes.android}
                    onChange={(e) => updateNestedValue('qrCodes', 'android', e.target.value)}
                    placeholder="/images/qr code/playstore-qr.png"
                  />
                  <FileUpload
                    category="general"
                    label=""
                    description="Upload Play Store QR code"
                    currentImage={images.qrCodes.android}
                    onUploadComplete={handleUploadComplete('qrCodes', 'android')}
                  />
                </div>

                {/* iOS QR */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <Label className="text-base font-semibold">iOS (App Store)</Label>
                  </div>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-40 border">
                    {images.qrCodes.ios && (
                      <Image
                        src={images.qrCodes.ios}
                        alt="iOS QR Code"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <Input
                    value={images.qrCodes.ios}
                    onChange={(e) => updateNestedValue('qrCodes', 'ios', e.target.value)}
                    placeholder="/images/qr code/appstore-qr.png"
                  />
                  <FileUpload
                    category="general"
                    label=""
                    description="Upload App Store QR code"
                    currentImage={images.qrCodes.ios}
                    onUploadComplete={handleUploadComplete('qrCodes', 'ios')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* App Mockups Tab */}
        <TabsContent value="mockups">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal" />
                App Mockups
              </CardTitle>
              <CardDescription>
                iPhone app screenshots used throughout the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(images.mockups).map(([key, value]) => (
                  <div key={key} className="space-y-3 p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-2 flex items-center justify-center h-48 overflow-hidden">
                      {value && (
                        <Image
                          src={value}
                          alt={key}
                          width={100}
                          height={200}
                          className="object-contain max-h-44"
                        />
                      )}
                    </div>
                    <Input
                      value={value}
                      onChange={(e) => updateNestedValue('mockups', key, e.target.value)}
                      placeholder={`/images/app mockups/${key}.png`}
                      className="text-xs"
                    />
                    <FileUpload
                      category="general"
                      label=""
                      description="Upload mockup"
                      currentImage={value}
                      onUploadComplete={handleUploadComplete('mockups', key)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Badges Tab */}
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-teal" />
                App Store Badges
              </CardTitle>
              <CardDescription>
                Download badges for Apple App Store and Google Play Store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Apple Badge */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <Label className="text-base font-semibold">Apple App Store Badge</Label>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 border">
                    {images.appStoreBadges.apple && (
                      <Image
                        src={images.appStoreBadges.apple}
                        alt="Apple App Store Badge"
                        width={160}
                        height={48}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <Input
                    value={images.appStoreBadges.apple}
                    onChange={(e) => updateNestedValue('appStoreBadges', 'apple', e.target.value)}
                    placeholder="/images/badges/apple-store-badge.svg"
                  />
                  <FileUpload
                    category="general"
                    label=""
                    description="Upload Apple badge"
                    currentImage={images.appStoreBadges.apple}
                    onUploadComplete={handleUploadComplete('appStoreBadges', 'apple')}
                  />
                </div>

                {/* Google Badge */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <Label className="text-base font-semibold">Google Play Store Badge</Label>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 border">
                    {images.appStoreBadges.google && (
                      <Image
                        src={images.appStoreBadges.google}
                        alt="Google Play Store Badge"
                        width={160}
                        height={48}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <Input
                    value={images.appStoreBadges.google}
                    onChange={(e) => updateNestedValue('appStoreBadges', 'google', e.target.value)}
                    placeholder="/images/badges/google-play-badge.svg"
                  />
                  <FileUpload
                    category="general"
                    label=""
                    description="Upload Google badge"
                    currentImage={images.appStoreBadges.google}
                    onUploadComplete={handleUploadComplete('appStoreBadges', 'google')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Images Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal" />
                SEO Images
              </CardTitle>
              <CardDescription>
                Images used for social media sharing and search results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Open Graph Image</Label>
                  <span className="text-xs text-muted-foreground">1200x630px recommended</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This image appears when your website is shared on Facebook, Twitter, LinkedIn, etc.
                </p>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center border aspect-[1200/630]">
                  {images.seo.ogImage && (
                    <Image
                      src={images.seo.ogImage}
                      alt="Open Graph Image"
                      width={600}
                      height={315}
                      className="object-contain max-w-full max-h-full rounded"
                    />
                  )}
                </div>
                <Input
                  value={images.seo.ogImage}
                  onChange={(e) => updateNestedValue('seo', 'ogImage', e.target.value)}
                  placeholder="/images/og-image.png"
                />
                <FileUpload
                  category="general"
                  label=""
                  description="Upload OG image (1200x630px recommended)"
                  currentImage={images.seo.ogImage}
                  onUploadComplete={handleUploadComplete('seo', 'ogImage')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Section Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal" />
                Hero Section Images
              </CardTitle>
              <CardDescription>
                Main images displayed in the homepage hero section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* App Mockup */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <Label className="text-base font-semibold">Hero App Mockup</Label>
                  <p className="text-sm text-muted-foreground">
                    The main phone mockup displayed in the hero section
                  </p>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 flex items-center justify-center h-64 overflow-hidden">
                    {images.hero.appMockup && (
                      <Image
                        src={images.hero.appMockup}
                        alt="Hero App Mockup"
                        width={150}
                        height={300}
                        className="object-contain max-h-56"
                      />
                    )}
                  </div>
                  <Input
                    value={images.hero.appMockup}
                    onChange={(e) => updateNestedValue('hero', 'appMockup', e.target.value)}
                    placeholder="/images/app mockups/1 - home screen.png"
                  />
                  <FileUpload
                    category="general"
                    label=""
                    description="Upload hero mockup"
                    currentImage={images.hero.appMockup}
                    onUploadComplete={handleUploadComplete('hero', 'appMockup')}
                  />
                </div>

                {/* Background Image */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <Label className="text-base font-semibold">Hero Background (Optional)</Label>
                  <p className="text-sm text-muted-foreground">
                    Optional background image for the hero section
                  </p>
                  <div className="bg-gradient-to-br from-primary/20 to-teal/20 rounded-lg p-4 flex items-center justify-center h-64 overflow-hidden border-2 border-dashed border-primary/30">
                    {images.hero.background ? (
                      <Image
                        src={images.hero.background}
                        alt="Hero Background"
                        width={300}
                        height={200}
                        className="object-cover max-w-full max-h-full rounded"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No background set</span>
                    )}
                  </div>
                  <Input
                    value={images.hero.background || ''}
                    onChange={(e) => updateNestedValue('hero', 'background', e.target.value)}
                    placeholder="/images/hero-background.jpg (optional)"
                  />
                  <FileUpload
                    category="general"
                    label=""
                    description="Upload hero background"
                    currentImage={images.hero.background || undefined}
                    onUploadComplete={handleUploadComplete('hero', 'background')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Save Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="gradient"
          size="lg"
          className="rounded-full w-14 h-14 p-0 shadow-2xl"
        >
          {saving ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Save className="w-6 h-6" />
          )}
        </Button>
      </div>
    </div>
  )
}
