import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Removed 'force-dynamic' for static export compatibility

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function GET() {
  try {
    const sessionToken = cookies().get('admin_session')?.value
    const storedTokenHash = cookies().get('admin_token_hash')?.value

    if (!sessionToken || !storedTokenHash) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify token hash matches
    const calculatedHash = hashPassword(sessionToken)
    if (calculatedHash !== storedTokenHash) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
