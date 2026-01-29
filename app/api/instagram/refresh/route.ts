import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId, doc, getDoc } from '@/lib/firebase-server'

// POST - Refresh Instagram long-lived access token
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
    const currentToken = tokenData.accessToken

    // Refresh the long-lived token using POST body to avoid token in URL/logs
    const refreshResponse = await fetch(
      'https://graph.instagram.com/refresh_access_token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'ig_refresh_token',
          access_token: currentToken,
        }),
      }
    )

    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text()
      console.error('Token refresh failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to refresh token. You may need to reconnect.' },
        { status: 500 }
      )
    }

    const refreshData = await refreshResponse.json()

    // Update stored token
    const { setDoc } = await import('firebase/firestore')
    await setDoc(tokenDocRef, {
      accessToken: refreshData.access_token,
      expiresIn: refreshData.expires_in,
      userId: tokenData.userId,
      connectedAt: tokenData.connectedAt,
      expiresAt: new Date(Date.now() + refreshData.expires_in * 1000),
      refreshedAt: new Date(),
    })

    return NextResponse.json({
      message: 'Token refreshed successfully',
      expiresIn: refreshData.expires_in,
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
  }
}
