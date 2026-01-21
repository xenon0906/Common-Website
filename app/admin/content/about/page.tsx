'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'

interface AboutContent {
  origin: { title: string; content: string }
  spark: { title: string; content: string }
  mission: { title: string; content: string }
  vision: { title: string; content: string }
  values: { title: string; content: string }
}

const defaultAbout: AboutContent = {
  origin: {
    title: 'Origin Story',
    content: 'Founded in 2024, Snapgo started with a simple idea - making transportation more accessible and affordable for everyone.',
  },
  spark: {
    title: 'The Spark',
    content: 'The idea came from watching students struggle with expensive cab fares during daily commutes.',
  },
  mission: {
    title: 'Mission',
    content: 'To revolutionize urban mobility by connecting verified co-riders, making travel safer, affordable, and sustainable.',
  },
  vision: {
    title: 'Vision',
    content: 'A world where every journey is shared, every ride is safe, and every commute builds community.',
  },
  values: {
    title: 'Values',
    content: 'Safety First, Community Driven, Eco-Friendly, Innovation Led, Transparency Always.',
  },
}

const sections = [
  { key: 'origin', label: 'Origin Story', description: 'How Snapgo was founded' },
  { key: 'spark', label: 'The Spark', description: 'The idea behind Snapgo' },
  { key: 'mission', label: 'Mission', description: 'Our purpose and goals' },
  { key: 'vision', label: 'Vision', description: 'Where we see ourselves' },
  { key: 'values', label: 'Values', description: 'Our core values' },
]

export default function AboutContentPage() {
  const [about, setAbout] = useState<AboutContent>(defaultAbout)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'about')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<AboutContent>
        setAbout({ ...defaultAbout, ...data })
      } else {
        setAbout(defaultAbout)
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
      setMessage({ type: 'error', text: 'Failed to load about content from Firestore' })
      setAbout(defaultAbout)
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
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'about')
      await setDoc(docRef, about)
      setMessage({ type: 'success', text: 'About content saved to Firestore!' })
    } catch (error) {
      console.error('Error saving about content:', error)
      setMessage({ type: 'error', text: 'Failed to save about content' })
    } finally {
      setSaving(false)
    }
  }

  const updateSection = (key: keyof AboutContent, field: 'title' | 'content', value: string) => {
    setAbout({
      ...about,
      [key]: {
        ...about[key],
        [field]: value,
      },
    })
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
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">About Content</h1>
            <p className="text-muted-foreground">Edit the about page content (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAboutContent}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="gradient">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save All
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

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={about[section.key as keyof AboutContent]?.title || ''}
                    onChange={(e) => updateSection(section.key as keyof AboutContent, 'title', e.target.value)}
                    placeholder={section.label}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={about[section.key as keyof AboutContent]?.content || ''}
                    onChange={(e) => updateSection(section.key as keyof AboutContent, 'content', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
