'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Plus, Trash2, Star, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from '@/lib/firebase'

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
  const [saving, setSaving] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const testimonialsRef = collection(db, 'artifacts', appId, 'public', 'data', 'testimonials')
      const querySnapshot = await getDocs(testimonialsRef)

      const items: Testimonial[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        quote: '',
        author: '',
        role: null,
        location: null,
        rating: 5,
        order: 0,
        isActive: true,
        ...docSnap.data()
      }))

      // Sort by order
      items.sort((a, b) => (a.order || 0) - (b.order || 0))
      setTestimonials(items)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast({ title: 'Error', description: 'Failed to fetch testimonials from Firestore', variant: 'destructive' })
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (testimonial: Testimonial) => {
    setSaving(testimonial.id)
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const testimonialRef = doc(db, 'artifacts', appId, 'public', 'data', 'testimonials', testimonial.id)

      const { id, ...dataToSave } = testimonial
      await updateDoc(testimonialRef, dataToSave)

      toast({ title: 'Success', description: 'Testimonial updated successfully' })
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' })
    } finally {
      setSaving(null)
    }
  }

  const handleAdd = async () => {
    setAdding(true)
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const testimonialsRef = collection(db, 'artifacts', appId, 'public', 'data', 'testimonials')

      const newTestimonial = {
        quote: 'New testimonial quote',
        author: 'Author Name',
        role: 'Role',
        location: 'Location',
        rating: 5,
        order: testimonials.length + 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      }

      const docRef = await addDoc(testimonialsRef, newTestimonial)

      setTestimonials([...testimonials, { id: docRef.id, ...newTestimonial }])
      toast({ title: 'Success', description: 'New testimonial added' })
    } catch (error) {
      console.error('Error adding testimonial:', error)
      toast({ title: 'Error', description: 'Failed to add testimonial', variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'testimonials', id))

      setTestimonials(testimonials.filter((t) => t.id !== id))
      toast({ title: 'Success', description: 'Testimonial deleted' })
    } catch (error) {
      console.error('Error deleting testimonial:', error)
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
            <p className="text-muted-foreground">Manage user testimonials (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTestimonials} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAdd} disabled={adding}>
            {adding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Testimonial
          </Button>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first testimonial to get started.
            </p>
            <Button onClick={handleAdd} disabled={adding}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                      <Button
                        size="sm"
                        onClick={() => handleSave(testimonial)}
                        disabled={saving === testimonial.id}
                      >
                        {saving === testimonial.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
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
      )}
    </div>
  )
}
