import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getAdminDb, getAdminCollectionPath } from '@/lib/firebase-admin'
import { getAuthenticatedServerDb, getCollectionPath } from '@/lib/firebase-server'
import { slugify } from '@/lib/utils'
import { updateCategorySchema, validateBody } from '@/lib/validations'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/categories/[id] - Get single category
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  try {
    // Try Admin SDK first
    const adminDb = getAdminDb()
    if (adminDb) {
      const categoriesPath = getAdminCollectionPath('categories')
      const doc = await adminDb.collection(categoriesPath).doc(id).get()

      if (!doc.exists) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }

      return NextResponse.json({ id: doc.id, ...doc.data() })
    }

    // Fallback: client SDK
    const db = await getAuthenticatedServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { doc: firestoreDoc, getDoc } = await import('firebase/firestore')
    const categoriesPath = getCollectionPath('categories')
    const docRef = firestoreDoc(db, categoriesPath, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(request: NextRequest, context: RouteContext) {
  const rateLimited = checkRateLimit(request, 'categories', { maxRequests: 20, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await context.params

  try {
    const body = await request.json()
    const validation = validateBody(updateCategorySchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const validated = validation.data

    // Try Admin SDK first
    const adminDb = getAdminDb()
    if (adminDb) {
      return await updateCategoryWithAdminSDK(adminDb, id, validated)
    }

    // Fallback: client SDK
    return await updateCategoryWithClientSDK(id, validated)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(request: NextRequest, context: RouteContext) {
  const rateLimited = checkRateLimit(request, 'categories', { maxRequests: 20, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await context.params

  try {
    // Try Admin SDK first
    const adminDb = getAdminDb()
    if (adminDb) {
      const categoriesPath = getAdminCollectionPath('categories')
      await adminDb.collection(categoriesPath).doc(id).delete()
      revalidatePath('/blog')
      revalidatePath('/admin/blogs')
      return NextResponse.json({ message: 'Category deleted successfully' })
    }

    // Fallback: client SDK
    const db = await getAuthenticatedServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { doc: firestoreDoc, deleteDoc } = await import('firebase/firestore')
    const categoriesPath = getCollectionPath('categories')
    const docRef = firestoreDoc(db, categoriesPath, id)
    await deleteDoc(docRef)

    revalidatePath('/blog')
    revalidatePath('/admin/blogs')
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

async function updateCategoryWithAdminSDK(
  adminDb: FirebaseFirestore.Firestore,
  id: string,
  validated: Record<string, any>
) {
  const admin = await import('firebase-admin')
  const categoriesPath = getAdminCollectionPath('categories')
  const docRef = adminDb.collection(categoriesPath).doc(id)

  // Check if category exists
  const doc = await docRef.get()
  if (!doc.exists) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const updateData: Record<string, any> = {
    updatedAt: admin.default.firestore.FieldValue.serverTimestamp(),
  }

  // Only update fields that are provided
  if (validated.name) {
    updateData.name = validated.name
    // Auto-generate slug if name changes
    if (!validated.slug) {
      updateData.slug = slugify(validated.name)
    }
  }

  if (validated.slug) updateData.slug = validated.slug
  if (validated.color) updateData.color = validated.color
  if (validated.description !== undefined) updateData.description = validated.description

  // Check slug uniqueness if changing
  if (updateData.slug && updateData.slug !== doc.data()?.slug) {
    const existingCategories = await adminDb
      .collection(categoriesPath)
      .where('slug', '==', updateData.slug)
      .get()
    if (!existingCategories.empty && existingCategories.docs[0].id !== id) {
      return NextResponse.json(
        { error: `A category with slug "${updateData.slug}" already exists` },
        { status: 409 }
      )
    }
  }

  await docRef.update(updateData)
  revalidatePath('/blog')
  revalidatePath('/admin/blogs')

  const updated = await docRef.get()
  return NextResponse.json({ id: updated.id, ...updated.data() })
}

async function updateCategoryWithClientSDK(id: string, validated: Record<string, any>) {
  const db = await getAuthenticatedServerDb()
  if (!db) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
  }

  const { doc: firestoreDoc, getDoc, updateDoc, serverTimestamp, getDocs, query, where, collection } =
    await import('firebase/firestore')
  const categoriesPath = getCollectionPath('categories')
  const docRef = firestoreDoc(db, categoriesPath, id)

  // Check if category exists
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const updateData: Record<string, any> = {
    updatedAt: serverTimestamp(),
  }

  // Only update fields that are provided
  if (validated.name) {
    updateData.name = validated.name
    // Auto-generate slug if name changes
    if (!validated.slug) {
      updateData.slug = slugify(validated.name)
    }
  }

  if (validated.slug) updateData.slug = validated.slug
  if (validated.color) updateData.color = validated.color
  if (validated.description !== undefined) updateData.description = validated.description

  // Check slug uniqueness if changing
  if (updateData.slug && updateData.slug !== docSnap.data()?.slug) {
    const collRef = collection(db, categoriesPath)
    const slugQuery = query(collRef, where('slug', '==', updateData.slug))
    const existingCategories = await getDocs(slugQuery)
    if (!existingCategories.empty && existingCategories.docs[0].id !== id) {
      return NextResponse.json(
        { error: `A category with slug "${updateData.slug}" already exists` },
        { status: 409 }
      )
    }
  }

  await updateDoc(docRef, updateData)
  revalidatePath('/blog')
  revalidatePath('/admin/blogs')

  const updated = await getDoc(docRef)
  return NextResponse.json({ id: updated.id, ...updated.data() })
}
