import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerDb, getServerAppId, doc } from '@/lib/firebase-server'

// GET - Handle OAuth callback from Instagram
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')

  if (errorParam) {
    return NextResponse.redirect(new URL('/admin/instagram?error=auth_denied', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/admin/instagram?error=no_code', request.url))
  }

  // Verify OAuth state parameter to prevent CSRF
  const stateParam = searchParams.get('state')
  const storedState = cookies().get('ig_oauth_state')?.value
  cookies().delete('ig_oauth_state')

  if (!stateParam || !storedState || stateParam !== storedState) {
    return NextResponse.redirect(new URL('/admin/instagram?error=invalid_state', request.url))
  }

  const clientId = process.env.INSTAGRAM_CLIENT_ID
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL('/admin/instagram?error=config_missing', request.url))
  }

  try {
    // Exchange code for short-lived token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(new URL('/admin/instagram?error=token_exchange_failed', request.url))
    }

    const tokenData = await tokenResponse.json()
    const shortLivedToken = tokenData.access_token
    const userId = tokenData.user_id

    // Exchange for long-lived token (60 days) using POST body to avoid secret in access logs
    const longLivedResponse = await fetch('https://graph.instagram.com/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: clientSecret,
        access_token: shortLivedToken,
      }),
    })

    if (!longLivedResponse.ok) {
      console.error('Long-lived token exchange failed:', await longLivedResponse.text())
      return NextResponse.redirect(new URL('/admin/instagram?error=long_token_failed', request.url))
    }

    const longLivedData = await longLivedResponse.json()

    // Store token in Firestore
    const db = getServerDb()
    if (db) {
      const { setDoc } = await import('firebase/firestore')
      const appId = getServerAppId()
      const tokenDocRef = doc(db, 'artifacts', appId, 'instagramAuth', 'token')
      await setDoc(tokenDocRef, {
        accessToken: longLivedData.access_token,
        expiresIn: longLivedData.expires_in,
        userId: String(userId),
        connectedAt: new Date(),
        expiresAt: new Date(Date.now() + longLivedData.expires_in * 1000),
      })
    }

    return NextResponse.redirect(new URL('/admin/instagram?success=connected', request.url))
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/admin/instagram?error=unknown', request.url))
  }
}
