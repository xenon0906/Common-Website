import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { requireAuth } from '@/lib/api-auth'

interface HomepageContent {
  hero?: any
  features?: any
  stats?: any
  testimonials?: any
  cta?: any
  [key: string]: any
}

const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: {},
  features: {},
  stats: {},
  testimonials: {},
  cta: {},
}

// GET - Fetch homepage content from Firestore or return defaults
export async function GET() {
  try {
    if (isFirebaseConfigured()) {
      const homepage = await getFirestoreDocument<HomepageContent>(
        'content',
        'homepage',
        DEFAULT_HOMEPAGE
      )
      return NextResponse.json(homepage)
    }

    return NextResponse.json(DEFAULT_HOMEPAGE)
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(DEFAULT_HOMEPAGE, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// PUT - Update homepage content in Firestore
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

    await db.collection(docPath).doc('homepage').update(data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating homepage content:', error)
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 500 }
    )
  }
}
