import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_FEATURES, FeatureData } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'

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
    return NextResponse.json(DEFAULT_FEATURES, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// POST - Create a new feature in Firestore
export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req, 'features', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
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
    const { title, description, icon, order } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('features')
    const collRef = db.collection(collectionPath)

    // Get the highest order number if not provided
    let featureOrder = order
    if (featureOrder === undefined) {
      const snapshot = await collRef.orderBy('order', 'desc').limit(1).get()
      if (!snapshot.empty) {
        const lastFeature = snapshot.docs[0].data()
        featureOrder = (lastFeature.order || 0) + 1
      } else {
        featureOrder = 1
      }
    }

    const newFeatureData: Omit<FeatureData, 'id'> = {
      title,
      description,
      icon: icon || 'Zap',
      order: featureOrder,
      isActive: true,
    }

    const docRef = await collRef.add(newFeatureData)

    const feature: FeatureData = {
      id: docRef.id,
      ...newFeatureData,
    }

    return NextResponse.json(feature, { status: 201 })
  } catch (error) {
    console.error('Error creating feature:', error)
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    )
  }
}
