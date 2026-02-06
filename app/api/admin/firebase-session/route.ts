import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { verifyIdToken, isAdminConfigured } from '@/lib/firebase-admin'

// Hash function for session token
function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex')
}

/**
 * Firebase Session Endpoint
 * Creates session cookies after Firebase authentication succeeds
 * This bridges Firebase Auth with cookie-based API authentication
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'Firebase ID token is required' },
        { status: 400 }
      )
    }

    // Verify the Firebase ID token server-side using Admin SDK
    const decodedToken = await verifyIdToken(idToken)

    if (decodedToken === null) {
      if (isAdminConfigured()) {
        // Admin SDK is configured but verification failed — reject
        return NextResponse.json(
          { error: 'Invalid Firebase ID token' },
          { status: 401 }
        )
      }
      // Admin SDK not configured — reject in production for security
      if (process.env.NODE_ENV === 'production') {
        console.error('[firebase-session] FIREBASE_SERVICE_ACCOUNT_KEY not configured. Rejecting unverified token.')
        return NextResponse.json(
          { error: 'Server-side token verification is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY.' },
          { status: 503 }
        )
      }
      // Only allow in development with warning
      console.warn(
        '[firebase-session] Admin SDK not configured. ' +
        'Accepting unverified Firebase token in development. ' +
        'Set FIREBASE_SERVICE_ACCOUNT_KEY for production.'
      )
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const cookieStore = await cookies()

    // Set session cookie
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    // Store session token hash in another cookie for verification
    const tokenHash = hashString(sessionToken)
    cookieStore.set('admin_token_hash', tokenHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    // Also store the Firebase ID token hash for API route verification
    const firebaseTokenHash = hashString(idToken)
    cookieStore.set('firebase_token_hash', firebaseTokenHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Session created successfully',
    })
  } catch (error) {
    console.error('Firebase session error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
