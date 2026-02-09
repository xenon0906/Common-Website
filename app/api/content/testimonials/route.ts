import { NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_TESTIMONIALS, TestimonialData } from '@/lib/content'

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
