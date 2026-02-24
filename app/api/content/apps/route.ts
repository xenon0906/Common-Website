import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_APP_LINKS } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'

interface AppStoreLinks {
  android: {
    url: string
    isLive: boolean
    qrCodeUrl: string
  }
  ios: {
    url: string
    isLive: boolean
    qrCodeUrl: string
  }
}

// GET - Fetch app store links from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const apps = await getFirestoreDocument<AppStoreLinks>(
        'content',
        'apps',
        DEFAULT_APP_LINKS as AppStoreLinks
      )
      return NextResponse.json(apps)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_APP_LINKS)
  } catch (error) {
    console.error('Error fetching app store links:', error)
    return NextResponse.json(DEFAULT_APP_LINKS, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// PUT - Update app store links in Firestore
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

    await db.collection(docPath).doc('apps').set(data, { merge: true })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating app store links:', error)
    return NextResponse.json(
      { error: 'Failed to update app store links' },
      { status: 500 }
    )
  }
}
