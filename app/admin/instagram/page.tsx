'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Instagram,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Play,
  RefreshCw,
  Settings,
  Link as LinkIcon,
} from 'lucide-react'
import {
  getFirebaseDb,
  getAppId,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from '@/lib/firebase'

interface InstagramReel {
  id: string
  reelId: string
  title: string
  description: string
  visible: boolean
  order: number
}

interface InstagramSettings {
  username: string
  profileUrl: string
  showSection: boolean
  autoRefresh: boolean
  maxReels: number
}

interface InstagramConnection {
  connected: boolean
  userId?: string
  connectedAt?: Date
  expiresAt?: Date
}

const defaultSettings: InstagramSettings = {
  username: 'snapgo.co.in',
  profileUrl: 'https://www.instagram.com/snapgo.co.in',
  showSection: true,
  autoRefresh: false,
  maxReels: 6,
}

export default function InstagramManagerPage() {
  const [reels, setReels] = useState<InstagramReel[]>([])
  const [settings, setSettings] = useState<InstagramSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'reels' | 'settings'>('reels')
  const [connection, setConnection] = useState<InstagramConnection>({ connected: false })

  useEffect(() => {
    let isCancelled = false

    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const db = getFirebaseDb()
        const appId = getAppId()

        // Fetch reels
        const reelsRef = collection(db, 'artifacts', appId, 'public', 'data', 'instagram')
        const reelsSnap = await getDocs(reelsRef)
        if (isCancelled) return
        const reelsData = reelsSnap.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as InstagramReel[]
        setReels(reelsData.sort((a, b) => a.order - b.order))

        // Fetch settings
        const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'instagramSettings', 'config')
        const settingsSnap = await getDoc(settingsRef)
        if (isCancelled) return
        if (settingsSnap.exists()) {
          setSettings({ ...defaultSettings, ...settingsSnap.data() })
        }

        // Check Instagram connection status
        const tokenRef = doc(db, 'artifacts', appId, 'instagramAuth', 'token')
        const tokenSnap = await getDoc(tokenRef)
        if (isCancelled) return
        if (tokenSnap.exists()) {
          const tokenData = tokenSnap.data()
          setConnection({
            connected: true,
            userId: tokenData.userId,
            connectedAt: tokenData.connectedAt?.toDate?.() || tokenData.connectedAt,
            expiresAt: tokenData.expiresAt?.toDate?.() || tokenData.expiresAt,
          })
        }
      } catch (error) {
        if (isCancelled) return
        console.error('Error fetching Instagram data:', error)
        setMessage({ type: 'error', text: 'Failed to load Instagram data from Firestore' })
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    fetchInitialData()

    return () => { isCancelled = true }
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()

      // Fetch reels
      const reelsRef = collection(db, 'artifacts', appId, 'public', 'data', 'instagram')
      const reelsSnap = await getDocs(reelsRef)
      const reelsData = reelsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as InstagramReel[]
      setReels(reelsData.sort((a, b) => a.order - b.order))

      // Fetch settings
      const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'instagramSettings', 'config')
      const settingsSnap = await getDoc(settingsRef)
      if (settingsSnap.exists()) {
        setSettings({ ...defaultSettings, ...settingsSnap.data() })
      }

      // Check Instagram connection status
      const tokenRef = doc(db, 'artifacts', appId, 'instagramAuth', 'token')
      const tokenSnap = await getDoc(tokenRef)
      if (tokenSnap.exists()) {
        const tokenData = tokenSnap.data()
        setConnection({
          connected: true,
          userId: tokenData.userId,
          connectedAt: tokenData.connectedAt?.toDate?.() || tokenData.connectedAt,
          expiresAt: tokenData.expiresAt?.toDate?.() || tokenData.expiresAt,
        })
      }
    } catch (error) {
      console.error('Error fetching Instagram data:', error)
      setMessage({ type: 'error', text: 'Failed to load Instagram data from Firestore' })
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

      // Save all reels
      for (const reel of reels) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'instagram', reel.id)
        const { id, ...reelData } = reel
        await setDoc(docRef, reelData)
      }

      // Save settings
      const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'instagramSettings', 'config')
      await setDoc(settingsRef, settings)

      setMessage({ type: 'success', text: 'Instagram settings saved successfully!' })
    } catch (error) {
      console.error('Error saving Instagram data:', error)
      setMessage({ type: 'error', text: 'Failed to save Instagram data' })
    } finally {
      setSaving(false)
    }
  }

  const addReel = async () => {
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'instagram')

      const newReel = {
        reelId: '',
        title: 'New Reel',
        description: '',
        visible: true,
        order: reels.length + 1,
      }

      const docRef = await addDoc(collRef, newReel)
      setReels([...reels, { id: docRef.id, ...newReel }])
      setMessage({ type: 'success', text: 'New reel added!' })
    } catch (error) {
      console.error('Error adding reel:', error)
      setMessage({ type: 'error', text: 'Failed to add reel' })
    }
  }

  const updateReel = (id: string, updates: Partial<InstagramReel>) => {
    setReels(reels.map((reel) => (reel.id === id ? { ...reel, ...updates } : reel)))
  }

  const removeReel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reel?')) return

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'instagram', id)
      await deleteDoc(docRef)
      setReels(reels.filter((reel) => reel.id !== id))
      setMessage({ type: 'success', text: 'Reel deleted!' })
    } catch (error) {
      console.error('Error deleting reel:', error)
      setMessage({ type: 'error', text: 'Failed to delete reel' })
    }
  }

  const handleConnectInstagram = async () => {
    try {
      const res = await fetch('/api/instagram/auth')
      const data = await res.json()
      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to start Instagram connection' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to Instagram' })
    }
  }

  const handleSyncFromInstagram = async () => {
    setSyncing(true)
    setMessage(null)
    try {
      const res = await fetch('/api/instagram/sync', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: data.message })
        if (data.synced > 0) {
          fetchData() // Reload reels
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to sync' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to sync from Instagram' })
    } finally {
      setSyncing(false)
    }
  }

  const extractReelId = (url: string): string => {
    const match = url.match(/reel\/([A-Za-z0-9_-]+)/)
    return match ? match[1] : url
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Instagram className="w-8 h-8 text-pink-500" />
            Instagram Manager
          </h1>
          <p className="text-muted-foreground">Manage Instagram reels displayed on your website (Firestore)</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <a href={settings.profileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </a>
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
                Save Changes
              </>
            )}
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

      {/* Profile Card */}
      <Card className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-pink-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">@{settings.username}</h3>
              <p className="text-muted-foreground">Instagram Business Account</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold">{reels.filter((r) => r.visible).length}</p>
                <p className="text-xs text-muted-foreground">Active Reels</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{reels.length}</p>
                <p className="text-xs text-muted-foreground">Total Reels</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instagram API Connection */}
      <Card className={connection.connected ? 'border-green-500/30 bg-green-500/5' : 'border-dashed'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${connection.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div>
                <p className="font-medium">
                  {connection.connected ? 'Instagram Connected' : 'Instagram Not Connected'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {connection.connected
                    ? `Connected. Token expires ${connection.expiresAt ? new Date(connection.expiresAt).toLocaleDateString() : 'unknown'}.`
                    : 'Connect your Instagram account to auto-sync reels.'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {connection.connected ? (
                <Button
                  variant="outline"
                  onClick={handleSyncFromInstagram}
                  disabled={syncing}
                >
                  {syncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" />Sync Reels</>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleConnectInstagram}
                  className="border-pink-500/50 text-pink-500 hover:bg-pink-500/10"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Connect Instagram
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('reels')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'reels'
              ? 'border-pink-500 text-pink-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Play className="w-4 h-4 inline mr-2" />
          Reels
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'settings'
              ? 'border-pink-500 text-pink-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Settings
        </button>
      </div>

      {/* Reels Tab */}
      {activeTab === 'reels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add Instagram reel IDs to display on your website. Get the ID from the reel URL: instagram.com/reel/<strong>REEL_ID</strong>/
            </p>
            <Button onClick={addReel} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Reel
            </Button>
          </div>

          <div className="grid gap-4">
            {reels.map((reel, index) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={!reel.visible ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Preview */}
                      <div className="w-32 h-44 flex-shrink-0 rounded-lg bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 flex items-center justify-center relative overflow-hidden">
                        {reel.reelId ? (
                          <>
                            <div className="absolute inset-0 bg-black/20" />
                            <Play className="w-8 h-8 text-white z-10" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-white text-xs truncate">{reel.reelId}</p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <Instagram className="w-8 h-8 mx-auto mb-2 text-pink-500/50" />
                            <p className="text-xs text-muted-foreground">No reel ID</p>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Title</Label>
                              <Input
                                value={reel.title}
                                onChange={(e) => updateReel(reel.id, { title: e.target.value })}
                                placeholder="Reel title"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Reel ID or URL</Label>
                              <Input
                                value={reel.reelId}
                                onChange={(e) => updateReel(reel.id, { reelId: extractReelId(e.target.value) })}
                                placeholder="DDxfo_TTOZF or full URL"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">Description (optional)</Label>
                          <Input
                            value={reel.description}
                            onChange={(e) => updateReel(reel.id, { description: e.target.value })}
                            placeholder="Brief description of the reel"
                            className="mt-1"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={reel.visible}
                                onCheckedChange={(checked) => updateReel(reel.id, { visible: checked })}
                              />
                              <span className="text-sm">{reel.visible ? 'Visible' : 'Hidden'}</span>
                            </div>
                            {reel.reelId && (
                              <a
                                href={`https://www.instagram.com/reel/${reel.reelId}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-pink-500 hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View on Instagram
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => removeReel(reel.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {reels.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Instagram className="w-12 h-12 mx-auto text-pink-500/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reels added</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first Instagram reel to display on your website
                  </p>
                  <Button onClick={addReel}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reel
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Instagram Section Settings</CardTitle>
            <CardDescription>Configure how Instagram content appears on your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Instagram Username</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    @
                  </span>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                    className="rounded-l-none"
                    placeholder="snapgo.co.in"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileUrl">Profile URL</Label>
                <Input
                  id="profileUrl"
                  value={settings.profileUrl}
                  onChange={(e) => setSettings({ ...settings, profileUrl: e.target.value })}
                  placeholder="https://www.instagram.com/snapgo.co.in"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Show Instagram Section</h4>
                  <p className="text-sm text-muted-foreground">Display the Instagram reels section on homepage</p>
                </div>
                <Switch
                  checked={settings.showSection}
                  onCheckedChange={(checked) => setSettings({ ...settings, showSection: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Auto Refresh</h4>
                  <p className="text-sm text-muted-foreground">Automatically refresh embed when switching reels</p>
                </div>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
                />
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Maximum Reels to Display</h4>
                  <Badge variant="outline">{settings.maxReels} reels</Badge>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.maxReels}
                  onChange={(e) => setSettings({ ...settings, maxReels: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <h4 className="font-medium text-pink-600 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                How to get Reel ID
              </h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to the Instagram reel you want to embed</li>
                <li>Copy the URL from your browser address bar</li>
                <li>The reel ID is the part after /reel/ in the URL</li>
                <li>Example: instagram.com/reel/<strong>DDxfo_TTOZF</strong>/ - ID is DDxfo_TTOZF</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
