import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getFirestoreCollection,
  addFirestoreDocument,
  isFirebaseConfigured,
  getAdminFirestore
} from '@/lib/firebase-server'
import { DEFAULT_CTA_SECTIONS } from '@/lib/constants'
import type { CTASectionData } from '@/lib/types/homepage'

/**
 * GET /api/content/cta-sections
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_CTA_SECTIONS)
    }

    const sections = await getFirestoreCollection<CTASectionData>(
      'ctaSections',
      DEFAULT_CTA_SECTIONS,
      'order'
    )

    return NextResponse.json(sections)
  } catch (error) {
    console.error('[GET /api/content/cta-sections] Error:', error)
    return NextResponse.json(DEFAULT_CTA_SECTIONS)
  }
}

/**
 * POST /api/content/cta-sections
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

    const data = await req.json() as Omit<CTASectionData, 'id' | 'updatedAt'>

    if (!data.quote || !data.buttonText || !data.buttonLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newSection: Omit<CTASectionData, 'id'> = {
      ...data,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      backgroundStyle: data.backgroundStyle || 'gradient',
      updatedAt: new Date().toISOString(),
    }

    const docId = await addFirestoreDocument('ctaSections', newSection)

    return NextResponse.json({
      success: true,
      data: { ...newSection, id: docId },
    })
  } catch (error) {
    console.error('[POST /api/content/cta-sections] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create CTA section' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/content/cta-sections (batch update)
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

    const { sections } = await req.json() as { sections: CTASectionData[] }

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const batch = db.batch()

    sections.forEach((section) => {
      const docRef = db.collection('artifacts')
        .doc(process.env.NEXT_PUBLIC_APP_ID || 'default')
        .collection('public')
        .doc('data')
        .collection('ctaSections')
        .doc(section.id)

      batch.update(docRef, {
        order: section.order,
        updatedAt: new Date().toISOString(),
      })
    })

    await batch.commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PUT /api/content/cta-sections] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update sections' },
      { status: 500 }
    )
  }
}
