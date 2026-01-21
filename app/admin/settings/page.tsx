'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'
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
  RefreshCw,
  Palette,
  Sun,
  Moon,
  RotateCcw,
  Server,
  BarChart3,
  Megaphone,
  Shield,
  Zap,
  Link2,
  ExternalLink,
  Eye,
  Target,
  FileText,
  Settings2,
  Info,
} from 'lucide-react'
import Link from 'next/link'

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
    supportEmail: string
    businessEmail: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
    youtube: string
  }
  founders: string[]
  theme: {
    primaryColor: string
    accentColor: string
    backgroundColor: string
    cardColor: string
    mode: 'light' | 'dark' | 'system'
  }
  hosting: {
    provider: 'hostinger' | 'godaddy' | 'vercel' | 'netlify' | 'cloudflare' | 'other'
    primaryDomain: string
    customDomains: string[]
    sslEnabled: boolean
    cdnEnabled: boolean
    hostingNotes: string
  }
  analytics: {
    gaEnabled: boolean
    gaMeasurementId: string
    gaPropertyId: string
    hotjarEnabled: boolean
    hotjarId: string
    clarityEnabled: boolean
    clarityId: string
  }
  businessSuite: {
    facebookPixelId: string
    googleTagManagerId: string
    metaBusinessId: string
    googleAdsId: string
    linkedinInsightTag: string
  }
}

const defaultSettings: SiteSettings = {
  site: {
    name: 'Snapgo',
    legalName: 'Snapgo Service Private Limited',
    tagline: 'Pool Cabs, Save Money, Go Green',
    description: "India's #1 Cab Pooling Platform. Pool a commercial cab with verified co-riders - 100% legal, eco-friendly, and up to 75% cheaper.",
    url: 'https://snapgo.co.in',
  },
  contact: {
    email: 'info@snapgo.co.in',
    phone: '+91 6398786105',
    address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
    supportEmail: 'support@snapgo.co.in',
    businessEmail: 'business@snapgo.co.in',
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
    instagram: 'https://www.instagram.com/snapgo.co.in/',
    linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
    twitter: '',
    youtube: '',
  },
  founders: ['Mohit Purohit', 'Surya Purohit'],
  theme: {
    primaryColor: '#0ea5c2',
    accentColor: '#5DD3CB',
    backgroundColor: '#141821',
    cardColor: '#1c2230',
    mode: 'dark',
  },
  hosting: {
    provider: 'hostinger',
    primaryDomain: 'snapgo.co.in',
    customDomains: [],
    sslEnabled: true,
    cdnEnabled: false,
    hostingNotes: '',
  },
  analytics: {
    gaEnabled: true,
    gaMeasurementId: 'G-9BDGDNYM7Q',
    gaPropertyId: '',
    hotjarEnabled: false,
    hotjarId: '',
    clarityEnabled: false,
    clarityId: '',
  },
  businessSuite: {
    facebookPixelId: '',
    googleTagManagerId: '',
    metaBusinessId: '',
    googleAdsId: '',
    linkedinInsightTag: '',
  },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('site')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // Merge with defaults to ensure all fields exist
        const data = docSnap.data() as Partial<SiteSettings>
        setSettings({
          site: { ...defaultSettings.site, ...data.site },
          contact: { ...defaultSettings.contact, ...data.contact },
          social: { ...defaultSettings.social, ...data.social },
          founders: data.founders || defaultSettings.founders,
          theme: { ...defaultSettings.theme, ...data.theme },
          hosting: { ...defaultSettings.hosting, ...data.hosting },
          analytics: { ...defaultSettings.analytics, ...data.analytics },
          businessSuite: { ...defaultSettings.businessSuite, ...data.businessSuite },
        })
      } else {
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings from Firestore' })
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config')
      await setDoc(docRef, settings)
      setMessage({ type: 'success', text: 'Settings saved to Firestore!' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings to Firestore' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('This will reset all settings to default values. Are you sure?')) return

    setResetting(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config')
      await setDoc(docRef, defaultSettings)
      setSettings(defaultSettings)
      setMessage({ type: 'success', text: 'Settings reset to defaults!' })
    } catch (error) {
      console.error('Error resetting settings:', error)
      setMessage({ type: 'error', text: 'Failed to reset settings' })
    } finally {
      setResetting(false)
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
          <p className="text-muted-foreground">Manage site configuration, analytics, and integrations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} disabled={resetting} variant="outline">
            {resetting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </>
            )}
          </Button>
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
      </div>

      {/* Info Banner about Dedicated Pages */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-600">Content Management</h4>
            <p className="text-sm text-muted-foreground mt-1">
              For editing website content (Hero, Stats, Features, How It Works, About, etc.), use the dedicated pages under{' '}
              <Link href="/admin/content" className="text-teal hover:underline font-medium">
                Content Manager
              </Link>
              . This Settings page is for site-wide configuration only.
            </p>
          </div>
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
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" /> Theme
          </TabsTrigger>
          <TabsTrigger value="hosting" className="flex items-center gap-2">
            <Server className="w-4 h-4" /> Hosting
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" /> Business Suite
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Primary Email
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
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.contact.supportEmail || ''}
                    onChange={(e) => updateNestedSetting('contact', 'supportEmail', e.target.value)}
                    placeholder="support@snapgo.co.in"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.contact.businessEmail || ''}
                    onChange={(e) => updateNestedSetting('contact', 'businessEmail', e.target.value)}
                    placeholder="business@snapgo.co.in"
                  />
                </div>
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
              <div className="grid gap-4 md:grid-cols-2">
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
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={settings.social.twitter || ''}
                    onChange={(e) => updateNestedSetting('social', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    type="url"
                    value={settings.social.youtube || ''}
                    onChange={(e) => updateNestedSetting('social', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/..."
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

        {/* Hosting Tab */}
        <TabsContent value="hosting">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-teal" />
                Domain & Hosting Configuration
              </CardTitle>
              <CardDescription>Manage your domain settings and hosting provider information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hosting Provider */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Hosting Provider</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(['hostinger', 'godaddy', 'vercel', 'netlify', 'cloudflare', 'other'] as const).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => updateNestedSetting('hosting', 'provider', provider)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                        settings.hosting?.provider === provider
                          ? 'border-teal bg-teal/10 text-teal'
                          : 'border-border hover:border-teal/50'
                      }`}
                    >
                      <Server className="w-4 h-4" />
                      {provider}
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain Settings */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryDomain">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Primary Domain
                  </Label>
                  <Input
                    id="primaryDomain"
                    value={settings.hosting?.primaryDomain || ''}
                    onChange={(e) => updateNestedSetting('hosting', 'primaryDomain', e.target.value)}
                    placeholder="snapgo.co.in"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    <Link2 className="w-4 h-4 inline mr-2" />
                    Custom Domains (comma separated)
                  </Label>
                  <Input
                    value={(settings.hosting?.customDomains || []).join(', ')}
                    onChange={(e) => updateNestedSetting('hosting', 'customDomains', e.target.value.split(',').map(d => d.trim()).filter(Boolean))}
                    placeholder="www.snapgo.co.in, app.snapgo.co.in"
                  />
                </div>
              </div>

              {/* SSL & CDN */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">SSL Certificate</h4>
                      <p className="text-sm text-muted-foreground">HTTPS encryption enabled</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.hosting?.sslEnabled || false}
                    onCheckedChange={(checked) => updateNestedSetting('hosting', 'sslEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">CDN Enabled</h4>
                      <p className="text-sm text-muted-foreground">Content delivery network</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.hosting?.cdnEnabled || false}
                    onCheckedChange={(checked) => updateNestedSetting('hosting', 'cdnEnabled', checked)}
                  />
                </div>
              </div>

              {/* Hosting Notes */}
              <div className="space-y-2">
                <Label htmlFor="hostingNotes">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Hosting Notes (Admin Reference)
                </Label>
                <Textarea
                  id="hostingNotes"
                  value={settings.hosting?.hostingNotes || ''}
                  onChange={(e) => updateNestedSetting('hosting', 'hostingNotes', e.target.value)}
                  placeholder="DNS settings, nameserver info, renewal dates, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal" />
                Analytics Configuration
              </CardTitle>
              <CardDescription>Configure analytics and tracking services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Analytics */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Google Analytics 4</h4>
                      <p className="text-sm text-muted-foreground">Track website traffic and user behavior</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.analytics?.gaEnabled || false}
                    onCheckedChange={(checked) => updateNestedSetting('analytics', 'gaEnabled', checked)}
                  />
                </div>
                {settings.analytics?.gaEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 pt-2">
                    <div className="space-y-2">
                      <Label>Measurement ID</Label>
                      <Input
                        value={settings.analytics?.gaMeasurementId || ''}
                        onChange={(e) => updateNestedSetting('analytics', 'gaMeasurementId', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                      />
                      <p className="text-xs text-muted-foreground">Format: G-XXXXXXXXXX</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Property ID (Optional)</Label>
                      <Input
                        value={settings.analytics?.gaPropertyId || ''}
                        onChange={(e) => updateNestedSetting('analytics', 'gaPropertyId', e.target.value)}
                        placeholder="123456789"
                      />
                      <p className="text-xs text-muted-foreground">For server-side API access</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Microsoft Clarity */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Microsoft Clarity</h4>
                      <p className="text-sm text-muted-foreground">Session recordings and heatmaps</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.analytics?.clarityEnabled || false}
                    onCheckedChange={(checked) => updateNestedSetting('analytics', 'clarityEnabled', checked)}
                  />
                </div>
                {settings.analytics?.clarityEnabled && (
                  <div className="pt-2">
                    <div className="space-y-2">
                      <Label>Clarity Project ID</Label>
                      <Input
                        value={settings.analytics?.clarityId || ''}
                        onChange={(e) => updateNestedSetting('analytics', 'clarityId', e.target.value)}
                        placeholder="abcdefghij"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Hotjar */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Hotjar</h4>
                      <p className="text-sm text-muted-foreground">User behavior analytics and feedback</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.analytics?.hotjarEnabled || false}
                    onCheckedChange={(checked) => updateNestedSetting('analytics', 'hotjarEnabled', checked)}
                  />
                </div>
                {settings.analytics?.hotjarEnabled && (
                  <div className="pt-2">
                    <div className="space-y-2">
                      <Label>Hotjar Site ID</Label>
                      <Input
                        value={settings.analytics?.hotjarId || ''}
                        onChange={(e) => updateNestedSetting('analytics', 'hotjarId', e.target.value)}
                        placeholder="1234567"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Suite Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-teal" />
                Business Suite & Marketing
              </CardTitle>
              <CardDescription>Configure marketing pixels and business integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Tag Manager */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Google Tag Manager</h4>
                    <p className="text-sm text-muted-foreground">Centralized tag management</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GTM Container ID</Label>
                  <Input
                    value={settings.businessSuite?.googleTagManagerId || ''}
                    onChange={(e) => updateNestedSetting('businessSuite', 'googleTagManagerId', e.target.value)}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>

              {/* Meta/Facebook Pixel */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Meta (Facebook) Pixel</h4>
                    <p className="text-sm text-muted-foreground">Track conversions and build audiences</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pixel ID</Label>
                    <Input
                      value={settings.businessSuite?.facebookPixelId || ''}
                      onChange={(e) => updateNestedSetting('businessSuite', 'facebookPixelId', e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Business ID (Optional)</Label>
                    <Input
                      value={settings.businessSuite?.metaBusinessId || ''}
                      onChange={(e) => updateNestedSetting('businessSuite', 'metaBusinessId', e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                </div>
              </div>

              {/* Google Ads */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Google Ads</h4>
                    <p className="text-sm text-muted-foreground">Conversion tracking and remarketing</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Conversion ID</Label>
                  <Input
                    value={settings.businessSuite?.googleAdsId || ''}
                    onChange={(e) => updateNestedSetting('businessSuite', 'googleAdsId', e.target.value)}
                    placeholder="AW-XXXXXXXXX"
                  />
                </div>
              </div>

              {/* LinkedIn Insight Tag */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-700/20 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold">LinkedIn Insight Tag</h4>
                    <p className="text-sm text-muted-foreground">B2B conversion tracking</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Partner ID</Label>
                  <Input
                    value={settings.businessSuite?.linkedinInsightTag || ''}
                    onChange={(e) => updateNestedSetting('businessSuite', 'linkedinInsightTag', e.target.value)}
                    placeholder="1234567"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-teal/10 border border-teal/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-teal mt-0.5" />
                  <div>
                    <h4 className="font-medium text-teal">Integration Note</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      These tracking codes will be automatically added to your website when configured.
                      For Google Tag Manager, you can manage all other tags from within GTM instead of adding them individually here.
                    </p>
                  </div>
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
