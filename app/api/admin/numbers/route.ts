import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getAdminDb, getAdminCollectionPath } from '@/lib/firebase-admin'
import { getFirestoreCollection } from '@/lib/firebase-server'
import { STATS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// Default stats matching the StatisticData interface from lib/content.ts
const DEFAULT_STATS_DATA = STATS.map((s, i) => ({
  id: `stat-${i}`,
  label: s.label,
  value: s.value,
  prefix: s.prefix || '',
  suffix: s.suffix || '',
  icon: null as string | null,
  order: i,
  isActive: true,
}))

export async function GET() {
  try {
    // Try Admin SDK first
    const adminDb = getAdminDb()
    if (adminDb) {
      const statsPath = getAdminCollectionPath('stats')
      const snapshot = await adminDb.collection(statsPath).orderBy('order').get()

      if (!snapshot.empty) {
        const stats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        return NextResponse.json(stats)
      }
    }

    // Fallback: client SDK
    const stats = await getFirestoreCollection('stats', DEFAULT_STATS_DATA, 'order')
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(DEFAULT_STATS_DATA)
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 'admin-numbers', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    const stats: Array<{
      id?: string
      label: string
      value: number
      prefix: string
      suffix: string
      icon: string | null
      order: number
      isActive: boolean
    }> = await request.json()

    if (!Array.isArray(stats) || stats.length === 0) {
      return NextResponse.json({ error: 'Stats must be a non-empty array' }, { status: 400 })
    }

    const adminDb = getAdminDb()
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin SDK not configured. Cannot save stats.' },
        { status: 503 }
      )
    }

    const admin = await import('firebase-admin')
    const adminModule = (admin as any).default || admin
    const statsPath = getAdminCollectionPath('stats')
    const batch = adminDb.batch()

    // Delete existing stats
    const existing = await adminDb.collection(statsPath).get()
    existing.docs.forEach(doc => batch.delete(doc.ref))

    // Write new stats
    for (const stat of stats) {
      const docRef = stat.id
        ? adminDb.doc(`${statsPath}/${stat.id}`)
        : adminDb.collection(statsPath).doc()

      batch.set(docRef, {
        label: stat.label,
        value: stat.value,
        prefix: stat.prefix || '',
        suffix: stat.suffix || '',
        icon: stat.icon || null,
        order: stat.order,
        isActive: stat.isActive !== false,
        updatedAt: adminModule.firestore.FieldValue.serverTimestamp(),
      })
    }

    await batch.commit()
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving stats:', error)
    return NextResponse.json(
      { error: 'Failed to save stats' },
      { status: 500 }
    )
  }
}
