import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_STATS, StatisticData } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'

// GET - Fetch statistics from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const stats = await getFirestoreCollection<StatisticData>(
        'stats',
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
    return NextResponse.json(DEFAULT_STATS, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// POST - Create a new statistic in Firestore
export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req, 'stats', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { value, label, prefix, suffix, icon, order } = body

    if (!value || !label) {
      return NextResponse.json(
        { error: 'Value and label are required' },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('stats')
    const collRef = db.collection(collectionPath)

    // Get the highest order number if not provided
    let statOrder = order
    if (statOrder === undefined) {
      const snapshot = await collRef.orderBy('order', 'desc').limit(1).get()
      if (!snapshot.empty) {
        const lastStat = snapshot.docs[0].data()
        statOrder = (lastStat.order || 0) + 1
      } else {
        statOrder = 1
      }
    }

    const newStatData: Omit<StatisticData, 'id'> = {
      value,
      label,
      prefix: prefix || '',
      suffix: suffix || '',
      icon: icon || 'Users',
      order: statOrder,
      isActive: true,
    }

    const docRef = await collRef.add(newStatData)

    const stat: StatisticData = {
      id: docRef.id,
      ...newStatData,
    }

    return NextResponse.json(stat, { status: 201 })
  } catch (error) {
    console.error('Error creating statistic:', error)
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    )
  }
}
