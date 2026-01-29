import { NextRequest, NextResponse } from 'next/server'
import { getServerDb, getServerAppId, doc, getDoc } from '@/lib/firebase-server'
import { setDoc } from 'firebase/firestore'
import { GlobalSEO, DEFAULT_GLOBAL_SEO } from '@/lib/types/seo'
import { requireAuth } from '@/lib/api-auth'

// GET /api/admin/seo - Get global SEO settings
export async function GET() {
  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(DEFAULT_GLOBAL_SEO)
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'seo', 'config')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return NextResponse.json({ ...DEFAULT_GLOBAL_SEO, ...docSnap.data() })
    }

    return NextResponse.json(DEFAULT_GLOBAL_SEO)
  } catch (error) {
    console.error('Error fetching global SEO:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/seo - Update global SEO settings
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const data = await request.json() as Partial<GlobalSEO>
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'seo', 'config')

    const updatedData = {
      ...DEFAULT_GLOBAL_SEO,
      ...data,
      updatedAt: new Date(),
    }

    await setDoc(docRef, updatedData)

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('Error saving global SEO:', error)
    return NextResponse.json(
      { error: 'Failed to save SEO settings' },
      { status: 500 }
    )
  }
}
