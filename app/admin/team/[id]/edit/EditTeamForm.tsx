'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, User, Loader2, ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface TeamMember {
  id: string
  name: string
  bio: string | null
  details: string | null
  imageUrl: string | null
  portraitUrl: string | null
  email: string | null
  linkedin: string | null
  twitter: string | null
  order: number
  isActive: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function EditTeamForm() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    details: '',
    email: '',
    linkedin: '',
    twitter: '',
    imageUrl: '',
    portraitUrl: '',
    order: '',
    isActive: true,
  })

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch(`/api/team/${params.id}`)
        if (res.ok) {
          const data: TeamMember = await res.json()
          setFormData({
            name: data.name,
            bio: data.bio || '',
            details: data.details || '',
            email: data.email || '',
            linkedin: data.linkedin || '',
            twitter: data.twitter || '',
            imageUrl: data.imageUrl || '',
            portraitUrl: data.portraitUrl || '',
            order: data.order.toString(),
            isActive: data.isActive,
          })
        } else {
          alert('Team member not found')
          router.push('/admin/team')
        }
      } catch (error) {
        console.error('Error fetching team member:', error)
        alert('Failed to load team member')
        router.push('/admin/team')
      } finally {
        setLoading(false)
      }
    }
    fetchMember()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/team/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: formData.order ? parseInt(formData.order) : undefined,
        }),
      })

      if (res.ok) {
        router.push('/admin/team')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update team member')
      }
    } catch (error) {
      console.error('Error updating team member:', error)
      alert('Failed to update team member')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/team">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Team Member</h1>
          <p className="text-muted-foreground">Update team member information</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update the team member's basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Short Bio</Label>
                    <textarea
                      id="bio"
                      placeholder="A brief description about the team member..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Details / Information Box</Label>
                    <textarea
                      id="details"
                      placeholder="Enter detailed information about this person that will appear in their info box..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      This text will be displayed in the details box on the team page
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Social</CardTitle>
                  <CardDescription>Update contact information and social links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@snapgo.co.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter URL</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/username"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portrait Photo</CardTitle>
                  <CardDescription>Large portrait for team card display</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[3/4] w-full max-w-[200px] mx-auto rounded-lg bg-gradient-to-br from-primary to-teal-500 flex flex-col items-center justify-center overflow-hidden">
                    {formData.portraitUrl ? (
                      <img
                        src={formData.portraitUrl}
                        alt="Portrait Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-white/90 mb-2">
                          {formData.name ? getInitials(formData.name) : 'AB'}
                        </span>
                        <User className="w-10 h-10 text-white/40" />
                      </>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portraitUrl">Portrait URL</Label>
                    <Input
                      id="portraitUrl"
                      placeholder="https://example.com/portrait.jpg"
                      value={formData.portraitUrl}
                      onChange={(e) => setFormData({ ...formData, portraitUrl: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional. Shows initials placeholder if empty
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Small Avatar</CardTitle>
                  <CardDescription>Optional small profile image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center overflow-hidden">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/60" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Avatar URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Control visibility and order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isActive">Active</Label>
                      <p className="text-xs text-muted-foreground">
                        Show on public team page
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Order Number</Label>
                    <Input
                      id="order"
                      type="number"
                      placeholder="1"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" asChild>
                  <Link href="/admin/team">Cancel</Link>
                </Button>
                <Button type="submit" variant="gradient" className="flex-1" disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
