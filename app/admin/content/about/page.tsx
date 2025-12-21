'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface AboutContent {
  [key: string]: {
    id: string
    key: string
    title: string | null
    content: string
    order: number
  }
}

const sections = [
  { key: 'origin', label: 'Origin Story', description: 'How Snapgo was founded' },
  { key: 'spark', label: 'The Spark', description: 'The idea behind Snapgo' },
  { key: 'mission', label: 'Mission', description: 'Our purpose and goals' },
  { key: 'vision', label: 'Vision', description: 'Where we see ourselves' },
  { key: 'values', label: 'Values', description: 'Our core values' },
]

export default function AboutContentPage() {
  const [about, setAbout] = useState<AboutContent>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const res = await fetch('/api/content/about')
      const data = await res.json()
      setAbout(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch about content', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(about),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Success', description: 'About content updated successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save about content', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const updateSection = (key: string, field: 'title' | 'content', value: string) => {
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
            <p className="text-muted-foreground">Edit the about page content</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All
        </Button>
      </div>

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
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={about[section.key]?.title || ''}
                    onChange={(e) => updateSection(section.key, 'title', e.target.value)}
                    placeholder={section.label}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={about[section.key]?.content || ''}
                    onChange={(e) => updateSection(section.key, 'content', e.target.value)}
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
