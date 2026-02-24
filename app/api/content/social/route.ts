import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_SOCIAL } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'

interface SocialLinks {
  facebook: string
  instagram: string
  linkedin: string
  twitter?: string
  youtube?: string
}

// GET - Fetch social links from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const social = await getFirestoreDocument<SocialLinks>(
        'content',
        'social',
        DEFAULT_SOCIAL as SocialLinks
      )
      return NextResponse.json(social)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_SOCIAL)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json(DEFAULT_SOCIAL, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// PUT - Update social links in Firestore
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

    await db.collection(docPath).doc('social').set(data, { merge: true })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating social links:', error)
    return NextResponse.json(
      { error: 'Failed to update social links' },
      { status: 500 }
    )
  }
}
