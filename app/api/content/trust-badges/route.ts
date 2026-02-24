import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getFirestoreCollection,
  addFirestoreDocument,
  updateFirestoreDocument,
  isFirebaseConfigured,
} from '@/lib/firebase-server'
import { DEFAULT_TRUST_BADGES } from '@/lib/constants'
import type { TrustBadge } from '@/lib/types/homepage'

/**
 * GET /api/content/trust-badges
 * Fetch all trust badges
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_TRUST_BADGES)
    }

    const badges = await getFirestoreCollection<TrustBadge>(
      'trustBadges',
      DEFAULT_TRUST_BADGES,
      'order'
    )

    return NextResponse.json(badges)
  } catch (error) {
    console.error('[GET /api/content/trust-badges] Error:', error)
    return NextResponse.json(DEFAULT_TRUST_BADGES)
  }
}

/**
 * POST /api/content/trust-badges
 * Create a new trust badge
 * Requires authentication
 */
export async function POST(req: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const data = await req.json() as Omit<TrustBadge, 'id' | 'updatedAt'>

    // Basic validation
    if (!data.iconName || !data.title || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields: iconName, title, description' },
        { status: 400 }
      )
    }

    const newBadge: Omit<TrustBadge, 'id'> = {
      ...data,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      updatedAt: new Date().toISOString(),
    }

    const docId = await addFirestoreDocument('trustBadges', newBadge)

    return NextResponse.json({
      success: true,
      data: { ...newBadge, id: docId },
    })
  } catch (error) {
    console.error('[POST /api/content/trust-badges] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create badge' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/content/trust-badges (batch update for reordering)
 * Update multiple badges at once
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

    const { badges } = await req.json() as { badges: TrustBadge[] }

    if (!Array.isArray(badges)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    await Promise.all(
      badges.map((badge) =>
        updateFirestoreDocument('trustBadges', badge.id, {
          order: badge.order,
          updatedAt: new Date().toISOString(),
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PUT /api/content/trust-badges] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update badges' },
      { status: 500 }
    )
  }
}
