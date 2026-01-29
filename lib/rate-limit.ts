import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Window duration in milliseconds */
  windowMs: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

let lastCleanup = 0
const CLEANUP_INTERVAL = 60_000

function cleanup(): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  const keysToDelete: string[] = []
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach(key => rateLimitMap.delete(key))
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

/**
 * Check rate limit for a request.
 * Returns null if allowed, or a 429 response if rate limited.
 */
export function checkRateLimit(
  request: NextRequest,
  prefix: string,
  config: RateLimitConfig
): NextResponse | null {
  cleanup()

  const ip = getClientIp(request)
  const key = `${prefix}:${ip}`
  const now = Date.now()

  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs })
    return null
  }

  if (entry.count < config.maxRequests) {
    entry.count++
    return null
  }

  const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    }
  )
}
