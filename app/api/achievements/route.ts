import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'

export async function GET() {
  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json([])
    }

    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'achievements')
    const q = query(collRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    const achievements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'achievements')

    const achievementData = {
      type: body.type,
      title: body.title,
      content: body.content || null,
      mediaUrl: body.mediaUrl || null,
      embedCode: body.embedCode || null,
      metrics: body.metrics || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collRef, achievementData)

    return NextResponse.json({ id: docRef.id, ...achievementData }, { status: 201 })
  } catch (error) {
    console.error('Error creating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    )
  }
}
