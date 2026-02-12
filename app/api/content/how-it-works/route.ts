import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_STEPS, HowItWorksStepData } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'

// GET - Fetch how it works steps from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const steps = await getFirestoreCollection<HowItWorksStepData>(
        'howItWorks',
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
    return NextResponse.json(DEFAULT_STEPS, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// POST - Create a new how it works step in Firestore
export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req, 'how-it-works', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
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
    const { title, description, icon, order } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('howItWorks')
    const collRef = db.collection(collectionPath)

    // Get the highest order number if not provided
    let stepOrder = order
    if (stepOrder === undefined) {
      const snapshot = await collRef.orderBy('order', 'desc').limit(1).get()
      if (!snapshot.empty) {
        const lastStep = snapshot.docs[0].data()
        stepOrder = (lastStep.order || 0) + 1
      } else {
        stepOrder = 1
      }
    }

    const newStepData: Omit<HowItWorksStepData, 'id'> = {
      step: stepOrder,
      title,
      description,
      icon: icon || 'CircleDot',
      order: stepOrder,
      isActive: true,
    }

    const docRef = await collRef.add(newStepData)

    const step: HowItWorksStepData = {
      id: docRef.id,
      ...newStepData,
    }

    return NextResponse.json(step, { status: 201 })
  } catch (error) {
    console.error('Error creating how it works step:', error)
    return NextResponse.json(
      { error: 'Failed to create how it works step' },
      { status: 500 }
    )
  }
}
