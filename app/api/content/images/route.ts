import { NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_IMAGES } from '@/lib/types/images'
import type { SiteImagesConfig } from '@/lib/types/images'

// GET - Fetch images configuration from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const images = await getFirestoreDocument<SiteImagesConfig>(
        'images',
        'config',
        DEFAULT_IMAGES
      )
      return NextResponse.json(images)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_IMAGES)
  } catch (error) {
    console.error('Error fetching images config:', error)
    return NextResponse.json(DEFAULT_IMAGES, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}
