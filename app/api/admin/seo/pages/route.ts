import { NextRequest, NextResponse } from 'next/server'
import { getServerDb, getServerAppId, doc, getDoc, collection, getDocs, query, orderBy } from '@/lib/firebase-server'
import { setDoc, deleteDoc } from 'firebase/firestore'
import { PageSEO, DEFAULT_PAGES_SEO, calculateSEOScore } from '@/lib/types/seo'
import { requireAuth } from '@/lib/api-auth'

// GET /api/admin/seo/pages - Get all page SEO settings
export async function GET() {
  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(DEFAULT_PAGES_SEO.map(p => ({ ...p, id: p.pageSlug })))
    }

    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'seo', 'pages')
    const q = query(collRef, orderBy('pageName'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return NextResponse.json(DEFAULT_PAGES_SEO.map(p => ({ ...p, id: p.pageSlug })))
    }

    const pages = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as PageSEO[]

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page SEO settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/seo/pages - Create or update page SEO
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

    const data = await request.json() as Partial<PageSEO> & { pageSlug: string }

    if (!data.pageSlug) {
      return NextResponse.json(
        { error: 'pageSlug is required' },
        { status: 400 }
      )
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'seo', 'pages', data.pageSlug)

    // Calculate score
    const analysis = calculateSEOScore(data)

    const updatedData = {
      ...data,
      score: analysis.score,
      issues: analysis.issues,
      updatedAt: new Date(),
    }

    // Check if document exists
    const existingDoc = await getDoc(docRef)
    if (!existingDoc.exists()) {
      updatedData.createdAt = new Date()
    }

    await setDoc(docRef, updatedData, { merge: true })

    return NextResponse.json({ success: true, data: { id: data.pageSlug, ...updatedData } })
  } catch (error) {
    console.error('Error saving page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to save page SEO settings' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/seo/pages?slug=xxx - Delete page SEO
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'slug parameter is required' },
        { status: 400 }
      )
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'seo', 'pages', slug)

    await deleteDoc(docRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to delete page SEO settings' },
      { status: 500 }
    )
  }
}
