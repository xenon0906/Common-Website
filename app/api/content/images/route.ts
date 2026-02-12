import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_IMAGES } from '@/lib/types/images'
import type { SiteImagesConfig } from '@/lib/types/images'
import { requireAuth } from '@/lib/api-auth'

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

// PUT - Update images configuration in Firestore
export async function PUT(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const data = await req.json()
    const db = getAdminFirestore()
    const docPath = getCollectionPath('images')

    await db.collection(docPath).doc('config').update(data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating images config:', error)
    return NextResponse.json(
      { error: 'Failed to update images configuration' },
      { status: 500 }
    )
  }
}
