import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import {
  getServerDb,
  getServerAppId,
  doc,
  getDoc,
} from '@/lib/firebase-server'
import { sanitizeSlug } from '@/lib/utils'
import { updateBlogSchema, validateBody } from '@/lib/validations'

// Required for static export
export function generateStaticParams() {
  return []
}

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'blogs', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const validation = validateBody(updateBlogSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const validated = validation.data

    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { setDoc, serverTimestamp } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'blogs', id)

    const updateData: Record<string, unknown> = {
      title: validated.title,
      slug: sanitizeSlug(validated.slug),
      content: validated.content,
      metaDesc: validated.metaDesc,
      excerpt: validated.excerpt,
      keywords: validated.keywords,
      imageUrl: validated.imageUrl,
      published: validated.published,
      status: validated.status || (validated.published ? 'published' : 'draft'),
      updatedAt: serverTimestamp(),
    }

    if (validated.wordCount) updateData.wordCount = validated.wordCount
    if (validated.readingTime) updateData.readingTime = validated.readingTime

    await setDoc(docRef, updateData, { merge: true })

    // Revalidate blog pages to reflect the update immediately
    revalidatePath('/blog')
    revalidatePath(`/blog/${updateData.slug}`)

    return NextResponse.json({ id, ...updateData })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { deleteDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'blogs', id)

    await deleteDoc(docRef)

    // Revalidate blog pages to remove the deleted blog immediately
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]', 'page')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
