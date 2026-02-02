'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  GripVertical,
  Scale,
  Lock,
  RotateCcw,
  FileText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'

interface LegalSection {
  id: string
  title: string
  content: string
}

interface LegalPageData {
  lastUpdated: string
  sections: LegalSection[]
}

// Static defaults imported inline to avoid server/client module issues
const LEGAL_TYPES = [
  { key: 'terms', label: 'Terms of Service', icon: Scale, color: 'text-blue-600' },
  { key: 'privacy', label: 'Privacy Policy', icon: Lock, color: 'text-green-600' },
  { key: 'refund', label: 'Refund Policy', icon: RotateCcw, color: 'text-orange-600' },
] as const

type LegalType = typeof LEGAL_TYPES[number]['key']

export default function LegalContentPage() {
  const [activeTab, setActiveTab] = useState<LegalType>('terms')
  const [data, setData] = useState<Record<LegalType, LegalPageData | null>>({
    terms: null,
    privacy: null,
    refund: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [previewSection, setPreviewSection] = useState<string | null>(null)

  useEffect(() => {
    fetchAllLegalContent()
  }, [])

  const fetchAllLegalContent = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const results: Record<string, LegalPageData | null> = {}

      for (const type of LEGAL_TYPES) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'legal', type.key)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          results[type.key] = docSnap.data() as LegalPageData
        } else {
          // Fetch defaults from API
          try {
            const res = await fetch(`/api/content/legal?type=${type.key}`)
            const content = await res.json()
            results[type.key] = content
          } catch {
            results[type.key] = { lastUpdated: '', sections: [] }
          }
        }
      }

      setData(results as Record<LegalType, LegalPageData>)
    } catch (error) {
      console.error('Error fetching legal content:', error)
      setMessage({ type: 'error', text: 'Failed to load legal content' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const currentData = data[activeTab]
    if (!currentData) return

    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'legal', activeTab)
      await setDoc(docRef, currentData)
      setMessage({ type: 'success', text: `${LEGAL_TYPES.find(t => t.key === activeTab)?.label} saved!` })
    } catch (error) {
      console.error('Error saving legal content:', error)
      setMessage({ type: 'error', text: 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    const currentData = data[activeTab]
    if (!currentData) return

    const updated = { ...currentData }
    updated.sections = [...updated.sections]
    updated.sections[index] = { ...updated.sections[index], [field]: value }
    setData({ ...data, [activeTab]: updated })
  }

  const addSection = () => {
    const currentData = data[activeTab]
    if (!currentData) return

    const newId = `section-${Date.now()}`
    const updated = {
      ...currentData,
      sections: [
        ...currentData.sections,
        { id: newId, title: 'New Section', content: '' },
      ],
    }
    setData({ ...data, [activeTab]: updated })
    setExpandedSection(newId)
  }

  const removeSection = (index: number) => {
    const currentData = data[activeTab]
    if (!currentData) return
    if (!confirm('Remove this section?')) return

    const updated = {
      ...currentData,
      sections: currentData.sections.filter((_, i) => i !== index),
    }
    setData({ ...data, [activeTab]: updated })
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const currentData = data[activeTab]
    if (!currentData) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= currentData.sections.length) return

    const sections = [...currentData.sections]
    const [moved] = sections.splice(index, 1)
    sections.splice(newIndex, 0, moved)
    setData({ ...data, [activeTab]: { ...currentData, sections } })
  }

  const updateLastUpdated = (value: string) => {
    const currentData = data[activeTab]
    if (!currentData) return
    setData({ ...data, [activeTab]: { ...currentData, lastUpdated: value } })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentData = data[activeTab]

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
            <h1 className="text-2xl font-bold">Legal Pages</h1>
            <p className="text-muted-foreground">Edit Terms of Service, Privacy Policy, and Refund Policy</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAllLegalContent}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href={`/${activeTab === 'terms' ? 'terms' : activeTab === 'privacy' ? 'privacy' : 'refund'}`} target="_blank">
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LegalType)}>
        <TabsList className="grid w-full grid-cols-3">
          {LEGAL_TYPES.map((type) => {
            const Icon = type.icon
            return (
              <TabsTrigger key={type.key} value={type.key} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${type.color}`} />
                {type.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {LEGAL_TYPES.map((type) => (
          <TabsContent key={type.key} value={type.key}>
            {data[type.key] && (
              <div className="space-y-6">
                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Page Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Last Updated</Label>
                        <Input
                          value={data[type.key]?.lastUpdated || ''}
                          onChange={(e) => updateLastUpdated(e.target.value)}
                          placeholder="e.g., January 2025"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Sections</Label>
                        <div className="flex items-center gap-2 h-10">
                          <Badge variant="secondary" className="text-base px-4 py-1">
                            {data[type.key]?.sections.length || 0} sections
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Sections</h3>
                    <Button onClick={addSection} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </div>

                  {data[type.key]?.sections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="overflow-hidden">
                        <div
                          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium flex-1">{section.title || 'Untitled Section'}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => { e.stopPropagation(); moveSection(index, 'up') }}
                              disabled={index === 0}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => { e.stopPropagation(); moveSection(index, 'down') }}
                              disabled={index === (data[type.key]?.sections.length || 0) - 1}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewSection(previewSection === section.id ? null : section.id)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-500"
                              onClick={(e) => { e.stopPropagation(); removeSection(index) }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {expandedSection === section.id && (
                          <CardContent className="border-t pt-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Section Title</Label>
                              <Input
                                value={section.title}
                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                placeholder="Section title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Content (Markdown supported)</Label>
                              <Textarea
                                value={section.content}
                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                                placeholder="Section content... Markdown is supported."
                                rows={12}
                                className="font-mono text-sm"
                              />
                            </div>
                          </CardContent>
                        )}

                        {previewSection === section.id && (
                          <CardContent className="border-t pt-4 bg-muted/30">
                            <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown>{section.content || '*No content yet*'}</ReactMarkdown>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  ))}

                  {(!data[type.key]?.sections || data[type.key]?.sections.length === 0) && (
                    <Card className="p-8 text-center">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No sections yet</p>
                      <Button onClick={addSection} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Section
                      </Button>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
