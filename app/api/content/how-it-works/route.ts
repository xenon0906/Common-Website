import { NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_STEPS, HowItWorksStepData } from '@/lib/content'

// GET - Fetch how it works steps from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const steps = await getFirestoreCollection<HowItWorksStepData>(
        'content/howItWorks',
        DEFAULT_STEPS,
        'order'
      )

      // Filter active items
      const activeSteps = steps.filter(s => s.isActive !== false)
      return NextResponse.json(activeSteps)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_STEPS)
  } catch (error) {
    console.error('Error fetching how it works steps:', error)
    return NextResponse.json(DEFAULT_STEPS, { status: 200 })
  }
}
