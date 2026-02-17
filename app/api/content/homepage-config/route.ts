import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getFirestoreDocument, setFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_HOMEPAGE_CONFIG } from '@/lib/constants'
import type { HomepageConfig } from '@/lib/types/homepage'

/**
 * GET /api/content/homepage-config
 * Fetch homepage section configuration (visibility & order)
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_HOMEPAGE_CONFIG)
    }

    const data = await getFirestoreDocument<HomepageConfig>(
      'content',
      'homepageConfig',
      DEFAULT_HOMEPAGE_CONFIG
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/content/homepage-config] Error:', error)
    return NextResponse.json(DEFAULT_HOMEPAGE_CONFIG)
  }
}

/**
 * PUT /api/content/homepage-config
 * Update homepage section configuration
 * Used for section visibility toggles and drag & drop reordering
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

    const data = await req.json() as HomepageConfig

    // Validate sections array
    if (!data.sections || !Array.isArray(data.sections)) {
      return NextResponse.json(
        { error: 'Invalid sections data' },
        { status: 400 }
      )
    }

    // Validate each section has required fields
    for (const section of data.sections) {
      if (!section.componentName || typeof section.visible !== 'boolean' || typeof section.order !== 'number') {
        return NextResponse.json(
          { error: 'Invalid section structure' },
          { status: 400 }
        )
      }
    }

    // Add timestamp
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setFirestoreDocument('content', 'homepageConfig', updatedData)

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('[PUT /api/content/homepage-config] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update homepage config' },
      { status: 500 }
    )
  }
}
