import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_HERO, HeroContentData } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'

// GET - Fetch hero content from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const hero = await getFirestoreDocument<HeroContentData>(
        'content',
        'hero',
        DEFAULT_HERO
      )
      return NextResponse.json(hero)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_HERO)
  } catch (error) {
    console.error('Error fetching hero content:', error)
    return NextResponse.json(DEFAULT_HERO, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// PUT - Update hero content in Firestore
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
    const docPath = getCollectionPath('content')

    await db.collection(docPath).doc('hero').update(data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating hero content:', error)
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    )
  }
}
