import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getAdminDb, getAdminCollectionPath } from '@/lib/firebase-admin'
import { getAuthenticatedServerDb, getCollectionPath } from '@/lib/firebase-server'
import { slugify } from '@/lib/utils'
import { createCategorySchema, validateBody } from '@/lib/validations'

// GET /api/categories - List all categories (public)
export async function GET() {
  try {
    // Try Admin SDK first
    const adminDb = getAdminDb()
    if (adminDb) {
      const categoriesPath = getAdminCollectionPath('categories')
      const snapshot = await adminDb.collection(categoriesPath).orderBy('name', 'asc').get()
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      return NextResponse.json(categories)
    }

    // Fallback: client SDK
    const db = await getAuthenticatedServerDb()
    if (!db) {
      return NextResponse.json([], { status: 200 })
    }

    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const categoriesPath = getCollectionPath('categories')
    const collRef = collection(db, categoriesPath)
    const q = query(collRef, orderBy('name', 'asc'))
    const snapshot = await getDocs(q)

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/categories - Create new category (requires auth)
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 'categories', { maxRequests: 20, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const validation = validateBody(createCategorySchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const validated = validation.data

    // Try Admin SDK first
    const adminDb = getAdminDb()
    if (adminDb) {
      return await createCategoryWithAdminSDK(adminDb, validated)
    }

    // Fallback: client SDK
    return await createCategoryWithClientSDK(validated)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

async function createCategoryWithAdminSDK(adminDb: FirebaseFirestore.Firestore, validated: Record<string, any>) {
  const admin = await import('firebase-admin')
  const adminModule = (admin as any).default || admin
  const categoriesPath = getAdminCollectionPath('categories')
  const collRef = adminDb.collection(categoriesPath)

  // Generate slug from name if not provided
  const slug = validated.slug || slugify(validated.name)

  // Check if slug already exists
  const existingCategories = await collRef.where('slug', '==', slug).get()
  if (!existingCategories.empty) {
    return NextResponse.json(
      { error: `A category with slug "${slug}" already exists` },
      { status: 409 }
    )
  }

  const categoryData = {
    name: validated.name,
    slug,
    color: validated.color || 'bg-primary',
    description: validated.description || '',
    createdAt: adminModule.firestore.FieldValue.serverTimestamp(),
    updatedAt: adminModule.firestore.FieldValue.serverTimestamp(),
  }

  const docRef = await collRef.add(categoryData)
  revalidatePath('/blog')
  revalidatePath('/admin/blogs')

  return NextResponse.json({ id: docRef.id, ...categoryData }, { status: 201 })
}

async function createCategoryWithClientSDK(validated: Record<string, any>) {
  const db = await getAuthenticatedServerDb()
  if (!db) {
    return NextResponse.json(
      { error: 'Firebase not configured. Check your Firebase environment variables.' },
      { status: 503 }
    )
  }

  const { addDoc, collection, serverTimestamp, getDocs, query, where } = await import('firebase/firestore')
  const categoriesPath = getCollectionPath('categories')
  const collRef = collection(db, categoriesPath)

  // Generate slug from name if not provided
  const slug = validated.slug || slugify(validated.name)

  // Check if slug already exists
  const slugQuery = query(collRef, where('slug', '==', slug))
  const existingCategories = await getDocs(slugQuery)
  if (!existingCategories.empty) {
    return NextResponse.json(
      { error: `A category with slug "${slug}" already exists` },
      { status: 409 }
    )
  }

  const categoryData = {
    name: validated.name,
    slug,
    color: validated.color || 'bg-primary',
    description: validated.description || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collRef, categoryData)
  revalidatePath('/blog')
  revalidatePath('/admin/blogs')

  return NextResponse.json({ id: docRef.id, ...categoryData }, { status: 201 })
}
