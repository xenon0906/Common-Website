import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId } from '@/lib/firebase-server'

/**
 * TEMPORARY ENDPOINT - Delete all blogs for fresh start
 * This endpoint should be called once and then removed for security
 */
export async function DELETE(req: NextRequest) {
  // Require authentication
  const authError = await requireAuth()
  if (authError) {
    return authError
  }

  try {
    const db = getServerDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const { collection, getDocs, deleteDoc, doc, query, where } = await import('firebase/firestore')
    const appId = getServerAppId()

    // Get all blogs
    const blogsRef = collection(db, 'artifacts', appId, 'public', 'data', 'blogs')
    const blogsSnapshot = await getDocs(blogsRef)

    if (blogsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No blogs to delete',
        deleted: 0,
      })
    }

    // Delete all blogs
    const deletePromises = blogsSnapshot.docs.map(blogDoc =>
      deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'blogs', blogDoc.id))
    )

    await Promise.all(deletePromises)

    // Also delete media entries with category='blog'
    const mediaRef = collection(db, 'artifacts', appId, 'public', 'data', 'media')
    const mediaQuery = query(mediaRef, where('category', '==', 'blog'))
    const mediaSnapshot = await getDocs(mediaQuery)

    if (!mediaSnapshot.empty) {
      const mediaDeletePromises = mediaSnapshot.docs.map(mediaDoc =>
        deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'media', mediaDoc.id))
      )
      await Promise.all(mediaDeletePromises)
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${blogsSnapshot.size} blogs and ${mediaSnapshot.size} media entries`,
      deleted: blogsSnapshot.size,
      mediaDeleted: mediaSnapshot.size,
    })

  } catch (error: any) {
    console.error('Error deleting all blogs:', error)
    return NextResponse.json(
      { error: 'Failed to delete blogs', details: error.message },
      { status: 500 }
    )
  }
}
