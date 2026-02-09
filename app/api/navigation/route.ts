import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'
import { createNavigationSchema, bulkUpdateNavigationSchema, validateBody } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    const { collection, getDocs, query, orderBy, where } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'navigation')

    let q
    if (location) {
      q = query(collRef, where('location', '==', location), orderBy('order', 'asc'))
    } else {
      q = query(collRef, orderBy('order', 'asc'))
    }

    const snapshot = await getDocs(q)
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, 'navigation', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
    if (rateLimited) return rateLimited

    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const validation = validateBody(createNavigationSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const { label, href, icon, location, section, visible, external, order } = validation.data

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'navigation')

    const itemData = {
      label,
      href,
      icon,
      location: location || 'header',
      section,
      visible: visible ?? true,
      external: external ?? false,
      order: order || 0,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collRef, itemData)

    return NextResponse.json({ id: docRef.id, ...itemData }, { status: 201 })
  } catch (error) {
    console.error('Error creating navigation item:', error)
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { items } = body

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { collection, getDocs, query, where, writeBatch, doc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'navigation')

    const locationValue = items[0]?.location || 'header'

    // Use writeBatch for atomic delete + recreate
    const batch = writeBatch(db)

    // Delete existing items for this location
    const existingQuery = query(collRef, where('location', '==', locationValue))
    const existingSnapshot = await getDocs(existingQuery)
    existingSnapshot.docs.forEach(docSnap => {
      batch.delete(docSnap.ref)
    })

    // Create new items
    items.forEach((item: any, index: number) => {
      const newDocRef = doc(collRef)
      batch.set(newDocRef, {
        label: item.label,
        href: item.href,
        icon: item.icon,
        location: item.location || 'header',
        section: item.section,
        visible: item.visible ?? true,
        external: item.external ?? false,
        order: index,
      })
    })

    await batch.commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating navigation:', error)
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { doc, deleteDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'navigation', id)

    await deleteDoc(docRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting navigation item:', error)
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 })
  }
}
