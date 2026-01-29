import { NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_FEATURES, FeatureData } from '@/lib/content'

// GET - Fetch features from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const features = await getFirestoreCollection<FeatureData>(
        'features',
        DEFAULT_FEATURES,
        'order'
      )

      // Filter active items
      const activeFeatures = features.filter(f => f.isActive !== false)
      return NextResponse.json(activeFeatures)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_FEATURES)
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json(DEFAULT_FEATURES, { status: 200 })
  }
}
