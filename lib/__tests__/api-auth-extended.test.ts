import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cookies, headers } from 'next/headers'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
  headers: vi.fn(),
}))

vi.mock('@/lib/firebase-admin', () => ({
  verifyIdToken: vi.fn(() => null),
}))

import { verifyAdminSession, requireAuth, unauthorizedResponse } from '@/lib/api-auth'

describe('API Auth - Extended', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('verifyAdminSession', () => {
    it('returns false when session token exists but hash is missing', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn((name: string) => {
          if (name === 'admin_session') return { value: 'token123' }
          return undefined
        }),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn(() => null),
      } as any)

      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })

    it('returns false when hash exists but session token is missing', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn((name: string) => {
          if (name === 'admin_token_hash') return { value: 'hash123' }
          return undefined
        }),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn(() => null),
      } as any)

      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })
  })

  describe('requireAuth', () => {
    it('returns response object when unauthenticated', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn(() => undefined),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn(() => null),
      } as any)

      const result = await requireAuth()
      expect(result).not.toBeNull()
      if (result) {
        const body = await result.json()
        expect(body.error).toBeDefined()
      }
    })
  })

  describe('unauthorizedResponse', () => {
    it('returns JSON body with provided error message', async () => {
      const response = unauthorizedResponse('Custom error')
      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
      expect(body.message).toBe('Custom error')
      expect(body.authenticated).toBe(false)
    })
  })
})
