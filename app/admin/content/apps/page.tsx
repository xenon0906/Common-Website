'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Loader2, Smartphone, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'

interface AppStoreLinks {
  android: {
    url: string
    isLive: boolean
    qrCodeUrl: string
  }
  ios: {
    url: string
    isLive: boolean
    qrCodeUrl: string
  }
}

const defaultApps: AppStoreLinks = {
  android: {
    url: 'https://play.google.com/store/apps/details?id=in.snapgo.app',
    isLive: true,
    qrCodeUrl: '',
  },
  ios: {
    url: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741',
    isLive: true,
    qrCodeUrl: '',
  },
}

export default function AppsPage() {
  const [apps, setApps] = useState<AppStoreLinks>(defaultApps)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'apps')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<AppStoreLinks>
        setApps({ ...defaultApps, ...data })
      } else {
        setApps(defaultApps)
      }
    } catch (error) {
      console.error('Error fetching app store links:', error)
      setMessage({ type: 'error', text: 'Failed to load app store links from Firestore' })
      setApps(defaultApps)
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
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'apps')
      await setDoc(docRef, apps)
      setMessage({ type: 'success', text: 'App store links saved to Firestore!' })
    } catch (error) {
      console.error('Error saving app store links:', error)
      setMessage({ type: 'error', text: 'Failed to save app store links' })
    } finally {
      setSaving(false)
    }
  }

  const updateApp = (platform: 'android' | 'ios', field: keyof AppStoreLinks['android'], value: any) => {
    setApps({
      ...apps,
      [platform]: {
        ...apps[platform],
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
            <h1 className="text-2xl font-bold">App Store Links</h1>
            <p className="text-muted-foreground">Manage app download links and QR codes (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchApps}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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

      <div className="grid md:grid-cols-2 gap-6">
        {(['android', 'ios'] as const).map((platform, index) => (
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {platform === 'android' ? (
                    <div className="w-10 h-10 rounded-lg bg-[#3DDC84]/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#3DDC84]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.6 11.4c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m-11.2 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5M18.1 7l1.8-3.2c.1-.2 0-.4-.2-.5s-.4 0-.5.2l-1.8 3.3C15.7 5.7 13.9 5 12 5s-3.7.7-5.4 1.8L4.8 3.5c-.1-.2-.3-.3-.5-.2s-.3.3-.2.5L5.9 7C3.1 8.8 1.3 11.5 1 14.5h22c-.3-3-2.1-5.7-4.9-7.5"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                  )}
                  {platform === 'android' ? 'Android (Play Store)' : 'iOS (App Store)'}
                </CardTitle>
                <CardDescription>
                  Configure {platform === 'android' ? 'Google Play Store' : 'Apple App Store'} settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Store URL</Label>
                  <Input
                    value={apps[platform]?.url || ''}
                    onChange={(e) => updateApp(platform, 'url', e.target.value)}
                    placeholder={`https://${platform === 'android' ? 'play.google.com' : 'apps.apple.com'}/...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>QR Code Image Path</Label>
                  <Input
                    value={apps[platform]?.qrCodeUrl || ''}
                    onChange={(e) => updateApp(platform, 'qrCodeUrl', e.target.value)}
                    placeholder="/images/qr code/..."
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">App is Live</h4>
                    <p className="text-sm text-muted-foreground">Show download button on website</p>
                  </div>
                  <Switch
                    checked={apps[platform]?.isLive || false}
                    onCheckedChange={(checked) => updateApp(platform, 'isLive', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How download buttons will appear on the website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            {apps.android.isLive && (
              <a href={apps.android.url} target="_blank" rel="noopener noreferrer">
                <img
                  src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-14"
                />
              </a>
            )}
            {apps.ios.isLive && (
              <a href={apps.ios.url} target="_blank" rel="noopener noreferrer">
                <img
                  src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                  alt="Download on App Store"
                  className="h-14"
                />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
