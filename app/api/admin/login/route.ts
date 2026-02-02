import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { checkRateLimit } from '@/lib/rate-limit'

// Default admin credentials (change in production via env vars)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'

// In production, ADMIN_PASSWORD_HASH must be set via env var.
// In development, fall back to a default hash for convenience.
const DEFAULT_PASSWORD_HASH = process.env.NODE_ENV === 'production'
  ? null
  : bcrypt.hashSync('snapgo2024', 12)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH

// Input length limits
const MAX_USERNAME_LENGTH = 100
const MAX_PASSWORD_LENGTH = 200

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per 15 minutes per IP
  const rateLimited = checkRateLimit(request, 'login', {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  })
  if (rateLimited) return rateLimited

  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Input validation: reject oversized inputs
    if (typeof username !== 'string' || username.length > MAX_USERNAME_LENGTH) {
      return NextResponse.json(
        { error: 'Username exceeds maximum length' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: 'Password exceeds maximum length' },
        { status: 400 }
      )
    }

    // In production, refuse login if password hash is not configured
    if (!ADMIN_PASSWORD_HASH) {
      console.error('ADMIN_PASSWORD_HASH env var is not set. Login is disabled in production.')
      return NextResponse.json(
        { error: 'Login is not configured. Set ADMIN_PASSWORD_HASH environment variable.' },
        { status: 500 }
      )
    }

    // Verify credentials using bcrypt
    const usernameMatch = username === ADMIN_USERNAME
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)

    if (!usernameMatch || !passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    // Store session token hash in another cookie for verification
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex')
    cookieStore.set('admin_token_hash', tokenHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
