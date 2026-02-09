import { NextResponse } from 'next/server'
import { isFirebaseConfigured } from '@/lib/firebase-server'
import { getSafetyContent, DEFAULT_SAFETY } from '@/lib/content'

// GET - Fetch safety page content from Firestore or return defaults
export async function GET() {
  try {
    if (isFirebaseConfigured()) {
      const safety = await getSafetyContent()
      return NextResponse.json(safety)
    }

    return NextResponse.json(DEFAULT_SAFETY)
  } catch (error) {
    console.error('Error fetching safety content:', error)
    return NextResponse.json(DEFAULT_SAFETY, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}
