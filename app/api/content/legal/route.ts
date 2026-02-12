import { NextRequest, NextResponse } from 'next/server'
import { isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { getLegalContent, LegalPageData } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'

// GET - Fetch legal page content by type (terms, privacy, refund)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'terms' | 'privacy' | 'refund'

    if (!type || !['terms', 'privacy', 'refund'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be terms, privacy, or refund.' },
        { status: 400 }
      )
    }

    const content = await getLegalContent(type)
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching legal content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch legal content' },
      { status: 500, headers: { 'X-Data-Source': 'fallback' } }
    )
  }
}

// PUT - Update legal page content by type
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'terms' | 'privacy' | 'refund'

    if (!type || !['terms', 'privacy', 'refund'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be terms, privacy, or refund.' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('legal')

    await db.collection(collectionPath).doc(type).update(data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating legal content:', error)
    return NextResponse.json(
      { error: 'Failed to update legal content' },
      { status: 500 }
    )
  }
}
