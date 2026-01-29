import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { requireAuth } from '@/lib/api-auth'

// GET - Redirect to Instagram OAuth
export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const clientId = process.env.INSTAGRAM_CLIENT_ID
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Instagram API credentials not configured. Set INSTAGRAM_CLIENT_ID and INSTAGRAM_REDIRECT_URI in environment variables.' },
      { status: 500 }
    )
  }

  // Generate CSRF state parameter
  const state = crypto.randomBytes(32).toString('hex')
  cookies().set('ig_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  const authUrl = new URL('https://api.instagram.com/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'user_profile,user_media')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('state', state)

  return NextResponse.json({ authUrl: authUrl.toString() })
}
