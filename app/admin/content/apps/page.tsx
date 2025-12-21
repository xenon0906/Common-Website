'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Smartphone } from 'lucide-react'
import Link from 'next/link'

interface AppStoreLinks {
  [key: string]: {
    url: string
    isLive: boolean
    qrCodeUrl: string | null
  }
}

export default function AppsPage() {
  const [apps, setApps] = useState<AppStoreLinks>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/content/apps')
      const data = await res.json()
      setApps(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch app store links', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apps),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Success', description: 'App store links updated successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save app store links', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const updateApp = (platform: string, field: keyof AppStoreLinks[string], value: any) => {
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
            <p className="text-muted-foreground">Manage app download links and QR codes</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {['android', 'ios'].map((platform, index) => (
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  {platform === 'android' ? 'Android (Play Store)' : 'iOS (App Store)'}
                </CardTitle>
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
                <div className="flex items-center gap-2">
                  <Switch
                    checked={apps[platform]?.isLive || false}
                    onCheckedChange={(checked) => updateApp(platform, 'isLive', checked)}
                  />
                  <Label>App is Live</Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
