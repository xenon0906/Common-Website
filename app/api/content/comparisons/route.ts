import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getFirestoreDocument, setFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_COMPARISON } from '@/lib/constants'
import type { CabPoolingComparisonData } from '@/lib/types/homepage'

/**
 * GET /api/content/comparisons
 * Fetch cab pooling comparison data
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_COMPARISON)
    }

    const data = await getFirestoreDocument<CabPoolingComparisonData>(
      'content',
      'comparisons',
      DEFAULT_COMPARISON
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/content/comparisons] Error:', error)
    return NextResponse.json(DEFAULT_COMPARISON)
  }
}

/**
 * PUT /api/content/comparisons
 * Update cab pooling comparison data
 * Requires authentication
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

    const data = await req.json() as CabPoolingComparisonData

    // Basic validation
    if (!data.carpooling || !data.cabPooling || !data.benefits || !data.tagline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add timestamp
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setFirestoreDocument('content', 'comparisons', updatedData)

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('[PUT /api/content/comparisons] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update comparison data' },
      { status: 500 }
    )
  }
}
