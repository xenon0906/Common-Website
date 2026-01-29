import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId, doc, getDoc, collection, getDocs } from '@/lib/firebase-server'

// POST - Sync media from Instagram API to Firestore
export async function POST() {
  const authError = await requireAuth()
  if (authError) return authError

  const db = getServerDb()
  if (!db) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 })
  }

  try {
    const appId = getServerAppId()

    // Get stored access token
    const tokenDocRef = doc(db, 'artifacts', appId, 'instagramAuth', 'token')
    const tokenSnap = await getDoc(tokenDocRef)

    if (!tokenSnap.exists()) {
      return NextResponse.json(
        { error: 'Instagram not connected. Please connect your account first.' },
        { status: 400 }
      )
    }

    const tokenData = tokenSnap.data()
    const accessToken = tokenData.accessToken

    // Check if token is expired
    const expiresAt = tokenData.expiresAt?.toDate?.() || new Date(tokenData.expiresAt)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Instagram token expired. Please reconnect your account.' },
        { status: 401 }
      )
    }

    // Fetch media from Instagram Graph API
    // Note: Instagram Graph API requires access_token as a query parameter for GET requests.
    // Authorization headers are not supported. This is server-side only; the token is never exposed to clients.
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}&limit=20`
    )

    if (!mediaResponse.ok) {
      const errorText = await mediaResponse.text()
      console.error('Instagram API error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch from Instagram API' }, { status: 500 })
    }

    const mediaData = await mediaResponse.json()

    if (!mediaData.data || mediaData.data.length === 0) {
      return NextResponse.json({ message: 'No media found on Instagram', synced: 0 })
    }

    // Filter for reels/videos
    const reels = mediaData.data.filter(
      (item: any) => item.media_type === 'VIDEO'
    )

    // Get existing reels to avoid duplicates
    const instagramCollPath = `artifacts/${appId}/public/data/instagram`
    const existingReelsSnap = await getDocs(collection(db, instagramCollPath))
    const existingReelIds = new Set(
      existingReelsSnap.docs.map(d => d.data().reelId)
    )

    // Sync new reels to Firestore
    const { addDoc } = await import('firebase/firestore')
    const collRef = collection(db, instagramCollPath)
    let syncedCount = 0

    for (const reel of reels) {
      // Extract reel ID from permalink
      const reelIdMatch = reel.permalink?.match(/\/reel\/([^/?]+)/)
      const reelId = reelIdMatch ? reelIdMatch[1] : null

      if (!reelId || existingReelIds.has(reelId)) continue

      await addDoc(collRef, {
        reelId,
        title: reel.caption?.substring(0, 100) || 'Instagram Reel',
        description: reel.caption || '',
        visible: true,
        order: syncedCount,
        permalink: reel.permalink,
        mediaUrl: reel.media_url,
        thumbnailUrl: reel.thumbnail_url,
        instagramId: reel.id,
        syncedAt: new Date(),
        createdAt: new Date(reel.timestamp),
      })
      syncedCount++
    }

    return NextResponse.json({
      message: `Synced ${syncedCount} new reel(s) from Instagram`,
      synced: syncedCount,
      total: reels.length,
    })
  } catch (error) {
    console.error('Instagram sync error:', error)
    return NextResponse.json({ error: 'Failed to sync Instagram media' }, { status: 500 })
  }
}
