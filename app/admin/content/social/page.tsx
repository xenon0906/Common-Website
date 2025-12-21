'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Facebook, Instagram, Linkedin, Twitter, Youtube, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface SocialLinks {
  [key: string]: string
}

const platformIcons: { [key: string]: React.ReactNode } = {
  facebook: <Facebook className="w-5 h-5 text-[#1877F2]" />,
  instagram: <Instagram className="w-5 h-5 text-[#E4405F]" />,
  linkedin: <Linkedin className="w-5 h-5 text-[#0A66C2]" />,
  twitter: <Twitter className="w-5 h-5 text-[#1DA1F2]" />,
  youtube: <Youtube className="w-5 h-5 text-[#FF0000]" />,
}

export default function SocialPage() {
  const [social, setSocial] = useState<SocialLinks>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPlatform, setNewPlatform] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchSocial()
  }, [])

  const fetchSocial = async () => {
    try {
      const res = await fetch('/api/content/social')
      const data = await res.json()
      setSocial(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch social links', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(social),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Success', description: 'Social links updated successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save social links', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddPlatform = () => {
    if (!newPlatform.trim()) return
    const platform = newPlatform.toLowerCase().trim()
    if (social[platform]) {
      toast({ title: 'Error', description: 'Platform already exists', variant: 'destructive' })
      return
    }
    setSocial({ ...social, [platform]: '' })
    setNewPlatform('')
  }

  const handleDelete = async (platform: string) => {
    if (!confirm(`Delete ${platform} link?`)) return
    try {
      const res = await fetch(`/api/content/social?platform=${platform}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      const newSocial = { ...social }
      delete newSocial[platform]
      setSocial(newSocial)
      toast({ title: 'Success', description: 'Social link deleted' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete social link', variant: 'destructive' })
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
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Social Links</h1>
            <p className="text-muted-foreground">Manage social media profile URLs</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {Object.entries(social).map(([platform, url], index) => (
            <motion.div
              key={platform}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                {platformIcons[platform] || <span className="text-xs uppercase font-bold">{platform[0]}</span>}
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground capitalize">{platform}</Label>
                <Input
                  value={url}
                  onChange={(e) => setSocial({ ...social, [platform]: e.target.value })}
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(platform)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}

          <div className="flex items-center gap-4 pt-4 border-t">
            <Input
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              placeholder="Add new platform (e.g., twitter)"
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlatform()}
            />
            <Button onClick={handleAddPlatform} variant="outline">
              <Plus className="w-4 h-4 mr-2" />Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
