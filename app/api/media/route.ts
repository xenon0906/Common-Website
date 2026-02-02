import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'

export async function GET(request: NextRequest) {
  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const { collection, getDocs, query, orderBy, where } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'media')

    let q
    if (category && category !== 'all') {
      q = query(collRef, where('category', '==', category), orderBy('uploadedAt', 'desc'))
    } else {
      q = query(collRef, orderBy('uploadedAt', 'desc'))
    }

    const snapshot = await getDocs(q)
    const files = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { filename, url, category, mimeType, size, alt } = body

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'media')

    const fileData = {
      filename,
      url,
      category: category || 'general',
      mimeType,
      size: size || 0,
      alt,
      uploadedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collRef, fileData)

    return NextResponse.json({ id: docRef.id, ...fileData }, { status: 201 })
  } catch (error) {
    console.error('Error registering media:', error)
    return NextResponse.json({ error: 'Failed to register media' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { doc, getDoc, deleteDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'media', id)

    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    await deleteDoc(docRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
