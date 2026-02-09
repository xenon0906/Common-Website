import { NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_HERO, HeroContentData } from '@/lib/content'

// GET - Fetch hero content from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const hero = await getFirestoreDocument<HeroContentData>(
        'content',
        'hero',
        DEFAULT_HERO
      )
      return NextResponse.json(hero)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_HERO)
  } catch (error) {
    console.error('Error fetching hero content:', error)
    return NextResponse.json(DEFAULT_HERO, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}
