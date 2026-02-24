import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getAdminFirestore, getCollectionPath, isFirebaseConfigured } from '@/lib/firebase-server'

// PUT - Update a specific testimonial
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = checkRateLimit(req, 'testimonials', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { id } = await params
    const data = await req.json()

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('testimonials')
    const docRef = db.collection(collectionPath).doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    await docRef.set(data, { merge: true })

    const updated = await docRef.get()
    return NextResponse.json({ id: updated.id, ...updated.data() })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific testimonial
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = checkRateLimit(req, 'testimonials', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { id } = await params

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('testimonials')
    const docRef = db.collection(collectionPath).doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    await docRef.delete()

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
