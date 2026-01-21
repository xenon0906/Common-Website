'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Award,
  Video,
  FileText,
  Trash2,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Save,
  X,
} from 'lucide-react'
import {
  getFirebaseDb,
  getAppId,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from '@/lib/firebase'

interface Achievement {
  id: string
  type: 'CERT' | 'VIDEO' | 'POST'
  title: string
  content: string
  mediaUrl: string
  createdAt: string
}

const typeIcons = {
  CERT: Award,
  VIDEO: Video,
  POST: FileText,
}

const typeColors = {
  CERT: 'bg-amber-100 text-amber-700',
  VIDEO: 'bg-purple-100 text-purple-700',
  POST: 'bg-blue-100 text-blue-700',
}

const typeLabels = {
  CERT: 'Certificate',
  VIDEO: 'Video',
  POST: 'Social Post',
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newAchievement, setNewAchievement] = useState({
    type: 'CERT' as 'CERT' | 'VIDEO' | 'POST',
    title: '',
    content: '',
    mediaUrl: '',
  })

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'achievements')
      const snapshot = await getDocs(collRef)

      if (snapshot.empty) {
        setAchievements([])
      } else {
        const items = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as Achievement[]
        setAchievements(items.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
      setMessage({ type: 'error', text: 'Failed to load achievements from Firestore' })
      setAchievements([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newAchievement.title) {
      setMessage({ type: 'error', text: 'Title is required' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'achievements')

      const achievement = {
        ...newAchievement,
        createdAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collRef, achievement)
      setAchievements([{ id: docRef.id, ...achievement }, ...achievements])
      setNewAchievement({ type: 'CERT', title: '', content: '', mediaUrl: '' })
      setShowForm(false)
      setMessage({ type: 'success', text: 'Achievement added!' })
    } catch (error) {
      console.error('Error adding achievement:', error)
      setMessage({ type: 'error', text: 'Failed to add achievement' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'achievements', id)
      await deleteDoc(docRef)
      setAchievements(achievements.filter((a) => a.id !== id))
      setMessage({ type: 'success', text: 'Achievement deleted!' })
    } catch (error) {
      console.error('Error deleting achievement:', error)
      setMessage({ type: 'error', text: 'Failed to delete achievement' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">Manage certificates, videos, and social posts (Firestore)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAchievements}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="gradient" onClick={() => setShowForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Achievement
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

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Achievement</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2">
                  {(['CERT', 'VIDEO', 'POST'] as const).map((type) => {
                    const Icon = typeIcons[type]
                    return (
                      <button
                        key={type}
                        onClick={() => setNewAchievement({ ...newAchievement, type })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          newAchievement.type === type
                            ? 'border-teal bg-teal/10 text-teal'
                            : 'border-border hover:border-teal/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {typeLabels[type]}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="Achievement title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newAchievement.content}
                  onChange={(e) => setNewAchievement({ ...newAchievement, content: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Media URL (optional)</Label>
                <Input
                  value={newAchievement.mediaUrl}
                  onChange={(e) => setNewAchievement({ ...newAchievement, mediaUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={saving} variant="gradient">
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Achievement
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Achievement List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal" />
        </div>
      ) : achievements.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = typeIcons[achievement.type]
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${typeColors[achievement.type]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(achievement.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Badge variant="outline" className="mb-2">{typeLabels[achievement.type]}</Badge>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    {achievement.content && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {achievement.content}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(achievement.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-20 text-center">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first achievement to showcase Snapgo's milestones.
            </p>
            <Button variant="gradient" onClick={() => setShowForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Achievement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
