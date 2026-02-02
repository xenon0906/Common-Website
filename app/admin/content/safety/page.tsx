'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  Shield,
  AlertTriangle,
  Award,
  Megaphone,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'

interface SafetyFeature {
  id: string
  title: string
  description: string
  points: string[]
  icon: string
  order: number
  isActive: boolean
}

interface SafetyContent {
  hero: {
    headline: string
    subtext: string
    points: string[]
    stats: Array<{ value: string; label: string }>
  }
  features: SafetyFeature[]
  sos: {
    headline: string
    subtext: string
    steps: string[]
    shares: Array<{ icon: string; label: string }>
  }
  trust: {
    headline: string
    subtext: string
    certifications: Array<{ title: string; description: string }>
  }
  cta: {
    quote: string
    badge: string
    buttonText: string
    buttonLink: string
  }
}

const DEFAULT_SAFETY: SafetyContent = {
  hero: {
    headline: 'Your Safety is Our Priority',
    subtext: 'Every feature is designed with your security in mind. From verified riders to instant emergency support.',
    points: [
      '100% KYC verification for all users',
      'One-tap SOS with instant location sharing',
      'Dedicated female-only ride option',
    ],
    stats: [
      { value: '100%', label: 'KYC Verified' },
      { value: '<30s', label: 'SOS Response' },
      { value: '24/7', label: 'Support' },
    ],
  },
  features: [
    { id: '1', title: 'Aadhaar KYC Verification', description: 'Every user must complete Aadhaar-based KYC verification.', points: ['Real Identities', 'Gender Verification', 'Government Backed', 'KYC Badge'], icon: 'ShieldCheck', order: 1, isActive: true },
    { id: '2', title: 'Female Safety Features', description: 'Special features designed for women travelers.', points: ['Female-Only Filter', 'No Gender Manipulation', 'Verified Profiles'], icon: 'UserCheck', order: 2, isActive: true },
    { id: '3', title: 'Emergency SOS Feature', description: 'One tap to alert emergency contacts.', points: ['Emergency contacts', 'One-tap SOS', 'Instant notification', 'Live location'], icon: 'AlertTriangle', order: 3, isActive: true },
  ],
  sos: {
    headline: 'Emergency SOS Feature',
    subtext: 'Your safety net in emergencies.',
    steps: ['Add emergency contacts', 'One-tap SOS', 'Instant notification', 'Live location shared'],
    shares: [
      { icon: 'MapPin', label: 'Your live GPS location' },
      { icon: 'Users', label: 'Trip details & co-riders' },
      { icon: 'Clock', label: 'Timestamp of alert' },
    ],
  },
  trust: {
    headline: 'Trusted & Certified',
    subtext: 'Snapgo meets the highest standards of safety and security.',
    certifications: [
      { title: 'DPIIT Recognized', description: 'Government certified startup' },
      { title: 'Startup India', description: 'Official initiative member' },
      { title: 'Data Protected', description: 'Industry-standard encryption' },
    ],
  },
  cta: {
    quote: 'From day one, safety has been our top priority.',
    badge: '100% KYC Verified Platform',
    buttonText: 'Download Snapgo',
    buttonLink: '/#download',
  },
}

export default function SafetyContentPage() {
  const [safety, setSafety] = useState<SafetyContent>(DEFAULT_SAFETY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('hero')

  useEffect(() => {
    fetchSafetyContent()
  }, [])

  const fetchSafetyContent = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'safety')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<SafetyContent>
        setSafety({
          hero: { ...DEFAULT_SAFETY.hero, ...data.hero },
          features: data.features || DEFAULT_SAFETY.features,
          sos: { ...DEFAULT_SAFETY.sos, ...data.sos },
          trust: { ...DEFAULT_SAFETY.trust, ...data.trust },
          cta: { ...DEFAULT_SAFETY.cta, ...data.cta },
        })
      } else {
        setSafety(DEFAULT_SAFETY)
      }
    } catch (error) {
      console.error('Error fetching safety content:', error)
      setMessage({ type: 'error', text: 'Failed to load safety content' })
      setSafety(DEFAULT_SAFETY)
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
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'safety')
      await setDoc(docRef, safety)
      setMessage({ type: 'success', text: 'Safety page content saved!' })
    } catch (error) {
      console.error('Error saving safety content:', error)
      setMessage({ type: 'error', text: 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: string, value: any) => {
    setSafety({ ...safety, hero: { ...safety.hero, [field]: value } })
  }

  const updateSos = (field: string, value: any) => {
    setSafety({ ...safety, sos: { ...safety.sos, [field]: value } })
  }

  const updateTrust = (field: string, value: any) => {
    setSafety({ ...safety, trust: { ...safety.trust, [field]: value } })
  }

  const updateCta = (field: string, value: any) => {
    setSafety({ ...safety, cta: { ...safety.cta, [field]: value } })
  }

  const updateFeature = (index: number, field: string, value: any) => {
    const features = [...safety.features]
    features[index] = { ...features[index], [field]: value }
    setSafety({ ...safety, features })
  }

  const addFeature = () => {
    setSafety({
      ...safety,
      features: [
        ...safety.features,
        {
          id: `feature-${Date.now()}`,
          title: 'New Safety Feature',
          description: '',
          points: [],
          icon: 'Shield',
          order: safety.features.length + 1,
          isActive: true,
        },
      ],
    })
  }

  const removeFeature = (index: number) => {
    if (!confirm('Remove this feature?')) return
    setSafety({
      ...safety,
      features: safety.features.filter((_, i) => i !== index),
    })
  }

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= safety.features.length) return
    const features = [...safety.features]
    const [moved] = features.splice(index, 1)
    features.splice(newIndex, 0, moved)
    setSafety({ ...safety, features })
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Safety Page</h1>
            <p className="text-muted-foreground">Edit all safety page sections and features</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSafetyContent}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/safety" target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} variant="gradient">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero" className="flex items-center gap-1">
            <Shield className="w-4 h-4" /> Hero
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1">
            <Shield className="w-4 h-4" /> Features
          </TabsTrigger>
          <TabsTrigger value="sos" className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> SOS
          </TabsTrigger>
          <TabsTrigger value="trust" className="flex items-center gap-1">
            <Award className="w-4 h-4" /> Trust
          </TabsTrigger>
          <TabsTrigger value="cta" className="flex items-center gap-1">
            <Megaphone className="w-4 h-4" /> CTA
          </TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Safety Hero Section</CardTitle>
              <CardDescription>The main banner at the top of the safety page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input
                  value={safety.hero.headline}
                  onChange={(e) => updateHero('headline', e.target.value)}
                  placeholder="Your Safety is Our Priority"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtext</Label>
                <Textarea
                  value={safety.hero.subtext}
                  onChange={(e) => updateHero('subtext', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Key Points (one per line)</Label>
                <Textarea
                  value={safety.hero.points.join('\n')}
                  onChange={(e) => updateHero('points', e.target.value.split('\n').filter(Boolean))}
                  rows={4}
                  placeholder="100% KYC verification for all users&#10;One-tap SOS with instant location sharing"
                />
              </div>
              <div className="space-y-4">
                <Label>Hero Stats</Label>
                {safety.hero.stats.map((stat, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Value</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const stats = [...safety.hero.stats]
                          stats[i] = { ...stats[i], value: e.target.value }
                          updateHero('stats', stats)
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const stats = [...safety.hero.stats]
                          stats[i] = { ...stats[i], label: e.target.value }
                          updateHero('stats', stats)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Safety Features</h3>
              <Button onClick={addFeature} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>

            {safety.features.map((feature, index) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      {!feature.isActive && <Badge variant="secondary">Disabled</Badge>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFeature(index, 'up')} disabled={index === 0}>
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFeature(index, 'down')} disabled={index === safety.features.length - 1}>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => removeFeature(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon Name (Lucide)</Label>
                      <Input value={feature.icon} onChange={(e) => updateFeature(index, 'icon', e.target.value)} placeholder="ShieldCheck" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bullet Points (one per line)</Label>
                    <Textarea
                      value={feature.points.join('\n')}
                      onChange={(e) => updateFeature(index, 'points', e.target.value.split('\n').filter(Boolean))}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <Switch
                      checked={feature.isActive}
                      onCheckedChange={(checked) => updateFeature(index, 'isActive', checked)}
                    />
                    <Label>Feature Active</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SOS Tab */}
        <TabsContent value="sos">
          <Card>
            <CardHeader>
              <CardTitle>Emergency SOS Section</CardTitle>
              <CardDescription>The dark-themed SOS emergency section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input value={safety.sos.headline} onChange={(e) => updateSos('headline', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subtext</Label>
                <Textarea value={safety.sos.subtext} onChange={(e) => updateSos('subtext', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>How It Works Steps (one per line)</Label>
                <Textarea
                  value={safety.sos.steps.join('\n')}
                  onChange={(e) => updateSos('steps', e.target.value.split('\n').filter(Boolean))}
                  rows={5}
                />
              </div>
              <div className="space-y-4">
                <Label>What Gets Shared</Label>
                {safety.sos.shares.map((share, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Icon (Lucide name)</Label>
                      <Input
                        value={share.icon}
                        onChange={(e) => {
                          const shares = [...safety.sos.shares]
                          shares[i] = { ...shares[i], icon: e.target.value }
                          updateSos('shares', shares)
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={share.label}
                        onChange={(e) => {
                          const shares = [...safety.sos.shares]
                          shares[i] = { ...shares[i], label: e.target.value }
                          updateSos('shares', shares)
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSos('shares', [...safety.sos.shares, { icon: 'Info', label: 'New item' }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Share Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Tab */}
        <TabsContent value="trust">
          <Card>
            <CardHeader>
              <CardTitle>Trust & Certifications</CardTitle>
              <CardDescription>Certifications and trust badges section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input value={safety.trust.headline} onChange={(e) => updateTrust('headline', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subtext</Label>
                <Textarea value={safety.trust.subtext} onChange={(e) => updateTrust('subtext', e.target.value)} rows={2} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Certifications</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTrust('certifications', [...safety.trust.certifications, { title: 'New Cert', description: '' }])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                {safety.trust.certifications.map((cert, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={cert.title}
                        onChange={(e) => {
                          const certs = [...safety.trust.certifications]
                          certs[i] = { ...certs[i], title: e.target.value }
                          updateTrust('certifications', certs)
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={cert.description}
                        onChange={(e) => {
                          const certs = [...safety.trust.certifications]
                          certs[i] = { ...certs[i], description: e.target.value }
                          updateTrust('certifications', certs)
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:text-red-500"
                      onClick={() => {
                        updateTrust('certifications', safety.trust.certifications.filter((_, idx) => idx !== i))
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Tab */}
        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>The closing CTA banner at the bottom of the safety page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Quote / Message</Label>
                <Textarea value={safety.cta.quote} onChange={(e) => updateCta('quote', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input value={safety.cta.badge} onChange={(e) => updateCta('badge', e.target.value)} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input value={safety.cta.buttonText} onChange={(e) => updateCta('buttonText', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <Input value={safety.cta.buttonLink} onChange={(e) => updateCta('buttonLink', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
