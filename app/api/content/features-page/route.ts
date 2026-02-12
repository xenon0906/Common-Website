import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'

interface FeaturesPageItem {
  id: string
  title: string
  description: string
  icon?: string
  order: number
  isActive: boolean
  category?: string
  imageUrl?: string
}

const DEFAULT_FEATURES_PAGE: FeaturesPageItem[] = []

// GET - Fetch features page items from Firestore or return defaults
export async function GET() {
  try {
    if (isFirebaseConfigured()) {
      const items = await getFirestoreCollection<FeaturesPageItem>(
        'featuresPage',
        DEFAULT_FEATURES_PAGE,
        'order'
      )

      const activeItems = items.filter(item => item.isActive !== false)
      return NextResponse.json(activeItems)
    }

    return NextResponse.json(DEFAULT_FEATURES_PAGE)
  } catch (error) {
    console.error('Error fetching features page items:', error)
    return NextResponse.json(DEFAULT_FEATURES_PAGE, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// POST - Create a new features page item in Firestore
export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req, 'features-page', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
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
    const { title, description, icon, order, category, imageUrl } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('featuresPage')
    const collRef = db.collection(collectionPath)

    // Get the highest order number if not provided
    let itemOrder = order
    if (itemOrder === undefined) {
      const snapshot = await collRef.orderBy('order', 'desc').limit(1).get()
      if (!snapshot.empty) {
        const lastItem = snapshot.docs[0].data()
        itemOrder = (lastItem.order || 0) + 1
      } else {
        itemOrder = 1
      }
    }

    const newItemData: Omit<FeaturesPageItem, 'id'> = {
      title,
      description,
      icon: icon || 'Star',
      order: itemOrder,
      isActive: true,
      category: category || 'general',
      imageUrl: imageUrl || '',
    }

    const docRef = await collRef.add(newItemData)

    const item: FeaturesPageItem = {
      id: docRef.id,
      ...newItemData,
    }

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating features page item:', error)
    return NextResponse.json(
      { error: 'Failed to create features page item' },
      { status: 500 }
    )
  }
}
