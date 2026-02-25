import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getAdminDb, getAdminCollectionPath } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const adminDb = getAdminDb()
    if (!adminDb) {
      return NextResponse.json({
        publishedBlogs: 0,
        draftBlogs: 0,
        categories: 0,
        teamMembers: 0,
        recentBlogs: [],
      })
    }

    const blogsPath = getAdminCollectionPath('blogs')
    const categoriesPath = getAdminCollectionPath('categories')
    const teamPath = getAdminCollectionPath('team')

    // Fetch all collections in parallel
    const [blogsSnap, categoriesSnap, teamSnap] = await Promise.all([
      adminDb.collection(blogsPath).get(),
      adminDb.collection(categoriesPath).get().catch(() => ({ docs: [], size: 0 })),
      adminDb.collection(teamPath).get().catch(() => ({ docs: [], size: 0 })),
    ])

    // Count published vs draft
    let published = 0
    let draft = 0
    blogsSnap.docs.forEach((doc) => {
      const data = doc.data()
      if (data.published) published++
      else draft++
    })

    // Get 5 most recent blogs
    const recentSnap = await adminDb
      .collection(blogsPath)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()

    const recentBlogs = recentSnap.docs.map((doc) => {
      const data = doc.data()
      return {
        title: data.title || 'Untitled',
        status: data.published ? 'published' : 'draft',
        views: data.views || 0,
        imageUrl: data.imageUrl || '',
        slug: data.slug || '',
      }
    })

    return NextResponse.json({
      publishedBlogs: published,
      draftBlogs: draft,
      categories: categoriesSnap.size,
      teamMembers: teamSnap.size,
      recentBlogs,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({
      publishedBlogs: 0,
      draftBlogs: 0,
      categories: 0,
      teamMembers: 0,
      recentBlogs: [],
    })
  }
}
