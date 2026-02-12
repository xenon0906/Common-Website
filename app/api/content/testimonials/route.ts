import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_TESTIMONIALS, TestimonialData } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'

// GET - Fetch testimonials from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const testimonials = await getFirestoreCollection<TestimonialData>(
        'testimonials',
        DEFAULT_TESTIMONIALS,
        'order'
      )

      // Filter active items
      const activeTestimonials = testimonials.filter(t => t.isActive !== false)
      return NextResponse.json(activeTestimonials)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_TESTIMONIALS)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(DEFAULT_TESTIMONIALS, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// POST - Create a new testimonial in Firestore
export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req, 'testimonials', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { author, role, quote, rating, avatarUrl, location, order } = body

    if (!author || !quote) {
      return NextResponse.json(
        { error: 'Author and quote are required' },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('testimonials')
    const collRef = db.collection(collectionPath)

    // Get the highest order number if not provided
    let testimonialOrder = order
    if (testimonialOrder === undefined) {
      const snapshot = await collRef.orderBy('order', 'desc').limit(1).get()
      if (!snapshot.empty) {
        const lastTestimonial = snapshot.docs[0].data()
        testimonialOrder = (lastTestimonial.order || 0) + 1
      } else {
        testimonialOrder = 1
      }
    }

    const newTestimonialData: Omit<TestimonialData, 'id'> = {
      quote,
      author,
      role: role || null,
      location: location || null,
      avatarUrl: avatarUrl || null,
      rating: rating || 5,
      order: testimonialOrder,
      isActive: true,
    }

    const docRef = await collRef.add(newTestimonialData)

    const testimonial: TestimonialData = {
      id: docRef.id,
      ...newTestimonialData,
    }

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
