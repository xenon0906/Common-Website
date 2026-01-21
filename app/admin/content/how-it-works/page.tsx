'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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

interface HowItWorksStep {
  id: string
  step: number
  title: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

const defaultSteps: Omit<HowItWorksStep, 'id'>[] = [
  {
    step: 1,
    title: 'Enter Your Destination',
    description: 'Set your pickup and drop location in the app',
    icon: 'MapPin',
    order: 1,
    isActive: true,
  },
  {
    step: 2,
    title: 'Find Your Match',
    description: 'Our algorithm finds people going to the same destination within 750m',
    icon: 'Search',
    order: 2,
    isActive: true,
  },
  {
    step: 3,
    title: 'Pool Together & Save',
    description: 'Book a cab together or join a self-drive ride. Split costs and save up to 75%',
    icon: 'Users',
    order: 3,
    isActive: true,
  },
]

export default function HowItWorksPage() {
  const [steps, setSteps] = useState<HowItWorksStep[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSteps()
  }, [])

  const fetchSteps = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'howItWorks')
      const snapshot = await getDocs(collRef)

      if (snapshot.empty) {
        setSteps([])
      } else {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as HowItWorksStep[]
        setSteps(items.sort((a, b) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error fetching steps:', error)
      setMessage({ type: 'error', text: 'Failed to load steps from Firestore' })
      setSteps([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (step: HowItWorksStep) => {
    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'howItWorks', step.id)
      const { id, ...stepData } = step
      await updateDoc(docRef, stepData)
      setMessage({ type: 'success', text: 'Step updated successfully!' })
    } catch (error) {
      console.error('Error saving step:', error)
      setMessage({ type: 'error', text: 'Failed to save step' })
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

      for (const step of steps) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'howItWorks', step.id)
        const { id, ...stepData } = step
        await updateDoc(docRef, stepData)
      }

      setMessage({ type: 'success', text: 'All steps saved successfully!' })
    } catch (error) {
      console.error('Error saving steps:', error)
      setMessage({ type: 'error', text: 'Failed to save steps' })
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
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'howItWorks')

      const newStep = {
        step: steps.length + 1,
        title: 'New Step',
        description: 'Describe what happens in this step',
        icon: 'Star',
        order: steps.length + 1,
        isActive: true,
      }

      const docRef = await addDoc(collRef, newStep)
      setSteps([...steps, { id: docRef.id, ...newStep }])
      setMessage({ type: 'success', text: 'New step added!' })
    } catch (error) {
      console.error('Error adding step:', error)
      setMessage({ type: 'error', text: 'Failed to add step' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this step?')) return

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'howItWorks', id)
      await deleteDoc(docRef)

      // Reorder remaining steps
      const updatedSteps = steps
        .filter((s) => s.id !== id)
        .map((s, index) => ({ ...s, step: index + 1, order: index + 1 }))
      setSteps(updatedSteps)
      setMessage({ type: 'success', text: 'Step deleted!' })
    } catch (error) {
      console.error('Error deleting step:', error)
      setMessage({ type: 'error', text: 'Failed to delete step' })
    }
  }

  const handleInitialize = async () => {
    if (!confirm('This will initialize the steps collection with default values. Continue?')) return

    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'howItWorks')

      const newSteps: HowItWorksStep[] = []
      for (const step of defaultSteps) {
        const docRef = await addDoc(collRef, step)
        newSteps.push({ id: docRef.id, ...step })
      }

      setSteps(newSteps)
      setMessage({ type: 'success', text: 'Steps initialized with defaults!' })
    } catch (error) {
      console.error('Error initializing steps:', error)
      setMessage({ type: 'error', text: 'Failed to initialize steps' })
    } finally {
      setSaving(false)
    }
  }

  const updateStep = (id: string, field: keyof HowItWorksStep, value: any) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex((s) => s.id === id)
    if (direction === 'up' && index > 0) {
      const newSteps = [...steps]
      ;[newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]]
      // Update order and step numbers
      newSteps.forEach((s, i) => {
        s.order = i + 1
        s.step = i + 1
      })
      setSteps(newSteps)
    } else if (direction === 'down' && index < steps.length - 1) {
      const newSteps = [...steps]
      ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
      // Update order and step numbers
      newSteps.forEach((s, i) => {
        s.order = i + 1
        s.step = i + 1
      })
      setSteps(newSteps)
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
            <h1 className="text-2xl font-bold">How It Works</h1>
            <p className="text-muted-foreground">Manage the step-by-step guide (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSteps}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/how-it-works" target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          {steps.length === 0 && (
            <Button variant="outline" onClick={handleInitialize} disabled={saving}>
              Initialize Defaults
            </Button>
          )}
          <Button onClick={handleAdd} disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Step
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
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={!step.isActive ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Reorder Controls */}
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveStep(step.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <GripVertical className="w-5 h-5" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveStep(step.id, 'down')}
                        disabled={index === steps.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Step Number Badge */}
                    <div className="flex items-center">
                      <Badge
                        variant="default"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-teal"
                      >
                        {step.step}
                      </Badge>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={step.title}
                            onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                            placeholder="Enter step title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon (Lucide name)</Label>
                          <Input
                            value={step.icon}
                            onChange={(e) => updateStep(step.id, 'icon', e.target.value)}
                            placeholder="MapPin, Search, Users, etc."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                          placeholder="Describe what happens in this step"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={step.isActive}
                            onCheckedChange={(checked) => updateStep(step.id, 'isActive', checked)}
                          />
                          <Label>Active</Label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(step)}
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
                        onClick={() => handleDelete(step.id)}
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

      {steps.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No steps yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first step or initialize with defaults
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleInitialize} disabled={saving}>
                Initialize Defaults
              </Button>
              <Button onClick={handleAdd} disabled={saving} variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How the steps will appear on the website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-center gap-8">
              {steps
                .filter((s) => s.isActive)
                .map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center text-center max-w-xs">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-teal">{step.step}</span>
                      </div>
                      {index < steps.filter((s) => s.isActive).length - 1 && (
                        <div className="hidden md:block absolute top-8 left-full w-16 border-t-2 border-dashed border-teal/30" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
