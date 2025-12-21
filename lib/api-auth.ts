import { cookies } from 'next/headers'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Hash a string using SHA-256
 */
function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex')
}

/**
 * Verify if the current request has a valid admin session
 * Uses the same cookie-based auth as the middleware
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    const storedTokenHash = cookieStore.get('admin_token_hash')?.value

    if (!sessionToken || !storedTokenHash) {
      return false
    }

    // Hash the session token and compare with stored hash
    const calculatedHash = hashString(sessionToken)
    return calculatedHash === storedTokenHash
  } catch (error) {
    console.error('Error verifying admin session:', error)
    return false
  }
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
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   const authError = await requireAuth()
 *   if (authError) return authError
 *
 *   // ... rest of handler
 * }
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
 *
 * @example
 * export const POST = withAuth(async (request) => {
 *   // Handler code - already authenticated
 * })
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
