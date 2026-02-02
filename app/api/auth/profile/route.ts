import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/firebase-admin'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    const decoded = await verifyIdToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      )
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', decoded.uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile: docSnap.data() })
  } catch (error) {
    console.error('[API] GET /api/auth/profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    const decoded = await verifyIdToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Only allow updating specific fields
    const allowedFields = ['displayName', 'phone', 'photoURL']
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    updates.updatedAt = new Date().toISOString()

    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      )
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', decoded.uid)

    const { setDoc } = await import('firebase/firestore')
    await setDoc(docRef, updates, { merge: true })

    // Fetch and return updated profile
    const updatedSnap = await getDoc(docRef)

    return NextResponse.json({ profile: updatedSnap.data() })
  } catch (error) {
    console.error('[API] PUT /api/auth/profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
