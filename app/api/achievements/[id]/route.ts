import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId, doc, getDoc } from '@/lib/firebase-server'

export function generateStaticParams() {
  return []
}

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'achievements', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching achievement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievement' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { setDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'achievements', id)

    const updateData = {
      type: body.type,
      title: body.title,
      content: body.content || null,
      mediaUrl: body.mediaUrl || null,
      embedCode: body.embedCode || null,
      metrics: body.metrics || null,
      updatedAt: new Date().toISOString(),
    }

    await setDoc(docRef, updateData, { merge: true })

    return NextResponse.json({ id, ...updateData })
  } catch (error) {
    console.error('Error updating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to update achievement' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { deleteDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'achievements', id)

    await deleteDoc(docRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    )
  }
}
