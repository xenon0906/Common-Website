import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getFirestoreCollection,
  addFirestoreDocument,
  isFirebaseConfigured,
  getAdminFirestore
} from '@/lib/firebase-server'
import { DEFAULT_WHY_SNAPGO } from '@/lib/constants'
import type { WhySnapgoReason } from '@/lib/types/homepage'

/**
 * GET /api/content/why-snapgo
 * Fetch all Why Snapgo reasons
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_WHY_SNAPGO)
    }

    const reasons = await getFirestoreCollection<WhySnapgoReason>(
      'whySnapgo',
      DEFAULT_WHY_SNAPGO,
      'order'
    )

    // Filter active reasons for public API (admin can see all)
    return NextResponse.json(reasons)
  } catch (error) {
    console.error('[GET /api/content/why-snapgo] Error:', error)
    return NextResponse.json(DEFAULT_WHY_SNAPGO)
  }
}

/**
 * POST /api/content/why-snapgo
 * Create a new Why Snapgo reason
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

    const data = await req.json() as Omit<WhySnapgoReason, 'id' | 'updatedAt'>

    // Basic validation
    if (!data.iconName || !data.title || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields: iconName, title, description' },
        { status: 400 }
      )
    }

    // Add timestamps
    const newReason: Omit<WhySnapgoReason, 'id'> = {
      ...data,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      updatedAt: new Date().toISOString(),
    }

    const docId = await addFirestoreDocument('whySnapgo', newReason)

    return NextResponse.json({
      success: true,
      data: { ...newReason, id: docId },
    })
  } catch (error) {
    console.error('[POST /api/content/why-snapgo] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create reason' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/content/why-snapgo (batch update for reordering)
 * Update multiple reasons at once (used for drag & drop reordering)
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

    const { reasons } = await req.json() as { reasons: WhySnapgoReason[] }

    if (!Array.isArray(reasons)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    // Batch update using Firestore batch
    const db = getAdminFirestore()
    const batch = db.batch()

    reasons.forEach((reason) => {
      const docRef = db.collection('artifacts')
        .doc(process.env.NEXT_PUBLIC_APP_ID || 'default')
        .collection('public')
        .doc('data')
        .collection('whySnapgo')
        .doc(reason.id)

      batch.update(docRef, {
        order: reason.order,
        updatedAt: new Date().toISOString(),
      })
    })

    await batch.commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PUT /api/content/why-snapgo] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update reasons' },
      { status: 500 }
    )
  }
}
