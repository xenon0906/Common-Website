import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getServerDb,
  getServerAppId,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from '@/lib/firebase-server'

function getInstagramCollectionPath() {
  const appId = getServerAppId()
  return `artifacts/${appId}/public/data/instagram`
}

// GET all Instagram reels
export async function GET() {
  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 })
    }

    const collRef = collection(db, getInstagramCollectionPath())
    const q = query(collRef, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    const reels = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }))

    return NextResponse.json(reels)
  } catch (error) {
    console.error('Error fetching reels:', error)
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 })
  }
}

// POST create new reel
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { reelId, title, description, visible, order } = body

    const { addDoc } = await import('firebase/firestore')
    const collRef = collection(db, getInstagramCollectionPath())

    const newReel = {
      reelId: reelId || '',
      title: title || 'New Reel',
      description: description || '',
      visible: visible ?? true,
      order: order || 0,
      createdAt: new Date(),
    }

    const docRef = await addDoc(collRef, newReel)

    return NextResponse.json({ id: docRef.id, ...newReel }, { status: 201 })
  } catch (error) {
    console.error('Error creating reel:', error)
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 })
  }
}

// PUT update reels
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { reels } = body

    const { setDoc } = await import('firebase/firestore')

    for (const reel of reels) {
      if (!reel.id) continue
      const docRef = doc(db, getInstagramCollectionPath(), reel.id)
      const { id, ...reelData } = reel
      await setDoc(docRef, {
        reelId: reelData.reelId || '',
        title: reelData.title || '',
        description: reelData.description || '',
        visible: reelData.visible ?? true,
        order: reelData.order || 0,
        updatedAt: new Date(),
      }, { merge: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating reels:', error)
    return NextResponse.json({ error: 'Failed to update reels' }, { status: 500 })
  }
}

// DELETE reel
export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Reel ID required' }, { status: 400 })
    }

    const { deleteDoc } = await import('firebase/firestore')
    const docRef = doc(db, getInstagramCollectionPath(), id)
    await deleteDoc(docRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reel:', error)
    return NextResponse.json({ error: 'Failed to delete reel' }, { status: 500 })
  }
}
