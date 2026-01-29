import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  getAnalyticsOverview,
  getDailyVisitors,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getGeographicData,
} from '@/lib/ga-server'

export async function GET() {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    // Fetch all analytics data in parallel
    const [overview, dailyVisitors, topPages, trafficSources, deviceBreakdown, geoData] = await Promise.all([
      getAnalyticsOverview(),
      getDailyVisitors(7),
      getTopPages(5),
      getTrafficSources(),
      getDeviceBreakdown(),
      getGeographicData(5),
    ])

    return NextResponse.json({
      overview,
      dailyVisitors,
      topPages,
      trafficSources,
      deviceBreakdown,
      geoData,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
