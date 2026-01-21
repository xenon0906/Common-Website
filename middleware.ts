import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Check if Firebase mode is enabled
// When Firebase is used, auth is handled client-side via Firebase Auth
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true' || true // Default to Firebase mode

// Simple hash function using Web Crypto API (Edge runtime compatible)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Normalize path - remove trailing slash for comparison
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path

  // When Firebase is enabled, skip middleware auth - let client-side Firebase Auth handle it
  if (USE_FIREBASE) {
    return NextResponse.next()
  }

  // Only protect admin routes (except login) when NOT using Firebase
  if (normalizedPath.startsWith('/admin') && normalizedPath !== '/admin/login') {
    const sessionToken = request.cookies.get('admin_session')?.value
    const storedTokenHash = request.cookies.get('admin_token_hash')?.value

    // If no session, redirect to login
    if (!sessionToken || !storedTokenHash) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify token hash matches
    const calculatedHash = await hashPassword(sessionToken)
    if (calculatedHash !== storedTokenHash) {
      // Invalid session, clear cookies and redirect
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      response.cookies.delete('admin_token_hash')
      return response
    }
  }

  // If already logged in and trying to access login page, redirect to admin
  if (normalizedPath === '/admin/login') {
    const sessionToken = request.cookies.get('admin_session')?.value
    const storedTokenHash = request.cookies.get('admin_token_hash')?.value

    if (sessionToken && storedTokenHash) {
      const calculatedHash = await hashPassword(sessionToken)
      if (calculatedHash === storedTokenHash) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
