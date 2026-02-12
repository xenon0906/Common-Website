'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Loader2, Eye, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { contentAPI } from '@/lib/admin-client'
import { useToast } from '@/components/ui/use-toast'

interface HeroContent {
  headline: string
  subtext: string
  badge: string
  ctaPrimary: string
  ctaSecondary: string
  isActive: boolean
}

const defaultHero: HeroContent = {
  headline: 'Share Rides. Save More.',
  subtext: 'Connect with verified co-riders heading your way. Split fares, reduce carbon footprint, and travel safely with Snapgo.',
  badge: "India's #1 Ride-Sharing Platform",
  ctaPrimary: 'Download Free',
  ctaSecondary: 'See How It Works',
  isActive: true,
}

export default function HeroContentPage() {
  const [hero, setHero] = useState<HeroContent>(defaultHero)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await contentAPI.hero.get()

      if (error) {
        toast({
          title: 'Failed to load hero content',
          description: error,
          variant: 'destructive',
        })
        setHero(defaultHero)
      } else if (data) {
        setHero({ ...defaultHero, ...data })
      } else {
        setHero(defaultHero)
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
      toast({
        title: 'Failed to load hero content',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
      setHero(defaultHero)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const { error } = await contentAPI.hero.update(hero)

      if (error) {
        toast({
          title: 'Failed to save hero content',
          description: error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Hero content saved successfully',
          description: 'Your changes have been saved to Firestore',
        })
      }
    } catch (error) {
      console.error('Error saving hero content:', error)
      toast({
        title: 'Failed to save hero content',
        description: 'An unexpected error occurred',
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
            <p className="text-muted-foreground">Edit the main hero section content (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchHeroContent}>
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
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
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
                  value={hero.ctaPrimary}
                  onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })}
                  placeholder="Download Free"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaSecondary">Secondary CTA Button</Label>
                <Input
                  id="ctaSecondary"
                  value={hero.ctaSecondary}
                  onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })}
                  placeholder="See How It Works"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded-lg border">
              <Switch
                checked={hero.isActive}
                onCheckedChange={(checked) => setHero({ ...hero, isActive: checked })}
              />
              <Label>Hero Section Active</Label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How the hero section will appear on the homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-background to-muted/50 rounded-xl p-8 text-center">
            {hero.badge && (
              <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {hero.badge}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {hero.headline.split('.').map((part, i) => (
                <span key={i}>
                  {part}
                  {i === 0 && hero.headline.includes('.') && <span className="text-teal">.</span>}
                  {i === 0 && hero.headline.includes('.') && <br />}
                </span>
              ))}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">{hero.subtext}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="gradient">{hero.ctaPrimary}</Button>
              <Button variant="outline">{hero.ctaSecondary}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
