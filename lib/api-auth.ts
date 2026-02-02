import { cookies, headers } from 'next/headers'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/firebase-admin'

/**
 * Hash a string using SHA-256
 */
function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex')
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  const aBuf = Buffer.from(a, 'utf-8')
  const bBuf = Buffer.from(b, 'utf-8')

  return crypto.timingSafeEqual(aBuf, bBuf)
}

/**
 * Verify cookie-based admin session
 */
async function verifyCookieSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    const storedTokenHash = cookieStore.get('admin_token_hash')?.value

    if (!sessionToken || !storedTokenHash) {
      return false
    }

    // Hash the session token and compare with stored hash (timing-safe)
    const calculatedHash = hashString(sessionToken)
    return timingSafeCompare(calculatedHash, storedTokenHash)
  } catch (error) {
    console.error('Error verifying cookie session:', error)
    return false
  }
}

/**
 * Verify Firebase token from Authorization header
 * Accepts: "Bearer <firebase-id-token>"
 * Uses Firebase Admin SDK for server-side verification when available
 */
async function verifyFirebaseToken(): Promise<boolean> {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return false
    }

    const token = authHeader.slice(7) // Remove "Bearer " prefix

    // Attempt server-side verification with Admin SDK
    const decoded = await verifyIdToken(token)
    if (decoded) {
      return true
    }

    // If Admin SDK is not configured (returns null without env var),
    // fall back to cookie-based check
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const cookieStore = await cookies()
      const firebaseTokenHash = cookieStore.get('firebase_token_hash')?.value
      if (firebaseTokenHash) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error('Error verifying Firebase token:', error)
    return false
  }
}

/**
 * Verify if the current request has a valid admin session
 * Supports both cookie-based auth and Firebase token auth (hybrid approach)
 */
export async function verifyAdminSession(): Promise<boolean> {
  // Check cookie-based session first (traditional login)
  if (await verifyCookieSession()) {
    return true
  }

  // Fallback: check Firebase token from Authorization header
  if (await verifyFirebaseToken()) {
    return true
  }

  return false
}

/**
 * Returns an unauthorized response
 */
export function unauthorizedResponse(message = 'Authentication required'): NextResponse {
  return NextResponse.json(
    {
      error: 'Unauthorized',
      message,
      authenticated: false
    },
    { status: 401 }
  )
}

/**
 * Middleware helper to require authentication for API routes
 * Use this in API route handlers for POST/PUT/DELETE operations
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const isAuthenticated = await verifyAdminSession()

  if (!isAuthenticated) {
    return unauthorizedResponse('Admin authentication required')
  }

  return null // Proceed with request
}

/**
 * Higher-order function to wrap API handlers with authentication
 * Allows GET requests to pass through (public read access)
 * Requires auth for POST, PUT, DELETE, PATCH
 */
export function withAuth(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Allow GET requests to pass through (public read access)
    if (request.method === 'GET') {
      return handler(request, context)
    }

    // Require auth for POST, PUT, DELETE, PATCH
    const authError = await requireAuth()
    if (authError) return authError

    return handler(request, context)
  }
}

/**
 * Check if the request method requires authentication
 */
export function isWriteMethod(method: string): boolean {
  return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())
}
