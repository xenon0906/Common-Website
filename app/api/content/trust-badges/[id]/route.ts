import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getFirestoreDocumentById,
  updateFirestoreDocument,
  deleteFirestoreDocument,
  isFirebaseConfigured,
} from '@/lib/firebase-server'
import type { TrustBadge } from '@/lib/types/homepage'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/content/trust-badges/[id]
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const badge = await getFirestoreDocumentById<TrustBadge>('trustBadges', id)

    if (!badge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(badge)
  } catch (error) {
    console.error(`[GET /api/content/trust-badges/[id]] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch badge' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/content/trust-badges/[id]
 */
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await context.params

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const updates = await req.json()

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await updateFirestoreDocument('trustBadges', id, updatedData)

    return NextResponse.json({
      success: true,
      data: { id, ...updatedData },
    })
  } catch (error) {
    console.error(`[PUT /api/content/trust-badges/[id]] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to update badge' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/content/trust-badges/[id]
 */
export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await context.params

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const updates = await req.json()

    const patchData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await updateFirestoreDocument('trustBadges', id, patchData)

    return NextResponse.json({
      success: true,
      data: { id, ...patchData },
    })
  } catch (error) {
    console.error(`[PATCH /api/content/trust-badges/[id]] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to patch badge' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/content/trust-badges/[id]
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await context.params

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    await deleteFirestoreDocument('trustBadges', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[DELETE /api/content/trust-badges/[id]] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to delete badge' },
      { status: 500 }
    )
  }
}
