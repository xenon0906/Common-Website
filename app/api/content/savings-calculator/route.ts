import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getFirestoreDocument, setFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_SAVINGS_CONFIG } from '@/lib/constants'
import type { SavingsCalculatorData } from '@/lib/types/homepage'

/**
 * GET /api/content/savings-calculator
 * Fetch savings calculator configuration
 */
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(DEFAULT_SAVINGS_CONFIG)
    }

    const data = await getFirestoreDocument<SavingsCalculatorData>(
      'content',
      'savingsCalculator',
      DEFAULT_SAVINGS_CONFIG
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/content/savings-calculator] Error:', error)
    return NextResponse.json(DEFAULT_SAVINGS_CONFIG)
  }
}

/**
 * PUT /api/content/savings-calculator
 * Update savings calculator configuration
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

    const data = await req.json() as SavingsCalculatorData

    // Basic validation
    if (!data.headline || !data.subheadline || !data.currencySymbol) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (
      typeof data.defaultFare !== 'number' ||
      typeof data.defaultRiders !== 'number' ||
      !Array.isArray(data.riderOptions)
    ) {
      return NextResponse.json(
        { error: 'Invalid numeric fields or riderOptions' },
        { status: 400 }
      )
    }

    // Add timestamp
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setFirestoreDocument('content', 'savingsCalculator', updatedData)

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('[PUT /api/content/savings-calculator] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update savings calculator config' },
      { status: 500 }
    )
  }
}
