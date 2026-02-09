import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getBlogs, DEFAULT_BLOGS } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'
import { sanitizeSlug } from '@/lib/utils'
import { createBlogSchema, validateBody } from '@/lib/validations'

export async function GET() {
  try {
    const blogs = await getBlogs()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(DEFAULT_BLOGS, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 'blogs', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const validation = validateBody(createBlogSchema, body)
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

    const { addDoc, collection, serverTimestamp, getDocs, query, where } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'blogs')

    // Check for duplicate slug
    const slug = sanitizeSlug(validated.slug)
    const slugQuery = query(collRef, where('slug', '==', slug))
    const existingBlogs = await getDocs(slugQuery)
    if (!existingBlogs.empty) {
      return NextResponse.json(
        { error: `A blog with slug "${slug}" already exists` },
        { status: 409 }
      )
    }

    const wordCount = validated.content.trim().split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const blogData = {
      title: validated.title,
      slug,
      content: validated.content,
      metaDesc: validated.metaDesc,
      excerpt: validated.excerpt,
      keywords: validated.keywords,
      imageUrl: validated.imageUrl,
      published: validated.published,
      status: validated.published ? 'published' : 'draft',
      wordCount,
      readingTime,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collRef, blogData)

    // Revalidate blog pages to reflect the new blog immediately
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]', 'page')

    return NextResponse.json({ id: docRef.id, ...blogData }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
