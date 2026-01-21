import { NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_APP_LINKS } from '@/lib/content'

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
    return NextResponse.json(DEFAULT_APP_LINKS, { status: 200 })
  }
}
