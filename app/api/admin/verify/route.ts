import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex')
}

// Timing-safe string comparison to prevent timing attacks
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison to avoid timing leak on length difference
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    const storedTokenHash = cookieStore.get('admin_token_hash')?.value

    if (!sessionToken || !storedTokenHash) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify token hash matches using timing-safe comparison
    const calculatedHash = hashString(sessionToken)
    if (!timingSafeCompare(calculatedHash, storedTokenHash)) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
