'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { FileUpload } from '@/components/ui/FileUpload'
import {
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Layout,
  Users,
  Star,
  Settings2,
  Smartphone,
  MessageSquare,
  Target,
  Eye,
  Heart,
  FileText,
  RefreshCw,
  Trash2,
  Palette,
  Sun,
  Moon,
  Image,
  Upload,
} from 'lucide-react'

interface SiteSettings {
  site: {
    name: string
    legalName: string
    tagline: string
    description: string
    url: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  founders: string[]
  hero: {
    headline: string
    subtext: string
  }
  stats: { label: string; value: number; suffix: string; prefix: string }[]
  features: { title: string; description: string; icon: string }[]
  howItWorks: { step: number; title: string; description: string; icon: string }[]
  testimonials: { quote: string; author: string; location: string }[]
  about: {
    origin: string
    spark: string
    mission: string
    vision: string
    values: string
  }
  apps: {
    androidUrl: string
    iosUrl: string
    androidLive: boolean
    iosLive: boolean
  }
  theme: {
    primaryColor: string
    accentColor: string
    backgroundColor: string
    cardColor: string
    mode: 'light' | 'dark' | 'system'
  }
  images: {
    logo: string
    logoDark: string
    heroBackground: string
    favicon: string
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('site')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        throw new Error('Failed to save settings')
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const updateNestedSetting = (category: string, key: string, value: any) => {
    if (!settings) return
    setSettings({
      ...settings,
      [category]: {
        ...(settings as any)[category],
        [key]: value,
      },
    })
  }

  const updateArrayItem = (category: string, index: number, key: string, value: any) => {
    if (!settings) return
    const array = [...(settings as any)[category]]
    array[index] = { ...array[index], [key]: value }
    setSettings({ ...settings, [category]: array })
  }

  const addArrayItem = (category: string, template: any) => {
    if (!settings) return
    const array = [...(settings as any)[category], template]
    setSettings({ ...settings, [category]: array })
  }

  const removeArrayItem = (category: string, index: number) => {
    if (!settings) return
    const array = (settings as any)[category].filter((_: any, i: number) => i !== index)
    setSettings({ ...settings, [category]: array })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Failed to load settings</p>
        <Button onClick={fetchSettings} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Manage all website content and configuration</p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="gradient" size="lg">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
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
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </motion.div>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-muted/50">
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Building className="w-4 h-4" /> Site Info
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="w-4 h-4" /> Social
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Layout className="w-4 h-4" /> Hero
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Star className="w-4 h-4" /> Stats
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Features
          </TabsTrigger>
          <TabsTrigger value="howItWorks" className="flex items-center gap-2">
            <Target className="w-4 h-4" /> Steps
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Reviews
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> About
          </TabsTrigger>
          <TabsTrigger value="apps" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Apps
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" /> Theme
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="w-4 h-4" /> Images
          </TabsTrigger>
        </TabsList>

        {/* Site Info Tab */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.site.name}
                    onChange={(e) => updateNestedSetting('site', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Name</Label>
                  <Input
                    id="legalName"
                    value={settings.site.legalName}
                    onChange={(e) => updateNestedSetting('site', 'legalName', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.site.tagline}
                  onChange={(e) => updateNestedSetting('site', 'tagline', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.site.description}
                  onChange={(e) => updateNestedSetting('site', 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={settings.site.url}
                  onChange={(e) => updateNestedSetting('site', 'url', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Founders (comma separated)</Label>
                <Input
                  value={settings.founders.join(', ')}
                  onChange={(e) => setSettings({ ...settings, founders: e.target.value.split(',').map(f => f.trim()) })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How users can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => updateNestedSetting('contact', 'email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={settings.contact.phone}
                  onChange={(e) => updateNestedSetting('contact', 'phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={settings.contact.address}
                  onChange={(e) => updateNestedSetting('contact', 'address', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">
                  <Facebook className="w-4 h-4 inline mr-2" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  type="url"
                  value={settings.social.facebook}
                  onChange={(e) => updateNestedSetting('social', 'facebook', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">
                  <Instagram className="w-4 h-4 inline mr-2" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  type="url"
                  value={settings.social.instagram}
                  onChange={(e) => updateNestedSetting('social', 'instagram', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">
                  <Linkedin className="w-4 h-4 inline mr-2" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={settings.social.linkedin}
                  onChange={(e) => updateNestedSetting('social', 'linkedin', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main headline and subtext for the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={settings.hero.headline}
                  onChange={(e) => updateNestedSetting('hero', 'headline', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtext">Subtext</Label>
                <Textarea
                  id="subtext"
                  value={settings.hero.subtext}
                  onChange={(e) => updateNestedSetting('hero', 'subtext', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Key numbers displayed on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(settings?.stats || []).map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 items-end p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateArrayItem('stats', index, 'value', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-20 space-y-2">
                    <Label>Suffix</Label>
                    <Input
                      value={stat.suffix}
                      onChange={(e) => updateArrayItem('stats', index, 'suffix', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem('stats', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('stats', { label: 'New Stat', value: 0, suffix: '+', prefix: '' })}
              >
                + Add Stat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Key features displayed on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(settings?.features || []).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{feature.icon}</Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem('features', index)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon (Lucide name)</Label>
                      <Input
                        value={feature.icon}
                        onChange={(e) => updateArrayItem('features', index, 'icon', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateArrayItem('features', index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </motion.div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('features', { title: 'New Feature', description: '', icon: 'Star' })}
              >
                + Add Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* How It Works Tab */}
        <TabsContent value="howItWorks">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Step-by-step guide for users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(settings?.howItWorks || []).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <Badge variant="default" className="bg-teal">Step {step.step}</Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem('howItWorks', index)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateArrayItem('howItWorks', index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Input
                        value={step.icon}
                        onChange={(e) => updateArrayItem('howItWorks', index, 'icon', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateArrayItem('howItWorks', index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </motion.div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('howItWorks', { step: settings.howItWorks.length + 1, title: 'New Step', description: '', icon: 'Star' })}
              >
                + Add Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>User reviews and testimonials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(settings?.testimonials || []).map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg space-y-4"
                >
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem('testimonials', index)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => updateArrayItem('testimonials', index, 'quote', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Author</Label>
                      <Input
                        value={testimonial.author}
                        onChange={(e) => updateArrayItem('testimonials', index, 'author', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={testimonial.location}
                        onChange={(e) => updateArrayItem('testimonials', index, 'location', e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('testimonials', { quote: '', author: '', location: '' })}
              >
                + Add Testimonial
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
              <CardDescription>Content for the about page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  <FileText className="w-4 h-4 inline mr-2" />
                  Origin Story
                </Label>
                <Textarea
                  value={settings.about.origin}
                  onChange={(e) => updateNestedSetting('about', 'origin', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <Star className="w-4 h-4 inline mr-2" />
                  The Spark
                </Label>
                <Textarea
                  value={settings.about.spark}
                  onChange={(e) => updateNestedSetting('about', 'spark', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <Target className="w-4 h-4 inline mr-2" />
                  Mission
                </Label>
                <Textarea
                  value={settings.about.mission}
                  onChange={(e) => updateNestedSetting('about', 'mission', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <Eye className="w-4 h-4 inline mr-2" />
                  Vision
                </Label>
                <Textarea
                  value={settings.about.vision}
                  onChange={(e) => updateNestedSetting('about', 'vision', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <Heart className="w-4 h-4 inline mr-2" />
                  Values
                </Label>
                <Textarea
                  value={settings.about.values}
                  onChange={(e) => updateNestedSetting('about', 'values', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apps Tab */}
        <TabsContent value="apps">
          <Card>
            <CardHeader>
              <CardTitle>App Store Links</CardTitle>
              <CardDescription>Configure mobile app links and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#3DDC84]/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#3DDC84]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.6 11.4c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m-11.2 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5M18.1 7l1.8-3.2c.1-.2 0-.4-.2-.5s-.4 0-.5.2l-1.8 3.3C15.7 5.7 13.9 5 12 5s-3.7.7-5.4 1.8L4.8 3.5c-.1-.2-.3-.3-.5-.2s-.3.3-.2.5L5.9 7C3.1 8.8 1.3 11.5 1 14.5h22c-.3-3-2.1-5.7-4.9-7.5"/>
                      </svg>
                    </div>
                    <span className="font-semibold">Android</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="androidLive">Live</Label>
                    <Switch
                      id="androidLive"
                      checked={settings.apps.androidLive}
                      onCheckedChange={(checked) => updateNestedSetting('apps', 'androidLive', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Google Play Store URL</Label>
                  <Input
                    type="url"
                    value={settings.apps.androidUrl}
                    onChange={(e) => updateNestedSetting('apps', 'androidUrl', e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <span className="font-semibold">iOS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="iosLive">Live</Label>
                    <Switch
                      id="iosLive"
                      checked={settings.apps.iosLive}
                      onCheckedChange={(checked) => updateNestedSetting('apps', 'iosLive', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>App Store URL</Label>
                  <Input
                    type="url"
                    value={settings.apps.iosUrl}
                    onChange={(e) => updateNestedSetting('apps', 'iosUrl', e.target.value)}
                    placeholder="https://apps.apple.com/app/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-teal" />
                Theme Customization
              </CardTitle>
              <CardDescription>Customize the look and feel of your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <Label className="text-base font-semibold">Theme Mode</Label>
                <div className="flex gap-4">
                  {(['light', 'dark', 'system'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateNestedSetting('theme', 'mode', mode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        settings.theme?.mode === mode
                          ? 'border-teal bg-teal/10 text-teal'
                          : 'border-border hover:border-teal/50'
                      }`}
                    >
                      {mode === 'light' && <Sun className="w-4 h-4" />}
                      {mode === 'dark' && <Moon className="w-4 h-4" />}
                      {mode === 'system' && <Settings2 className="w-4 h-4" />}
                      <span className="capitalize">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      value={settings.theme?.primaryColor || '#0ea5c2'}
                      onChange={(e) => updateNestedSetting('theme', 'primaryColor', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={settings.theme?.primaryColor || '#0ea5c2'}
                      onChange={(e) => updateNestedSetting('theme', 'primaryColor', e.target.value)}
                      placeholder="#0ea5c2"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color (Teal)</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="accentColor"
                      value={settings.theme?.accentColor || '#5DD3CB'}
                      onChange={(e) => updateNestedSetting('theme', 'accentColor', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={settings.theme?.accentColor || '#5DD3CB'}
                      onChange={(e) => updateNestedSetting('theme', 'accentColor', e.target.value)}
                      placeholder="#5DD3CB"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="backgroundColor"
                      value={settings.theme?.backgroundColor || '#141821'}
                      onChange={(e) => updateNestedSetting('theme', 'backgroundColor', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={settings.theme?.backgroundColor || '#141821'}
                      onChange={(e) => updateNestedSetting('theme', 'backgroundColor', e.target.value)}
                      placeholder="#141821"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardColor">Card Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="cardColor"
                      value={settings.theme?.cardColor || '#1c2230'}
                      onChange={(e) => updateNestedSetting('theme', 'cardColor', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={settings.theme?.cardColor || '#1c2230'}
                      onChange={(e) => updateNestedSetting('theme', 'cardColor', e.target.value)}
                      placeholder="#1c2230"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-base font-semibold mb-4 block">Preview</Label>
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: settings.theme?.backgroundColor || '#141821' }}
                >
                  <div
                    className="p-4 rounded-lg mb-4"
                    style={{ backgroundColor: settings.theme?.cardColor || '#1c2230' }}
                  >
                    <p className="text-white mb-2">Sample Card</p>
                    <button
                      className="px-4 py-2 rounded text-white"
                      style={{ backgroundColor: settings.theme?.primaryColor || '#0ea5c2' }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded text-white ml-2"
                      style={{ backgroundColor: settings.theme?.accentColor || '#5DD3CB' }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-teal" />
                Image Management
              </CardTitle>
              <CardDescription>Manage logos and images used across the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (Light Mode)</Label>
                  <Input
                    id="logo"
                    value={settings.images?.logo || ''}
                    onChange={(e) => updateNestedSetting('images', 'logo', e.target.value)}
                    placeholder="/images/logo.png"
                  />
                  <p className="text-xs text-muted-foreground">Path to logo for light backgrounds</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoDark">Logo (Dark Mode)</Label>
                  <Input
                    id="logoDark"
                    value={settings.images?.logoDark || ''}
                    onChange={(e) => updateNestedSetting('images', 'logoDark', e.target.value)}
                    placeholder="/images/logo-dark.png"
                  />
                  <p className="text-xs text-muted-foreground">Path to logo for dark backgrounds</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroBackground">Hero Background</Label>
                  <Input
                    id="heroBackground"
                    value={settings.images?.heroBackground || ''}
                    onChange={(e) => updateNestedSetting('images', 'heroBackground', e.target.value)}
                    placeholder="/images/hero-bg.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Background image for hero section</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <Input
                    id="favicon"
                    value={settings.images?.favicon || ''}
                    onChange={(e) => updateNestedSetting('images', 'favicon', e.target.value)}
                    placeholder="/favicon.ico"
                  />
                  <p className="text-xs text-muted-foreground">Browser tab icon</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-teal" />
                  <Label className="text-base font-semibold">Quick Image Upload</Label>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload images directly to use across your website. The uploaded URL will be copied automatically.
                </p>
                <FileUpload
                  category="logo"
                  label="Upload Logo or Image"
                  description="Drag and drop or click to upload (PNG, JPG, WebP up to 5MB)"
                  onUploadComplete={(url) => {
                    navigator.clipboard.writeText(url)
                    alert(`Image uploaded! URL copied to clipboard: ${url}`)
                  }}
                />
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
