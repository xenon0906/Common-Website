'use server'

import { BetaAnalyticsDataClient } from '@google-analytics/data'

// Initialize GA4 client with service account credentials
function getAnalyticsClient(): BetaAnalyticsDataClient | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !privateKey) {
    console.warn('Google Analytics credentials not configured')
    return null
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
  })
}

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

export interface AnalyticsData {
  totalVisitors: number
  totalPageViews: number
  avgSessionDuration: number
  bounceRate: number
  visitorChange: number
  pageViewChange: number
  durationChange: number
  bounceChange: number
  isError?: boolean
  errorMessage?: string
}

export interface DailyVisitors {
  date: string
  visitors: number
  pageViews: number
}

export interface TopPage {
  path: string
  title: string
  views: number
  percentage: number
}

export interface TrafficSource {
  source: string
  visitors: number
  percentage: number
}

export interface DeviceData {
  name: string
  value: number
  color: string
}

export interface GeoData {
  city: string
  visitors: number
  percentage: number
}

export async function getAnalyticsOverview(): Promise<AnalyticsData> {
  const client = getAnalyticsClient()

  if (!client || !propertyId) {
    return getMockAnalyticsData()
  }

  try {
    // Current period (last 30 days)
    const [currentResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    })

    // Previous period (60-30 days ago) for comparison
    const [previousResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '60daysAgo', endDate: '31daysAgo' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    })

    const current = currentResponse.rows?.[0]?.metricValues || []
    const previous = previousResponse.rows?.[0]?.metricValues || []

    const totalVisitors = parseInt(current[0]?.value || '0')
    const totalPageViews = parseInt(current[1]?.value || '0')
    const avgSessionDuration = parseFloat(current[2]?.value || '0')
    const bounceRate = parseFloat(current[3]?.value || '0') * 100

    const prevVisitors = parseInt(previous[0]?.value || '0')
    const prevPageViews = parseInt(previous[1]?.value || '0')
    const prevDuration = parseFloat(previous[2]?.value || '0')
    const prevBounce = parseFloat(previous[3]?.value || '0') * 100

    return {
      totalVisitors,
      totalPageViews,
      avgSessionDuration: Math.round(avgSessionDuration),
      bounceRate: Math.round(bounceRate * 10) / 10,
      visitorChange: calculateChange(totalVisitors, prevVisitors),
      pageViewChange: calculateChange(totalPageViews, prevPageViews),
      durationChange: calculateChange(avgSessionDuration, prevDuration),
      bounceChange: calculateChange(bounceRate, prevBounce),
    }
  } catch (error) {
    console.error('Error fetching analytics overview:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return {
      ...getMockAnalyticsData(),
      isError: true,
      errorMessage: `Failed to fetch analytics: ${errorMsg}`,
    }
  }
}

export async function getDailyVisitors(days: number = 7): Promise<DailyVisitors[]> {
  const client = getAnalyticsClient()

  if (!client || !propertyId) {
    return getMockDailyVisitors(days)
  }

  try {
    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    })

    return (response.rows || []).map(row => ({
      date: formatDate(row.dimensionValues?.[0]?.value || ''),
      visitors: parseInt(row.metricValues?.[0]?.value || '0'),
      pageViews: parseInt(row.metricValues?.[1]?.value || '0'),
    }))
  } catch (error) {
    console.error('Error fetching daily visitors:', error)
    return getMockDailyVisitors(days)
  }
}

export async function getTopPages(limit: number = 5): Promise<TopPage[]> {
  const client = getAnalyticsClient()

  if (!client || !propertyId) {
    return getMockTopPages()
  }

  try {
    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit,
    })

    const totalViews = (response.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    )

    return (response.rows || []).map(row => {
      const views = parseInt(row.metricValues?.[0]?.value || '0')
      return {
        path: row.dimensionValues?.[0]?.value || '/',
        title: row.dimensionValues?.[1]?.value || 'Unknown',
        views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
      }
    })
  } catch (error) {
    console.error('Error fetching top pages:', error)
    return getMockTopPages()
  }
}

export async function getTrafficSources(): Promise<TrafficSource[]> {
  const client = getAnalyticsClient()

  if (!client || !propertyId) {
    return getMockTrafficSources()
  }

  try {
    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 5,
    })

    const totalUsers = (response.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    )

    return (response.rows || []).map(row => {
      const visitors = parseInt(row.metricValues?.[0]?.value || '0')
      return {
        source: row.dimensionValues?.[0]?.value || 'Unknown',
        visitors,
        percentage: totalUsers > 0 ? Math.round((visitors / totalUsers) * 100) : 0,
      }
    })
  } catch (error) {
    console.error('Error fetching traffic sources:', error)
    return getMockTrafficSources()
  }
}

// Device colors mapping
const DEVICE_COLORS: Record<string, string> = {
  mobile: '#0066B3',
  desktop: '#0d9488',
  tablet: '#7c3aed',
  other: '#6b7280',
}

export async function getDeviceBreakdown(): Promise<DeviceData[]> {
  const client = getAnalyticsClient()

  if (!client || !propertyId) {
    return []
  }

  try {
    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
    })

    const totalUsers = (response.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    )

    return (response.rows || []).map(row => {
      const name = row.dimensionValues?.[0]?.value || 'Unknown'
      const users = parseInt(row.metricValues?.[0]?.value || '0')
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0,
        color: DEVICE_COLORS[name.toLowerCase()] || DEVICE_COLORS.other,
      }
    })
  } catch (error) {
    console.error('Error fetching device breakdown:', error)
    return []
  }
}

export async function getGeographicData(limit: number = 5): Promise<GeoData[]> {
  const client = getAnalyticsClient()

  if (!client || !propertyId) {
    return []
  }

  try {
    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit,
    })

    const totalUsers = (response.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    )

    return (response.rows || [])
      .filter(row => row.dimensionValues?.[0]?.value !== '(not set)')
      .map(row => {
        const visitors = parseInt(row.metricValues?.[0]?.value || '0')
        return {
          city: row.dimensionValues?.[0]?.value || 'Unknown',
          visitors,
          percentage: totalUsers > 0 ? Math.round((visitors / totalUsers) * 100) : 0,
        }
      })
  } catch (error) {
    console.error('Error fetching geographic data:', error)
    return []
  }
}

// Helper functions
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  return `${month}/${day}`
}

// Placeholder data for when GA4 is not configured - returns zeros to indicate no real data
function getMockAnalyticsData(): AnalyticsData {
  return {
    totalVisitors: 0,
    totalPageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    visitorChange: 0,
    pageViewChange: 0,
    durationChange: 0,
    bounceChange: 0,
  }
}

function getMockDailyVisitors(days: number): DailyVisitors[] {
  return []
}

function getMockTopPages(): TopPage[] {
  return []
}

function getMockTrafficSources(): TrafficSource[] {
  return []
}
