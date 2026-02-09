import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'
import { createAchievementSchema, validateBody } from '@/lib/validations'

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
  const rateLimited = checkRateLimit(request, 'achievements', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const validation = validateBody(createAchievementSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const validated = validation.data

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
      type: validated.type,
      title: validated.title,
      content: validated.content || null,
      mediaUrl: validated.mediaUrl || null,
      embedCode: validated.embedCode || null,
      metrics: validated.metrics || null,
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
