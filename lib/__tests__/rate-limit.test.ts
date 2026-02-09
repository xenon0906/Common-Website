import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/server before importing
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      body,
      status: init?.status ?? 200,
      headers: new Map(Object.entries(init?.headers ?? {})),
    }),
  },
}))

import { checkRateLimit } from '@/lib/rate-limit'

function createMockRequest(ip: string = '127.0.0.1') {
  return {
    headers: {
      get: (name: string) => {
        if (name === 'x-forwarded-for') return ip
        return null
      },
    },
  } as any
}

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset module state by re-importing would be ideal,
    // but for simplicity we use unique prefixes per test
  })

  it('allows first request', () => {
    const req = createMockRequest()
    const result = checkRateLimit(req, 'test-first', { maxRequests: 5, windowMs: 60000 })
    expect(result).toBeNull()
  })

  it('allows requests up to the limit', () => {
    const req = createMockRequest('10.0.0.1')
    const config = { maxRequests: 3, windowMs: 60000 }

    expect(checkRateLimit(req, 'test-limit', config)).toBeNull()
    expect(checkRateLimit(req, 'test-limit', config)).toBeNull()
    expect(checkRateLimit(req, 'test-limit', config)).toBeNull()
  })

  it('blocks request exceeding the limit', () => {
    const req = createMockRequest('10.0.0.2')
    const config = { maxRequests: 2, windowMs: 60000 }

    checkRateLimit(req, 'test-block', config)
    checkRateLimit(req, 'test-block', config)
    const result = checkRateLimit(req, 'test-block', config)

    expect(result).not.toBeNull()
    expect(result?.status).toBe(429)
  })

  it('returns Retry-After header when blocked', () => {
    const req = createMockRequest('10.0.0.3')
    const config = { maxRequests: 1, windowMs: 60000 }

    checkRateLimit(req, 'test-retry', config)
    const result = checkRateLimit(req, 'test-retry', config) as any

    expect(result).not.toBeNull()
    expect(result.headers.get('Retry-After')).toBeDefined()
  })

  it('separates rate limits by prefix', () => {
    const req = createMockRequest('10.0.0.4')
    const config = { maxRequests: 1, windowMs: 60000 }

    checkRateLimit(req, 'prefix-a', config)
    const result = checkRateLimit(req, 'prefix-b', config)

    expect(result).toBeNull()
  })

  it('separates rate limits by IP', () => {
    const config = { maxRequests: 1, windowMs: 60000 }

    checkRateLimit(createMockRequest('192.168.1.1'), 'test-ip', config)
    const result = checkRateLimit(createMockRequest('192.168.1.2'), 'test-ip', config)

    expect(result).toBeNull()
  })

  it('extracts IP from x-forwarded-for header', () => {
    const req = {
      headers: {
        get: (name: string) => {
          if (name === 'x-forwarded-for') return '1.2.3.4, 5.6.7.8'
          return null
        },
      },
    } as any
    const config = { maxRequests: 1, windowMs: 60000 }

    const result = checkRateLimit(req, 'test-xff', config)
    expect(result).toBeNull()
  })
})
