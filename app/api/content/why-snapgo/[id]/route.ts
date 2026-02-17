import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getFirestoreDocumentById,
  updateFirestoreDocument,
  deleteFirestoreDocument,
  isFirebaseConfigured,
} from '@/lib/firebase-server'
import type { WhySnapgoReason } from '@/lib/types/homepage'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/content/why-snapgo/[id]
 * Fetch single Why Snapgo reason by ID
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

    const reason = await getFirestoreDocumentById<WhySnapgoReason>('whySnapgo', id)

    if (!reason) {
      return NextResponse.json(
        { error: 'Reason not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(reason)
  } catch (error) {
    console.error(`[GET /api/content/why-snapgo/${await (await context.params).id}] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch reason' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/content/why-snapgo/[id]
 * Update a Why Snapgo reason by ID
 * Requires authentication
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

    // Add timestamp
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await updateFirestoreDocument('whySnapgo', id, updatedData)

    return NextResponse.json({
      success: true,
      data: { id, ...updatedData },
    })
  } catch (error) {
    console.error(`[PUT /api/content/why-snapgo/${await (await context.params).id}] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to update reason' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/content/why-snapgo/[id]
 * Partial update (e.g., toggle isActive)
 * Requires authentication
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

    // Add timestamp
    const patchData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await updateFirestoreDocument('whySnapgo', id, patchData)

    return NextResponse.json({
      success: true,
      data: { id, ...patchData },
    })
  } catch (error) {
    console.error(`[PATCH /api/content/why-snapgo/${await (await context.params).id}] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to patch reason' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/content/why-snapgo/[id]
 * Delete a Why Snapgo reason by ID
 * Requires authentication
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

    await deleteFirestoreDocument('whySnapgo', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[DELETE /api/content/why-snapgo/${await (await context.params).id}] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to delete reason' },
      { status: 500 }
    )
  }
}
