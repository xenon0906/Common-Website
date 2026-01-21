import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getAnalyticsOverview,
  getDailyVisitors,
  getTopPages,
  getTrafficSources,
} from '@/lib/ga-server'

// Removed 'force-dynamic' for static export compatibility

export async function GET() {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    // Fetch all analytics data in parallel
    const [overview, dailyVisitors, topPages, trafficSources] = await Promise.all([
      getAnalyticsOverview(),
      getDailyVisitors(7),
      getTopPages(5),
      getTrafficSources(),
    ])

    return NextResponse.json({
      overview,
      dailyVisitors,
      topPages,
      trafficSources,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
