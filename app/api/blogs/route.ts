import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getBlogs, DEFAULT_BLOGS } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getAdminDb, getAdminCollectionPath } from '@/lib/firebase-admin'
import { getAuthenticatedServerDb, getCollectionPath } from '@/lib/firebase-server'
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

    // Try Admin SDK first, fall back to authenticated client SDK
    const adminDb = getAdminDb()
    if (adminDb) {
      return await createBlogWithAdminSDK(adminDb, validated)
    }

    // Fallback: authenticated client SDK (anonymous auth)
    return await createBlogWithClientSDK(validated)
  } catch (error) {
    console.error('Error creating blog:', error)
    const message = process.env.NODE_ENV === 'development'
      ? `Failed to create blog: ${error instanceof Error ? error.message : String(error)}`
      : 'Failed to create blog'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

async function createBlogWithAdminSDK(adminDb: FirebaseFirestore.Firestore, validated: Record<string, any>) {
  const admin = await import('firebase-admin')
  const adminModule = (admin as any).default || admin
  const blogsPath = getAdminCollectionPath('blogs')
  const collRef = adminDb.collection(blogsPath)

  const slug = sanitizeSlug(validated.slug)
  const existingBlogs = await collRef.where('slug', '==', slug).get()
  if (!existingBlogs.empty) {
    return NextResponse.json({ error: `A blog with slug "${slug}" already exists` }, { status: 409 })
  }

  const contentText = validated.content || ''
  const wordCount = contentText.trim().split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const blogData: Record<string, unknown> = {
    title: validated.title,
    slug,
    content: validated.content || '',
    metaDesc: validated.metaDesc || '',
    excerpt: validated.excerpt || '',
    keywords: validated.keywords || '',
    imageUrl: validated.imageUrl || '',
    published: validated.published ?? false,
    status: validated.published ? 'published' : 'draft',
    category: validated.category || '',
    tags: validated.tags || [],
    wordCount,
    readingTime,
    createdAt: adminModule.firestore.FieldValue.serverTimestamp(),
    updatedAt: adminModule.firestore.FieldValue.serverTimestamp(),
  }

  if (validated.contentBlocks) blogData.contentBlocks = validated.contentBlocks
  if (validated.contentVersion) blogData.contentVersion = validated.contentVersion
  if (validated.author?.name) blogData.author = validated.author

  const docRef = await collRef.add(blogData)
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ id: docRef.id, ...blogData }, { status: 201 })
}

async function createBlogWithClientSDK(validated: Record<string, any>) {
  const db = await getAuthenticatedServerDb()
  if (!db) {
    return NextResponse.json(
      { error: 'Firebase not configured. Check your Firebase environment variables.' },
      { status: 503 }
    )
  }

  const { addDoc, collection, serverTimestamp, getDocs, query, where } = await import('firebase/firestore')
  const blogsPath = getCollectionPath('blogs')
  const collRef = collection(db, blogsPath)

  const slug = sanitizeSlug(validated.slug)
  const slugQuery = query(collRef, where('slug', '==', slug))
  const existingBlogs = await getDocs(slugQuery)
  if (!existingBlogs.empty) {
    return NextResponse.json({ error: `A blog with slug "${slug}" already exists` }, { status: 409 })
  }

  const contentText = validated.content || ''
  const wordCount = contentText.trim().split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const blogData = {
    title: validated.title,
    slug,
    content: validated.content || '',
    metaDesc: validated.metaDesc || '',
    excerpt: validated.excerpt || '',
    keywords: validated.keywords || '',
    imageUrl: validated.imageUrl || '',
    published: validated.published ?? false,
    status: validated.published ? 'published' : 'draft',
    category: validated.category || '',
    tags: validated.tags || [],
    wordCount,
    readingTime,
    contentBlocks: validated.contentBlocks || undefined,
    contentVersion: validated.contentVersion || undefined,
    author: validated.author?.name ? validated.author : undefined,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collRef, blogData)
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ id: docRef.id, ...blogData }, { status: 201 })
}
