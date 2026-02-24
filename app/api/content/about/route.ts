import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_ABOUT } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'

interface AboutContent {
  origin: string
  spark: string
  mission: string
  vision: string
  values: string
}

const DEFAULT_ABOUT_DOC: AboutContent = {
  origin: DEFAULT_ABOUT.origin.content,
  spark: DEFAULT_ABOUT.spark.content,
  mission: DEFAULT_ABOUT.mission.content,
  vision: DEFAULT_ABOUT.vision.content,
  values: DEFAULT_ABOUT.values.content,
}

// GET - Fetch about content from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const about = await getFirestoreDocument<AboutContent>(
        'content',
        'about',
        DEFAULT_ABOUT_DOC
      )

      // Convert to the expected format
      const result = {
        origin: { id: 'origin', key: 'origin', title: 'Our Origin', content: about.origin, order: 1 },
        spark: { id: 'spark', key: 'spark', title: 'The Spark', content: about.spark, order: 2 },
        mission: { id: 'mission', key: 'mission', title: 'Our Mission', content: about.mission, order: 3 },
        vision: { id: 'vision', key: 'vision', title: 'Our Vision', content: about.vision, order: 4 },
        values: { id: 'values', key: 'values', title: 'Our Values', content: about.values, order: 5 },
      }

      return NextResponse.json(result)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_ABOUT)
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(DEFAULT_ABOUT, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// PUT - Update about content in Firestore
export async function PUT(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const data = await req.json()
    const db = getAdminFirestore()
    const docPath = getCollectionPath('content')

    await db.collection(docPath).doc('about').set(data, { merge: true })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}
