'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Plus, Trash2, Star } from 'lucide-react'
import Link from 'next/link'

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string | null
  location: string | null
  rating: number
  order: number
  isActive: boolean
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/content/testimonials')
      const data = await res.json()
      setTestimonials(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch testimonials', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (testimonial: Testimonial) => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Success', description: 'Testimonial updated successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: 'New testimonial quote',
          author: 'Author Name',
          role: 'Role',
          location: 'Location',
          rating: 5,
          order: testimonials.length + 1,
          isActive: true,
        }),
      })
      if (!res.ok) throw new Error('Failed to add')
      const newTestimonial = await res.json()
      setTestimonials([...testimonials, newTestimonial])
      toast({ title: 'Success', description: 'New testimonial added' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add testimonial', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      const res = await fetch(`/api/content/testimonials?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setTestimonials(testimonials.filter((t) => t.id !== id))
      toast({ title: 'Success', description: 'Testimonial deleted' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' })
    }
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: any) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
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
            <h1 className="text-2xl font-bold">Testimonials</h1>
            <p className="text-muted-foreground">Manage user testimonials</p>
          </div>
        </div>
        <Button onClick={handleAdd} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />Add Testimonial
        </Button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateTestimonial(testimonial.id, 'rating', star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Author</Label>
                      <Input
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={testimonial.role || ''}
                        onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={testimonial.location || ''}
                        onChange={(e) => updateTestimonial(testimonial.id, 'location', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={() => handleSave(testimonial)} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(testimonial.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
