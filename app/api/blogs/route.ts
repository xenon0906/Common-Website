import { NextRequest, NextResponse } from 'next/server'
import { getBlogs, DEFAULT_BLOGS } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'

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
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const appId = getServerAppId()
    const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'blogs')

    const wordCount = body.content ? body.content.trim().split(/\s+/).length : 0
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const blogData = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      metaDesc: body.metaDesc || '',
      excerpt: body.excerpt || '',
      keywords: body.keywords || '',
      imageUrl: body.imageUrl || '',
      published: body.published ?? false,
      status: body.published ? 'published' : 'draft',
      wordCount,
      readingTime,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collRef, blogData)

    return NextResponse.json({ id: docRef.id, ...blogData }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
