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

describe('API Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('verifyAdminSession', () => {
    it('returns false when no cookies exist', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn(() => undefined),
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
    it('returns 401 when not authenticated', async () => {
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
      expect(result?.status).toBe(401)
    })
  })

  describe('unauthorizedResponse', () => {
    it('returns 401 with error message', () => {
      const response = unauthorizedResponse('Test message')
      expect(response.status).toBe(401)
    })

    it('returns 401 with default message when no argument provided', () => {
      const response = unauthorizedResponse()
      expect(response.status).toBe(401)
    })
  })
})
