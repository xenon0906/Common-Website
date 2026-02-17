import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getFirestoreDocument, setFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_CO2_CONFIG } from '@/lib/constants'
import type { CO2ImpactData } from '@/lib/types/homepage'

/**
 * GET /api/content/environment
 * Fetch CO2 impact tracker configuration
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_CO2_CONFIG)
    }

    const data = await getFirestoreDocument<CO2ImpactData>(
      'content',
      'environmentImpact',
      DEFAULT_CO2_CONFIG
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/content/environment] Error:', error)
    return NextResponse.json(DEFAULT_CO2_CONFIG)
  }
}

/**
 * PUT /api/content/environment
 * Update CO2 impact tracker configuration
 * Requires authentication
 */
export async function PUT(req: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const data = await req.json() as CO2ImpactData

    // Basic validation
    if (!data.headline || !data.subheadline || !data.metricsLabels) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (
      typeof data.defaultRides !== 'number' ||
      typeof data.co2PerRide !== 'number' ||
      typeof data.treesEquivalent !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid numeric fields' },
        { status: 400 }
      )
    }

    // Add timestamp
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setFirestoreDocument('content', 'environmentImpact', updatedData)

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('[PUT /api/content/environment] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update CO2 config' },
      { status: 500 }
    )
  }
}
