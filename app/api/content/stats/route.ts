import { NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_STATS, StatisticData } from '@/lib/content'

// GET - Fetch statistics from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const stats = await getFirestoreCollection<StatisticData>(
        'content/stats',
        DEFAULT_STATS,
        'order'
      )

      // Filter active items
      const activeStats = stats.filter(stat => stat.isActive !== false)
      return NextResponse.json(activeStats)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_STATS)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(DEFAULT_STATS, { status: 200 })
  }
}
