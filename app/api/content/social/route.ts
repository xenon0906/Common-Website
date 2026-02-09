import { NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_SOCIAL } from '@/lib/content'

interface SocialLinks {
  facebook: string
  instagram: string
  linkedin: string
  twitter?: string
  youtube?: string
}

// GET - Fetch social links from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const social = await getFirestoreDocument<SocialLinks>(
        'content',
        'social',
        DEFAULT_SOCIAL as SocialLinks
      )
      return NextResponse.json(social)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_SOCIAL)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json(DEFAULT_SOCIAL, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}
