import { NextRequest, NextResponse } from 'next/server'
import { isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { getSafetyContent, DEFAULT_SAFETY } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'

// GET - Fetch safety page content from Firestore or return defaults
export async function GET() {
  try {
    if (isFirebaseConfigured()) {
      const safety = await getSafetyContent()
      return NextResponse.json(safety)
    }

    return NextResponse.json(DEFAULT_SAFETY)
  } catch (error) {
    console.error('Error fetching safety content:', error)
    return NextResponse.json(DEFAULT_SAFETY, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// PUT - Update safety content in Firestore
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

    await db.collection(docPath).doc('safety').set(data, { merge: true })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating safety content:', error)
    return NextResponse.json(
      { error: 'Failed to update safety content' },
      { status: 500 }
    )
  }
}
