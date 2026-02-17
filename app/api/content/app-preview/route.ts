import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getFirestoreDocument, setFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_APP_PREVIEW } from '@/lib/constants'
import type { AppPreviewData } from '@/lib/types/homepage'

/**
 * GET /api/content/app-preview
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_APP_PREVIEW)
    }

    const data = await getFirestoreDocument<AppPreviewData>(
      'content',
      'appPreview',
      DEFAULT_APP_PREVIEW
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/content/app-preview] Error:', error)
    return NextResponse.json(DEFAULT_APP_PREVIEW)
  }
}

/**
 * PUT /api/content/app-preview
 */
export async function PUT(req: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const data = await req.json() as AppPreviewData

    if (!data.headline || !data.subheadline || !data.features || !data.mockupImages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setFirestoreDocument('content', 'appPreview', updatedData)

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('[PUT /api/content/app-preview] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update app preview' },
      { status: 500 }
    )
  }
}
