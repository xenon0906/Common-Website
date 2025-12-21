'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/content/features')
      const data = await res.json()
      setFeatures(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch features', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (feature: Feature) => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feature),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Success', description: 'Feature updated successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save feature', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Feature',
          description: 'Feature description',
          icon: 'Star',
          order: features.length + 1,
          isActive: true,
        }),
      })
      if (!res.ok) throw new Error('Failed to add')
      const newFeature = await res.json()
      setFeatures([...features, newFeature])
      toast({ title: 'Success', description: 'New feature added' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add feature', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feature?')) return
    try {
      const res = await fetch(`/api/content/features?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setFeatures(features.filter((f) => f.id !== id))
      toast({ title: 'Success', description: 'Feature deleted' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete feature', variant: 'destructive' })
    }
  }

  const updateFeature = (id: string, field: keyof Feature, value: any) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
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
            <h1 className="text-2xl font-bold">Features</h1>
            <p className="text-muted-foreground">Manage feature cards</p>
          </div>
        </div>
        <Button onClick={handleAdd} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />Add Feature
        </Button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon Name</Label>
                      <Input
                        value={feature.icon}
                        onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                        placeholder="Wallet, ShieldCheck, Users..."
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button size="sm" onClick={() => handleSave(feature)} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(feature.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
