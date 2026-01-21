'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  collection,
  addDoc,
  getDocs,
} from '@/lib/firebase'

export default function CreateTestimonialPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    location: '',
    rating: 5,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const testimonialsRef = collection(db, 'artifacts', appId, 'public', 'data', 'testimonials')

      // Get next order number
      const snapshot = await getDocs(testimonialsRef)
      const orderNum = snapshot.size + 1

      await addDoc(testimonialsRef, {
        quote: formData.quote,
        author: formData.author,
        role: formData.role || null,
        location: formData.location || null,
        rating: formData.rating,
        order: orderNum,
        isActive: true,
        createdAt: new Date().toISOString(),
      })

      router.push('/admin/content/testimonials')
    } catch (error) {
      console.error('Error creating testimonial:', error)
      alert('Failed to create testimonial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/content/testimonials">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Testimonial</h1>
          <p className="text-muted-foreground">Create a new customer testimonial (Firestore)</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testimonial Details</CardTitle>
                <CardDescription>Enter the testimonial information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-muted-foreground">
                      {formData.rating} out of 5 stars
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <div className="space-y-2">
                  <Label htmlFor="quote">Quote *</Label>
                  <Textarea
                    id="quote"
                    placeholder="Enter the testimonial quote..."
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The main testimonial text from the customer
                  </p>
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    placeholder="John Doe"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                {/* Role & Location */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / Title</Label>
                    <Input
                      id="role"
                      placeholder="CEO, Product Manager, etc."
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Bangalore, Mumbai, etc."
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How the testimonial will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg italic mb-4">
                    "{formData.quote || 'Your testimonial quote will appear here...'}"
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white font-bold text-sm">
                      {formData.author ? formData.author.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="font-semibold">{formData.author || 'Author Name'}</p>
                      <p className="text-sm text-muted-foreground">
                        {[formData.role, formData.location].filter(Boolean).join(', ') || 'Role, Location'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link href="/admin/content/testimonials">Cancel</Link>
              </Button>
              <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Testimonial
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
