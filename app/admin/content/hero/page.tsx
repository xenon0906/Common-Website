'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react'
import Link from 'next/link'

interface HeroContent {
  id: string
  headline: string
  subtext: string
  badge: string | null
  ctaPrimary: string | null
  ctaSecondary: string | null
  isActive: boolean
}

export default function HeroContentPage() {
  const [hero, setHero] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    try {
      const res = await fetch('/api/content/hero')
      const data = await res.json()
      setHero(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch hero content',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!hero) return
    setSaving(true)
    try {
      const res = await fetch('/api/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast({
        title: 'Success',
        description: 'Hero content updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save hero content',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
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
            <h1 className="text-2xl font-bold">Hero Section</h1>
            <p className="text-muted-foreground">Edit the main hero section content</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {hero && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>
                This content appears in the main hero section of the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={hero.headline}
                  onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                  placeholder="Share Rides. Save More."
                />
                <p className="text-xs text-muted-foreground">
                  Use a period (.) to split the headline into two lines with gradient styling
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtext">Subtext</Label>
                <Textarea
                  id="subtext"
                  value={hero.subtext}
                  onChange={(e) => setHero({ ...hero, subtext: e.target.value })}
                  placeholder="Connect with verified co-riders..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  value={hero.badge || ''}
                  onChange={(e) => setHero({ ...hero, badge: e.target.value || null })}
                  placeholder="India's #1 Ride-Sharing Platform"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to hide the badge
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaPrimary">Primary CTA Button</Label>
                  <Input
                    id="ctaPrimary"
                    value={hero.ctaPrimary || ''}
                    onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value || null })}
                    placeholder="Download Free"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaSecondary">Secondary CTA Button</Label>
                  <Input
                    id="ctaSecondary"
                    value={hero.ctaSecondary || ''}
                    onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value || null })}
                    placeholder="See How It Works"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
