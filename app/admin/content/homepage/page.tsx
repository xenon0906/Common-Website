'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  GripVertical,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
  BarChart3,
  Star,
  Layers,
  GitCompare,
  MessageSquare,
  Zap,
  Download,
  Instagram,
  Award,
  Megaphone,
} from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'

interface SectionConfig {
  id: string
  label: string
  visible: boolean
  order: number
}

const SECTION_ICONS: Record<string, any> = {
  hero: Sparkles,
  stats: BarChart3,
  features: Star,
  howItWorks: Layers,
  comparison: GitCompare,
  testimonials: MessageSquare,
  whySnapgo: Zap,
  download: Download,
  instagram: Instagram,
  trustBadges: Award,
  cta: Megaphone,
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: 'Main hero banner with headline, CTA buttons, and app mockup',
  stats: 'Animated statistics counter (downloads, rides, savings)',
  features: 'Feature cards grid showcasing Snapgo benefits',
  howItWorks: 'Step-by-step guide on how Snapgo works',
  comparison: 'Cab pooling vs carpooling comparison table',
  testimonials: 'User testimonials carousel with ratings',
  whySnapgo: 'Why choose Snapgo section with key benefits',
  download: 'App download section with QR codes and store links',
  instagram: 'Instagram reels feed integration',
  trustBadges: 'Trust badges and certification logos',
  cta: 'Final call-to-action section with download button',
}

const SECTION_EDIT_LINKS: Record<string, string> = {
  hero: '/admin/content/hero',
  stats: '/admin/content/stats',
  features: '/admin/content/features',
  howItWorks: '/admin/content/how-it-works',
  testimonials: '/admin/content/testimonials',
  download: '/admin/content/apps',
  instagram: '/admin/instagram',
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'hero', label: 'Hero Section', visible: true, order: 1 },
  { id: 'stats', label: 'Statistics Counter', visible: true, order: 2 },
  { id: 'features', label: 'Features Grid', visible: true, order: 3 },
  { id: 'howItWorks', label: 'How It Works', visible: true, order: 4 },
  { id: 'comparison', label: 'Cab Pooling Comparison', visible: true, order: 5 },
  { id: 'testimonials', label: 'Testimonials', visible: true, order: 6 },
  { id: 'whySnapgo', label: 'Why Snapgo', visible: true, order: 7 },
  { id: 'download', label: 'Download Section', visible: true, order: 8 },
  { id: 'instagram', label: 'Instagram Feed', visible: true, order: 9 },
  { id: 'trustBadges', label: 'Trust Badges', visible: true, order: 10 },
  { id: 'cta', label: 'Call to Action', visible: true, order: 11 },
]

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'homepage')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.sections && Array.isArray(data.sections)) {
          // Merge with defaults to add any new sections
          const saved = data.sections as SectionConfig[]
          const savedIds = new Set(saved.map(s => s.id))
          const merged = [
            ...saved,
            ...DEFAULT_SECTIONS.filter(d => !savedIds.has(d.id)),
          ]
          setSections(merged.sort((a, b) => a.order - b.order))
        }
      }
    } catch (error) {
      console.error('Error fetching homepage config:', error)
      setMessage({ type: 'error', text: 'Failed to load homepage configuration' })
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
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'homepage')
      // Re-number order based on current position
      const ordered = sections.map((s, i) => ({ ...s, order: i + 1 }))
      await setDoc(docRef, { sections: ordered })
      setSections(ordered)
      setMessage({ type: 'success', text: 'Homepage configuration saved!' })
    } catch (error) {
      console.error('Error saving homepage config:', error)
      setMessage({ type: 'error', text: 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (!confirm('Reset to default section order and visibility?')) return
    setSections(DEFAULT_SECTIONS)
  }

  const toggleVisibility = (index: number) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], visible: !updated[index].visible }
    setSections(updated)
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    const updated = [...sections]
    const [moved] = updated.splice(index, 1)
    updated.splice(newIndex, 0, moved)
    setSections(updated)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const visibleCount = sections.filter(s => s.visible).length

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
            <h1 className="text-2xl font-bold">Homepage Sections</h1>
            <p className="text-muted-foreground">Control section visibility and display order on the homepage</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Link href="/" target="_blank">
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{sections.length}</p>
            <p className="text-sm text-muted-foreground">Total Sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{visibleCount}</p>
            <p className="text-sm text-muted-foreground">Visible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{sections.length - visibleCount}</p>
            <p className="text-sm text-muted-foreground">Hidden</p>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Drag sections up/down to reorder them on the homepage. Toggle visibility to show/hide sections.
          Click "Edit Content" to modify the actual content of each section.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const Icon = SECTION_ICONS[section.id] || Layers
          const editLink = SECTION_EDIT_LINKS[section.id]

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className={`transition-all ${!section.visible ? 'opacity-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />

                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{section.label}</h3>
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        {!section.visible && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {SECTION_DESCRIPTIONS[section.id] || ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {editLink && (
                        <Link href={editLink}>
                          <Button variant="outline" size="sm">
                            Edit Content
                          </Button>
                        </Link>
                      )}

                      <div className="flex items-center gap-1 border-l pl-2 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveSection(index, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveSection(index, 'down')}
                          disabled={index === sections.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>

                      <Switch
                        checked={section.visible}
                        onCheckedChange={() => toggleVisibility(index)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
