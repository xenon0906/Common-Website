'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Save,
  Loader2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  ExternalLink,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'

interface SocialLinks {
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
  youtube: string
  [key: string]: string
}

const defaultSocial: SocialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
  instagram: 'https://www.instagram.com/snapgo.co.in/',
  linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
  twitter: '',
  youtube: '',
}

const platformConfig: { [key: string]: { icon: React.ReactNode; color: string; placeholder: string } } = {
  facebook: {
    icon: <Facebook className="w-5 h-5" />,
    color: '#1877F2',
    placeholder: 'https://facebook.com/...',
  },
  instagram: {
    icon: <Instagram className="w-5 h-5" />,
    color: '#E4405F',
    placeholder: 'https://instagram.com/...',
  },
  linkedin: {
    icon: <Linkedin className="w-5 h-5" />,
    color: '#0A66C2',
    placeholder: 'https://linkedin.com/company/...',
  },
  twitter: {
    icon: <Twitter className="w-5 h-5" />,
    color: '#1DA1F2',
    placeholder: 'https://twitter.com/...',
  },
  youtube: {
    icon: <Youtube className="w-5 h-5" />,
    color: '#FF0000',
    placeholder: 'https://youtube.com/...',
  },
}

export default function SocialPage() {
  const [social, setSocial] = useState<SocialLinks>(defaultSocial)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newPlatform, setNewPlatform] = useState('')

  useEffect(() => {
    fetchSocial()
  }, [])

  const fetchSocial = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'social')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Record<string, string | undefined>
        // Filter out undefined values and merge with defaults
        const filteredData: Record<string, string> = {}
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined) {
            filteredData[key] = value
          }
        }
        setSocial({ ...defaultSocial, ...filteredData })
      } else {
        setSocial(defaultSocial)
      }
    } catch (error) {
      console.error('Error fetching social links:', error)
      setMessage({ type: 'error', text: 'Failed to load social links from Firestore' })
      setSocial(defaultSocial)
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
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'social')
      await setDoc(docRef, social)
      setMessage({ type: 'success', text: 'Social links saved to Firestore!' })
    } catch (error) {
      console.error('Error saving social links:', error)
      setMessage({ type: 'error', text: 'Failed to save social links' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddPlatform = () => {
    if (!newPlatform.trim()) return
    const platform = newPlatform.toLowerCase().trim()
    if (social[platform] !== undefined) {
      setMessage({ type: 'error', text: 'Platform already exists' })
      return
    }
    setSocial({ ...social, [platform]: '' })
    setNewPlatform('')
    setMessage({ type: 'success', text: `Added ${platform} platform` })
  }

  const handleRemovePlatform = (platform: string) => {
    if (!confirm(`Remove ${platform} from social links?`)) return
    const newSocial = { ...social }
    delete newSocial[platform]
    setSocial(newSocial)
    setMessage({ type: 'success', text: `Removed ${platform}` })
  }

  const getIcon = (platform: string) => {
    const config = platformConfig[platform]
    if (config) {
      return <span style={{ color: config.color }}>{config.icon}</span>
    }
    return <Globe className="w-5 h-5 text-muted-foreground" />
  }

  const getPlaceholder = (platform: string) => {
    const config = platformConfig[platform]
    return config?.placeholder || `https://${platform}.com/...`
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
            <h1 className="text-2xl font-bold">Social Links</h1>
            <p className="text-muted-foreground">Manage social media profile URLs (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSocial}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/" target="_blank">
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
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </motion.div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Social Media Profiles</CardTitle>
          <CardDescription>
            Add your social media URLs. These will appear in the website footer and other sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(social).map(([platform, url], index) => (
            <motion.div
              key={platform}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                {getIcon(platform)}
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground capitalize font-medium">
                  {platform}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => setSocial({ ...social, [platform]: e.target.value })}
                    placeholder={getPlaceholder(platform)}
                  />
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              {!platformConfig[platform] && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleRemovePlatform(platform)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          ))}

          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2 block">Add Custom Platform</Label>
            <div className="flex items-center gap-4">
              <Input
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                placeholder="Platform name (e.g., tiktok, discord)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlatform()}
                className="flex-1"
              />
              <Button onClick={handleAddPlatform} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Add any social platform not listed above
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How social links will appear on the website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(social)
              .filter(([, url]) => url)
              .map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {getIcon(platform)}
                  <span className="capitalize text-sm font-medium">{platform}</span>
                </a>
              ))}
            {Object.values(social).every((v) => !v) && (
              <p className="text-muted-foreground text-sm">No social links configured yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
