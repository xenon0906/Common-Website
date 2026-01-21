'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from '@/lib/firebase'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

const defaultFeatures: Omit<Feature, 'id'>[] = [
  {
    title: 'Save Up to 75%',
    description: 'Split your cab fare with verified co-riders. No more paying full price for solo rides.',
    icon: 'Wallet',
    order: 1,
    isActive: true,
  },
  {
    title: '100% Legal',
    description: 'We pool commercial cabs, not private vehicles. Fully compliant with transport laws.',
    icon: 'ShieldCheck',
    order: 2,
    isActive: true,
  },
  {
    title: 'Verified Riders',
    description: 'Every user is Aadhaar-verified. Know who you are sharing your ride with.',
    icon: 'UserCheck',
    order: 3,
    isActive: true,
  },
  {
    title: 'Smart Matching',
    description: 'Our algorithm finds riders within 750m of your route. Perfect matches, every time.',
    icon: 'Target',
    order: 4,
    isActive: true,
  },
  {
    title: 'In-App Calling',
    description: 'Communicate with co-riders without sharing your personal number.',
    icon: 'Phone',
    order: 5,
    isActive: true,
  },
  {
    title: 'Go Green',
    description: 'Reduce your carbon footprint. One pooled ride = multiple solo trips saved.',
    icon: 'Leaf',
    order: 6,
    isActive: true,
  },
]

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'features')
      const snapshot = await getDocs(collRef)

      if (snapshot.empty) {
        setFeatures([])
      } else {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Feature[]
        setFeatures(items.sort((a, b) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error fetching features:', error)
      setMessage({ type: 'error', text: 'Failed to load features from Firestore' })
      setFeatures([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (feature: Feature) => {
    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'features', feature.id)
      const { id, ...featureData } = feature
      await updateDoc(docRef, featureData)
      setMessage({ type: 'success', text: 'Feature updated successfully!' })
    } catch (error) {
      console.error('Error saving feature:', error)
      setMessage({ type: 'error', text: 'Failed to save feature' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()

      for (const feature of features) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'features', feature.id)
        const { id, ...featureData } = feature
        await updateDoc(docRef, featureData)
      }

      setMessage({ type: 'success', text: 'All features saved successfully!' })
    } catch (error) {
      console.error('Error saving features:', error)
      setMessage({ type: 'error', text: 'Failed to save features' })
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'features')

      const newFeature = {
        title: 'New Feature',
        description: 'Feature description goes here',
        icon: 'Star',
        order: features.length + 1,
        isActive: true,
      }

      const docRef = await addDoc(collRef, newFeature)
      setFeatures([...features, { id: docRef.id, ...newFeature }])
      setMessage({ type: 'success', text: 'New feature added!' })
    } catch (error) {
      console.error('Error adding feature:', error)
      setMessage({ type: 'error', text: 'Failed to add feature' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'features', id)
      await deleteDoc(docRef)

      const updatedFeatures = features
        .filter((f) => f.id !== id)
        .map((f, index) => ({ ...f, order: index + 1 }))
      setFeatures(updatedFeatures)
      setMessage({ type: 'success', text: 'Feature deleted!' })
    } catch (error) {
      console.error('Error deleting feature:', error)
      setMessage({ type: 'error', text: 'Failed to delete feature' })
    }
  }

  const handleInitialize = async () => {
    if (!confirm('This will initialize the features collection with default values. Continue?')) return

    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'features')

      const newFeatures: Feature[] = []
      for (const feature of defaultFeatures) {
        const docRef = await addDoc(collRef, feature)
        newFeatures.push({ id: docRef.id, ...feature })
      }

      setFeatures(newFeatures)
      setMessage({ type: 'success', text: 'Features initialized with defaults!' })
    } catch (error) {
      console.error('Error initializing features:', error)
      setMessage({ type: 'error', text: 'Failed to initialize features' })
    } finally {
      setSaving(false)
    }
  }

  const updateFeature = (id: string, field: keyof Feature, value: any) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const moveFeature = (id: string, direction: 'up' | 'down') => {
    const index = features.findIndex((f) => f.id === id)
    if (direction === 'up' && index > 0) {
      const newFeatures = [...features]
      ;[newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]]
      newFeatures.forEach((f, i) => {
        f.order = i + 1
      })
      setFeatures(newFeatures)
    } else if (direction === 'down' && index < features.length - 1) {
      const newFeatures = [...features]
      ;[newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]]
      newFeatures.forEach((f, i) => {
        f.order = i + 1
      })
      setFeatures(newFeatures)
    }
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
            <h1 className="text-2xl font-bold">Features</h1>
            <p className="text-muted-foreground">Manage homepage feature cards (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchFeatures}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/" target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          {features.length === 0 && (
            <Button variant="outline" onClick={handleInitialize} disabled={saving}>
              Initialize Defaults
            </Button>
          )}
          <Button onClick={handleAdd} disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
          <Button onClick={handleSaveAll} disabled={saving} variant="gradient">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
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
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </motion.div>
      )}

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
              <Card className={!feature.isActive ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Reorder Controls */}
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveFeature(feature.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <GripVertical className="w-5 h-5" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveFeature(feature.id, 'down')}
                        disabled={index === features.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={feature.title}
                            onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                            placeholder="Feature title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon (Lucide name)</Label>
                          <Input
                            value={feature.icon}
                            onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                            placeholder="Wallet, ShieldCheck, Users, etc."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                          placeholder="Feature description"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={feature.isActive}
                            onCheckedChange={(checked) => updateFeature(feature.id, 'isActive', checked)}
                          />
                          <Label>Active</Label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(feature)}
                        disabled={saving}
                        variant="gradient"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(feature.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {features.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No features yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first feature or initialize with defaults
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleInitialize} disabled={saving}>
                Initialize Defaults
              </Button>
              <Button onClick={handleAdd} disabled={saving} variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How features will appear on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features
                .filter((f) => f.isActive)
                .map((feature) => (
                  <div
                    key={feature.id}
                    className="p-4 bg-gradient-to-br from-muted/50 to-muted rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center mb-3">
                      <span className="text-teal text-lg font-bold">
                        {feature.icon.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
